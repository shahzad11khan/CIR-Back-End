const express = require("express");
const activitesmodel = require("../models/activetiesmodel");

const multer = require("multer");
const router = express.Router();

//Upload image
// const storage = multer.diskStorage({
//     destination: (req, file, cb)=> {
//   // destination is used to specify the path of the directory in which the files have to be stored
//     cb(null, './activities/images');
//   },
//   filename:  (req, file, cb) =>{
//   // It is the filename that is given to the saved file.
//      cb(null , file.originalname);
//   }

// });
const storage = multer.diskStorage({
  destination: "./activities/images", // Use a more descriptive destination path
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
const folderPath = "./activities/images"; // Replace with the actual path to your folder
const upload = multer({ storage: storage });
// http://localhost:7000/files/uploadfile
router.post(
  "/uploadfiles",
  upload.fields([{ name: "file1" }, { name: "file2" }]),
  async (req, res) => {
    console.log(req.body);
    // console.log(req.files.file1);
    console.log(req.files.file2);

    let file2;
    if (req.files.file2 === undefined) {
      file2 = "";
      // console.log(file2,"is empty");
      const file1 = req.files["file1"][0].filename;
      const filesave = new activitesmodel({
        title: req.body.title,
        shortDescription: req.body.shortdescription,
        image: file1,
        longDescription: req.body.longdescription,
        metaTitle: req.body.metatitle,
        coverimage: file2,
        metashortDescription: req.body.metashortdescription,
        metalongDescription: req.body.metalongdescription,
        check: req.body.check,
        approve: req.body.approve,
      });
      const savefiles = filesave.save();
      console.log(savefiles);
    } else {
      file2 = req.files["file2"][0].filename;
      // console.log(file2);
      const file1 = req.files["file1"][0].filename;
      const filesave = new activitesmodel({
        title: req.body.title,
        shortDescription: req.body.shortdescription,
        image: file1,
        longDescription: req.body.longdescription,
        metaTitle: req.body.metatitle,
        coverimage: file2,
        metashortDescription: req.body.metashortdescription,
        metalongDescription: req.body.metalongdescription,
        check: req.body.check,
        approve: req.body.approve,
      });
      const savefiles = filesave.save();
      console.log(savefiles);
    }
  }
);

// get all files
// http://localhost:7000/files/getuploadedfile
router.get("/getuploadedallfiles", async (req, res) => {
  try {
    let getfiles = await activitesmodel.find().sort({ _id: -1 });
    if (getfiles) {
      return res.json(getfiles);
    } else {
      res.status(501).json({ result: "File are not availiables.." });
    }
  } catch (error) {
    res.status(500).json({ result: "Server error" });
  }
});

// get sepsific file
router.get("/specificuploadedfile/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let getfiles = await activitesmodel.findById(id);
    if (getfiles) {
      res.json(getfiles);
    } else {
      res.status(501).json({ result: "Soory" });
    }
  } catch (error) {
    res.status(500).json({ result: "Server error" });
  }
});

// Update a news article by ID
router.put(
  "/updateactivity/:id",
  upload.fields([{ name: "file1" }, { name: "file2" }]),
  async (req, res) => {
    console.log(req.body);
    try {
      const id = req.params.id;
      const {
        title,
        shortdescription,
        longdescription,
        metatitle,
        metashortdescription,
        metalongdescription,
        check,
      } = req.body;
      // let file1 = req.files['file1'][0].filename;
      // let file2 = req.files['file2'] ? req.files['file2'][0].filename : '';
      let file1; // Initialize file1 variable

      if (req.files["file1"]) {
        file1 = req.files["file1"][0].filename;
      } else {
        file1 = req.body.file1;
      }
      let file2 = req.files["file2"] ? req.files["file2"][0].filename : "";
      // Find the document by ID and update it
      const updatedProject = await activitesmodel.findByIdAndUpdate(
        id,
        {
          title,
          shortDescription: shortdescription,
          image: file1,
          longDescription: longdescription,
          check,
          metaTitle: metatitle,
          coverimage: file2,
          metashortDescription: metashortdescription,
          metalongDescription: metalongdescription,
          approve: req.body.approve,
        },
        { new: true }
      ); // { new: true } returns the updated document

      if (!updatedProject) {
        return res.status(404).json({ error: "activity not found" });
      }
      return res.json(updatedProject);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// delete files
// http://localhost:7000/files/deleteuploadedfile/ id
router.delete("/deleteuploadedfile/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let getfiles = await activitesmodel.findByIdAndRemove(id);
    const file = getfiles.image;
    const filePath = path.join(folderPath, file);
    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting the file:", err);
        } else {
          console.log("File deleted successfully");
        }
      });
    } else {
      console.error("File does not exist");
    }
    if (getfiles) {
      return res.json(getfiles);
    } else {
      res.status(501).json({ result: "Soory" });
    }
  } catch (error) {
    res.status(500).json({ result: "Server error" });
  }
});

// update all the record with approve 0 to 1
router.put("/update-all", (req, res) => {
  activitesmodel
    .updateMany({}, { $set: { approve: "1" } })
    .then(() => {
      console.log("All records updated successfully");
      res.status(200).json("All records updated successfully");
    })
    .catch((error) => {
      console.error("Failed to update all records:", error);
      res.status(500).json("Failed to update all records");
    });
});

module.exports = router;