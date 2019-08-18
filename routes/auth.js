const express = require("express");
const authController = require("../controllers/auth");
const { loginValidators, signupValidators } = require("../validators/auth");

const router = express.Router();

router.post("/signup", signupValidators, authController.signup);

router.post("/login", loginValidators, authController.signin);

module.exports = router;
