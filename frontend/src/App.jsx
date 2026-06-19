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
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

// ---------- Components ----------

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
            <span className="inline-block bg-emerald-500/30 backdrop-blur-sm text-emerald-100 px-3 py-1 rounded-full text-sm font-medium mb-4">
              Presque Isle County, Michigan
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
              Fresh from the farm,<br />
              <span className="text-yellow-300">straight to your table</span>
            </h1>
            <p className="text-emerald-100 text-lg max-w-xl mb-8">
              Browse local farms, reserve your favorites, and pick up fresh food
              from backyard gardeners, homesteaders, and hobby farms in your
              county.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <span>🥬</span> Vegetables
              </span>
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <span>🥚</span> Eggs & Dairy
              </span>
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <span>🍯</span> Honey
              </span>
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <span>🫐</span> Berries
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 text-8xl sm:text-9xl opacity-80">
            🌽
          </div>
        </div>
      </div>
    </div>
  );
}

function FarmCard({ farm, onSelect }) {
  const emojis = {
    vegetables: "🥬",
    "dairy-eggs": "🥚",
    honey: "🍯",
    fruit: "🫐",
    preserves: "🫙",
    crafts: "🕯️",
    "body-care": "🧴",
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
      onClick={() => onSelect(farm)}
    >
      <div className="h-32 bg-gradient-to-br from-emerald-100 to-lime-100 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30 group-hover:scale-110 transition-transform">
          🌿
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
            {farm.county} County
          </span>
        </div>
        {farm.subscription_tier === "premium" && (
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-stone-800 group-hover:text-emerald-700 transition-colors">
          {farm.name}
        </h3>
        <p className="text-stone-500 text-sm mt-1 line-clamp-2">
          {farm.description}
        </p>
        <div className="flex items-center gap-2 mt-3 text-sm text-stone-500">
          <span>📍</span>
          <span>
            {farm.city}, {farm.state}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-400">{farm.phone}</span>
          <span className="text-emerald-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
            View products &rarr;
          </span>
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
          <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full capitalize shrink-0">
            {product.unit}
          </span>
        </div>
        <p className="text-sm text-stone-500 mt-0.5 line-clamp-1">
          {product.description}
        </p>
        <p className="text-xs text-stone-400 mt-1">
          {product.farm_name} &middot; {product.county} County
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-3">
        <span className="text-lg font-bold text-emerald-700">
          {formatPrice(product.price)}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd(product);
          }}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            added
              ? "bg-emerald-100 text-emerald-700"
              : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95"
          }`}
          aria-label="Add to cart"
        >
          {added ? "✓" : "+"}
        </button>
      </div>
    </div>
  );
}

function CartDrawer({ items, onUpdateQty, onRemove, onSubmit }) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pickupDate: "",
    pickupLocation: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email) {
      setError("Name and email are required.");
      return;
    }
    setSubmitting(true);
    try {
      const reservation = await apiPost("/reservations", {
        shopper_name: form.name,
        shopper_email: form.email,
        shopper_phone: form.phone,
        pickup_date: form.pickupDate || null,
        pickup_location: form.pickupLocation || null,
        notes: form.notes || null,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      });
      onSubmit(reservation);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-stone-400">
        <div className="text-5xl mb-3">🛒</div>
        <p className="font-medium">Your cart is empty</p>
        <p className="text-sm mt-1">Browse farms and add products to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.cartId}
            className="flex items-center justify-between bg-white rounded-xl border border-stone-100 p-3"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-stone-800 text-sm truncate">
                {item.name}
              </p>
              <p className="text-xs text-stone-500">{item.farm_name}</p>
              <p className="text-sm font-semibold text-emerald-700 mt-1">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <button
                onClick={() => onUpdateQty(item.cartId, -1)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center text-sm"
              >
                &minus;
              </button>
              <span className="w-6 text-center font-medium text-sm">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQty(item.cartId, 1)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center text-sm"
              >
                +
              </button>
              <button
                onClick={() => onRemove(item.cartId)}
                className="w-7 h-7 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-sm ml-1"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-stone-800">Total</span>
          <span className="text-xl font-bold text-emerald-700">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 active:scale-[0.98] transition-all"
        >
          Continue to Reservation
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            type="text"
            placeholder="Your Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
          <input
            required
            type="email"
            placeholder="Email Address *"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
          <input
            type="date"
            placeholder="Pickup Date"
            value={form.pickupDate}
            onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
          <input
            type="text"
            placeholder="Pickup Location"
            value={form.pickupLocation}
            onChange={(e) =>
              setForm({ ...form, pickupLocation: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
          <textarea
            placeholder="Notes or special instructions"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none resize-none"
            rows={2}
          />
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
          >
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

  useEffect(() => {
    setLoading(true);
    apiFetch(`/farms/${farmId}`)
      .then(setFarm)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [farmId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin text-4xl">🌱</div>
      </div>
    );
  }
  if (!farm) {
    return <div className="text-center py-20 text-stone-500">Farm not found</div>;
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm mb-6"
      >
        &larr; Back to all farms
      </button>

      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-6 sm:p-8 text-white mb-8">
        <div className="flex items-start justify-between">
          <div>
            {farm.subscription_tier === "premium" && (
              <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-0.5 rounded-full mb-2">
                Featured Producer
              </span>
            )}
            <h2 className="text-3xl font-bold">{farm.name}</h2>
            <p className="text-emerald-100 mt-1">
              📍 {farm.city}, {farm.state} &middot; {farm.county} County
            </p>
          </div>
          <div className="text-5xl opacity-50">🌾</div>
        </div>
        <p className="mt-4 text-emerald-50 text-sm max-w-2xl">{farm.description}</p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-emerald-100">
          {farm.phone && (<span>📞 {farm.phone}</span>)}
          {farm.email && (<span>✉️ {farm.email}</span>)}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-2">
          <span className="text-lg shrink-0">📋</span>
          <div>
            <p className="font-medium text-amber-800 text-sm">Pickup Information</p>
            <p className="text-amber-700 text-sm">{farm.pickup_info}</p>
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-lg text-stone-800 mb-4">
        Available Products ({farm.products?.length || 0})
      </h3>

      <div className="space-y-2">
        {farm.products?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={onAddToCart}
            added={cartItemIds.has(product.id)}
          />
        ))}
        {(!farm.products || farm.products.length === 0) && (
          <p className="text-stone-400 text-center py-8">
            No products currently available. Check back soon!
          </p>
        )}
      </div>
    </div>
  );
}

function Confirmation({ reservation, onNewOrder }) {
  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-stone-800 mb-2">
        Reservation Confirmed!
      </h2>
      <p className="text-stone-500 mb-6">
        Your reservation has been placed. Here's a summary:
      </p>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 text-left space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">Confirmation</span>
          <span className="font-mono text-xs text-stone-400">
            #{reservation.id?.slice(0, 8)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">Name</span>
          <span className="font-medium">{reservation.shopper_name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">Email</span>
          <span>{reservation.shopper_email}</span>
        </div>
        {reservation.pickup_date && (
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Pickup Date</span>
            <span className="font-medium">{reservation.pickup_date}</span>
          </div>
        )}
        <div className="border-t border-stone-100 pt-3 mt-3">
          <p className="text-sm font-medium text-stone-700 mb-2">Items</p>
          {reservation.items?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm text-stone-600"
            >
              <span>
                {item.product_name} &times; {item.quantity}
              </span>
              <span>{formatPrice(item.unit_price * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-stone-800 mt-2 pt-2 border-t border-stone-100">
            <span>Total</span>
            <span className="text-emerald-700">
              {formatPrice(reservation.total_amount)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onNewOrder}
        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-all"
      >
        Start New Order
      </button>
    </div>
  );
}

// ---------- Main App ----------

export default function App() {
  const [page, setPage] = useState("browse");
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    apiFetch("/farms")
      .then(setFarms)
      .catch(console.error);
  }, []);

  const cartItemIds = new Set(cartItems.map((i) => i.id));
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleSelectFarm = (farm) => {
    setSelectedFarmId(farm.id);
    setPage("farm");
    setShowCart(false);
  };

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          ...product,
          cartId: generateId(),
          quantity: 1,
          price: product.price,
          farm_name: product.farm_name || "Unknown Farm",
        },
      ];
    });
  };

  const handleUpdateQty = (cartId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (cartId) => {
    setCartItems((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const handleSubmitReservation = (result) => {
    setReservation(result);
    setCartItems([]);
    setShowCart(false);
    setPage("confirmation");
  };

  const handleNewOrder = () => {
    setReservation(null);
    setPage("browse");
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => {
              setPage("browse");
              setShowCart(false);
            }}
            className="flex items-center gap-2 font-bold text-lg text-emerald-700"
          >
            <span>🌽</span>
            <span className="hidden sm:inline">Local Food Co-op</span>
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPage("browse")}
              className={`text-sm font-medium transition-colors ${
                page === "browse" || page === "farm"
                  ? "text-emerald-600"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Farms
            </button>
            {reservation && (
              <button
                onClick={() => setPage("confirmation")}
                className={`text-sm font-medium transition-colors ${
                  page === "confirmation"
                    ? "text-emerald-600"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                My Order
              </button>
            )}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Cart sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowCart(false)}
          />
          <div className="relative ml-auto w-full max-w-md bg-stone-50 h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between z-10">
              <h2 className="font-semibold text-stone-800">Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-stone-400 hover:text-stone-600 text-xl"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <CartDrawer
                items={cartItems}
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemoveItem}
                onSubmit={handleSubmitReservation}
              />
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
                <h2 className="text-2xl font-bold text-stone-800">
                  Farms & Producers
                </h2>
                <span className="text-sm text-stone-400">
                  {farms.length} in Presque Isle County
                </span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {farms.map((farm) => (
                  <FarmCard
                    key={farm.id}
                    farm={farm}
                    onSelect={handleSelectFarm}
                  />
                ))}
              </div>
              {farms.length === 0 && (
                <div className="text-center py-20 text-stone-400">
                  <div className="text-5xl mb-4">🌱</div>
                  <p>Loading farms...</p>
                </div>
              )}
            </div>
          </>
        )}

        {page === "farm" && (
          <FarmDetail
            farmId={selectedFarmId}
            onBack={() => {
              setPage("browse");
              setSelectedFarmId(null);
            }}
            onAddToCart={handleAddToCart}
            cartItemIds={cartItemIds}
          />
        )}

        {page === "confirmation" && reservation && (
          <Confirmation
            reservation={reservation}
            onNewOrder={handleNewOrder}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-stone-400">
          <p className="font-medium text-stone-500 mb-1">
            🌽 Presque Isle Local Food Co-op
          </p>
          <p>
            Connecting our community with fresh, local food. Supporting Presque
            Isle County farmers.
          </p>
        </div>
      </footer>
    </div>
  );
}
