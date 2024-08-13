const User = require('../models/usersmodel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// get all function
const getallusers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    return res.status(500).send('An error occurred');
  }
}

// register function
const registeruser = async (req, res) => {
  console.log(req.body)
  const { username, email, password, select,selectedPermissions } = req.body
  // for hashing a pasword
  const hashedPassword = await bcrypt.hash(password, 10);
  // // checking condition here
  if (!username || !email || !password || !select) {
    return res.status(422).json({ error: "Fill all the details....!" })
  }
  try {
    // check password and confrompassword is same
    const preuser = await User.findOne({ email: email })

    if (preuser) {
      res.status(422).json({ error: "Email already exists...!" })
      // console.log('email is exits...!');
    }
    else {
      // Create a new user instance
      // console.log("good newss...!");
      const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
        confrompassword:password,
        usertype: select,
        permissions:selectedPermissions
      });

      // Save the user to the database
      const savedUser = await newUser.save();
      if (!newUser) {
        console.log("user not added....");
        res.status(500).json({ error: 'An error occurred' });
      } else {
        console.log({ newUser });
        res.status(201).json({ message: 'User registered successfully', user: savedUser });
      }

    }

  } catch (error) {
    console.log("error occur.....", error)
  }
}

// login function
const login = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email,password);
  const finduser = await User.findOne({ email: email })
  if (!finduser) {
    // console.log("email is not found..!");
    res.json({ message: "User Email Does`t Match...! soory" })
  } else {
     bcrypt.compare(password, finduser.password, (err, response) => {
      if(response){
      // console.log("Every Thing is right...! Hurrah");
      const secretKey = process.env.JWT_TOKEN;
      const token = jwt.sign({ userId: finduser._id, user: finduser.username, userType: finduser.usertype ,permissions:finduser.permissions }, secretKey, { expiresIn: '1d' });
      // console.log(token);
      const userr = { user: finduser.username, type:finduser.usertype , permissions:finduser.permissions }
      res.cookie("usertoken", token, {
        expires: new Date(Date.now() + 9000000),
        httpOnly: true
      });
      const result = {
        finduser,
        token
      }
      res.status(201).json({ status: 201, result, userr })
      console.log("login time:",result);
    }
    });

  }

}

// delete function
const delet = async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID and remove it
    const user = await User.findByIdAndRemove(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    return res.send('User deleted successfully');
  } catch (err) {
    return res.status(500).send('An error occurred');
  }
}

//   update function
// const update = async (req, res) => {
//   const userId = req.params.id;
//   // console.log(req.body)
//   const { getuser, getuseremail, getuserpassword, getuserselect } = req.body
//   // for hashing a pasword
//   const hashedPassword = await bcrypt.hash(getuserpassword, 10);
//   try {
//     // Find the user by ID and update it
//     const user = await User.findByIdAndUpdate(userId, {
//       username: getuser,
//       email: getuseremail,
//       password: hashedPassword,
//       usertype: getuserselect
//     });

//     if (!user) {
//       return res.status(404).send('User not found');
//     }

//     return res.send('User updated successfully');
//   } catch (err) {
//     return res.status(500).send('An error occurred');
//   }
// }

// const update = async (req, res) => {
//   const userId = req.params.id;
//   console.log(req.body)
//   const { getuser, getuseremail, getuserpassword, getuserselect,selectedPermissions } = req.body;

//   try {
//     // Check if the user is trying to update the password
//     if (getuserpassword) {
//       // Hash the new password
//       const hashedPassword = await bcrypt.hash(getuserpassword, 10);

//       // Update the user with the new hashed password
//       await User.findByIdAndUpdate(userId, {
//         username: getuser,
//         email: getuseremail,
//         password: hashedPassword,
//         usertype: getuserselect,
//         permissions:selectedPermissions
//       });
//     } else {
//       // Update the user without changing the password
//       await User.findByIdAndUpdate(userId, {
//         username: getuser,
//         email: getuseremail,
//         usertype: getuserselect,
//         permissions:permissions
//       });
//     }

//     return res.send('User updated successfully');
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send('An error occurred');
//   }
// };
const update = async (req, res) => {
  const userId = req.params.id;
  const { getuser, getuseremail, getuserpassword, getuserselect, selectedPermissions } = req.body;

  try {
    let updateFields = {
      username: getuser,
      email: getuseremail,
      usertype: getuserselect,
      permissions: selectedPermissions
    };

    // Check if the user is trying to update the password
    if (getuserpassword) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(getuserpassword, 10);
      // Update the user with the new hashed password
      updateFields.password = hashedPassword;
    } else {
      // Retrieve the existing password from the database
      const existingUser = await User.findById(userId);
      if (existingUser) {
        // Use the existing password in the update
        updateFields.password = existingUser.password;
      }
    }

    // Update the user
    await User.findByIdAndUpdate(userId, updateFields);

    return res.send('User updated successfully');
  } catch (err) {
    console.error(err);
    return res.status(500).send('An error occurred');
  }
};

// 

// 

// get specific function
const getspecific = async (req, res) => {
  const userId = req.params.userId; // Get the user ID from the URL

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).send('An error occurred');
  }
}
exports.registeruser = registeruser;
exports.login = login;
exports.delet = delet;
exports.update = update;
exports.getallusers = getallusers;
exports.getspecific = getspecific;


