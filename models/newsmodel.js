const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
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


// userSchema.pre("save",async function(next){
//   this.password=await bcrypt.hash(this.password,12);
//   this.conformpassword=await bcrypt.hash(this.conformpassword,12);
//   next();
  
// })
const newsdb = mongoose.model('new', newsSchema);

module.exports = newsdb;
