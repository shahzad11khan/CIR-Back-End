const mongoose = require("mongoose");
const emailSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String },
  emailId: { type: String },
  file: { type: String },
  approval: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Emails = mongoose.model("Email", emailSchema);
module.exports = Emails;
