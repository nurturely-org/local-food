import { useState, useEffect } from "react";
import "./App.css";

// Import custom high-fidelity visual assets
import bonzBeachCover from "./assets/bonz-beach-farms.png";
import johnsonHomesteadCover from "./assets/johnson-family-homestead.png";
import northWoodsCover from "./assets/north-woods-apiary.png";
import posenPotatoCover from "./assets/posen-potato.png";
import lakeEsauCover from "./assets/lake-esau.png";

import honeyJarImg from "./assets/honey-jars.png";
import freshEggsImg from "./assets/fresh-eggs.png";
import vegBasketImg from "./assets/vegetable-basket.png";

const API_BASE = "/api";

const farmCovers = {
  "Bonz Beach Farms": bonzBeachCover,
  "Johnson Family Homestead": johnsonHomesteadCover,
  "North Woods Apiary": northWoodsCover,
  "Posen Potato Patch": posenPotatoCover,
  "Lake Esau Berry Farm": lakeEsauCover,
};

const getProductImage = (productName) => {
  const name = productName.toLowerCase();
  if (name.includes("honey")) return honeyJarImg;
  if (name.includes("egg")) return freshEggsImg;
  return vegBasketImg;
};

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

function nextSaturday() {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7));
  return d.toISOString().split("T")[0];
}

// ---------- API Helpers ----------
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

// ---------- Visual SVG Icons ----------
const MapPinIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 011.94.384l-.5 2.5a1 1 0 01-1.395.738l-1.311-.531a15.981 15.981 0 007.696 7.696l.531-1.311a1 1 0 01.738-1.395l2.5-.5a1 1 0 01.384 1.94V19a2 2 0 01-2 2h-3.28a1 1 0 01-1.94-.384l.5-2.5a1 1 0 011.395-.738l1.311.531a15.981 15.981 0 00-7.696-7.696l-.531 1.311a1 1 0 01-.738 1.395l-2.5.5A1 1 0 013 19V5z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const statusColors = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  picked_up: "bg-stone-100 text-stone-500",
  cancelled: "bg-red-100 text-red-800",
};

// ---------- Hero Component ----------
function Hero({ activeCounty, producerCount }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 text-white shadow-xl shadow-stone-200/40 mb-12">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_1px]" />
      <div className="relative max-w-5xl mx-auto px-6 py-16 sm:py-20 md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-emerald-50 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm border border-white/10">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              County Density Focus
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight mb-4 tracking-tight">
              Hyper-local food, <br />
              <span className="text-amber-300 font-normal italic">reserved with a single click.</span>
            </h1>
            <p className="text-emerald-100/90 text-md sm:text-lg max-w-xl mb-8 leading-relaxed font-sans font-light">
              We connect backyard gardeners, homesteaders, and hobby farms directly to neighbors. Browse fresh local food in your county, reserve, and pick up direct.
            </p>
            <div className="inline-flex items-center gap-3 bg-emerald-900/50 backdrop-blur-sm border border-emerald-500/20 px-5 py-3 rounded-2xl text-sm font-medium">
              <span className="text-2xl">🎉</span>
              <div className="text-left">
                <p className="text-white font-semibold">{producerCount} Active Producers</p>
                <p className="text-emerald-200 text-xs">now open in {activeCounty} County, MI</p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 text-9xl select-none filter drop-shadow-lg hidden md:block">🧺</div>
        </div>
      </div>
    </div>
  );
}

