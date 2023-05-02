# Postman JWT RSA Signature Utility #
This is a quick way to get a RS256 signed JWT for use with Salesforce in Postman. As far as I know and can see Postman doesn't support signinng a JWT with a private RSA key. This repo is an app that can be called from a Postman to create a signed JWT.

## Configuration
Create an environment variable called `SHARED_SECRET` with a preshared key.

## Authentication
Simple authentication is performed by sending the configured `SHARED_SECRET` as a Bearer token in the `Authorization` header.

## Usage
Send a JSON object like the one below to `/sign` with the shared secret as a Bearer token:
```
{
    "iss": "{{clientId}}",
    "aud": "{{Experience Cloud Site or https://login.salesforce.com or https://test.salesforce.com}}",
    "sub": "{{username of user to impersonate}}",
    "privateKey": "{{base64 encoded private key in PEM format}}"
}
```

Response will be a JSON object with a `token` key with the JWT like below:
```
{
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleH...U83VuCo8jCmQ"
}
```

## Postman usage

### Body
```
{
    "iss": "{{clientId}}",
    "aud": "{{experienceCloudSite}}",
    "sub": "{{communityUsername}}",
    "privateKey": "{{_privateKeyBase64}}"
}
```

### Pre-request Script
```
const context = pm.environment.name ? pm.environment : pm.collectionVariables;
const privateKey = context.get("privateKeyPem");
const privateKeyBase64 = btoa(privateKey);
context.set("_privateKeyBase64", privateKeyBase64);
```

### Tests
```
const context = pm.environment.name ? pm.environment : pm.collectionVariables;
context.unset("_privateKeyBase64");
context.set("_jwt", pm.response.json().token);
```