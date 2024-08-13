const mongoose = require('mongoose');

const natureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Nature = mongoose.model('Nature', natureSchema);

module.exports = Nature;
