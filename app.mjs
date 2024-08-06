import express from 'express';
import axios from 'axios';
import * as jose from 'node-jose';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// JWT signing key (in a real-world scenario, this should be securely stored)
const jwtKey = 'your-secret-jwt-key';

// Server B URL (replace with the actual URL)
const serverBUrl = 'https://server-b-api.example.com';

// Function to sign data with JWT
async function signJWT(payload) {
  const key = await jose.JWK.asKey({ kty: 'oct', k: Buffer.from(jwtKey).toString('base64') });
  return jose.JWS.createSign({ format: 'compact' }, key)
    .update(JSON.stringify(payload))
    .final();
}

app.post('/api/proxy', async (req, res) => {
  try {
    const { adminToken } = req.body;

    if (!adminToken) {
      return res.status(400).json({ error: 'Admin token is required' });
    }

    // Make API call to Server B
    const response = await axios.get(serverBUrl, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    // Sign the response data with JWT
    const signedResponse = await signJWT(response.data);

    // Return the signed JWT response
    res.json({ signedResponse });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});