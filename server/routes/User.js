const express = require("express");
const router = express.Router();

const {
  login,
  signUp,
  sendOTP,
  changePassword,
} = require("../controllers/Auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

const { auth } = require("../middlewares/Auth");

// Route for user login
router.post("/login", login);

// Route for user SignUp
router.post("/signup", signUp);

// Route for sendOTP
router.post("/sendotp", sendOTP);

// Route for "auth","changePassword"
router.post("/changepassword", auth, changePassword);

// Route for resetPasswordToken
router.post("/reset-password-token", resetPasswordToken);

// Route for resetPassword
router.post("/reset-password", resetPassword);

module.exports = router;