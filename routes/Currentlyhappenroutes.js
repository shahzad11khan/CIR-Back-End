const express = require("express");
const router = express.Router();
const CurrentlyHappening = require("../models/CurrentlyHappenmodel");

const multer = require("multer");

// Define multer storage configuration
const storage = multer.diskStorage({
  destination: "./currently/images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

// Initialize multer with the defined storage configuration
const upload = multer({ storage: storage });

// Define the route to handle the POST request for adding currently happening
router.post("/addcurrentlyhappen", upload.single("image"), async (req, res) => {
  try {
    console.log(req.file); // Log the uploaded file details

    // Destructure required fields from the request body
    const { title, shortDescription, longDescription, date, check, approve } =
      req.body;

    // Extract the filename of the uploaded image
    const imagePath = req.file.filename;

    // Assuming CurrentlyHappening is your Mongoose model
    const currentlyHappening = new CurrentlyHappening({
      title,
      image: imagePath, // Save the path of the image
      shortDescription,
      longDescription,
      date,
      check,
      approve,
    });

    // Save the currently happening object to the database
    await currentlyHappening.save();

    // Send a success response back to the client
    res.status(201).json({
      message: "Currently Happening created successfully",
      currentlyHappening,
    });
  } catch (err) {
    // If an error occurs, send a 500 internal server error response
    res.status(500).json({ error: err.message });
  }
});

// READ - GET request to get all currently happenings
router.get("/getcurrentlyhappen", async (req, res) => {
  try {
    const currentlyHappenings = await CurrentlyHappening.find();
    res.json(currentlyHappenings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ - GET request to get a single currently happening by ID
router.get("/getsepcificcurrentlyhappen/:id", async (req, res) => {
  try {
    const currentlyHappening = await CurrentlyHappening.findById(req.params.id);
    if (!currentlyHappening) {
      return res.status(404).json({ message: "Currently Happening not found" });
    }
    res.json(currentlyHappening);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - PUT request to update a currently happening
router.put("/updatecurrentlyhappen/:id", async (req, res) => {
  try {
    const { title, image, shortDescription, longDescription, check, approve } =
      req.body;
    const updatedCurrentlyHappening =
      await CurrentlyHappening.findByIdAndUpdate(
        req.params.id,
        { title, image, shortDescription, longDescription, check, approve },
        { new: true }
      );
    if (!updatedCurrentlyHappening) {
      return res.status(404).json({ message: "Currently Happening not found" });
    }
    res.json({
      message: "Currently Happening updated successfully",
      updatedCurrentlyHappening,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - DELETE request to delete a currently happening
router.delete("/deletecurrentlyhappen/:id", async (req, res) => {
  try {
    const deletedCurrentlyHappening =
      await CurrentlyHappening.findByIdAndDelete(req.params.id);
    if (!deletedCurrentlyHappening) {
      return res.status(404).json({ message: "Currently Happening not found" });
    }
    res.json({ message: "Currently Happening deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
