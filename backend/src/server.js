const express = require("express");
const cors = require("cors");
const path = require("path");
const { getDb } = require("./database");
const { seed } = require("./seed");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and seed
getDb();
seed();

// API Routes
app.use("/api/farms", require("./routes/farms"));
app.use("/api/products", require("./routes/products"));
app.use("/api/reservations", require("./routes/reservations"));
app.use("/api/producer", require("./routes/producer"));
app.use("/api/pickup", require("./routes/pickup"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Local Food API server running on http://127.0.0.1:${PORT}`);
});