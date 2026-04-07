const express = require("express");
const router = express.Router();
const { capturePayment, verifyPayment, verifySignature,  sendPaymentSuccessEmail,
} = require("../controllers/Payments");

const { auth, isStudent } = require("../middlewares/Auth");
router.post("/capturePayment", auth, isStudent, capturePayment);
// router.post("/verifySignature", auth, isStudent, verifyPayment);
// router.post("/verifySignature", verifySignature);
router.post("/verifyPayment", auth, isStudent, verifyPayment);

// router.post(
//   "/sendPaymentSuccessEmail",
//   auth,
//   isStudent,
//   sendPaymentSuccessEmail
// );
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  sendPaymentSuccessEmail
);

module.exports = router;