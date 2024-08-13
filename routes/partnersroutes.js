const express = require("express");
const Partner = require("../models/partners");

const multer = require("multer");
const router = express.Router();

// Set up multer for handling file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./partners/images"); // Save uploaded files in the 'uploads' directory
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname); // Rename files to avoid conflicts
//   },
// });
//
const storage = multer.diskStorage({
  destination: "./partners/images", // Use a more descriptive destination path
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
//
const upload = multer({ storage: storage });

// CRUD operations

// Create a new partner with an image upload
router.post("/post/partners", upload.single("image"), async (req, res) => {
  try {
    //   const { name, description } = req.body;
    const imagePath = req.file.filename;

    const newPartner = new Partner({ image: imagePath });
    await newPartner.save();
    res.status(201).json(newPartner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read all partners
router.get("/get/partners", async (req, res) => {
  try {
    const partners = await Partner.find().sort({ _id: -1 });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get/partners/:Id", async (req, res) => {
  const id = req.params.Id;
  let msg;
  try {
    msg = await Partner.findById(id);
    res.json(msg);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the library item" });
  }
});

// Update a partner
router.put("/put/partners/:id", upload.single("image"), async (req, res) => {
  let file1;

  // Check if req.file exists and has a filename
  if (req.file && req.file.filename) {
    file1 = req.file.filename;
  } else {
    file1 = req.body.image;
  }

  try {
    // Assuming messagee is a valid Mongoose model
    const updatedItem = await Partner.findByIdAndUpdate(
      req.params.id,
      {
        // name: req.body.name,
        // message: req.body.message,
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

// Delete a partner
router.delete("/delete/partners/:id", async (req, res) => {
  try {
    await Partner.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
