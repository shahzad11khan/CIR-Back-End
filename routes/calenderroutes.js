const express = require("express");
const router = express.Router();
const calendermodel = require("../models/calendermodel");
// const controller=require('../controller/controller')

// this is get all medicine route
// 1st method
router.get("/getallcalender", async (req, res) => {
  let calender;
  try {
    calender = await calendermodel.find().sort({ _id: -1 });
    res.json(calender);
  } catch (err) {
    console.log(err);
  }
});
// 2nd method
// router.get('/',controller.getallmedi)

// enter medicine into database
router.post("/addcalender", async (req, res) => {
  // const { data, description, country, city, longDescription } =
  console.log(req.body);
  // console.log({data, description, country, city, longDescription});
  let calender;
  try {
    calender = new calendermodel({
      date: req.body.date,
      description: req.body.shortdescription,
      country: req.body.selectcountry,
      city: req.body.selectcity,
      longDescription: req.body.longdescription,
      approve: req.body.approve,
      check: req.body.check,
    });
    const data = await calender.save();
    res.json(calender);
  } catch (err) {
    console.log(err);
  }
});

// get record by id
router.get("/getspecific/:id", async (req, res) => {
  const id = req.params.id;
  let calender;
  try {
    calender = await calendermodel.findById(id);
    res.json(calender);
  } catch (error) {
    console.log(error);
  }
});

//update medicines by id
// router.put('/updatecalender/:id', async (req, res) => {
//     const id = req.params.id;
//     console.log(req.body)
//     console.log(id);
//     const { date, shortdescription, selectcountry, selectcity, longdescription,approve,check } = req.body;
//     let calender;
//     try {
//         calender = await calendermodel.findByIdAndUpdate(id, {
//             data:date, description:shortdescription, country:selectcountry, city:selectcity, longDescription:longdescription,approve:approve,check:check,
//         });

//     } catch (err) {
//         console.log(err);
//     }
//     if (!calender) {
//         return res.status(404).json({ message: "Nothing has been updated.." })
//     }
//     else {
//          res.json(calender)
//     }

// })
router.put("/put/update/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  console.log(req.body);
  const {
    date,
    shortdescription,
    selectcountry,
    selectcity,
    longdescription,
    check,
    approve,
  } = req.body;
  try {
    const updatedCalendarEntry = await calendermodel.findByIdAndUpdate(
      id,
      {
        date: date,
        description: shortdescription,
        country: selectcountry,
        city: selectcity,
        longDescription: longdescription,
        check: check,
        approve: approve,
      },

      { new: true }
    );
    res.json(updatedCalendarEntry);
  } catch (error) {
    console.error("Error updating calendar entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// deleteing medicine by id
router.delete("/deletecalender/:id", async (req, res, next) => {
  let id = req.params.id;
  let calender;
  try {
    calender = await calendermodel.findByIdAndRemove(id);
  } catch (error) {
    console.log(error, "u r fked up");
  }
  if (!calender) {
    return res
      .status(404)
      .json({ message: "calender is deleted successfully..." });
  } else {
    return res.status(200).json({ calender });
  }
});
// all record updated approve 0 to 1
router.put("/update-all", (req, res) => {
  calendermodel
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
