const express = require("express");
const cors = require("cors");
// const bodyParser=require('body-parser');
const newsRouter = require("./routes/newsroutes");
const userRouter = require("./routes/usersroutes");
const categoryRoutes = require("./routes/categoryroutes");
const projectRouter = require("./routes/projectroutes");
const calenderRouter = require("./routes/calenderroutes");
const activitiesRouter = require("./routes/activitiesroutes");
const libraryItemRoutes = require("./routes/libraryroutes");
const natureRoutes = require("./routes/natureroutes");
const projectlibrary = require("./routes/projectforlibrary");
const currentlyhappen = require("./routes/Currentlyhappenroutes");
const message = require("./routes/message");
const Partner = require("./routes/partnersroutes");
const conect = require("./routes/Connectdbroute");
// const { CheckAuth } = require('./Middleware/CheckAuth')
const Emails = require("./routes/emailroutes");
// const nodemailer = require('nodemailer');
const path = require("path");
// const { verify } = require('crypto');
require("dotenv").config();

require("./db/conn");
const PORT = process.env.PORT || 8000;
const app = express(); // Replace with the origin(s) of your frontend app
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
// app.use('/news/images',express.static('news/images'));
// app.use('/projects/images',express.static('projects/images'));
// app.use('/activities/images',express.static('activities/images'));
// app.use('/library/images',express.static('library/images'));
// app.use("/library/images", express.static(path.join(__dirname, "library/images")))
// app.use('/message/images',express.static('message/images'));
// app.use('/partners/images',express.static('partners/images'));
app.use("/library", express.static(path.join(__dirname, "library")));
app.use("/news", express.static(path.join(__dirname, "news")));
app.use("/projects", express.static(path.join(__dirname, "projects")));
app.use("/activities", express.static(path.join(__dirname, "activities")));
app.use("/message", express.static(path.join(__dirname, "message")));
app.use("/partners", express.static(path.join(__dirname, "partners")));
app.use("/currently", express.static(path.join(__dirname, "currently")));

app.get("/", (req, res) => {
  res.send("Server is running...");
});
// mail setup

// Connect to MongoDB
// const connect = async () =>{
// try{
//  await mongoose.connect("mongodb://127.0.0.1:27017/MERN");
//  console.log('MongoDB Connected');
// }catch(err){
//   console.log(err);
// }
// }

// routes

app.use("/api/connect", conect);

// done
app.use("/users", userRouter);
// done
app.use("/api/news", newsRouter);
// done
app.use("/api/project", projectRouter);
// done
app.use("/api/activites", activitiesRouter);
// done
app.use("/api/calender", calenderRouter);
// in library
app.use("/api/category", categoryRoutes);
app.use("/api/projectlibrary", projectlibrary);

// done
app.use("/api/libraryItem", libraryItemRoutes);
app.use("/api/currently", currentlyhappen);
// done
app.use("/api/nature", natureRoutes);

app.use("/api/message", message);
app.use("/api/partners", Partner);
app.use("/api/emails", Emails);

app.get("/", (req, res) => {
  const permissions = req.permissions;
  console.log(permissions);
  res.json({ message: "backend is Working..." });
});

app.get("/Justcheck", (req, res) => {
  res.json({ message: "backend is Connected With Front End" });
});

// Create a transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'shahzadkhan311666@gmail.com',
//     pass: 'ygsb yiey smtc dnan'
//   }
// });
// Endpoint to send email with attachment
// app.post('/send-email/:id', async (req, res) => {
//   const { to } = req.body;
//   const id = req.params.id;

//   try {
//     // Retrieve the LibraryItem with the specified ID
//     const existingLib = await LibraryItem.findById(id);
//     // const path = './library/images/';
//     if (!existingLib) {
//       return res.status(404).json({ error: 'Library item not found' });
//     }
//     const getfile = existingLib.file; // Assuming 'existingLib.file' contains the file name only
//     // const content = existingLib.file; // Assuming 'existingLib.file' contains Buffer data

//     console.log(getfile);
//     // console.log(content);

//     // store email
//     try {
//       const newEmail = new Emails({
//         name: req.body.name,
//         email: to,
//         file: getfile,
//         approval: req.body.approval
//       });
//       const savedEmail = await newEmail.save();
//       res.json(savedEmail);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//     // end store email

//     const message = {
//       from: 'shahzadkhan311666@gmail.com',
//       to: to,
//       // subject: subject,
//       text: `<h1>Thanks From CIR</h1><p>This file is send from CIR</p>`,
//       attachments: [
//         {
//           // filename:'Document',
//           path: './library/images/' + getfile
//         },
//       ],
//     };

//     // Send the email
//     transporter.sendMail(message, (error, info) => {
//       if (error) {
//         console.error('Error sending email: ', error);
//         res.status(500).json({ error: 'Email not sent' });
//       } else {
//         console.log('Email sent: ' + info.response);
//         res.json({ message: 'Email sent successfully' });
//       }
//     });
//   } catch (error) {
//     console.error('Error: ', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
// app.post('/send-email/:id', async (req, res) => {
//   const { to } = req.body;
//   const id = req.params.id;

//   try {
//     // Retrieve the LibraryItem with the specified ID
//     const existingLib = await LibraryItem.findById(id);
//     // const path = './library/images/';
//     if (!existingLib) {
//       return res.status(404).json({ error: 'Library item not found' });
//     }
//     const getfile = existingLib.file; // Assuming 'existingLib.file' contains the file name only

//     console.log(getfile);

//     // store email
//     try {
//       const newEmail = new Emails({
//         name: req.body.name,
//         email: to,
//         file: getfile,
//         approval: req.body.approval
//       });
//       const savedEmail = await newEmail.save();
//       res.json(savedEmail);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//     // end store email

//     const message = {
//       from: 'shahzadkhan311666@gmail.com',
//       to: to,
//       // subject: subject,
//       text: `<h1>Thanks From CIR</h1><p>This file is sent from CIR</p>`,
//       attachments: [
//         {
//           filename: getfile, // Add this line
//           path: './library/images/' + getfile
//         },
//       ],
//     };

//     // Send the email
//     transporter.sendMail(message, (error, info) => {
//       if (error) {
//         console.error('Error sending email: ', error);
//         res.status(500).json({ error: 'Email not sent' });
//       } else {
//         console.log('Email sent: ' + info.response);
//         res.json({ message: 'Email sent successfully' });
//       }
//     });
//   } catch (error) {
//     console.error('Error: ', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// for logout
// app.get('/api/logout', (req, res) => {
//   // Clear cookies
//   res.clearCookie('usertoken');

//   // Send a response to the client
//   res.send('Logged out successfully');
//   // Alternatively, you can redirect the user to another page after logout
//   res.redirect('/');

//   console.log("logout");
// });

app.listen(PORT, () => {
  // connect();
  console.log(`server is running on http://localhost:${PORT}`);
});
