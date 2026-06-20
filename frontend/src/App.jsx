import { useState, useEffect } from "react";
import "./App.css";

const API_BASE = "/api";

// ---------- Helpers ----------
function formatPrice(n) {
  return `$${Number(n).toFixed(2)}`;
}

function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function todayString() {
  return new Date().toISOString().split("T")[0];
}

function nextSaturday() {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7));
  return d.toISOString().split("T")[0];
}

// ---------- API ----------
async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || `API error: ${res.status}`); }
  return res.json();
}

async function apiPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || `API error: ${res.status}`); }
  return res.json();
}

async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, { method: "DELETE" });
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || `API error: ${res.status}`); }
  return res.json();
}

// ---------- Existing Components (Hero, FarmCard, ProductCard, CartDrawer, FarmDetail, Confirmation) ----------

function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-lime-600 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-yellow-300 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-emerald-300 blur-3xl" />
      </div>
      <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-emerald-500/30 backdrop-blur-sm text-emerald-100 px-3 py-1 rounded-full text-sm font-medium mb-4">Presque Isle County, Michigan</span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">Fresh from the farm,<br /><span className="text-yellow-300">straight to your table</span></h1>
            <p className="text-emerald-100 text-lg max-w-xl mb-8">Browse local farms, reserve your favorites, and pick up fresh food from backyard gardeners, homesteaders, and hobby farms in your county.</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm"><span>🥬</span> Vegetables</span>
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm"><span>🥚</span> Eggs & Dairy</span>
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm"><span>🍯</span> Honey</span>
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm"><span>🫐</span> Berries</span>
            </div>
          </div>
          <div className="flex-shrink-0 text-8xl sm:text-9xl opacity-80">🌽</div>
        </div>
      </div>
    </div>
  );
}

function FarmCard({ farm, onSelect }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group" onClick={() => onSelect(farm)}>
      <div className="h-32 bg-gradient-to-br from-emerald-100 to-lime-100 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30 group-hover:scale-110 transition-transform">🌿</div>
        <div className="absolute bottom-3 left-3"><span className="bg-white/90 backdrop-blur-sm text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">{farm.county} County</span></div>
        {farm.subscription_tier === "premium" && <div className="absolute top-3 right-3"><span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">Featured</span></div>}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-stone-800 group-hover:text-emerald-700 transition-colors">{farm.name}</h3>
        <p className="text-stone-500 text-sm mt-1 line-clamp-2">{farm.description}</p>
        <div className="flex items-center gap-2 mt-3 text-sm text-stone-500"><span>📍</span><span>{farm.city}, {farm.state}</span></div>
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-400">{farm.phone}</span>
          <span className="text-emerald-600 text-sm font-medium group-hover:translate-x-1 transition-transform">View products &rarr;</span>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd, added }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-100 hover:border-emerald-200 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-stone-800 truncate">{product.name}</h4>
          <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full capitalize shrink-0">{product.unit}</span>
        </div>
        <p className="text-sm text-stone-500 mt-0.5 line-clamp-1">{product.description}</p>
        <p className="text-xs text-stone-400 mt-1">{product.farm_name} &middot; {product.county} County</p>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-3">
        <span className="text-lg font-bold text-emerald-700">{formatPrice(product.price)}</span>
        <button onClick={(e) => { e.stopPropagation(); onAdd(product); }}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${added ? "bg-emerald-100 text-emerald-700" : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"}`} aria-label="Add to cart">{added ? "✓" : "+"}</button>
      </div>
    </div>
  );
}

