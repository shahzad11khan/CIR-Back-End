const express = require("express");
const router = express.Router();
const multer = require("multer");
const messagee = require("../models/message");
const fs = require("fs");
const path = require("path");

// Set up multer for image uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./message/images");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });
//
const storage = multer.diskStorage({
  destination: "./message/images", // Use a more descriptive destination path
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
//

const upload = multer({ storage: storage });
const folderPath = "./message/images";

// Routes
router.post("/post/message", upload.single("image"), async (req, res) => {
  const { name, message } = req.body;
  console.log(req.file.filename, " ", name, " ", message);
  const image = req.file.filename;
  const newItem = messagee({
    image: image,
    name,
    message,
  });

  await newItem.save();
  res.json(newItem);
});

router.get("/get/message", async (req, res) => {
  const items = await messagee.find().sort({ _id: -1 });
  res.json(items);
});

router.get("/get/specific/:Id", async (req, res) => {
  const id = req.params.Id;
  let msg;
  try {
    msg = await messagee.findById(id);
    res.json(msg);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the library item" });
  }
});

// Route for updating a message by ID
router.put("/put/message/:id", upload.single("image"), async (req, res) => {
  let file1;

  // Check if req.file exists and has a filename
  if (req.file && req.file.filename) {
    file1 = req.file.filename;
  } else {
    file1 = req.body.image;
  }

  try {
    // Assuming messagee is a valid Mongoose model
    const updatedItem = await messagee.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        message: req.body.message,
        image: file1,
      },
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete/message/:id", async (req, res) => {
  const messageitem = await messagee.findByIdAndRemove(req.params.id);
  const findimage = messageitem.image;
  const file1Path = path.join(folderPath, findimage);
  fs.unlink(file1Path, (err2) => {
    if (err2) {
      console.error(`Error deleting`);
    } else {
      console.log(`deleted successfully.`);
    }
  });
  res.json({ success: true });
});

module.exports = router;
