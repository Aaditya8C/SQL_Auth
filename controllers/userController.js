// const User = require("../models/userModel");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

// const register = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const user = await User.create({ username, email, password });
//     res.status(201).send("User registered successfully.");
//   } catch (err) {
//     res.status(500).send("Error registering the user.");
//   }
// };

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ where: { email } });

//     if (!user) {
//       return res.status(401).send("Invalid credentials.");
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).send("Invalid credentials.");
//     }

//     const token = jwt.sign({ id: user.id }, "your_jwt_secret", {
//       expiresIn: "1h",
//     });
//     res.json({ token });
//   } catch (err) {
//     res.status(500).send("Error logging in.");
//   }
// };

// module.exports = {
//   register,
//   login,
// };

const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const dot = require("dotenv");
dot.config();

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(200).json({
        status: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    // Send response
    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: {
        email: user.email,
        username: user.username,
        token: token,
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "User not found",
      });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: "Invalid password",
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send response
    res.status(200).json({
      status: true,
      message: "User logged in successfully",
      data: {
        username: user.username,
        token: token,
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = {
  register,
  login,
};