function CartDrawer({ items, onUpdateQty, onRemove, onSubmit }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", pickupDate: nextSaturday(), pickupLocation: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!form.name || !form.email) { setError("Name and email are required."); return; }
    setSubmitting(true);
    try {
      const reservation = await apiPost("/reservations", {
        shopper_name: form.name, shopper_email: form.email, shopper_phone: form.phone,
        pickup_date: form.pickupDate || null, pickup_location: form.pickupLocation || null,
        notes: form.notes || null, items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })),
      });
      onSubmit(reservation);
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  };

  if (items.length === 0) {
    return (<div className="text-center py-12 text-stone-400"><div className="text-5xl mb-3">🛒</div><p className="font-medium">Your cart is empty</p><p className="text-sm mt-1">Browse farms and add products to get started</p></div>);
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">{items.map((item) => (
        <div key={item.cartId} className="flex items-center justify-between bg-white rounded-xl border border-stone-100 p-3">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-stone-800 text-sm truncate">{item.name}</p>
            <p className="text-xs text-stone-500">{item.farm_name}</p>
            <p className="text-sm font-semibold text-emerald-700 mt-1">{formatPrice(item.price * item.quantity)}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <button onClick={() => onUpdateQty(item.cartId, -1)} className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center text-sm">&minus;</button>
            <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
            <button onClick={() => onUpdateQty(item.cartId, 1)} className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center text-sm">+</button>
            <button onClick={() => onRemove(item.cartId)} className="w-7 h-7 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-sm ml-1">&times;</button>
          </div>
        </div>
      ))}</div>
      <div className="bg-emerald-50 rounded-xl p-4"><div className="flex justify-between items-center"><span className="font-semibold text-stone-800">Total</span><span className="text-xl font-bold text-emerald-700">{formatPrice(total)}</span></div></div>
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 active:scale-[0.98] transition-all">Continue to Reservation</button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input required type="text" placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" />
          <input required type="email" placeholder="Email Address *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" />
          <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" />
          <input type="date" placeholder="Pickup Date" value={form.pickupDate} onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" />
          <input type="text" placeholder="Pickup Location" value={form.pickupLocation} onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none" />
          <textarea placeholder="Notes or special instructions" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none resize-none" rows={2} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50">
            {submitting ? "Placing Reservation..." : "Place Reservation"}
          </button>
        </form>
      )}
    </div>
  );
}

function FarmDetail({ farmId, onBack, onAddToCart, cartItemIds }) {
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); apiFetch(`/farms/${farmId}`).then(setFarm).catch(console.error).finally(() => setLoading(false)); }, [farmId]);
  if (loading) return (<div className="flex justify-center py-20"><div className="animate-spin text-4xl">🌱</div></div>);
  if (!farm) return <div className="text-center py-20 text-stone-500">Farm not found</div>;
  return (
    <div>
      <button onClick={onBack} className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm mb-6">&larr; Back to all farms</button>
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-6 sm:p-8 text-white mb-8">
        <div className="flex items-start justify-between">
          <div>{farm.subscription_tier === "premium" && <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-0.5 rounded-full mb-2">Featured Producer</span>}
            <h2 className="text-3xl font-bold">{farm.name}</h2>
            <p className="text-emerald-100 mt-1">📍 {farm.city}, {farm.state} &middot; {farm.county} County</p>
          </div>
          <div className="text-5xl opacity-50">🌾</div>
        </div>
        <p className="mt-4 text-emerald-50 text-sm max-w-2xl">{farm.description}</p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-emerald-100">{farm.phone && <span>📞 {farm.phone}</span>}{farm.email && <span>✉️ {farm.email}</span>}</div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-2"><span className="text-lg shrink-0">📋</span><div><p className="font-medium text-amber-800 text-sm">Pickup Information</p><p className="text-amber-700 text-sm">{farm.pickup_info}</p></div></div>
      </div>
      <h3 className="font-semibold text-lg text-stone-800 mb-4">Available Products ({farm.products?.length || 0})</h3>
      <div className="space-y-2">
        {farm.products?.map((product) => <ProductCard key={product.id} product={product} onAdd={onAddToCart} added={cartItemIds.has(product.id)} />)}
        {(!farm.products || farm.products.length === 0) && <p className="text-stone-400 text-center py-8">No products currently available. Check back soon!</p>}
      </div>
    </div>
  );
}

