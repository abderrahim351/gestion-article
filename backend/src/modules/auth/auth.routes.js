// src/modules/auth/auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { authenticate } = require("../../middlewares/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authenticate, authController.logout);

module.exports = router;
