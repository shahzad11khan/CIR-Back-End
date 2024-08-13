const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  message: { type: String, require:true },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;