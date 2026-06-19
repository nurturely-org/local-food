# Local Food — MVP Design System & Visual Guidelines
Revision 1 • Created by agent-designer • 2026-06-19

This design system establishes a warm, wholesome, hyper-local, and highly trustworthy visual identity for the **Local Food** marketplace. It is built explicitly to be implemented with **Tailwind CSS** in React.

---

## 1. Brand Concept & Aesthetic
* **Core Philosophy:** Bypassing complex logistics to connect backyard gardeners directly with local shoppers. The design should feel as organic and personal as picking up tomatoes from a neighbor, yet as seamless and reliable as a modern digital cart.
* **Tone:** Wholesome, clean, sunny, tactile, rustic-modern.
* **Themes:** Fresh soil, green leaves, golden honey, sun-warmed wood, and farm-fresh eggs.

---

## 2. Color Palette

Use these specific hex codes or Tailwind color mappings to maintain a unified color scheme.

| Color Role | Color Name | Hex Code | Tailwind Equivalent / Usage |
| :--- | :--- | :--- | :--- |
| **Primary (Brand / Nature)** | Leaf Forest | `#14532D` | `text-emerald-900` or `text-green-950` — Dark headings, deep brand color |
| **Primary Accent** | Fresh Sage | `#16A34A` | `bg-green-600` or `text-green-600` — Primary buttons, active badges, highlights |
| **Primary Light** | Sprout Cream | `#F0FDF4` | `bg-green-50` — Soft backgrounds, alerts, secondary sections |
| **Secondary (Warmth)** | Wild Honey | `#D97706` | `text-amber-700` or `bg-amber-600` — Egg/Honey highlights, rating stars, warning/notice text |
| **Secondary Light** | Sun Warmth | `#FFFBEB` | `bg-amber-50` — Special announcements, seller highlight backgrounds |
| **Earth Accent** | Clay Terracotta | `#C2410C` | `text-orange-700` — Root vegetables, rustic alerts, earthy secondary buttons |
| **Neutral Base** | Milk Cream | `#FDFBF7` | Custom background (warm cream) — Main body background |
| **Neutral Card** | Fresh Chalk | `#FFFFFF` | `bg-white` — Cards, modals, inputs (contrasts beautifully with warm cream background) |
| **Neutral Dark (Text)**| Charcoal Bark | `#1C1917` | `text-stone-900` — Primary body copy, high contrast |
| **Neutral Medium** | Weathered Slate| `#78716C` | `text-stone-500` — Secondary text, labels, borders |
| **Neutral Light** | Soft Mist | `#E7E5E4` | `border-stone-200` — Borders, dividers |

### Tailwind `tailwind.config.js` Theme Extension Block:
For the engineer, insert this into `tailwind.config.js` to create standard semantic colors:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          cream: '#FDFBF7',
          forest: '#14532D',
          sage: '#16A34A',
          sprout: '#F0FDF4',
          honey: '#D97706',
          sunshine: '#FFFBEB',
          terracotta: '#C2410C',
          bark: '#1C1917',
        }
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'], // Elegant, rustic headings
        sans: ['Inter', 'system-ui', 'sans-serif'], // Super readable interface text
      }
    }
  }
}
```

---

## 3. Typography & Text Hierarchy

We combine a warm, characterful **serif** for emotional highlights and primary headings with a highly legible **sans-serif** for interface mechanics, forms, and lists.

* **Primary Headings (`h1`, `h2`) — Serif Font:**
  * Tailwind Classes: `font-serif font-bold tracking-tight text-brand-forest`
  * Usage: Hero banners, farm titles, landing page value props, product detail headings.
* **Secondary Headings (`h3`, `h4`) — Sans-Serif Bold:**
  * Tailwind Classes: `font-sans font-semibold tracking-wide text-brand-bark`
  * Usage: Product card titles, dashboard widget titles, section headers.
* **Body Text — Sans-Serif Regular:**
  * Tailwind Classes: `font-sans text-stone-700 leading-relaxed`
  * Usage: Product descriptions, pickup instructions, producer bios.
* **Muted / Small Text:**
  * Tailwind Classes: `font-sans text-xs text-stone-500`
  * Usage: Card footers, subscription details, helper text, timestamps.

---

## 4. UI Components & Component Styling Guidelines

Consistent styling classes for key reusable components. Use these Tailwind patterns directly in your JSX:

### 4.1 Cards (Farms & Products)
```html
<div class="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-stone-200/50">
  <!-- Image Header -->
  <div class="relative h-48 bg-stone-100">
    <img src="..." alt="..." class="h-full w-full object-cover" />
    <span class="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-forest shadow-sm backdrop-blur-sm">
      Presque Isle County
    </span>
  </div>
  <!-- Card Content -->
  <div class="p-5">
    <h3 class="font-serif text-lg font-bold text-brand-forest">Farm Name</h3>
    <p class="mt-1 text-sm text-stone-500">Subtitle or producer bio short description...</p>
    <div class="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
      <span class="text-xs font-medium text-brand-sage">5 Active Products</span>
      <button class="rounded-lg bg-brand-forest px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-sage">
        Browse Store
      </button>
    </div>
  </div>
