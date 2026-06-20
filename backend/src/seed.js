const { getDb } = require("./database");
const { v4: uuidv4 } = require("crypto");

function generateId() {
  // Simple ID generator that doesn't require crypto
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function seed() {
  const db = getDb();

  // Check if already seeded
  const count = db.prepare("SELECT COUNT(*) as c FROM farms").get();
  if (count.c > 0) {
    console.log("Database already seeded. Skipping.");
    return;
  }

  console.log("Seeding database with Presque Isle County Food Co-op data...");

  // --- FARMS ---
  const farms = [
    {
      id: "f1",
      name: "Bonz Beach Farms",
      description:
        "Family-owned farm on the shores of Lake Huron specializing in heirloom tomatoes, sweet corn, and seasonal vegetables. Open since 1985.",
      address: "12873 US-23",
      city: "Rogers City",
      state: "MI",
      zip: "49779",
      county: "Presque Isle",
      phone: "(989) 555-0142",
      email: "hello@bonzbeachfarms.com",
      website: "https://bonzbeachfarms.com",
      pickup_info:
        "Farm stand open Tues, Thurs, Sat 9am-5pm. Pre-orders picked up at the red barn.",
      image_url: "/images/bonz-beach.jpg",
      payment_details: "Venmo: @BonzBeachFarms",
      subscription_tier: "premium",
    },
    {
      id: "f2",
      name: "Johnson Family Homestead",
      description:
        "Certified naturally grown vegetables, pasture-raised eggs, and handmade preserves. Three generations of farming in Presque Isle County.",
      address: "5543 M-65 N",
      city: "Millersburg",
      state: "MI",
      zip: "49759",
      county: "Presque Isle",
      phone: "(989) 555-0187",
      email: "johnsons@homestead.com",
      website: null,
      pickup_info:
        "Pickup at the homestead barn Wed & Fri 3-6pm. Please bring your own bags.",
      image_url: "/images/johnson-homestead.jpg",
      payment_details: "Venmo: @JohnsonHomestead",
      subscription_tier: "starter",
    },
    {
      id: "f3",
      name: "North Woods Apiary",
      description:
        "Pure raw honey, beeswax candles, and handcrafted lip balms. Our bees forage on wildflowers in the Pigeon River Country Forest.",
      address: "8921 Krause Rd",
      city: "Onaway",
      state: "MI",
      zip: "49765",
      county: "Presque Isle",
      phone: "(989) 555-0233",
      email: "buzz@northwoodsapiary.com",
      website: "https://northwoodsapiary.com",
      pickup_info:
        "Available at the Onaway Farmers Market (Sat 8am-1pm) or by appointment at the apiary.",
      image_url: "/images/north-woods-apiary.jpg",
      payment_details: "Venmo: @NorthWoodsApiary",
      subscription_tier: "premium",
    },
    {
      id: "f4",
      name: "Posen Potato Patch",
      description:
        "Known for our heirloom and specialty potatoes — from purple Peruvian to fingerlings. Also grow root vegetables and heritage beans.",
      address: "2467 Behler Rd",
      city: "Posen",
      state: "MI",
      zip: "49776",
      county: "Presque Isle",
      phone: "(989) 555-0301",
      email: "potatoes@posenpatch.com",
      website: null,
      pickup_info:
        "Farmstand open daily dawn-dusk (self-serve). Pre-orders available for weekend pickup.",
      image_url: "/images/posen-potato.jpg",
      payment_details: "Venmo: @PosenPotato",
      subscription_tier: "starter",
    },
    {
      id: "f5",
      name: "Lake Esau Berry Farm",
      description:
        "U-pick and pre-picked strawberries, blueberries, raspberries, and blackberries. Our jams and jellies are made in small batches.",
      address: "3101 Esau Lake Rd",
      city: "Hawks",
      state: "MI",
      zip: "49743",
      county: "Presque Isle",
      phone: "(989) 555-0415",
      email: "berries@lakeesaufarm.com",
      website: null,
      pickup_info:
        "U-pick season June-Sept. Pre-ordered berries available for pickup at the farm store 10am-5pm daily.",
      image_url: "/images/lake-esau.jpg",
      payment_details: "Venmo: @LakeEsauBerry",
      subscription_tier: "premium",
    },
  ];

  const insertFarm = db.prepare(`
    INSERT INTO farms (id, name, description, address, city, state, zip, county, phone, email, website, pickup_info, image_url, payment_details, subscription_tier)
    VALUES (@id, @name, @description, @address, @city, @state, @zip, @county, @phone, @email, @website, @pickup_info, @image_url, @payment_details, @subscription_tier)
  `);

  for (const farm of farms) {
    insertFarm.run(farm);
  }

  // --- PRODUCTS ---
  const products = [
    // Bonz Beach Farms (f1)
    {
      id: "p1",
      farm_id: "f1",
      name: "Heirloom Tomato Mix",
      description:
        "A colorful mix of Brandywine, Cherokee Purple, and Sun Gold tomatoes. Perfect for caprese or slicing.",
      price: 5.0,
      unit: "lb",
      category: "vegetables",
      available_quantity: 50,
    },
    {
      id: "p2",
      farm_id: "f1",
      name: "Sweet Corn (Dozen)",
      description:
        "Fresh-picked bi-color sweet corn. Picked fresh daily during the season.",
      price: 6.0,
      unit: "dozen",
      category: "vegetables",
      available_quantity: 30,
    },
    {
      id: "p3",
      farm_id: "f1",
      name: "Green Zucchini",
      description: "Tender summer squash, freshly harvested.",
      price: 2.5,
      unit: "lb",
      category: "vegetables",
      available_quantity: 40,
    },
    {
      id: "p4",
      farm_id: "f1",
      name: "Cucumbers",
      description: "Crisp slicing cucumbers. Great for salads and pickling.",
      price: 1.5,
      unit: "each",
      category: "vegetables",
      available_quantity: 60,
    },
    {
      id: "p5",
      farm_id: "f1",
      name: "Green Bell Peppers",
      description: "Large, thick-walled bell peppers.",
      price: 1.0,
      unit: "each",
      category: "vegetables",
      available_quantity: 45,
    },

    // Johnson Family Homestead (f2)
    {
      id: "p6",
      farm_id: "f2",
      name: "Pasture-Raised Eggs (Dozen)",
      description:
        "Farm-fresh eggs from free-range hens. Deep orange yolks packed with flavor.",
      price: 5.5,
      unit: "dozen",
      category: "dairy-eggs",
      available_quantity: 24,
    },
    {
      id: "p7",
      farm_id: "f2",
      name: "Strawberry Rhubarb Jam",
      description:
        "Small-batch preserve made with homestead strawberries and rhubarb. No pectin or preservatives.",
      price: 8.0,
      unit: "jar",
      category: "preserves",
      available_quantity: 15,
    },
    {
      id: "p8",
      farm_id: "f2",
      name: "Kale (Bunch)",
      description:
        "Lacinato (dinosaur) kale grown in our certified natural gardens.",
      price: 3.0,
      unit: "bunch",
      category: "vegetables",
      available_quantity: 20,
    },
    {
      id: "p9",
      farm_id: "f2",
      name: "Garlic (3 heads)",
      description: "Hardneck garlic — Music variety. Bold, spicy flavor.",
      price: 2.5,
      unit: "3-pack",
      category: "vegetables",
      available_quantity: 35,
    },

    // North Woods Apiary (f3)
    {
      id: "p10",
      farm_id: "f3",
      name: "Wildflower Honey (16oz)",
      description:
        "Pure, raw, unfiltered wildflower honey from the Pigeon River Country Forest.",
      price: 12.0,
      unit: "jar",
      category: "honey",
      available_quantity: 40,
    },
    {
      id: "p11",
      farm_id: "f3",
      name: "Creamed Honey (8oz)",
      description:
        "Smooth, spreadable creamed honey. Great on toast or biscuits.",
      price: 8.0,
      unit: "jar",
      category: "honey",
      available_quantity: 25,
    },
    {
      id: "p12",
      farm_id: "f3",
      name: "Beeswax Candle (Pillar)",
      description:
        "Hand-poured 100% beeswax pillar candle. Burns clean with a natural honey scent. Approx. 6oz.",
      price: 14.0,
      unit: "each",
      category: "crafts",
      available_quantity: 18,
    },
    {
      id: "p13",
      farm_id: "f3",
      name: "Bee Balm Lip Balm",
      description: "Nourishing lip balm made with beeswax, coconut oil, and local honey.",
      price: 4.0,
      unit: "each",
      category: "body-care",
      available_quantity: 50,
    },

    // Posen Potato Patch (f4)
    {
      id: "p14",
      farm_id: "f4",
      name: "Purple Peruvian Potatoes",
      description:
        "Stunning deep purple potatoes with a nutty, earthy flavor. Great roasted or mashed.",
      price: 4.0,
      unit: "lb",
      category: "vegetables",
      available_quantity: 60,
    },
    {
      id: "p15",
      farm_id: "f4",
      name: "Yukon Gold Potatoes",
      description: "Buttery gold potatoes perfect for mashing, roasting, or boiling.",
      price: 3.0,
      unit: "lb",
      category: "vegetables",
      available_quantity: 80,
    },
    {
      id: "p16",
      farm_id: "f4",
      name: "Fingerling Potato Mix",
      description:
        "Mixed bag of Russian Banana, French, and Purple Peruvian fingerlings.",
      price: 4.5,
      unit: "lb",
      category: "vegetables",
      available_quantity: 35,
    },
    {
      id: "p17",
      farm_id: "f4",
      name: "Carrots (Bunch)",
      description: "Rainbow carrots — orange, purple, yellow, and white. Topped fresh.",
      price: 3.0,
      unit: "bunch",
      category: "vegetables",
      available_quantity: 25,
    },

    // Lake Esau Berry Farm (f5)
    {
      id: "p18",
      farm_id: "f5",
      name: "Fresh Strawberries (1qt)",
      description: "Sun-ripened June-bearing strawberries. Picked at peak ripeness.",
      price: 6.0,
      unit: "quart",
      category: "fruit",
      available_quantity: 40,
    },
    {
      id: "p19",
      farm_id: "f5",
      name: "Blueberries (1pt)",
      description: "Plump, sweet high-bush blueberries.",
      price: 4.5,
      unit: "pint",
      category: "fruit",
      available_quantity: 35,
    },
    {
      id: "p20",
      farm_id: "f5",
      name: "Strawberry Jam (8oz)",
      description:
        "Traditional strawberry jam made with farm berries and cane sugar. No pectin added.",
      price: 7.0,
      unit: "jar",
      category: "preserves",
      available_quantity: 20,
    },
    {
      id: "p21",
      farm_id: "f5",
      name: "Raspberries (1/2pt)",
      description: "Delicate red raspberries, hand-picked and gently packed.",
      price: 5.0,
      unit: "half-pint",
      category: "fruit",
      available_quantity: 20,
    },
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (id, farm_id, name, description, price, unit, category, available_quantity)
    VALUES (@id, @farm_id, @name, @description, @price, @unit, @category, @available_quantity)
  `);

  for (const product of products) {
    insertProduct.run(product);
  }

  console.log(
    `Seeded ${farms.length} farms and ${products.length} products successfully.`
  );
}

module.exports = { seed };
