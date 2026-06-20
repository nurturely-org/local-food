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

// PUT /api/products/:id - Update a product
router.put("/:id", (req, res) => {
  const db = getDb();
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const { name, description, price, unit, category, available_quantity, is_available } = req.body;

  db.prepare(`
    UPDATE products SET
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      price = COALESCE(?, price),
      unit = COALESCE(?, unit),
      category = COALESCE(?, category),
      available_quantity = COALESCE(?, available_quantity),
      is_available = COALESCE(?, is_available)
    WHERE id = ?
  `).run(
    name || null,
    description !== undefined ? description : null,
    price !== undefined ? price : null,
    unit || null,
    category !== undefined ? category : null,
    available_quantity !== undefined ? available_quantity : null,
    is_available !== undefined ? (is_available ? 1 : 0) : null,
    req.params.id
  );

  const updated = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  res.json(updated);
});

// DELETE /api/products/:id - Soft-delete (mark unavailable) a product
router.delete("/:id", (req, res) => {
  const db = getDb();
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  db.prepare("UPDATE products SET is_available = 0 WHERE id = ?").run(req.params.id);
  res.json({ success: true, message: "Product removed" });
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