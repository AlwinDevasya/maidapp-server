require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./router");
require("./connection");

const server = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://maidapp-frontend-wmdu.vercel.app", // ✅ Ensure correct frontend URL
];

// Debugging: Log incoming requests
server.use((req, res, next) => {
  console.log("Incoming request from:", req.headers.origin);
  next();
});

server.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("❌ Blocked by CORS:", origin);
        callback(new Error("CORS policy does not allow this origin"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Manually handle preflight requests
server.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  next();
});

server.use(express.json());
server.use(router);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`✅ Server is running successfully at PORT ${PORT}`);
});

// Test route
server.get("/", (req, res) => {
  res.send("GET request received");
});
