const express = require("express");
const router = express.Router();
const multer = require("multer");
const LibraryItem = require("../models/librarymodel");
const fs = require("fs");
const path = require("path");
//Upload image
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // destination is used to specify the path of the directory in which the files have to be stored
//     cb(null, './library/images');
//   },
//   filename: (req, file, cb) => {
//     // It is the filename that is given to the saved file.
//     cb(null, file.originalname);
//   }
// });
//
const storage = multer.diskStorage({
  destination: "./library/images", // Use a more descriptive destination path
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
//
const folderPath = "./library/images";
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB file size limit
  },
});

// Create a new library item with file uploads
// router.post('/postlibrary', upload.fields([{ name: 'file' }, { name: 'image' }]), async (req, res) => {
//   console.log(req.body);
//   console.log(req.files['file'][0].filename);
//   console.log(req.files['image'][0].filename);
//   try {
//     const lib = new LibraryItem({
//       title: req.body.title,
//       shortDescription: req.body.shortdescription,
//       category: req.body.category,
//       nature: req.body.nature,
//       project: req.body.project,
//       approve: req.body.approve, // Ensure that req.body.approve contains the correct value
//       credentials: req.body.selectvalues,
//       file: req.files['file'][0].filename,
//       image: req.files['image'][0].filename,
//       longDescription: req.body.longdescriotion, // Correct the typo in "longDescription"
//     });

//  const libdone =   lib.save();
//  if(libdone){
//   // console.log(libdone)
//   res.status(200).json({"status":200})
//  }

//   } catch (err) {
//     console.log(err);
//   }
// });
router.post(
  "/postlibrary",
  upload.fields([{ name: "file" }, { name: "image" }]),
  async (req, res) => {
    console.log(req.body);
    console.log(req.files["file"][0].filename);
    console.log(req.files["image"][0].filename);

    try {
      const lib = new LibraryItem({
        title: req.body.title,
        shortDescription: req.body.shortdescription,
        category: req.body.category,
        nature: req.body.nature,
        project: req.body.project,
        approve: req.body.approve, // Ensure that req.body.approve contains the correct value
        credentials: req.body.selectvalues,
        file: req.files["file"][0].filename,
        image: req.files["image"][0].filename,
        longDescription: req.body.longdescriotion, // Correct the typo in "longDescription"
      });

      const libdone = await lib.save(); // Wait for the save operation to complete

      if (libdone) {
        // console.log(libdone)
        res.status(200).json({ status: 200 });
      } else {
        // If the save operation fails
        res.status(500).json({ status: 500, error: "Failed to add library" });
      }
    } catch (err) {
      console.log(err);
      // Handle other errors
      res.status(500).json({ status: 500, error: "Failed to add library" });
    }
  }
);

