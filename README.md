# This repo is archived since the authentication bridge is integrated into paopao-ce's backend
# Simple Auth Bridge 
## Overview

This repository contains the Auth Bridge, a Node.js-based server that facilitates authentication and authorization between VRpanda-admin-panel and paopao-ce.
### Q: why make a bridge?
A: ~~CUZ I DUN WANT TO WRITE BACKEND CODE~~  * Cough *  It is because I cannot modify the VR panda (main website) original api port to directly sign and return the user jwt since it might affect other current applications which might also depend on that unsigned token. Moreover, I'm not the main maintainer of the vrpanda backend so I better not alter too much or else my co-worker might kill me.

## System Architecture

The Auth Bridge is part of a larger system architecture that includes:

### 1. VRpanda-admin-panel (Main Website) 
* Built with Vue.js 2 and PHP Laravel
* Responsible for user authentication and providing user information to the Auth Bridge.
### 2. Auth Bridge (This repo)
* Built with Node.js
* Uses `jose` (v4.x) for JSON Web Token (JWT) management
* Acts as an intermediary between VRpanda-admin-panel and paopao-ce.
* Responsible for authenticating users and issuing JWT tokens.
* Forwards requests to VRpanda-admin-panel backend to retrieve user information.
* Signs JWT tokens with a private key and returns them to VRpanda-admin-panel.
### 3. [paopao-ce](https://github.com/waydxd/paopao-ce) (a fork of an Open Source Forum Website) 
* I forked the repo to make customizations for commercial use.
* Built with Vue.js 3 and Go with Gin Web Framework for backend
* A standalone forum website with its own backend and database.
* Linked to VRpanda-admin-panel through the Auth Bridge.
* Responsible for verifying JWT tokens and signing users in with synced user information.
## Authentication Flow
* A user logs in to VRpanda-admin-panel.
* When the user clicks the forum button, a POST request is sent to the Auth Bridge with their admin token.
* The Auth Bridge forwards the request to the VRpanda-admin-panel backend to retrieve the user's information.
* The Auth Bridge signs a JWT token containing the user's information with a private key and returns it to VRpanda-admin-panel.
* The VRpanda-admin-panel frontend stores the JWT token in a cookie and redirects the user to paopao-ce.
* The paopao-ce frontend automatically grabs the JWT token from the cookie and makes a login request to the paopao-ce backend.
* The paopao-ce backend verifies the JWT token for integrity and signs the user in with the synced user information (e.g., email, experience level, etc.).
## Technical Details
* JWT tokens are used for authentication and authorization between VRpanda-admin-panel and paopao-ce.
* The Auth Bridge uses the jose package (v4.x) for JWT management.
* The Auth Bridge acts as a central entry point for authentication requests between the two systems.
This README provides a overview of the system architecture and the Auth Bridge's role within it. For more information, please refer to the individual component repositories and documentation.

## Flow Chart
         +---------------+
          |  VRpanda-    |
          |  admin-panel  |
          +---------------+
                  |
                  | (1) Login Request
                  v
          +---------------+
          |  Auth Bridge  |
          |  (Node.js)    |
          +---------------+
                  |
                  | (2) Request User Info
                  v
          +---------------+
          |  VRpanda-     |
          |  admin-panel  |
          |  Backend (PHP)|
          +---------------+
                  |
                  | (3) User Info Response
                  v
          +---------------+
          |  Auth Bridge  |
          |  (Node.js)    |
          +---------------+
                  |
                  | (4) JWT Token
                  v
          +---------------+
          |  paopao-ce    |
          |  (vue 3)      |
          +---------------+
                  |
                  | (5) Verify JWT Token
                  v
          +---------------+
          |  paopao-ce    |
          |  (go gin)     |
          +---------------+


TODO: Integrate this into paopao-ce
