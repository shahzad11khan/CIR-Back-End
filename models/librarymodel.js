const mongoose = require('mongoose');

const libraryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  category: { type: String,required: true },
  nature: { type: String,required: true },
  project: { type: String,required: true },
  credentials: { type: String, enum: ['private', 'public'],default:'public'},
  file: { type: String,required: true},
  image:{type:String},
  longDescription: { type: String },
  approve: { type: String },
  createdAt: {
    type: Date,
    default: Date.now
  },

});

const LibraryItem = mongoose.model('Library', libraryItemSchema);

module.exports = LibraryItem;
