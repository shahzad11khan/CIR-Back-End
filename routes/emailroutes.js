const express = require("express");
const Emails = require("../models/emailmodel");
const nodemailer = require("nodemailer");
const router = express.Router();
const LibraryItem = require("../models/librarymodel");

router.post("/send-email/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, approval } = req.body;

  console.log("Received request to send email for ID:", id);

  try {
    // Find the library item by ID
    const existingLib = await LibraryItem.findById(id);

    // Check if the library item exists
    if (!existingLib) {
      console.log("Library item not found for ID:", id);
      return res.status(404).json({ error: "Library item not found" });
    }

    console.log("Library item found for ID:", id);

    // Assuming 'existingLib.file' contains the file name only
    const file = existingLib.file;

    // Create a new Emails instance
    const newEmail = new Emails({
      name: name,
      email: email,
      emailId: id, // Use the id from the URL params
      file: file, // Use the file obtained from the existing library item
      approval: approval,
    });

    console.log("Creating new email instance:", newEmail);

    // Save the new email instance to the database
    const savedEmail = await newEmail.save();

    console.log("Email saved successfully:", savedEmail);

    res.json(savedEmail);
  } catch (error) {
    console.error("Error occurred while sending email:", error.message);
    res.status(400).json({ error: error.message });
  }
});

//
// Get all emails
router.get("/emails", async (req, res) => {
  try {
    const emails = await Emails.find();
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Update a specific email by ID
router.put("/emails/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, approval, file, emailId } = req.body; // Destructuring additional variables
  console.log(id, name, email, approval, emailId);
  try {
    console.log("Received request to update email with ID:", req.params.id);

    const updatedEmail = await Emails.findByIdAndUpdate(
      id, // Use the destructured 'id' directly
      {
        name: name, // Simplify to use destructured variables
        email: email,
        approval: approval, // Corrected the field name
        file: file, // Assuming 'file' is defined in req.body
        emailId: emailId,
      },
      { new: true }
    );

    console.log("Email updated:", updatedEmail);

    if (!updatedEmail) {
      console.log("Email not found.");
      return res.status(404).json({ message: "Email not found" });
    }

    console.log("Sending email...");

    // const existingLib = await LibraryItem.findById(emailId); // Using the destructured 'emailId'
    const existingLib = await LibraryItem.findById(emailId);
    console.log(existingLib ? "yes" : "no");
    // return;

    if (!existingLib) {
      return res.status(404).json({ error: "Library item not found" });
    }

    const getfile = existingLib.file;
    console.log("File found:", getfile);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_ADD,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = {
      from: process.env.EMAIL_ADD_SEND_FROM,
      to: email, // Use the destructured 'email' directly
      subject: "Your Subject Here", // Add subject field
      html: `<h1>Thanks From CIR</h1><p>This file is sent from CIR</p>`, // Corrected text to HTML
      attachments: [
        {
          path: "./library/images/" + file, // Use the destructured 'file' directly
        },
      ],
    };

    console.log("Sending email to:", message.to);

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        res.status(500).json({ error: "Email not sent" });
      } else {
        console.log("Email sent:", info.response);
        res.json({ message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(400).json({ error: error.message });
  }
});

//

// Delete a specific email by ID
router.delete("/emails/:id", async (req, res) => {
  try {
    const deletedEmail = await Emails.findByIdAndDelete(req.params.id);
    if (!deletedEmail) {
      return res.status(404).json({ message: "Email not found" });
    }
    res.json(deletedEmail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update all approvals
router.put("/update-all", (req, res) => {
  Emails.updateMany({ approval: "0" }, { $set: { approval: "1" } })
    .then((result) => {
      if (result.nModified > 0) {
        console.log("All records updated successfully");
        res.status(200).json("All records updated successfully");
      } else {
        console.log("No records found with approval status 0");
        res.status(404).json("No records found with approval status 0");
      }
    })
    .catch((error) => {
      console.error("Failed to update all records:", error);
      res.status(500).json("Failed to update all records");
    });
});
module.exports = router;
