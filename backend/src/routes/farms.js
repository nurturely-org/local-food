const express = require("express");
const { getDb } = require("../database");

const router = express.Router();

// GET /api/farms - List all active farms
router.get("/", (req, res) => {
  const db = getDb();
  const farms = db
    .prepare("SELECT * FROM farms WHERE active = 1 ORDER BY name")
    .all();
  res.json(farms);
});

// GET /api/farms/:id - Get a single farm with its products
router.get("/:id", (req, res) => {
  const db = getDb();
  const farm = db.prepare("SELECT * FROM farms WHERE id = ?").get(req.params.id);
  if (!farm) {
    return res.status(404).json({ error: "Farm not found" });
  }
  const products = db
    .prepare(
      "SELECT * FROM products WHERE farm_id = ? AND is_available = 1 ORDER BY category, name"
    )
    .all(req.params.id);
  res.json({ ...farm, products });
});

module.exports = router;
