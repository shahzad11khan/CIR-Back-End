const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  usertype: {
    type: String,
    enum: ['user','manager','superadmin'],
    default: 'user'
  },
  confrompassword: {
    type: String
  },
  permissions: [String],
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
const userdb = mongoose.model('User', userSchema);

module.exports = userdb;
