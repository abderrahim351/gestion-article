// src/modules/auth/auth.controller.js
const authService = require("./auth.service");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    const data = await authService.register({ name, email, password });
    return res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const data = await authService.login({ email, password });
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const tokens = await authService.refreshTokens(refreshToken);
    return res.status(200).json(tokens);
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await authService.logout(userId);
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
