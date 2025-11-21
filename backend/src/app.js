// src/app.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const routes = require("./routes");
const path = require("path");
const app = express();
// ----- Middlewares  -----
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:4200",
    credentials: true,
  })
);

// Rate limiting 
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);
const uploadsPath = path.join(__dirname, "..", "uploads");

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(uploadsPath)
);
// ----- Routes principales -----
app.use("/api", routes);

// 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Handler d'erreurs 
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

module.exports = app;
