// Import dotenv
require("dotenv").config();

// Import express
const express = require("express");

// Import cors
const cors = require("cors");

// Import router
const router = require("./router");

// Import connection
require("./connection");

// Create server
const server = express();

// ✅ Allow CORS for both localhost (development) and deployed frontend (Vercel)
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://maidapp-frontend-3ra3.vercel.app", // Deployed frontend (Updated)
];

server.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy does not allow this origin"), false);
      }
    },
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true, // ✅ Allow cookies if needed
  })
);

// ✅ Handle preflight requests
server.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// ✅ Ensure Express understands JSON requests
server.use(express.json());

// Use the router for routes
server.use(router);

// Set port (fix for the PORT assignment)
const PORT = process.env.PORT || 4000;

// Listen
server.listen(PORT, () => {
  console.log(`✅ Server is running successfully at PORT ${PORT}`);
});

// Test route to verify server is running
server.get("/", (req, res) => {
  res.send("GET request received");
});
