const express = require("express");
const { getDb } = require("../database");

const router = express.Router();

// GET /api/products - List all available products with farm info
router.get("/", (req, res) => {
  const db = getDb();
  const { farm_id, category } = req.query;

  let sql = `
    SELECT p.*, f.name as farm_name, f.county, f.pickup_info
    FROM products p
    JOIN farms f ON p.farm_id = f.id
    WHERE p.is_available = 1 AND f.active = 1
  `;
  const params = [];

  if (farm_id) {
    sql += " AND p.farm_id = ?";
    params.push(farm_id);
  }
  if (category) {
    sql += " AND p.category = ?";
    params.push(category);
  }

  sql += " ORDER BY f.name, p.category, p.name";

  const products = db.prepare(sql).all(...params);
  res.json(products);
});

// GET /api/products/categories - List all categories
router.get("/categories", (req, res) => {
  const db = getDb();
  const categories = db
    .prepare(
      "SELECT DISTINCT category FROM products WHERE is_available = 1 ORDER BY category"
    )
    .all();
  res.json(categories.map((c) => c.category));
});

// GET /api/products/:id
router.get("/:id", (req, res) => {
  const db = getDb();
  const product = db
    .prepare(
      `
    SELECT p.*, f.name as farm_name, f.county, f.pickup_info
    FROM products p
    JOIN farms f ON p.farm_id = f.id
    WHERE p.id = ?
  `
    )
    .get(req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

module.exports = router;
