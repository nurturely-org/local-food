const express = require("express");
const { getDb } = require("../database");

const router = express.Router();

function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// POST /api/reservations - Create a new reservation
router.post("/", (req, res) => {
  const db = getDb();
  const { shopper_name, shopper_email, shopper_phone, pickup_date, pickup_location, notes, items } = req.body;

  if (!shopper_name || !shopper_email || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const reservationId = generateId();
  let totalAmount = 0;

  const itemRecords = [];
  for (const item of items) {
    const product = db.prepare("SELECT * FROM products WHERE id = ? AND is_available = 1").get(item.product_id);
    if (!product) {
      return res.status(400).json({ error: `Product not found: ${item.product_id}` });
    }
    const quantity = item.quantity || 1;
    const unitPrice = product.price;
    totalAmount += quantity * unitPrice;
    itemRecords.push({
      id: generateId(),
      reservation_id: reservationId,
      product_id: item.product_id,
      quantity,
      unit_price: unitPrice,
    });
  }

  const insertReservation = db.prepare(`
    INSERT INTO reservations (id, shopper_name, shopper_email, shopper_phone, pickup_date, pickup_location, notes, total_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertItem = db.prepare(`
    INSERT INTO reservation_items (id, reservation_id, product_id, quantity, unit_price)
    VALUES (?, ?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    insertReservation.run(
      reservationId,
      shopper_name,
      shopper_email,
      shopper_phone || null,
      pickup_date || null,
      pickup_location || null,
      notes || null,
      totalAmount
    );

    for (const item of itemRecords) {
      insertItem.run(item.id, item.reservation_id, item.product_id, item.quantity, item.unit_price);
    }
  });

  transaction();

  const reservation = db.prepare("SELECT * FROM reservations WHERE id = ?").get(reservationId);
  const reservationItems = db
    .prepare(
      `SELECT ri.*, p.name as product_name, p.farm_id, f.name as farm_name
       FROM reservation_items ri
       JOIN products p ON ri.product_id = p.id
       JOIN farms f ON p.farm_id = f.id
       WHERE ri.reservation_id = ?`
    )
    .all(reservationId);

  res.status(201).json({ ...reservation, items: reservationItems });
});

// PUT /api/reservations/:id/status - Update reservation status
router.put("/:id/status", (req, res) => {
  const db = getDb();
  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "ready", "picked_up", "cancelled"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
  }

  const reservation = db.prepare("SELECT * FROM reservations WHERE id = ?").get(req.params.id);
  if (!reservation) {
    return res.status(404).json({ error: "Reservation not found" });
  }

  db.prepare("UPDATE reservations SET status = ? WHERE id = ?").run(status, req.params.id);
  const updated = db.prepare("SELECT * FROM reservations WHERE id = ?").get(req.params.id);

  res.json(updated);
});

// GET /api/reservations/farm/:farmId - Get reservations for a specific farm
router.get("/farm/:farmId", (req, res) => {
  const db = getDb();
  const { farmId } = req.params;
  const { status } = req.query;

  let sql = `
    SELECT DISTINCT r.* FROM reservations r
    JOIN reservation_items ri ON ri.reservation_id = r.id
    JOIN products p ON ri.product_id = p.id
    WHERE p.farm_id = ?
  `;
  const params = [farmId];

  if (status) {
    sql += " AND r.status = ?";
    params.push(status);
  }

  sql += " ORDER BY r.created_at DESC";

  const reservations = db.prepare(sql).all(...params);

  // Attach items
  const result = reservations.map((r) => {
    const items = db
      .prepare(`
        SELECT ri.*, p.name as product_name, p.farm_id, f.name as farm_name
        FROM reservation_items ri
        JOIN products p ON ri.product_id = p.id
        JOIN farms f ON p.farm_id = f.id
        WHERE ri.reservation_id = ?
      `)
      .all(r.id);
    return { ...r, items };
  });

  res.json(result);
});

// GET /api/reservations/:id - Get a reservation by ID
router.get("/:id", (req, res) => {
  const db = getDb();
  const reservation = db.prepare("SELECT * FROM reservations WHERE id = ?").get(req.params.id);
  if (!reservation) {
    return res.status(404).json({ error: "Reservation not found" });
  }

  const items = db
    .prepare(
      `SELECT ri.*, p.name as product_name, p.farm_id, f.name as farm_name
       FROM reservation_items ri
       JOIN products p ON ri.product_id = p.id
       JOIN farms f ON p.farm_id = f.id
       WHERE ri.reservation_id = ?`
    )
    .all(req.params.id);

  res.json({ ...reservation, items });
});

// GET /api/reservations - List reservations (by email)
router.get("/", (req, res) => {
  const db = getDb();
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email query parameter required" });
  }

  const reservations = db
    .prepare("SELECT * FROM reservations WHERE shopper_email = ? ORDER BY created_at DESC")
    .all(email);

  const result = reservations.map((r) => {
    const items = db
      .prepare(
        `SELECT ri.*, p.name as product_name, p.farm_id, f.name as farm_name
         FROM reservation_items ri
         JOIN products p ON ri.product_id = p.id
         JOIN farms f ON p.farm_id = f.id
         WHERE ri.reservation_id = ?`
      )
      .all(r.id);
    return { ...r, items };
  });

  res.json(result);
});

module.exports = router;