require("dotenv").config();
const express = require("express");
const { json } = require("body-parser");
const { sign } = require("jsonwebtoken");

const SHARED_SECRET = process.env.SHARED_SECRET;
if (!SHARED_SECRET) {
    console.log("No SHARED_SECRET environment variable defined - refusing to start");
    process.exit(1);
}

const app = express();
app.use(json());

app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).end();
    const secret = authHeader.substring(7);
    if (!secret || secret !== SHARED_SECRET) return res.status(401).end();
    next();
});

app.post("/sign", async (req, res) => {
    const obj = req.body;

    // specify main payload
    var signOptions = {
        issuer: obj.iss || obj.issuer,
        subject: obj.sub || obj.subject,
        audience: obj.aud || args.audience || "https://login.salesforce.com",
        expiresIn: 2 * 60,
        algorithm: "RS256",
        noTimestamp: true
    };

    // get the private key and base64 decode it
    const privateKey = Buffer.from(obj.privateKey, "base64").toString();

    // sign token with private key
    const token = await sign({}, privateKey, signOptions);
    
    // return
    res.type("json").send({token});
});

app.listen(process.env.PORT || 3000);
