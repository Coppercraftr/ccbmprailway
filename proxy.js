// Save as proxy.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/proxy', async (req, res) => {
  try {
    const response = await fetch('http://ccbmpp.onrender.com/join');
    const text = await response.text();
    res.send(text); // Send back to CopperCube
  } catch (e) {
    res.status(500).send("Error: " + e.toString());
  }
});

app.listen(80, () => {
  console.log("Proxy running on HTTP port 80");
});
