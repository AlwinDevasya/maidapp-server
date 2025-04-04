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
  "http://localhost:5173", // Local dev
  "https://maidapp-frontend-s5lj.vercel.app", // Deployed frontend
];

server.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked CORS request from:", origin);
        callback(new Error("CORS policy does not allow this origin"));
      }
    },
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

// Parse incoming JSON
server.use(express.json());

// Use router
server.use(router);

// Test route
server.get("/", (req, res) => {
  res.send("GET request received");
});

// Set port
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`✅ Server is running successfully at PORT ${PORT}`);
});
