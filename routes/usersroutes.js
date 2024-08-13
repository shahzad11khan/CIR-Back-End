const express = require("express");
const userRegister = require("../controllers/userscontrollers");
const userlogin = require("../controllers/userscontrollers");
const userdelete = require("../controllers/userscontrollers");
const userupdate = require("../controllers/userscontrollers");
const allusers = require("../controllers/userscontrollers");
const getspecificuser = require("../controllers/userscontrollers");
const user = require("../models/usersmodel");
const { CheckAuth } = require("../Middleware/CheckAuth");
const router = express.Router();
// Middleware
// POST route for user registration
router.post("/registeruser", userRegister.registeruser);

// // login
router.post("/login", userlogin.login);

// delete api
router.delete("/delete/:id", userdelete.delet);

//   update api
router.put("/update/:id", userupdate.update);

//   get all users
router.get("/getallusers", allusers.getallusers);

//   get specific user
router.get("/specificuser/:userId", getspecificuser.getspecific);

// router.get("/validuser",CheckAuth,async (req,res)=>{
//     console.log("done");
//     try {
//         const validuser= await user.findOne({_id:req.userId});
//         res.status(201).json({status:201,validuser})
//         // console.log(validuser);
//     } catch (error) {
//         res.status(401).json({status:401,error})

//     }

// })

router.get("/validuser", CheckAuth, async (req, res) => {
  try {
    const validUser = await user.findOne({ _id: req.userId });

    if (!validUser) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }
    res.status(200).json({ status: 200, validUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
});

// //   clear cookies logout
// router.get("/logout", (req, res) => {
//     res.clearCookie('token');
//     return res.json("clear the token or cookies")
// })

module.exports = router;
