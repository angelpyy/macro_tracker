require('dotenv').config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '1h' });
    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const token  = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '1h' });
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(400).json({ message: 'Login Failed', error: error.message });
  }
};


// Handle validation at the front page level before sending the request to the server
// Simplify the registration and login functions by using async/await

// const validate = (req, res, next) => {
//   const { username, password } = req.body;
//   const errors = [];

//   if (!username || !username.trim()) {
//     errors.push("Username is required.");
//   }
//   if (username && username.includes(" ")) {
//     errors.push("Username cannot contain spaces.");
//   }
//   if (!password || !password.trim()) {
//     errors.push("Password is required.");
//   }
//   if (password && password.includes(" ")) {
//     errors.push("Password cannot contain spaces.");
//   }

//   if (errors.length > 0) {
//     res.status(400).json({ errors });
//   } else {
//     next();
//   }
// };

// const register = (req, res, next) => {
//   //Hash the user's password
//   bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
//     if (err) {
//       //If there's an error, return a 400 status code and an error message
//       return res.status(400).json({
//         message: "An error has occurred.",
//       });
//     }
//     //Check if the username already exists in the database
//     Login.findOne({ username: req.body.username }).then((existingUser) => {
//       if (existingUser) {
//         //If the username already exists, return a 400 status code and an error message
//         return res.status(400).json({
//           message: "Username already exists. Please choose a different one.",
//         });
//       }
//       //If the username doesn't already exist, create a new user object and save it to the database
//       let user = new Login({
//         username: req.body.username,
//         password: hashedPass,
//       });
//       user.save().then((user) => {
//         //If the user is saved successfully, generate a JWT token and return a 200 status code and a success message with the token
//         const token = jwt.sign(
//           {
//             username: user.username,
//             userId: user._id,
//           },
//           process.env.JWT_KEY, //must include in env file in current environment
//           { expiresIn: "1h" }
//         );
//         return res
//           .status(200)
//           .json({ message: "User Registered Successfully.", token: token });
//       });
//     });
//   });
// };

// const login = (req, res, next) => {
//   // Find the user with the given username
//   Login.findOne({ username: req.body.username }).then((existingUser) => {
//     // If the user doesn't exist, send an error response
//     if (!existingUser) {
//       return res.status(400).json({ message: "User not found." });
//     }

//     // Compare the password provided with the stored password hash
//     bcrypt.compare(
//       req.body.password,
//       existingUser.password,
//       function (err, result) {
//         // If there's an error in comparison other than passwords dont match, send an error response
//         if (err) {
//           return res.status(401).json({ message: "Authentication failed." });
//         }

//         // If the password is correct, generate a token and send a success response
//         if (result) {
//           const token = jwt.sign(
//             {
//               username: existingUser.username,
//               userId: existingUser._id,
//             },
//             process.env.JWT_KEY, //must include in env file in current environment
//             { expiresIn: "1h" }
//           );
//           return res
//             .status(200)
//             .json({ message: "Authentication successful.", token: token });
//         }

//         // If the password is incorrect, send an error response
//         return res
//           .status(401)
//           .json({ message: "Authentication failed. Username or Password is incorrect." });
//       }
//     );
//   });
// };