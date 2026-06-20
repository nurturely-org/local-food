const express = require("express");
const { getDb } = require("../database");

const router = express.Router();

// GET /api/pickup/upcoming - Get all upcoming pickups grouped by farm
router.get("/upcoming", (req, res) => {
  const db = getDb();

  // Get all reservations that are not "picked_up" or "cancelled", with items
  const reservations = db
    .prepare(`
      SELECT DISTINCT r.* FROM reservations r
      JOIN reservation_items ri ON ri.reservation_id = r.id
      JOIN products p ON ri.product_id = p.id
      JOIN farms f ON p.farm_id = f.id
      WHERE r.status IN ('pending', 'confirmed', 'ready')
      ORDER BY r.pickup_date ASC, r.created_at DESC
    `)
    .all();

  // Group items by farm within each reservation
  const result = reservations.map((r) => {
    const items = db
      .prepare(`
        SELECT ri.*, p.name as product_name, p.farm_id, f.name as farm_name,
               f.pickup_info, f.city, f.phone as farm_phone
        FROM reservation_items ri
        JOIN products p ON ri.product_id = p.id
        JOIN farms f ON p.farm_id = f.id
        WHERE ri.reservation_id = ?
        ORDER BY f.name, p.name
      `)
      .all(r.id);

    // Group items by farm
    const itemsByFarm = {};
    for (const item of items) {
      if (!itemsByFarm[item.farm_id]) {
        itemsByFarm[item.farm_id] = {
          farm_id: item.farm_id,
          farm_name: item.farm_name,
          pickup_info: item.pickup_info,
          city: item.city,
          farm_phone: item.farm_phone,
          items: [],
        };
      }
      itemsByFarm[item.farm_id].items.push(item);
    }

    return { ...r, items, itemsByFarm: Object.values(itemsByFarm) };
  });

  res.json(result);
});

// GET /api/pickup/farm/:farmId - Get pickup list for a specific farm
router.get("/farm/:farmId", (req, res) => {
  const db = getDb();
  const { farmId } = req.params;
  const { date } = req.query;

  const farm = db.prepare("SELECT * FROM farms WHERE id = ? AND active = 1").get(farmId);
  if (!farm) {
    return res.status(404).json({ error: "Farm not found" });
  }

  let sql = `
    SELECT r.*, ri.id as item_id, ri.quantity, ri.unit_price,
           p.name as product_name, p.unit
    FROM reservations r
    JOIN reservation_items ri ON ri.reservation_id = r.id
    JOIN products p ON ri.product_id = p.id
    WHERE p.farm_id = ? AND r.status IN ('pending', 'confirmed', 'ready')
  `;
  const params = [farmId];

  if (date) {
    sql += " AND r.pickup_date = ?";
    params.push(date);
  }

  sql += " ORDER BY r.pickup_date ASC, r.shopper_name ASC";

  const rows = db.prepare(sql).all(...params);

  // Group by reservation
  const reservationsMap = {};
  for (const row of rows) {
    if (!reservationsMap[row.id]) {
      reservationsMap[row.id] = {
        id: row.id,
        shopper_name: row.shopper_name,
        shopper_email: row.shopper_email,
        shopper_phone: row.shopper_phone,
        pickup_date: row.pickup_date,
        pickup_location: row.pickup_location,
        notes: row.notes,
        status: row.status,
        total_amount: row.total_amount,
        items: [],
      };
    }
    reservationsMap[row.id].items.push({
      id: row.item_id,
      product_name: row.product_name,
      quantity: row.quantity,
      unit_price: row.unit_price,
      unit: row.unit,
    });
  }

  const reservations = Object.values(reservationsMap);

  // Summary stats
  const totalShoppers = reservations.length;
  const totalItems = reservations.reduce((sum, r) => sum + r.items.reduce((s, i) => s + i.quantity, 0), 0);

  res.json({
    farm,
    pickup_date: date || "all",
    total_shoppers: totalShoppers,
    total_items: totalItems,
    reservations,
  });
});

// GET /api/pickup/instructions - Get combined pickup instructions for all farms
router.get("/instructions", (req, res) => {
  const db = getDb();
  const farms = db
    .prepare("SELECT id, name, city, address, pickup_info, phone FROM farms WHERE active = 1 ORDER BY name")
    .all();
  res.json({ farms });
});

module.exports = router;