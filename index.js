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
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

// ✅ Let cors handle preflight properly
server.options("*", cors());

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
