// src/modules/auth/auth.service.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../users/user.model");

const SALT_ROUNDS = 10;

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error("Email already in use");
    error.status = 400;
    throw error;
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const isFirstUser = (await User.countDocuments()) === 0;
  const role = isFirstUser ? "ADMIN" : "READER";

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

const refreshTokens = async (token) => {
  if (!token) {
    const error = new Error("Refresh token required");
    error.status = 400;
    throw error;
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    const error = new Error("Invalid refresh token");
    error.status = 401;
    throw error;
  }

  const user = await User.findById(payload.sub);
  if (!user || user.refreshToken !== token) {
    const error = new Error("Refresh token not valid");
    error.status = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

module.exports = {
  register,
  login,
  refreshTokens,
  logout,
};