function Confirmation({ reservation, onNewOrder }) {
  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-stone-800 mb-2">Reservation Confirmed!</h2>
      <p className="text-stone-500 mb-6">Your reservation has been placed. Here's a summary:</p>
      <div className="bg-white rounded-2xl border border-stone-200 p-6 text-left space-y-3 mb-6">
        <div className="flex justify-between text-sm"><span className="text-stone-500">Confirmation</span><span className="font-mono text-xs text-stone-400">#{reservation.id?.slice(0, 8)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-stone-500">Name</span><span className="font-medium">{reservation.shopper_name}</span></div>
        <div className="flex justify-between text-sm"><span className="text-stone-500">Email</span><span>{reservation.shopper_email}</span></div>
        {reservation.pickup_date && <div className="flex justify-between text-sm"><span className="text-stone-500">Pickup Date</span><span className="font-medium">{reservation.pickup_date}</span></div>}
        <div className="border-t border-stone-100 pt-3 mt-3">
          <p className="text-sm font-medium text-stone-700 mb-2">Items</p>
          {reservation.items?.map((item) => <div key={item.id} className="flex justify-between text-sm text-stone-600"><span>{item.product_name} &times; {item.quantity}</span><span>{formatPrice(item.unit_price * item.quantity)}</span></div>)}
          <div className="flex justify-between font-bold text-stone-800 mt-2 pt-2 border-t border-stone-100"><span>Total</span><span className="text-emerald-700">{formatPrice(reservation.total_amount)}</span></div>
        </div>
      </div>
      <button onClick={onNewOrder} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-all">Start New Order</button>
    </div>
  );
}

// ---------- SCREEN 4: Producer Dashboard ----------

