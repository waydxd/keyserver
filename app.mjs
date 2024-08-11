import express from 'express';
import axios from 'axios';
import * as jose from 'jose';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 6969;

// Use body-parser middleware to parse JSON request bodies
app
  .use(cors())
  .use(bodyParser.json());

// JWT signing key
// Pls change it with your own key!
const jwk = {
  "crv": "P-256",
  "d": "FhMdTeoUY6laOOC8VlkdIoJfjIhukjoFmltzXocjf1Q",
  "ext": true,
  "key_ops": [
      "sign"
  ],
  "kid": "HslzyDpUJbIEkS9lwNJ67bMFF6HllEYL_IKvFJ-NE8s",
  "kty": "EC",
  "x": "dL9Hl29kUYP7nLm5wAGKM1MevLfoPKZ2Q_lVc58gDYM",
  "y": "yunYh4DaSWHqNIhUE7VGpdZx4RqYZQyufwqsPPXUmy0"
};

// Function to sign data with JWT
async function signJWT(payload) {
  const key = await jose.importJWK(jwk, 'ES256');
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'ES256', kid: jwk.kid })
    .sign(key);
}

app.post('/api/proxy', async (req, res) => {
  try {
    // Log the incoming request details
    console.log('Received an API request!');
    console.log('Method:', req.method);
    console.log('URL:', req.originalUrl);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    const { adminToken } = req.body;

    if (!adminToken) {
      return res.status(400).json({ error: 'Admin token is required' });
    }
    // Server B URL (replace with the actual URL)
    const serverBUrl = `http://127.0.0.1:8000/api/user/user_info?token=${adminToken}`;

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
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port,'0.0.0.0', () => {
  console.log(`Server listening at http://0.0.0.0:${port}`);
});