// ---------- FarmCard Component ----------
function FarmCard({ farm, onSelect }) {
  const coverImage = farmCovers[farm.name] || bonzBeachCover;
  return (
    <div className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 hover:shadow-stone-200/50 cursor-pointer flex flex-col h-full" onClick={() => onSelect(farm)}>
      <div className="relative h-44 bg-stone-100 overflow-hidden">
        <img src={coverImage} alt={farm.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-80" />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-forest shadow-sm backdrop-blur-sm">{farm.city}, {farm.state}</span>
        {farm.subscription_tier === "premium" && (
          <span className="absolute top-3 right-3 rounded-full bg-amber-400 text-amber-950 px-2.5 py-1 text-[10px] font-bold shadow-sm uppercase tracking-wider">Premium Seller</span>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-xl font-bold text-brand-forest group-hover:text-brand-sage transition-colors duration-200">{farm.name}</h3>
          <p className="mt-2 text-sm text-stone-600 line-clamp-2 leading-relaxed font-sans font-light">{farm.description}</p>
        </div>
        <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-400 flex items-center gap-1 font-mono"><MapPinIcon /> {farm.county} Co.</span>
          <button className="rounded-lg bg-brand-forest px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-sage shadow-sm shadow-emerald-900/10">Browse Store &rarr;</button>
        </div>
      </div>
    </div>
  );
}

// ---------- ProductCard Component ----------
function ProductCard({ product, onAdd, added }) {
  const productImage = getProductImage(product.name);
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 hover:shadow-stone-200/50 flex flex-col justify-between h-full">
      <div className="relative h-40 bg-stone-50">
        <img src={productImage} alt={product.name} className="w-full h-full object-cover" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-medium text-stone-700 shadow-sm">{product.category}</span>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-sans font-semibold text-brand-bark text-md line-clamp-1">{product.name}</h4>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md shrink-0">{formatPrice(product.price)}</span>
          </div>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-stone-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-sage" />
            Sold by <span className="text-brand-forest hover:underline cursor-pointer font-semibold">{product.farm_name}</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-400 font-mono">Per {product.unit}</span>
          <button onClick={() => onAdd(product)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
              added ? "bg-brand-sprout text-brand-sage border border-emerald-200 cursor-default" : "bg-brand-sage text-white hover:bg-brand-forest active:scale-95 shadow-sm shadow-emerald-900/10 cursor-pointer"
            }`}>
            {added ? <><span>✓</span> Added</> : "+ Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- CartDrawer ----------
function CartDrawer({ items, onUpdateQty, onRemove, onSubmit }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", pickupDate: nextSaturday(), pickupLocation: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const itemsByFarm = items.reduce((groups, item) => {
    const farmName = item.farm_name || "Unknown Farm";
    if (!groups[farmName]) groups[farmName] = [];
    groups[farmName].push(item);
    return groups;
  }, {});

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!form.name || !form.email) { setError("Please fill out both your Name and Email address."); return; }
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
    return (<div className="text-center py-16 text-stone-400"><div className="text-6xl mb-4 select-none">🛒</div><p className="font-semibold text-stone-700 text-lg">Your cart is empty</p><p className="text-sm mt-2 max-w-xs mx-auto text-stone-500 font-light">Browse our local farms and add fresh eggs, golden honey, and hand-picked veggies to get started.</p></div>);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(itemsByFarm).map(([farmName, farmItems]) => (
          <div key={farmName} className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm">
            <div className="bg-brand-sprout px-4 py-2 border-b border-stone-100 flex items-center justify-between">
              <span className="font-serif text-sm font-bold text-brand-forest">Stop: {farmName}</span>
              <span className="text-[10px] bg-white border border-emerald-100 text-brand-sage font-semibold px-2 py-0.5 rounded-full">{farmItems.length} {farmItems.length === 1 ? "item" : "items"}</span>
            </div>
            <div className="divide-y divide-stone-100">
              {farmItems.map((item) => (
                <div key={item.cartId} className="p-4 flex items-center justify-between">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-semibold text-stone-800 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-stone-400 font-mono mt-0.5">{formatPrice(item.price)} per {item.unit}</p>
                    <p className="text-sm font-bold text-brand-sage mt-1">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => onUpdateQty(item.cartId, -1)} className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 active:scale-90 flex items-center justify-center text-sm font-bold transition-all">&minus;</button>
                    <span className="w-5 text-center font-bold text-sm text-stone-800">{item.quantity}</span>
                    <button onClick={() => onUpdateQty(item.cartId, 1)} className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 active:scale-90 flex items-center justify-center text-sm font-bold transition-all">+</button>
                    <button onClick={() => onRemove(item.cartId)} className="w-7 h-7 rounded-full bg-brand-sunshine text-brand-honey hover:bg-amber-100 flex items-center justify-center text-md ml-1">&times;</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-brand-sunshine border border-amber-200 rounded-2xl p-4 flex justify-between items-center shadow-sm">
        <div><p className="text-xs text-brand-honey uppercase tracking-wider font-bold">Total Reservation Value</p><p className="text-xs text-stone-500 font-light mt-0.5">Pay cash or Venmo direct to producer at pickup</p></div>
        <span className="text-2xl font-bold text-brand-honey">{formatPrice(total)}</span>
      </div>
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="w-full bg-brand-sage text-white py-3.5 rounded-xl font-semibold hover:bg-brand-forest active:scale-[0.98] transition-all duration-200 shadow-md shadow-emerald-900/10 text-sm">Securely Reserve Items</button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 border-t border-stone-200 pt-6">
          <h3 className="font-serif text-lg font-bold text-brand-forest">Your Reservation Details</h3>
          <p className="text-xs text-stone-500 leading-normal font-light">No online payment! Submit your details here to lock in your products.</p>
          <div className="space-y-3">
            <div><label className="block text-xs font-semibold text-stone-700 mb-1">Your Name *</label><input required type="text" placeholder="E.g. Jane Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-brand-sage focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm" /></div>
            <div><label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label><input required type="email" placeholder="E.g. jane@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-brand-sage focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm" /></div>
            <div><label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number (Optional)</label><input type="tel" placeholder="E.g. (989) 555-0100" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-brand-sage focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm" /></div>
            <div><label className="block text-xs font-semibold text-stone-700 mb-1">Target Pickup Date</label><input type="date" value={form.pickupDate} onChange={(e) => setForm({ ...form, pickupDate: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-brand-sage focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm" /></div>
            <div><label className="block text-xs font-semibold text-stone-700 mb-1">Special Notes for Producers (Optional)</label><textarea placeholder="E.g. Please leave my eggs in the cooler at the barn door..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-brand-sage focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none text-sm" rows={2} /></div>
          </div>
          {error && <p className="text-brand-terracotta text-xs font-semibold">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-semibold rounded-xl py-3 text-xs transition-colors duration-200">Back</button>
            <button type="submit" disabled={submitting} className="flex-1 bg-brand-sage hover:bg-brand-forest text-white font-semibold rounded-xl py-3 text-xs transition-colors duration-200 shadow-sm disabled:opacity-50">{submitting ? "Placing..." : "Confirm Reservation"}</button>
          </div>
        </form>
      )}
    </div>
  );
}

// ---------- FarmDetail ----------
function FarmDetail({ farmId, onBack, onAddToCart, cartItemIds }) {
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); apiFetch(`/farms/${farmId}`).then(setFarm).catch(console.error).finally(() => setLoading(false)); }, [farmId]);
  if (loading) return (<div className="flex flex-col items-center justify-center py-20 gap-3"><div className="animate-spin text-4xl">🌱</div><p className="text-stone-500 text-sm font-light">Loading fresh store details...</p></div>);
  if (!farm) return (<div className="text-center py-20"><p className="text-stone-500 font-medium">Farm not found</p><button onClick={onBack} className="mt-4 text-brand-sage font-semibold hover:underline">Go back to farms</button></div>);
  const coverImage = farmCovers[farm.name] || bonzBeachCover;
  return (
    <div className="animate-fadeIn">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-brand-sage hover:text-brand-forest font-semibold text-sm mb-6 transition-colors">&larr; Back to all farms</button>
      <div className="relative overflow-hidden rounded-3xl text-white shadow-xl shadow-stone-200/40 mb-8">
        <div className="absolute inset-0 bg-stone-900/60 z-10" />
        <img src={coverImage} alt={farm.name} className="absolute inset-0 h-full w-full object-cover scale-102 filter blur-[1px]" />
        <div className="relative z-20 p-6 sm:p-10 md:p-12">
          {farm.subscription_tier === "premium" && <span className="inline-block bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">Featured Producer</span>}
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">{farm.name}</h2>
          <p className="text-emerald-100 flex items-center gap-1 mt-2 text-sm sm:text-md"><MapPinIcon /> {farm.address}, {farm.city}, {farm.state} &middot; {farm.county} County</p>
          <p className="mt-4 text-emerald-50/90 text-sm sm:text-base max-w-3xl leading-relaxed font-light font-sans">{farm.description}</p>
          <div className="flex flex-wrap gap-4 mt-6 text-xs sm:text-sm text-emerald-100 font-medium border-t border-white/10 pt-4">
            {farm.phone && <span className="flex items-center gap-1"><PhoneIcon /> {farm.phone}</span>}
            {farm.email && <span className="flex items-center gap-1"><EmailIcon /> {farm.email}</span>}
          </div>
        </div>
      </div>
      <div className="bg-brand-sunshine border border-amber-200 rounded-2xl p-5 mb-8 shadow-sm">
        <div className="flex gap-3"><span className="text-2xl shrink-0">📋</span><div><p className="font-semibold text-brand-honey text-sm sm:text-base">Direct Pickup Instructions</p><p className="text-stone-700 text-sm mt-1 leading-relaxed">{farm.pickup_info}</p></div></div>
      </div>
      <div className="flex items-center justify-between mb-6"><h3 className="font-serif text-2xl font-bold text-brand-forest">Our Products</h3><span className="text-xs bg-emerald-50 text-brand-sage border border-emerald-100 px-3 py-1 rounded-full font-semibold">{farm.products?.length || 0} Available</span></div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {farm.products?.map((product) => <ProductCard key={product.id} product={{ ...product, farm_name: farm.name, county: farm.county }} onAdd={onAddToCart} added={cartItemIds.has(product.id)} />)}
        {(!farm.products || farm.products.length === 0) && <div className="col-span-full text-center py-12 text-stone-400"><div className="text-5xl mb-2">🌱</div><p className="font-semibold text-stone-600">No products available right now</p><p className="text-sm font-light mt-1">Check back soon or call the homestead to coordinate.</p></div>}
      </div>
    </div>
  );
}

// ---------- Confirmation ----------
function Confirmation({ reservation, onNewOrder }) {
  const groupItemsByFarm = reservation.items?.reduce((groups, item) => {
    const farmName = item.farm_name || "Garden Producer";
    if (!groups[farmName]) groups[farmName] = [];
    groups[farmName].push(item);
    return groups;
  }, {}) || {};

  return (
    <div className="max-w-2xl mx-auto text-center py-12 px-4 animate-fadeIn">
      <div className="text-6xl mb-4 select-none">🎉</div>
      <h2 className="font-serif text-3xl font-bold text-brand-forest mb-2">Reservation Confirmed!</h2>
      <p className="text-stone-600 mb-8 font-light text-sm sm:text-base max-w-md mx-auto leading-relaxed">Your hyper-local food reserves have been logged. Please review your custom pickup itinerary below.</p>
      <div className="text-left space-y-6 mb-8">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 h-1 bg-brand-sage w-full" />
          <h3 className="font-serif text-lg font-bold text-brand-forest border-b border-stone-100 pb-3 mb-4">Reservation Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
            <div><p className="text-stone-400 font-medium">Reservation Code</p><p className="font-mono font-semibold text-stone-800 text-xs mt-0.5">#{reservation.id?.slice(0, 8).toUpperCase()}</p></div>
            <div><p className="text-stone-400 font-medium">Shopper Name</p><p className="font-semibold text-stone-800 mt-0.5">{reservation.shopper_name}</p></div>
            <div><p className="text-stone-400 font-medium">Contact Email</p><p className="text-stone-800 mt-0.5 font-light">{reservation.shopper_email}</p></div>
            {reservation.pickup_date && <div><p className="text-stone-400 font-medium">Desired Pickup Date</p><p className="font-semibold text-stone-800 mt-0.5 flex items-center gap-1"><CalendarIcon /> {reservation.pickup_date}</p></div>}
          </div>
        </div>
        <h3 className="font-serif text-xl font-bold text-brand-forest mt-8 flex items-center gap-2"><span>🚗</span> Your Custom Pickup Itinerary</h3>
        <div className="space-y-4">
          {Object.entries(groupItemsByFarm).map(([farmName, farmItems], index) => (
            <div key={farmName} className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-sm flex flex-col sm:flex-row gap-4 relative overflow-hidden">
              <div className="absolute left-0 top-0 w-1.5 h-full bg-brand-sage" />
              <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-brand-sprout border border-emerald-100 text-brand-forest font-serif font-bold text-sm">{index + 1}</div>
              <div className="flex-1 space-y-3">
                <div><h4 className="font-serif text-lg font-bold text-brand-forest">{farmName}</h4><p className="text-xs text-stone-500 font-light mt-0.5">Direct stop-by pickup point</p></div>
                <div className="bg-stone-50 rounded-2xl p-3 text-xs sm:text-sm text-stone-600 divide-y divide-stone-100">
                  {farmItems.map((item) => <div key={item.id} className="py-2 flex justify-between"><span>{item.product_name} &times; {item.quantity}</span><span className="font-semibold text-stone-800">{formatPrice(item.unit_price * item.quantity)}</span></div>)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-brand-sunshine border border-amber-200 p-4 rounded-2xl text-xs text-brand-honey font-light leading-relaxed">
          <p className="font-bold mb-0.5">💰 Reminder on Payment</p>
          We do not charge cards online. Please pay each grower directly at their pickup spot. Bring cash, a personal check, or have your Venmo app ready!
        </div>
      </div>
      <button onClick={onNewOrder} className="bg-brand-sage text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-brand-forest transition-all shadow-md shadow-emerald-900/10 text-sm">Start New Order</button>
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
      await apiPut(`/products/${editingProduct}`, { name: editForm.name, description: editForm.description, price: parseFloat(editForm.price), unit: editForm.unit, category: editForm.category, available_quantity: parseFloat(editForm.available_quantity) });
      setMessage("Product updated!"); setEditingProduct(null); loadDashboard(selectedFarmId);
    } catch (err) { setMessage(err.message); } finally { setSaving(false); }
  };

  const handleToggleAvailability = async (product) => {
    try { await apiPut(`/products/${product.id}`, { is_available: !product.is_available }); loadDashboard(selectedFarmId); } catch (err) { setMessage(err.message); }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Remove this product?")) return;
    try { await apiDelete(`/products/${productId}`); setMessage("Product removed."); loadDashboard(selectedFarmId); } catch (err) { setMessage(err.message); }
  };

  const handleAddProduct = async () => {
    setSaving(true); setMessage("");
    try {
      await apiPost("/producer/products", { farm_id: selectedFarmId, name: editForm.name, description: editForm.description, price: parseFloat(editForm.price), unit: editForm.unit, category: editForm.category, available_quantity: parseFloat(editForm.available_quantity) });
      setMessage("Product added!"); setNewProduct(false); setEditingProduct(null); loadDashboard(selectedFarmId);
    } catch (err) { setMessage(err.message); } finally { setSaving(false); }
  };

  const handleUpdateStatus = async (reservationId, status) => {
    try { await apiPut(`/reservations/${reservationId}/status`, { status }); loadDashboard(selectedFarmId); } catch (err) { setMessage(err.message); }
  };

  if (!selectedFarmId) {
    return (
      <div>
        <h2 className="font-serif text-2xl font-bold text-brand-forest mb-6">👨‍🌾 Producer Dashboard</h2>
        <p className="text-stone-500 mb-6">Select your farm to manage products, view orders, and handle pickups.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {farms.map((farm) => (
            <button key={farm.id} onClick={() => loadDashboard(farm.id)} className="text-left bg-white rounded-xl border border-stone-200 p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
              <h3 className="font-serif font-bold text-lg text-stone-800 group-hover:text-brand-sage">{farm.name}</h3>
              <p className="text-sm text-stone-500 mt-1">📍 {farm.city}, {farm.state}</p>
              <p className="text-xs text-stone-400 mt-2">{farm.phone}</p>
              <span className="inline-block mt-3 text-brand-sage text-sm font-medium">Access Dashboard &rarr;</span>
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
        className="inline-flex items-center gap-1 text-brand-sage hover:text-brand-forest font-medium text-sm mb-6">&larr; Back to farm selection</button>
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-start justify-between">
          <div><h2 className="text-2xl font-bold">{farm.name}</h2><p className="text-emerald-100 text-sm mt-1">{farm.city}, {farm.state} &middot; {farm.phone}</p></div>
          <div className="text-4xl opacity-50">🌾</div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center"><p className="text-2xl font-bold text-emerald-700">{stats.total_products}</p><p className="text-xs text-stone-500 mt-1">Total Products</p></div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center"><p className="text-2xl font-bold text-emerald-700">{stats.available_products}</p><p className="text-xs text-stone-500 mt-1">Available</p></div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center"><p className="text-2xl font-bold text-amber-600">{stats.total_reservations}</p><p className="text-xs text-stone-500 mt-1">Total Orders</p></div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center"><p className="text-2xl font-bold text-blue-600">{stats.pending_reservations}</p><p className="text-xs text-stone-500 mt-1">Pending</p></div>
      </div>
      {message && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-2 mb-4 text-sm">{message}</div>}
      <div className="flex border-b border-stone-200 mb-6">
        <button onClick={() => { setEditingProduct(null); setNewProduct(false); }}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${!editingProduct && !newProduct ? "border-brand-sage text-brand-forest" : "border-transparent text-stone-500 hover:text-stone-700"}`}>📋 Reservations ({reservations.length})</button>
        <button className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${editingProduct || newProduct ? "border-brand-sage text-brand-forest" : "border-transparent text-stone-500 hover:text-stone-700"}`}>📦 Products ({products.length})</button>
      </div>
      {!editingProduct && !newProduct && (
        <div className="space-y-3">
          {reservations.length === 0 && <p className="text-stone-400 text-center py-8">No reservations yet. When shoppers place orders, they'll appear here.</p>}
          {reservations.map((res) => (
            <div key={res.id} className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="flex items-start justify-between mb-2">
                <div><p className="font-semibold text-stone-800">{res.shopper_name}</p><p className="text-xs text-stone-500">{res.shopper_email}{res.shopper_phone && <> &middot; {res.shopper_phone}</>}</p></div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[res.status] || "bg-stone-100 text-stone-600"}`}>{res.status?.replace("_", " ")}</span>
              </div>
              {res.pickup_date && <p className="text-xs text-stone-500 mb-2">📅 Pickup: {res.pickup_date}{res.pickup_location && <> at {res.pickup_location}</>}</p>}
              <div className="space-y-1 mb-3">{res.items?.map((item) => (<div key={item.id} className="flex justify-between text-sm text-stone-600"><span>{item.product_name} &times; {item.quantity}</span><span>{formatPrice(item.unit_price * item.quantity)}</span></div>))}</div>
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
      {(editingProduct || newProduct) && (
        <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-3">
          <h3 className="font-semibold text-stone-800">{newProduct ? "Add New Product" : "Edit Product"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Product Name *" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm" />
            <input type="text" placeholder="Unit (lb, each, dozen...)" value={editForm.unit} onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm" />
            <input type="number" step="0.01" placeholder="Price *" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm" />
            <input type="number" placeholder="Available Quantity" value={editForm.available_quantity} onChange={(e) => setEditForm({ ...editForm, available_quantity: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm" />
            <input type="text" placeholder="Category (vegetables, fruit, honey...)" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm sm:col-span-2" />
            <textarea placeholder="Description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm resize-none sm:col-span-2" rows={2} />
          </div>
          <div className="flex gap-2">
            <button onClick={newProduct ? handleAddProduct : handleSaveProduct} disabled={saving || !editForm.name || !editForm.price} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50">{saving ? "Saving..." : newProduct ? "Add Product" : "Save Changes"}</button>
            <button onClick={() => { setEditingProduct(null); setNewProduct(false); }} className="bg-stone-100 text-stone-600 px-4 py-2 rounded-lg text-sm hover:bg-stone-200">Cancel</button>
          </div>
        </div>
      )}
      {!editingProduct && !newProduct && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-stone-800">Product Inventory</h3>
            <button onClick={() => { setNewProduct(true); setEditForm({ name: "", description: "", price: "", unit: "each", category: "", available_quantity: "0" }); }} className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-700">+ Add Product</button>
          </div>
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-white rounded-xl border border-stone-100 p-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${p.is_available ? "bg-green-500" : "bg-red-400"}`}></span><p className="font-medium text-stone-800 text-sm">{p.name}</p><span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{p.unit}</span></div>
                <p className="text-xs text-stone-400 mt-0.5">{p.category} &middot; Qty: {p.available_quantity}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="font-bold text-emerald-700 text-sm">{formatPrice(p.price)}</span>
                <button onClick={() => handleEditProduct(p)} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded hover:bg-stone-200">Edit</button>
                <button onClick={() => handleToggleAvailability(p)} className={`text-xs px-2 py-1 rounded ${p.is_available ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>{p.is_available ? "Hide" : "Show"}</button>
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

  useEffect(() => { apiFetch("/pickup/instructions").then((d) => setPickupFarms(d.farms)).catch(console.error); loadUpcoming(); }, []);

  const loadUpcoming = async () => { setLoading(true); try { const data = await apiFetch("/pickup/upcoming"); setUpcoming(data); } catch (err) { console.error(err); } setLoading(false); };

  const loadFarmPickup = async (farmId) => { setSelectedFarmId(farmId); setLoading(true); try { const data = await apiFetch(`/pickup/farm/${farmId}?date=${filterDate}`); setPickupList(data); } catch (err) { console.error(err); } setLoading(false); };

  const handlePrint = () => window.print();

  if (loading) return (<div className="flex justify-center py-20"><div className="animate-spin text-4xl">🌱</div></div>);

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-brand-forest mb-6">📋 Pickup Management</h2>
      <div className="flex border-b border-stone-200 mb-6">
        <button onClick={() => setTab("instructions")} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === "instructions" ? "border-brand-sage text-brand-forest" : "border-transparent text-stone-500 hover:text-stone-700"}`}>📍 Pickup Instructions</button>
        <button onClick={() => { setTab("list"); setSelectedFarmId(null); setPickupList(null); }} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === "list" ? "border-brand-sage text-brand-forest" : "border-transparent text-stone-500 hover:text-stone-700"}`}>📦 Pickup Lists</button>
        <button onClick={() => { setTab("upcoming"); loadUpcoming(); }} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === "upcoming" ? "border-brand-sage text-brand-forest" : "border-transparent text-stone-500 hover:text-stone-700"}`}>📅 All Upcoming</button>
      </div>
      {tab === "instructions" && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-start gap-2"><span className="text-lg shrink-0">ℹ️</span><div><p className="font-medium text-emerald-800 text-sm">Saturday Pickup Hub</p><p className="text-emerald-700 text-sm mt-1">The Presque Isle County Food Co-op operates a centralized Saturday pickup at the <strong>Rogers City Farmers Market Pavilion</strong> (245 N 3rd St, Rogers City, MI 49779) from <strong>9:00 AM to 12:00 PM</strong>. Shoppers with orders from multiple farms can pick up everything at one location.</p></div></div>
          </div>
          <h3 className="font-semibold text-stone-800">Individual Farm Pickup Locations</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {pickupFarms.map((farm) => (
              <div key={farm.id} className="bg-white rounded-xl border border-stone-200 p-4">
                <h4 className="font-semibold text-stone-800">{farm.name}</h4>
                <p className="text-xs text-stone-500 mt-1">📍 {farm.address}, {farm.city}, MI</p>
                {farm.phone && <p className="text-xs text-stone-500">📞 {farm.phone}</p>}
                <div className="mt-2 pt-2 border-t border-stone-100"><p className="text-sm text-stone-700">{farm.pickup_info}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "list" && !selectedFarmId && (
        <div>
          <div className="flex items-center gap-3 mb-4"><label className="text-sm font-medium text-stone-700">Pickup Date:</label><input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="px-3 py-1.5 rounded-lg border border-stone-200 text-sm focus:border-emerald-400 outline-none" /></div>
          <p className="text-stone-500 mb-4">Select a farm to view its pickup list for the selected date:</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pickupFarms.map((farm) => (
              <button key={farm.id} onClick={() => loadFarmPickup(farm.id)} className="text-left bg-white rounded-xl border border-stone-200 p-4 hover:border-emerald-300 hover:shadow-sm transition-all">
                <h3 className="font-semibold text-stone-800">{farm.name}</h3><p className="text-xs text-stone-500 mt-1">{farm.city}</p><span className="inline-block mt-2 text-brand-sage text-sm font-medium">View Pickup List &rarr;</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {tab === "list" && selectedFarmId && pickupList && (
        <div>
          <button onClick={() => { setSelectedFarmId(null); setPickupList(null); }} className="inline-flex items-center gap-1 text-brand-sage hover:text-brand-forest font-medium text-sm mb-4">&larr; Back to farm selection</button>
          <div className="bg-gradient-to-r from-amber-600 to-amber-500 rounded-2xl p-5 text-white mb-4">
            <div className="flex items-start justify-between">
              <div><h3 className="text-xl font-bold">{pickupList.farm.name}</h3><p className="text-amber-100 text-sm">Pickup Date: {pickupList.pickup_date || "All dates"}</p></div>
              <button onClick={handlePrint} className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm hover:bg-white/30">🖨️ Print</button>
            </div>
            <div className="flex gap-4 mt-3 text-sm text-amber-100"><span>{pickupList.total_shoppers} shopper{pickupList.total_shoppers !== 1 ? "s" : ""}</span><span>{pickupList.total_items} total items</span></div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4"><p className="text-sm text-amber-800"><strong>📍 Pickup:</strong> {pickupList.farm.pickup_info}</p></div>
          <div className="space-y-3 print:space-y-2">
            {pickupList.reservations.map((res) => (
              <div key={res.id} className="bg-white rounded-xl border border-stone-200 p-4 print:border print:shadow-none print:break-inside-avoid">
                <div className="flex items-start justify-between mb-2">
                  <div><p className="font-semibold text-stone-800">{res.shopper_name}</p><p className="text-xs text-stone-500">{res.shopper_email}{res.shopper_phone && <> &middot; {res.shopper_phone}</>}</p></div>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${res.status === "ready" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{res.status?.replace("_", " ")}</span>
                </div>
                <table className="w-full text-sm"><thead><tr className="text-stone-400 text-xs"><th className="text-left pb-1">Item</th><th className="text-right pb-1">Qty</th><th className="text-right pb-1">Price</th></tr></thead><tbody>{res.items.map((item) => (<tr key={item.id} className="border-t border-stone-50"><td className="py-1 text-stone-700">{item.product_name}</td><td className="py-1 text-right text-stone-600">{item.quantity} {item.unit}</td><td className="py-1 text-right text-stone-600">{formatPrice(item.unit_price * item.quantity)}</td></tr>))}</tbody></table>
                <div className="border-t border-stone-100 mt-2 pt-2 flex justify-between font-semibold text-sm"><span>Total</span><span className="text-emerald-700">{formatPrice(res.total_amount)}</span></div>
              </div>
            ))}
            {pickupList.reservations.length === 0 && <p className="text-stone-400 text-center py-8">No pickups scheduled for this date.</p>}
          </div>
        </div>
      )}
      {tab === "upcoming" && (
        <div>
          {upcoming && upcoming.length === 0 && <p className="text-stone-400 text-center py-8">No upcoming pickups.</p>}
          <div className="space-y-4">
            {upcoming?.map((res) => (
              <div key={res.id} className="bg-white rounded-xl border border-stone-200 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div><p className="font-semibold text-stone-800">{res.shopper_name}</p><p className="text-xs text-stone-500">{res.shopper_email}</p></div>
                  <div className="text-right text-xs text-stone-500"><p>📅 {res.pickup_date || "No date set"}</p><span className={`inline-block mt-1 px-2 py-0.5 rounded-full capitalize font-medium ${statusColors[res.status] || "bg-stone-100"}`}>{res.status}</span></div>
                </div>
                <div className="space-y-2 mt-2">
                  {res.itemsByFarm?.map((farmGroup) => (
                    <div key={farmGroup.farm_id} className="bg-stone-50 rounded-lg p-2">
                      <p className="text-xs font-semibold text-stone-700 mb-1">{farmGroup.farm_name}</p>
                      <div className="space-y-0.5">{farmGroup.items.map((item) => (<div key={item.id} className="flex justify-between text-xs text-stone-600"><span>{item.product_name} &times; {item.quantity}</span><span>{formatPrice(item.unit_price * item.quantity)}</span></div>))}</div>
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

// ---------- Main App Component ----------
export default function App() {
  const [page, setPage] = useState("browse");
  const [viewTab, setViewTab] = useState("farms");
  const [farms, setFarms] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    apiFetch("/farms").then(setFarms).catch(console.error);
    apiFetch("/products").then(setAllProducts).catch(console.error);
  }, []);

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

  const handleUpdateQty = (cartId, delta) => { setCartItems((prev) => prev.map((item) => item.cartId === cartId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter((item) => item.quantity > 0)); };
  const handleRemoveItem = (cartId) => { setCartItems((prev) => prev.filter((i) => i.cartId !== cartId)); };
  const handleSubmitReservation = (result) => { setReservation(result); setCartItems([]); setShowCart(false); setPage("confirmation"); };
  const handleNewOrder = () => { setReservation(null); setPage("browse"); setViewTab("farms"); };

  const filteredFarms = farms.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.city.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredProducts = allProducts.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.farm_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const categories = ["all", "vegetables", "dairy-eggs", "honey", "fruit", "preserves", "crafts", "body-care"];

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <nav className="bg-brand-cream/90 border-b border-stone-200/80 sticky top-0 z-50 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <button onClick={() => { setPage("browse"); setViewTab("farms"); setShowCart(false); }} className="flex items-center gap-2">
              <span className="text-2xl">🌽</span>
              <span className="font-serif text-xl font-bold text-brand-forest">Local Food Co-op</span>
            </button>
            <div className="flex items-center gap-4">
              <button onClick={() => { setPage("browse"); setViewTab("farms"); }}
                className={`text-sm font-semibold transition-colors duration-200 ${page === "browse" && viewTab === "farms" ? "text-brand-sage font-bold" : "text-stone-500 hover:text-stone-700"}`}>Farms</button>
              <button onClick={() => { setPage("browse"); setViewTab("all-products"); }}
                className={`text-sm font-semibold transition-colors duration-200 ${page === "browse" && viewTab === "all-products" ? "text-brand-sage font-bold" : "text-stone-500 hover:text-stone-700"}`}>Products</button>
              <button onClick={() => setPage("producer")}
                className={`text-sm font-semibold transition-colors duration-200 ${page === "producer" ? "text-brand-sage font-bold" : "text-stone-500 hover:text-stone-700"}`}>👨‍🌾 Producer</button>
              <button onClick={() => setPage("pickup")}
                className={`text-sm font-semibold transition-colors duration-200 ${page === "pickup" ? "text-brand-sage font-bold" : "text-stone-500 hover:text-stone-700"}`}>📋 Pickup</button>
              {reservation && (
                <button onClick={() => setPage("confirmation")}
                  className={`text-sm font-semibold transition-colors duration-200 ${page === "confirmation" ? "text-brand-sage font-bold" : "text-stone-500 hover:text-stone-700"}`}>My Order</button>
              )}
              <button onClick={() => setShowCart(!showCart)} className="relative p-2.5 rounded-xl hover:bg-stone-100 transition-colors border border-stone-200 bg-white" aria-label="View shopping cart">
                <span className="text-xl">🛒</span>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-brand-sage text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">{cartCount > 9 ? "9+" : cartCount}</span>}
              </button>
            </div>
          </div>
        </nav>

        {showCart && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowCart(false)} />
            <div className="relative ml-auto w-full max-w-lg bg-brand-cream h-full overflow-y-auto shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-slideLeft">
              <div>
                <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between z-10">
                  <h2 className="font-serif text-lg font-bold text-brand-forest">Your Unified Reservation Cart</h2>
                  <button onClick={() => setShowCart(false)} className="text-stone-400 hover:text-stone-600 text-2xl font-light" aria-label="Close cart">&times;</button>
                </div>
                <div className="p-6">
                  <CartDrawer items={cartItems} onUpdateQty={handleUpdateQty} onRemove={handleRemoveItem} onSubmit={handleSubmitReservation} />
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="max-w-6xl mx-auto px-4 py-8">
          {page === "browse" && (
            <>
              <Hero activeCounty="Presque Isle" producerCount={farms.length} />
              <div className="flex border-b border-stone-200 mb-8 gap-6">
                <button onClick={() => setViewTab("farms")}
                  className={`pb-3 font-serif text-lg font-bold transition-all ${viewTab === "farms" ? "text-brand-forest border-b-2 border-brand-sage" : "text-stone-400 hover:text-stone-600"}`}>Browse Farms</button>
                <button onClick={() => setViewTab("all-products")}
                  className={`pb-3 font-serif text-lg font-bold transition-all ${viewTab === "all-products" ? "text-brand-forest border-b-2 border-brand-sage" : "text-stone-400 hover:text-stone-600"}`}>Browse All Products</button>
              </div>
              <div className="bg-white border border-stone-200 rounded-3xl p-5 mb-8 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div className="w-full md:w-1/3 relative">
                    <input type="text" placeholder={viewTab === "farms" ? "Search farms by name or town..." : "Search products or farms..."} value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-stone-300 focus:border-brand-sage focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm" />
                    <span className="absolute right-3 top-3 text-stone-400">🔍</span>
                  </div>
                  {viewTab === "all-products" && (
                    <div className="w-full md:w-auto flex flex-wrap gap-2 justify-start md:justify-end">
                      {categories.map((cat) => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border ${selectedCategory === cat ? "bg-brand-sage border-brand-sage text-white shadow-sm" : "bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100 hover:text-stone-700"}`}>
                          {cat.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {viewTab === "farms" && (
                <div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filteredFarms.map((farm) => <FarmCard key={farm.id} farm={farm} onSelect={handleSelectFarm} />)}</div>{filteredFarms.length === 0 && <div className="text-center py-16 text-stone-400"><div className="text-5xl mb-4">🌱</div><p className="font-semibold text-stone-600">No farms matched your search</p><p className="text-sm font-light mt-1">Try another search term or browse all products tab!</p></div>}</div>
              )}
              {viewTab === "all-products" && (
                <div><div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={handleAddToCart} added={cartItemIds.has(product.id)} />)}</div>{filteredProducts.length === 0 && <div className="text-center py-16 text-stone-400"><div className="text-5xl mb-4">🥬</div><p className="font-semibold text-stone-600">No products matched your filters</p><p className="text-sm font-light mt-1">Try resetting the category filter or changing your search.</p></div>}</div>
              )}
            </>
          )}
          {page === "farm" && <FarmDetail farmId={selectedFarmId} onBack={() => { setPage("browse"); setSelectedFarmId(null); }} onAddToCart={handleAddToCart} cartItemIds={cartItemIds} />}
          {page === "confirmation" && reservation && <Confirmation reservation={reservation} onNewOrder={handleNewOrder} />}
          {page === "producer" && <ProducerDashboard />}
          {page === "pickup" && <PickupManagement />}
        </main>
      </div>
      <footer className="border-t border-stone-200 bg-white mt-16 py-10 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-serif text-lg font-bold text-brand-forest mb-2">🌽 Presque Isle Local Food Co-op</p>
          <p className="text-stone-500 max-w-lg mx-auto text-sm font-light leading-relaxed">Supporting backyard gardeners, beekeepers, and homesteaders throughout Presque Isle County. Empowering hyper-local, direct agricultural connections.</p>
          <div className="mt-6 flex justify-center gap-4 text-xs font-semibold text-stone-400"><span>© 2026 Local Food Marketplace</span><span>&middot;</span><span>All Rights Reserved</span></div>
        </div>
      </footer>
    </div>
  );
}
