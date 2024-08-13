const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  longDescription: {
    type: String,
  },
  coverimage: {
    type: String,
  },
  metaTitle: {
    type: String,
  },
  metashortDescription: {
    type: String,
  },
  metalongDescription: {
    type: String,
  },
  check:{
    type:String
  },
  approve: { type: String },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const projectdb = mongoose.model('Activtie', ActivitySchema);

module.exports = projectdb;
