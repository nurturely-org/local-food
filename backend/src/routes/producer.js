const express = require("express");
const { getDb } = require("../database");

const router = express.Router();

function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// POST /api/producer/products - Add a new product
router.post("/products", (req, res) => {
  const db = getDb();
  const { farm_id, name, description, price, unit, category, available_quantity } = req.body;

  if (!farm_id || !name || price === undefined) {
    return res.status(400).json({ error: "farm_id, name, and price are required" });
  }

  const farm = db.prepare("SELECT * FROM farms WHERE id = ? AND active = 1").get(farm_id);
  if (!farm) {
    return res.status(404).json({ error: "Farm not found" });
  }

  const id = generateId();
  db.prepare(`
    INSERT INTO products (id, farm_id, name, description, price, unit, category, available_quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, farm_id, name, description || null, price, unit || "each", category || null, available_quantity || 0);

  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  res.status(201).json(product);
});

// GET /api/producer/:farmId/dashboard - Get full dashboard data for a farm
router.get("/:farmId/dashboard", (req, res) => {
  const db = getDb();
  const { farmId } = req.params;

  const farm = db.prepare("SELECT * FROM farms WHERE id = ? AND active = 1").get(farmId);
  if (!farm) {
    return res.status(404).json({ error: "Farm not found" });
  }

  // Get all products for this farm
  const products = db
    .prepare("SELECT * FROM products WHERE farm_id = ? ORDER BY category, name")
    .all(farmId);

  // Get reservations that contain this farm's products
  const reservations = db
    .prepare(`
      SELECT DISTINCT r.* FROM reservations r
      JOIN reservation_items ri ON ri.reservation_id = r.id
      JOIN products p ON ri.product_id = p.id
      WHERE p.farm_id = ?
      ORDER BY r.created_at DESC
    `)
    .all(farmId);

  // Attach items to each reservation (filtered to this farm's products)
  const reservationsWithItems = reservations.map((r) => {
    const items = db
      .prepare(`
        SELECT ri.*, p.name as product_name, p.farm_id, f.name as farm_name
        FROM reservation_items ri
        JOIN products p ON ri.product_id = p.id
        JOIN farms f ON p.farm_id = f.id
        WHERE ri.reservation_id = ? AND p.farm_id = ?
      `)
      .all(r.id, farmId);
    return { ...r, items };
  });

  // Stats
  const stats = {
    total_products: products.length,
    available_products: products.filter((p) => p.is_available).length,
    total_reservations: reservations.length,
    pending_reservations: reservations.filter((r) => r.status === "pending").length,
  };

  res.json({ farm, products, reservations: reservationsWithItems, stats });
});

module.exports = router;