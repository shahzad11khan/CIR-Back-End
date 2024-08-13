const mongoose = require('mongoose');

const projectslibrary = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Category = mongoose.model('projectforlibrary', projectslibrary);

module.exports = Category;