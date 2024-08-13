const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/check-db-connection', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1; // 1 means connected
    console.log(isConnected)
  res.json({ connected: isConnected });
});

module.exports = router;