</div>
```

### 4.2 Buttons
* **Primary Button (Fresh & Actionable):**
  * Tailwind: `bg-brand-sage hover:bg-brand-forest text-white font-semibold rounded-xl px-5 py-2.5 transition-colors duration-200 shadow-sm text-sm inline-flex items-center justify-center gap-2`
  * Use: "Reserve Now", "Confirm Order", "Subscribe"
* **Secondary Button (Subtle & Contextual):**
  * Tailwind: `border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-semibold rounded-xl px-5 py-2.5 transition-colors duration-200 text-sm inline-flex items-center justify-center gap-2`
  * Use: "Back", "View Seller Details", "Cancel"
* **Danger / Earth Button (Alert & Critical Actions):**
  * Tailwind: `bg-brand-terracotta hover:bg-red-800 text-white font-semibold rounded-xl px-5 py-2.5 transition-colors duration-200 text-sm`
  * Use: "Remove Item", "Decline Subscription"

### 4.3 Navigation & Header Bar
* Modern, warm navigation with blurred transparent background.
  * Tailwind: `sticky top-0 z-50 border-b border-stone-200/80 bg-brand-cream/90 backdrop-blur-md`
  * Text Links: `text-stone-600 hover:text-brand-sage font-medium text-sm transition-colors`
  * Active Link: `text-brand-forest font-semibold border-b-2 border-brand-sage pb-1`

### 4.4 Badges / Labels
* **Producer County Density / Active Indicator:**
  * Tailwind: `bg-brand-sprout text-brand-forest border border-emerald-100 px-2.5 py-0.5 rounded-full text-xs font-medium`
* **Starter Subscription Tier:**
  * Tailwind: `bg-stone-100 text-stone-700 border border-stone-200 px-2.5 py-0.5 rounded-full text-xs font-medium`
* **Premium Subscription Tier:**
  * Tailwind: `bg-brand-sunshine text-brand-honey border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-medium font-semibold`

---

## 5. Screen Layout & User Experience Wireframes

The 5 core MVP views should be laid out with strict mobile-first or highly responsive desktop grids in mind.

### 5.1 Browse Farms (County View)
* **Goal:** Direct entry. Shows density of producers in their current county (KPI #1 focus).
* **Layout:**
  * Hero search bar inviting the user to select or browse their county.
  * Active density counter (e.g., "🎉 8 producers active in Presque Isle County!").
  * Grid of gorgeous Farm Cover Cards (featuring the custom-generated farm graphics).

### 5.2 Browse Products (Unified Grocery Shelf)
* **Goal:** Simple unified browsing of all products across all active county producers.
* **Layout:**
  * Left side / Top filter bar: Filter by category (Veggies, Eggs, Honey, Fruit, Bakery) or Farm (Bonz Beach, Johnson Family, North Woods).
  * Main display: Card-grid showing appetizing photos, product price per unit (e.g., `$4.50 / dozen`), stock count, and seller badge.
  * Fast add-to-cart overlay.

### 5.3 Reserve Products (Unified Checkout & Cart)
* **Goal:** Single unified reservation cart bypassing complex logistics.
* **Layout:**
  * Clean two-column split layout.
  * Left: Cart item details grouped by Producer (important, as pickups are direct stop-by-stop).
  * Right: Grand summary (total reservation value, clear direct instructions on multi-farm stops, and a secure "Submit Reservation" checkout).
  * Explicit note: "No payment online! Reserve here and pay directly at pickup using Cash, Venmo, or check."

### 5.4 Producer Dashboard (Subscription & Inventory)
* **Goal:** Producer onboarding, subscription selection, and inventory management.
* **Layout:**
  * Header showing active subscription tier (Starter or Premium) and renewal date.
  * Clean table to edit prices, manage inventory levels, and check reservations.
  * Quick billing widget showing monthly value (Starter: `$10/mo`, Premium: `$29/mo`).

### 5.5 Pickup Management (Shopper Hub & Map Stop)
* **Goal:** Show shoppers exactly where to go and provide producers with order verification.
* **Layout:**
  * Step-by-step pickup stops (Stop 1: North Woods Apiary - 2 Honey Jars, Stop 2: Johnson Family Homestead - 1 Dozen Eggs).
  * Map layout/directions container (clean rustic list-based directions).
  * "Mark Picked Up" action triggers to record complete reservations (KPI #2 tracking).
