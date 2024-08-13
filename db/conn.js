// const mongoose =require('mongoose')
// const DB='mongodb://127.0.0.1:27017/MERN';
// mongoose.connect(DB).then(()=>console.log(`DB is Connected..........!`)).catch(err=>console.log(err))
const mongoose = require('mongoose');
// const dbURI = 'mongodb://127.0.0.1:27017/MERN';
const dbURI= process.env.DATABASE_URL

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const dbConnection = mongoose.connection;

dbConnection.on('connected', () => {
  console.log('MongoDB is connected');
});

dbConnection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});