function ProducerDashboard() {
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", price: "", unit: "", category: "", available_quantity: "" });
  const [newProduct, setNewProduct] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { apiFetch("/farms").then(setFarms).catch(console.error); }, []);

  const loadDashboard = (farmId) => {
    setSelectedFarmId(farmId);
    setDashboard(null);
    apiFetch(`/producer/${farmId}/dashboard`).then(setDashboard).catch(console.error);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setEditForm({ name: product.name, description: product.description || "", price: String(product.price), unit: product.unit, category: product.category || "", available_quantity: String(product.available_quantity || 0) });
    setNewProduct(false);
  };

  const handleSaveProduct = async () => {
    setSaving(true); setMessage("");
    try {
      await apiPut(`/products/${editingProduct}`, {
        name: editForm.name, description: editForm.description,
        price: parseFloat(editForm.price), unit: editForm.unit,
        category: editForm.category, available_quantity: parseFloat(editForm.available_quantity),
      });
      setMessage("Product updated!");
      setEditingProduct(null);
      loadDashboard(selectedFarmId);
    } catch (err) { setMessage(err.message); } finally { setSaving(false); }
  };

  const handleToggleAvailability = async (product) => {
    try {
      await apiPut(`/products/${product.id}`, { is_available: !product.is_available });
      loadDashboard(selectedFarmId);
    } catch (err) { setMessage(err.message); }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Remove this product?")) return;
    try {
      await apiDelete(`/products/${productId}`);
      setMessage("Product removed.");
      loadDashboard(selectedFarmId);
    } catch (err) { setMessage(err.message); }
  };

  const handleAddProduct = async () => {
    setSaving(true); setMessage("");
    try {
      await apiPost("/producer/products", {
        farm_id: selectedFarmId, name: editForm.name, description: editForm.description,
        price: parseFloat(editForm.price), unit: editForm.unit,
        category: editForm.category, available_quantity: parseFloat(editForm.available_quantity),
      });
      setMessage("Product added!");
      setNewProduct(false);
      setEditingProduct(null);
      loadDashboard(selectedFarmId);
    } catch (err) { setMessage(err.message); } finally { setSaving(false); }
  };

  const handleUpdateStatus = async (reservationId, status) => {
    try {
      await apiPut(`/reservations/${reservationId}/status`, { status });
      loadDashboard(selectedFarmId);
    } catch (err) { setMessage(err.message); }
  };

  const statusColors = { pending: "bg-amber-100 text-amber-800", confirmed: "bg-blue-100 text-blue-800", ready: "bg-green-100 text-green-800", picked_up: "bg-stone-100 text-stone-500", cancelled: "bg-red-100 text-red-800" };

  if (!selectedFarmId) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-stone-800 mb-6">👨‍🌾 Producer Dashboard</h2>
        <p className="text-stone-500 mb-6">Select your farm to manage products, view orders, and handle pickups.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {farms.map((farm) => (
            <button key={farm.id} onClick={() => loadDashboard(farm.id)}
              className="text-left bg-white rounded-xl border border-stone-200 p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
              <h3 className="font-semibold text-lg text-stone-800 group-hover:text-emerald-700">{farm.name}</h3>
              <p className="text-sm text-stone-500 mt-1">📍 {farm.city}, {farm.state}</p>
              <p className="text-xs text-stone-400 mt-2">{farm.phone} &middot; {farm.email}</p>
              <span className="inline-block mt-3 text-emerald-600 text-sm font-medium">Access Dashboard &rarr;</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboard) return (<div className="flex justify-center py-20"><div className="animate-spin text-4xl">🌱</div></div>);

  const { farm, products, reservations, stats } = dashboard;

  return (
    <div>
      <button onClick={() => { setSelectedFarmId(null); setDashboard(null); setEditingProduct(null); setNewProduct(false); }}
        className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm mb-6">&larr; Back to farm selection</button>

      {/* Farm header */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{farm.name}</h2>
            <p className="text-emerald-100 text-sm mt-1">{farm.city}, {farm.state} &middot; {farm.phone}</p>
          </div>
          <div className="text-4xl opacity-50">🌾</div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-700">{stats.total_products}</p>
          <p className="text-xs text-stone-500 mt-1">Total Products</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-700">{stats.available_products}</p>
          <p className="text-xs text-stone-500 mt-1">Available</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{stats.total_reservations}</p>
          <p className="text-xs text-stone-500 mt-1">Total Orders</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.pending_reservations}</p>
          <p className="text-xs text-stone-500 mt-1">Pending</p>
        </div>
      </div>

      {message && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-2 mb-4 text-sm">{message}</div>}

      {/* Tabs */}
      <div className="flex border-b border-stone-200 mb-6">
        <button onClick={() => { setEditingProduct(null); setNewProduct(false); }}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${!editingProduct && !newProduct ? "border-emerald-600 text-emerald-700" : "border-transparent text-stone-500 hover:text-stone-700"}`}>
          📋 Reservations ({reservations.length})
        </button>
        <button onClick={() => { setEditingProduct(null); setNewProduct(false); }}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${editingProduct || newProduct ? "border-emerald-600 text-emerald-700" : "border-transparent text-stone-500 hover:text-stone-700"}`}>
          📦 Products ({products.length})
        </button>
      </div>

      {/* Reservations view */}
      {!editingProduct && !newProduct && (
        <div className="space-y-3">
          {reservations.length === 0 && <p className="text-stone-400 text-center py-8">No reservations yet. When shoppers place orders, they'll appear here.</p>}
          {reservations.map((res) => (
            <div key={res.id} className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-stone-800">{res.shopper_name}</p>
                  <p className="text-xs text-stone-500">{res.shopper_email}{res.shopper_phone && <> &middot; {res.shopper_phone}</>}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[res.status] || "bg-stone-100 text-stone-600"}`}>
                    {res.status?.replace("_", " ")}
                  </span>
                </div>
              </div>
              {res.pickup_date && <p className="text-xs text-stone-500 mb-2">📅 Pickup: {res.pickup_date}{res.pickup_location && <> at {res.pickup_location}</>}</p>}
              <div className="space-y-1 mb-3">
                {res.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-stone-600">
                    <span>{item.product_name} &times; {item.quantity}</span>
                    <span>{formatPrice(item.unit_price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <span className="font-semibold text-emerald-700">{formatPrice(res.total_amount)}</span>
                <div className="flex gap-2">
                  {res.status === "pending" && <button onClick={() => handleUpdateStatus(res.id, "confirmed")} className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">Confirm</button>}
                  {res.status === "confirmed" && <button onClick={() => handleUpdateStatus(res.id, "ready")} className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700">Mark Ready</button>}
                  {res.status === "ready" && <button onClick={() => handleUpdateStatus(res.id, "picked_up")} className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700">Picked Up</button>}
                  {res.status !== "picked_up" && res.status !== "cancelled" && <button onClick={() => handleUpdateStatus(res.id, "cancelled")} className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200">Cancel</button>}
                </div>
              </div>
              {res.notes && <p className="text-xs text-stone-400 mt-2 italic">Note: {res.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Products management */}
      {(editingProduct || newProduct) && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-3">
          <h3 className="font-semibold text-stone-800">{newProduct ? "Add New Product" : "Edit Product"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Product Name *" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm" />
            <input type="text" placeholder="Unit (lb, each, dozen, etc.)" value={editForm.unit} onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm" />
            <input type="number" step="0.01" placeholder="Price *" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm" />
            <input type="number" placeholder="Available Quantity" value={editForm.available_quantity} onChange={(e) => setEditForm({ ...editForm, available_quantity: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm" />
            <input type="text" placeholder="Category (vegetables, fruit, honey...)" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm sm:col-span-2" />
            <textarea placeholder="Description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm resize-none sm:col-span-2" rows={2} />
          </div>
          <div className="flex gap-2">
            <button onClick={newProduct ? handleAddProduct : handleSaveProduct} disabled={saving || !editForm.name || !editForm.price}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50">
              {saving ? "Saving..." : newProduct ? "Add Product" : "Save Changes"}
            </button>
            <button onClick={() => { setEditingProduct(null); setNewProduct(false); }}
              className="bg-stone-100 text-stone-600 px-4 py-2 rounded-lg text-sm hover:bg-stone-200">Cancel</button>
          </div>
        </div>
      )}

      {!editingProduct && !newProduct && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-stone-800">Product Inventory</h3>
            <button onClick={() => { setNewProduct(true); setEditForm({ name: "", description: "", price: "", unit: "each", category: "", available_quantity: "0" }); }}
              className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-700">+ Add Product</button>
          </div>
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-white rounded-xl border border-stone-100 p-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${p.is_available ? "bg-green-500" : "bg-red-400"}`}></span>
                  <p className="font-medium text-stone-800 text-sm">{p.name}</p>
                  <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{p.unit}</span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">{p.category} &middot; Qty: {p.available_quantity}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="font-bold text-emerald-700 text-sm">{formatPrice(p.price)}</span>
                <button onClick={() => handleEditProduct(p)} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded hover:bg-stone-200">Edit</button>
                <button onClick={() => handleToggleAvailability(p)} className={`text-xs px-2 py-1 rounded ${p.is_available ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>
                  {p.is_available ? "Hide" : "Show"}
                </button>
                <button onClick={() => handleDeleteProduct(p.id)} className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded hover:bg-red-100">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- SCREEN 5: Pickup Management ----------

function PickupManagement() {
  const [tab, setTab] = useState("instructions");
  const [pickupFarms, setPickupFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [pickupList, setPickupList] = useState(null);
  const [upcoming, setUpcoming] = useState(null);
  const [filterDate, setFilterDate] = useState(nextSaturday());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch("/pickup/instructions").then((d) => setPickupFarms(d.farms)).catch(console.error);
    loadUpcoming();
  }, []);

  const loadUpcoming = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/pickup/upcoming");
      setUpcoming(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const loadFarmPickup = async (farmId) => {
    setSelectedFarmId(farmId);
    setLoading(true);
    try {
      const data = await apiFetch(`/pickup/farm/${farmId}?date=${filterDate}`);
      setPickupList(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handlePrint = () => window.print();

  if (loading) return (<div className="flex justify-center py-20"><div className="animate-spin text-4xl">🌱</div></div>);

  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-800 mb-6">📋 Pickup Management</h2>

      <div className="flex border-b border-stone-200 mb-6">
        <button onClick={() => setTab("instructions")}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === "instructions" ? "border-emerald-600 text-emerald-700" : "border-transparent text-stone-500 hover:text-stone-700"}`}>
          📍 Pickup Instructions
        </button>
        <button onClick={() => { setTab("list"); setSelectedFarmId(null); setPickupList(null); }}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === "list" ? "border-emerald-600 text-emerald-700" : "border-transparent text-stone-500 hover:text-stone-700"}`}>
          📦 Pickup Lists
        </button>
        <button onClick={() => { setTab("upcoming"); loadUpcoming(); }}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === "upcoming" ? "border-emerald-600 text-emerald-700" : "border-transparent text-stone-500 hover:text-stone-700"}`}>
          📅 All Upcoming
        </button>
      </div>

      {/* Tab 1: Pickup Instructions */}
      {tab === "instructions" && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-lg shrink-0">ℹ️</span>
              <div>
                <p className="font-medium text-emerald-800 text-sm">Saturday Pickup Hub</p>
                <p className="text-emerald-700 text-sm mt-1">The Presque Isle County Food Co-op operates a centralized Saturday pickup at the <strong>Rogers City Farmers Market Pavilion</strong> (245 N 3rd St, Rogers City, MI 49779) from <strong>9:00 AM to 12:00 PM</strong>. Shoppers with orders from multiple farms can pick up everything at one location.</p>
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-stone-800">Individual Farm Pickup Locations</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {pickupFarms.map((farm) => (
              <div key={farm.id} className="bg-white rounded-xl border border-stone-200 p-4">
                <h4 className="font-semibold text-stone-800">{farm.name}</h4>
                <p className="text-xs text-stone-500 mt-1">📍 {farm.address}, {farm.city}, MI</p>
                {farm.phone && <p className="text-xs text-stone-500">📞 {farm.phone}</p>}
                <div className="mt-2 pt-2 border-t border-stone-100">
                  <p className="text-sm text-stone-700">{farm.pickup_info}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Pickup Lists by Farm */}
      {tab === "list" && !selectedFarmId && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm font-medium text-stone-700">Pickup Date:</label>
            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-stone-200 text-sm focus:border-emerald-400 outline-none" />
          </div>
          <p className="text-stone-500 mb-4">Select a farm to view its pickup list for the selected date:</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pickupFarms.map((farm) => (
              <button key={farm.id} onClick={() => loadFarmPickup(farm.id)}
                className="text-left bg-white rounded-xl border border-stone-200 p-4 hover:border-emerald-300 hover:shadow-sm transition-all">
                <h3 className="font-semibold text-stone-800">{farm.name}</h3>
                <p className="text-xs text-stone-500 mt-1">{farm.city}</p>
                <span className="inline-block mt-2 text-emerald-600 text-sm font-medium">View Pickup List &rarr;</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "list" && selectedFarmId && pickupList && (
        <div>
          <button onClick={() => { setSelectedFarmId(null); setPickupList(null); }}
            className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm mb-4">&larr; Back to farm selection</button>

          <div className="bg-gradient-to-r from-amber-600 to-amber-500 rounded-2xl p-5 text-white mb-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{pickupList.farm.name}</h3>
                <p className="text-amber-100 text-sm">Pickup Date: {pickupList.pickup_date || "All dates"}</p>
              </div>
              <button onClick={handlePrint} className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm hover:bg-white/30">🖨️ Print</button>
            </div>
            <div className="flex gap-4 mt-3 text-sm text-amber-100">
              <span>{pickupList.total_shoppers} shopper{pickupList.total_shoppers !== 1 ? "s" : ""}</span>
              <span>{pickupList.total_items} total items</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
            <p className="text-sm text-amber-800"><strong>📍 Pickup:</strong> {pickupList.farm.pickup_info}</p>
          </div>

          <div className="space-y-3">
            {pickupList.reservations.map((res) => (
              <div key={res.id} className="bg-white rounded-xl border border-stone-200 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-stone-800">{res.shopper_name}</p>
                    <p className="text-xs text-stone-500">{res.shopper_email}{res.shopper_phone && <> &middot; {res.shopper_phone}</>}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${res.status === "ready" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {res.status?.replace("_", " ")}
                  </span>
                </div>
                <table className="w-full text-sm">
                  <thead><tr className="text-stone-400 text-xs"><th className="text-left pb-1">Item</th><th className="text-right pb-1">Qty</th><th className="text-right pb-1">Price</th></tr></thead>
                  <tbody>
                    {res.items.map((item) => (
                      <tr key={item.id} className="border-t border-stone-50">
                        <td className="py-1 text-stone-700">{item.product_name}</td>
                        <td className="py-1 text-right text-stone-600">{item.quantity} {item.unit}</td>
                        <td className="py-1 text-right text-stone-600">{formatPrice(item.unit_price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="border-t border-stone-100 mt-2 pt-2 flex justify-between font-semibold text-sm">
                  <span>Total</span>
                  <span className="text-emerald-700">{formatPrice(res.total_amount)}</span>
                </div>
              </div>
            ))}
            {pickupList.reservations.length === 0 && <p className="text-stone-400 text-center py-8">No pickups scheduled for this date.</p>}
          </div>
        </div>
      )}

      {/* Tab 3: All Upcoming Pickups */}
      {tab === "upcoming" && (
        <div>
          {upcoming && upcoming.length === 0 && <p className="text-stone-400 text-center py-8">No upcoming pickups.</p>}
          <div className="space-y-4">
            {upcoming?.map((res) => (
              <div key={res.id} className="bg-white rounded-xl border border-stone-200 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-stone-800">{res.shopper_name}</p>
                    <p className="text-xs text-stone-500">{res.shopper_email}</p>
                  </div>
                  <div className="text-right text-xs text-stone-500">
                    <p>📅 {res.pickup_date || "No date set"}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full capitalize font-medium ${statusColors[res.status] || "bg-stone-100"}`}>{res.status}</span>
                  </div>
                </div>
                <div className="space-y-2 mt-2">
                  {res.itemsByFarm?.map((farmGroup) => (
                    <div key={farmGroup.farm_id} className="bg-stone-50 rounded-lg p-2">
                      <p className="text-xs font-semibold text-stone-700 mb-1">{farmGroup.farm_name}</p>
                      <div className="space-y-0.5">
                        {farmGroup.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-xs text-stone-600">
                            <span>{item.product_name} &times; {item.quantity}</span>
                            <span>{formatPrice(item.unit_price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const statusColors = { pending: "bg-amber-100 text-amber-800", confirmed: "bg-blue-100 text-blue-800", ready: "bg-green-100 text-green-800", picked_up: "bg-stone-100 text-stone-500", cancelled: "bg-red-100 text-red-800" };

// ---------- Main App ----------

export default function App() {
  const [page, setPage] = useState("browse");
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [reservation, setReservation] = useState(null);

  useEffect(() => { apiFetch("/farms").then(setFarms).catch(console.error); }, []);

  const cartItemIds = new Set(cartItems.map((i) => i.id));
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleSelectFarm = (farm) => { setSelectedFarmId(farm.id); setPage("farm"); setShowCart(false); };

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, cartId: generateId(), quantity: 1, price: product.price, farm_name: product.farm_name || "Unknown Farm" }];
    });
  };

  const handleUpdateQty = (cartId, delta) => {
    setCartItems((prev) => prev.map((item) => item.cartId === cartId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter((item) => item.quantity > 0));
  };

  const handleRemoveItem = (cartId) => { setCartItems((prev) => prev.filter((i) => i.cartId !== cartId)); };

  const handleSubmitReservation = (result) => { setReservation(result); setCartItems([]); setShowCart(false); setPage("confirmation"); };

  const handleNewOrder = () => { setReservation(null); setPage("browse"); };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => { setPage("browse"); setShowCart(false); }}
            className="flex items-center gap-2 font-bold text-lg text-emerald-700">
            <span>🌽</span>
            <span className="hidden sm:inline">Local Food Co-op</span>
          </button>
          <div className="flex items-center gap-4">
            <button onClick={() => setPage("producer")}
              className={`text-sm font-medium transition-colors ${page === "producer" ? "text-emerald-600" : "text-stone-500 hover:text-stone-700"}`}>
              👨‍🌾 Producer
            </button>
            <button onClick={() => setPage("pickup")}
              className={`text-sm font-medium transition-colors ${page === "pickup" ? "text-emerald-600" : "text-stone-500 hover:text-stone-700"}`}>
              📋 Pickup
            </button>
            {reservation && (
              <button onClick={() => setPage("confirmation")}
                className={`text-sm font-medium transition-colors ${page === "confirmation" ? "text-emerald-600" : "text-stone-500 hover:text-stone-700"}`}>
                My Order
              </button>
            )}
            <button onClick={() => { setShowCart(!showCart); setPage("browse"); }}
              className="relative p-2 rounded-lg hover:bg-stone-100 transition-colors">
              <span className="text-xl">🛒</span>
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount > 9 ? "9+" : cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Cart sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowCart(false)} />
          <div className="relative ml-auto w-full max-w-md bg-stone-50 h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between z-10">
              <h2 className="font-semibold text-stone-800">Your Cart</h2>
              <button onClick={() => setShowCart(false)} className="text-stone-400 hover:text-stone-600 text-xl">&times;</button>
            </div>
            <div className="p-4">
              <CartDrawer items={cartItems} onUpdateQty={handleUpdateQty} onRemove={handleRemoveItem} onSubmit={handleSubmitReservation} />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {page === "browse" && (
          <>
            <Hero />
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-stone-800">Farms & Producers</h2>
                <span className="text-sm text-stone-400">{farms.length} in Presque Isle County</span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {farms.map((farm) => <FarmCard key={farm.id} farm={farm} onSelect={handleSelectFarm} />)}
              </div>
              {farms.length === 0 && <div className="text-center py-20 text-stone-400"><div className="text-5xl mb-4">🌱</div><p>Loading farms...</p></div>}
            </div>
          </>
        )}

        {page === "farm" && (
          <FarmDetail farmId={selectedFarmId} onBack={() => { setPage("browse"); setSelectedFarmId(null); }}
            onAddToCart={handleAddToCart} cartItemIds={cartItemIds} />
        )}

        {page === "confirmation" && reservation && <Confirmation reservation={reservation} onNewOrder={handleNewOrder} />}

        {page === "producer" && <ProducerDashboard />}

        {page === "pickup" && <PickupManagement />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-stone-400">
          <p className="font-medium text-stone-500 mb-1">🌽 Presque Isle Local Food Co-op</p>
          <p>Connecting our community with fresh, local food. Supporting Presque Isle County farmers.</p>
        </div>
      </footer>
    </div>
  );
}