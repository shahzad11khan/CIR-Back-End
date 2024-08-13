const mongoose = require('mongoose')
const calenderSchema = mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  longDescription: {
    type: String,
    required: true
  },
   check: {
    type: String
  },
  approve: { type: String },
  createdAt: {
    type: Date,
    default: Date.now
  },
});



module.exports = mongoose.model('calender', calenderSchema)