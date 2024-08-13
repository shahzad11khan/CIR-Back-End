const mongoose = require('mongoose');
const partnerSchema = new mongoose.Schema({
    // name: String,
    // description: String,
    image: String, // Store the file path or URL in the database
    // Add other fields as needed
    createdAt: {
        type: Date,
        default: Date.now
      },
  });
  const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;