var express = require("express");
var router = express.Router();
var jsonwebtoken = require("jsonwebtoken");
var uuid = require("uuid-random");

var privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvNUOy+xlWwHu7
5v7851YEUxV7B/7qjhKuBTw2YlC1l6x+vdLHuz9+VJDyD2q3QTWRdiHrHV0W4VVy
qUZQJjKo6cyp3FUF638BFRwU+fBGHBAr+hNpsyhRK0WhA/OYAY8NftsgKIBKchHX
FfVPoEeZq9mwHAh6EKaCnbIKyxiIOG69GLNINO5ybEuFfLojD6bcHE5LxQR0GpCF
19Z1PtwQ/Q1dmZn9mQ0w1IOFRNW8njn71b6ZaIrsFu5J5DaMe70ljKVPgUXLkQIA
srh/qOaDv/P+qfSSziqyibaCGXDNQv5Gk3s0aOzvRWDti/BZdY66P9DYO/am7rqe
5TQAPOeVAgMBAAECggEAfNXfuZvNbxFQWA57KekOUaB9Ep8c0zSNPK6AO2OLjAdY
oSlREHxq/fD1IXM4nv94Un8wJZxTYmUFA+B2N88vk0iaSYCyl7g2UqgezRdUSi/e
mebhhBNhq4vAXbw6CNk7eusi5+PTnLdv3KdJlQVnXqeiQCeJJqfMbA49+BDDFvKj
uctlNWziacP87DaAx2qnPdAnER55LqO/AneV2EX8KYOPkI5/LSeo/F9gm4TYRKFo
LUr9oDEqtJgUS9iJ0AfbIlKReRe8xq/w1fNoRHoHflmXCePnZfWHGBjdPFLBs9CQ
TCw0cX1wi4W7ZZNjDmjj6SVOxYEGyLFG8YRRkc3FwQKBgQD904jMyQPgJcW9ZvyW
761Haddu4sXLQOgX2RIrgjpWglt2qyyndBRBFtxz75ZjcCF2nSK9CrUntdJPtRCs
cZ1hIqzZcXYTGslIGJuxJ3CAcdoHVdYEJO9cl9rpJ3q3sYbLNiHDJ77SqtwtyZtq
K7/dghtr/902+pnkzLk54P9wEQKBgQCwtV/m7lGusxIBklR+Bbl+zC2RVuhZafM7
5scrEWQZZ0Tp+rBFxzUawzVPaUQiGvYVfJrQESIgdxqaYduEqc6ikYyoN56JsC29
VAU1sX5s5h2HuHxjrj6yfGxLJAxjGPh3evmlVZNKSwsI5ZyKntKWkbkgQvcaRtBP
wBhM31uDRQKBgQDtROXl+CnlR6nWaQTI2vbxgKDfiKA4ZU4PrNxtS2jZITX6cfxl
8/5S8dnVjirYfSLqy+yDJhU9L5uO4sTZTcM937oP8R3csfdhq48uRJ3Hk6WpobVT
XmtZ9KGvvTXbrNlB8DITSX35U7pKGuFql8bcexjDFgRltlBRLoYe8pIU4QKBgDVa
HaFwtPLFGBunXaFLAy14Yg2uqqpMZebhD6M+NfXBizoFuXDn622wIIlgY/TUJRZp
r6hAdAhPTZXtE8UjK8NDpK8pU9GIgtbV5ljGxUAF3kaa+dtywXVMQboSITdOU75n
P7aedsEIlUVTZgcoWrahOr612Ttyw/RAMFYNXejtAoGBALde3M1wme+CKlMC/RdO
QzLMud8Bg1Hr8+zjYe1OF7ZrZd2LXbvilv0Bgo9GmIZkiZ3CINDCnDLjh3Jl464N
P68f61oxojOkQ77KUliHBEqFNcLDQK1Ud8GoZByGl2hTnvRJJBs1/tYf3ywTssB0
YfQwn4zNpZRinAU38vzZ3Q8n
-----END PRIVATE KEY-----`;

/* GET home page. */
router.post("/auth", function (req, res, next) {
  console.log(req.body);
  const token = generate(privateKey, {
    id: uuid(),
    name: req.body["name"],
    email: req.body["email"],
    avatar: "my avatar url",
    appId: "vpaas-magic-cookie-9885231739344da1a2492caa7aa88181", // Your AppID ( previously tenant )
    kid: "vpaas-magic-cookie-9885231739344da1a2492caa7aa88181/a948c8",
  });
  res.json({ token: token });
});

const generate = (privateKey, { id, name, email, avatar, appId, kid }) => {
  const now = new Date();
  const jwt = jsonwebtoken.sign(
    {
      aud: "jitsi",
      context: {
        user: {
          id,
          name,
          avatar,
          email: email,
          moderator: "true",
        },
        features: {
          livestreaming: "true",
          recording: "true",
          transcription: "true",
          "outbound-call": "true",
        },
      },
      iss: "chat",
      room: "*",
      sub: appId,
      exp: Math.round(now.setHours(now.getHours() + 3) / 1000),
      nbf: Math.round(new Date().getTime() / 1000) - 10,
    },
    privateKey,
    { algorithm: "RS256", header: { kid } }
  );
  return jwt;
};

module.exports = router;