// Retrieve all library items
router.get("/getalllibrary", async (req, res) => {
  try {
    const libraryItems = await LibraryItem.find().sort({ _id: -1 });
    res.json(libraryItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve library items" });
  }
});

// Retrieve a single library item by ID
router.get("/getspecificlibrary/:libraryItemId", async (req, res) => {
  const id = req.params.libraryItemId;
  let lib;
  try {
    lib = await LibraryItem.findById(id);
    res.json(lib);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the library item" });
  }
});

// Update a library item by ID
// router.put('/updatelibrary/:id', upload.fields([{ name: 'file' }, { name: 'image' }]), async (req, res) => {
//   // console.log(req.params.id)
//   // const id = req.params.id
//   // console.log(req.body)

//   // const file1 = req.files.file
//   // const file2 = req.files.image
//   // if (file1 === undefined || file2 === undefined) {
//   //   let lib;
//   //   try {
//   //     lib = await LibraryItem.findByIdAndUpdate(id, {
//   //       title: req.body.title,
//   //       shortDescription: req.body.shortdescription,
//   //       category: req.body.selectedcategory,
//   //       nature: req.body.selectednature,
//   //       project: req.body.selectedproject,
//   //       credentials: req.body.credentials,
//   //       file: req.body.file,
//   //       image: req.body.image,
//   //       longDescription: req.body.longdescription,
//   //       approve: req.body.approve
//   //     });

//   //     res.json(lib)

//   //   } catch (err) {
//   //     console.log(err);
//   //   }
//   // } else {
//   //   let lib;
//   //   try {
//   //     lib = await LibraryItem.findByIdAndUpdate(id, {
//   //       title: req.body.title,
//   //       shortDescription: req.body.shortdescription,
//   //       category: req.body.selectedCategory,
//   //       nature: req.body.Selectednatures,
//   //       project: req.body.SelectedProjects,
//   //       credentials: req.body.credentials,
//   //       file: req.files['file'][0].filename,
//   //       image: req.files['image'][0].filename,
//   //       longDescription: req.body.longdescription,
//   //       approve: req.body.update

//   //     });

//   //     res.json(lib)

//   //   } catch (err) {
//   //     console.log(err);
//   //   }
//   // }
//   console.log(req.body)
//   // console.log(req.files['file'][0].filename);
//   console.log(req.files['image'][0].filename);

//   try {
//     const id = req.params.id;
//     const { title, shortdescription, longdescription, selectedcategory, selectednature, selectedproject,credentials,approve} = req.body;
//     // let file1 = req.files['file1'][0].filename;
//     // let file2 = req.files['file2'] ? req.files['file2'][0].filename : '';
//     let file; // Initialize file1 variable
//     let image;
//     if (req.files['file'] && req.files['image']) {
//       file = req.files['file'][0].filename;
//       image = req.files['image'][0].filename;
//     } else if (req.files['file']) {
//       file = req.files['file'][0].filename;
//     } else if (req.files['image']) {
//       image = req.files['image'][0].filename;
//     } else if(!req.files['file']){
//       file=req.body.file
//     }else if(!req.files['image']){
//       image = req.body.image;
//     }

//     // Find the document by ID and update it
//     const updatedLib = await LibraryItem.findByIdAndUpdate(id, {
//       title,
//       shortDescription: shortdescription,
//       file: file,
//       longDescription: longdescription,
//       image: image,
//       credentials:credentials,
//       category:selectedcategory,
//       nature:selectednature,
//       project:selectedproject,
//       approve:approve
//     }, { new: true }); // { new: true } returns the updated document

//     if (!updatedLib) {
//       return res.status(404).json({ error: 'Library not found' });
//     }
//     return res.json(updatedLib);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
//   //
// });
router.put(
  "/updatelibrary/:id",
  upload.fields([{ name: "file" }, { name: "image" }]),
  async (req, res) => {
    try {
      const id = req.params.id;
      const {
        title,
        shortdescription,
        longdescription,
        selectedcategory,
        selectednature,
        selectedproject,
        credentials,
        approve,
      } = req.body;

      let file;
      let image;

      if (req.files["file"] && req.files["image"]) {
        file = req.files["file"][0].filename;
        image = req.files["image"][0].filename;
      } else if (req.files["file"]) {
        file = req.files["file"][0].filename;
      } else if (req.files["image"]) {
        image = req.files["image"][0].filename;
      }

      // Find the existing document by ID
      const existingLib = await LibraryItem.findById(id);

      // Update only the fields that are present in the request
      const updatedLib = await LibraryItem.findByIdAndUpdate(
        id,
        {
          title,
          shortDescription: shortdescription,
          file: file || existingLib.file, // use existing file if not updated
          longDescription: longdescription,
          image: image || existingLib.image, // use existing image if not updated
          credentials,
          category: selectedcategory,
          nature: selectednature,
          project: selectedproject,
          approve,
        },
        { new: true }
      );

      if (!updatedLib) {
        return res.status(404).json({ error: "Library not found" });
      }
      return res.json(updatedLib);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete a library item by ID
router.delete("/deletelibrary/:libraryItemId", async (req, res) => {
  try {
    const libraryItem = await LibraryItem.findByIdAndRemove(
      req.params.libraryItemId
    );
    const file = libraryItem.file;
    const findimage = libraryItem.image;

    const file1Path = path.join(folderPath, file);
    const file2Path = path.join(folderPath, findimage);

    fs.unlink(file1Path, (err1) => {
      if (err1) {
        console.error(`Error deleting:`);
      } else {
        console.log(` deleted successfully.`);

        // After successfully deleting the first file, proceed to delete the second file
        fs.unlink(file2Path, (err2) => {
          if (err2) {
            console.error(`Error deleting`);
          } else {
            console.log(`deleted successfully.`);
          }
        });
      }
    });

    if (!libraryItem) {
      return res.status(404).json({ error: "Library item not found" });
    }
    res.json({ message: "Library item deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the library item" });
  }
});

// update all the record with approve 0 to 1
router.put("/update-all", (req, res) => {
  LibraryItem.updateMany({}, { $set: { approve: "1" } })
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
