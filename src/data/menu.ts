// Centralised menu. Edit prices / availability here.
export type MenuItem = {
  id: string;
  name: string;
  category: string;
  prices: number[]; // one price, or one per size
  note?: string;
  featured?: boolean;
  available?: boolean; // default true
};

export type Category = { id: string; name: string; emoji: string; sizes?: string[] };

// Size labels still need confirming with the restaurant.
const PIZZA_SIZES = ["Small", "Medium", "Large"];

export const categories: Category[] = [
  { id: "pizza-maniya", name: "Pizza Maniya", emoji: "🍕", sizes: PIZZA_SIZES },
  { id: "classic-veg", name: "Classic Veg Pizza", emoji: "🍕", sizes: PIZZA_SIZES },
  { id: "simply-veg", name: "Simply Veg Pizza", emoji: "🍕", sizes: PIZZA_SIZES },
  { id: "special-veg", name: "Special Veg Pizza", emoji: "🍕", sizes: PIZZA_SIZES },
  { id: "kullad", name: "Kullad Pizza", emoji: "🏺" },
  { id: "burgers", name: "Burgers", emoji: "🍔" },
  { id: "sandwiches", name: "Sandwiches", emoji: "🥪" },
  { id: "pasta", name: "Pasta", emoji: "🍝" },
  { id: "garlic-bread", name: "Garlic Bread", emoji: "🥖" },
  { id: "fries", name: "French Fries", emoji: "🍟" },
  { id: "wraps", name: "Wraps", emoji: "🌯" },
  { id: "mojito", name: "Mojito", emoji: "🍹" },
  { id: "shakes", name: "Shakes", emoji: "🥤" },
  { id: "cold-coffee", name: "Cold Coffee", emoji: "🧋" },
  { id: "hot-coffee", name: "Hot Coffee", emoji: "☕" },
  { id: "other", name: "Desserts", emoji: "🍫" },
];

const mk = (category: string, rows: [string, number[], Partial<MenuItem>?][]): MenuItem[] =>
  rows.map(([name, prices, extra]) => ({
    id: `${category}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name,
    category,
    prices,
    ...extra,
  }));

const p3 = (a: number, b: number, c: number) => [a, b, c];

export const menu: MenuItem[] = [
  ...mk("pizza-maniya", [
    ["Four Season", p3(200, 350, 500), { featured: true }],
    ["Paneer Bite", p3(200, 350, 500)],
    ["Spicy Lover", p3(200, 350, 500)],
    ["All Toppings", p3(200, 350, 500)],
    ["8 Flavoured in One Pizza", [650], { note: "Separate sauce charged extra" }],
  ]),
  ...mk("classic-veg", [
    ["Country Feast", p3(150, 300, 380)],
    ["Farm House", p3(150, 300, 380), { featured: true }],
    ["Tandoori Paneer", p3(150, 300, 380), { featured: true }],
    ["Zesty Special", p3(150, 300, 380)],
    ["Tandoori Chilli", p3(150, 300, 380)],
  ]),
  ...mk("simply-veg", [
    ["Cheese Capsicum", p3(100, 180, 280)],
    ["Cheese Corn", p3(100, 180, 280), { featured: true }],
    ["Cheese Onion", p3(100, 180, 280)],
    ["Cheese Tomato", p3(100, 180, 280)],
  ]),
  ...mk("special-veg", [
    ["Cheese Black Olive", p3(130, 230, 330)],
    ["Cheese Paneer", p3(130, 230, 330)],
    ["Cheese Mushroom", p3(130, 230, 330)],
  ]),
  ...mk("kullad", [
    ["Tandoori Kullad Pizza", [130]],
    ["All Topping Kullad Pizza", [150]],
  ]),
  ...mk("burgers", [
    ["Aloo Tikki", [50]],
    ["Cheese Aloo Tikki", [70]],
    ["Double Cheese Burger", [80], { featured: true }],
    ["Veggie King Burger", [80]],
    ["Cheese Veggie King Burger", [90]],
    ["Cheese Corn Burger", [90]],
    ["Cheese Paneer Fillet", [100]],
  ]),
  ...mk("sandwiches", [
    ["Mix Veg Sandwich", [80]],
    ["Pasta Sandwich", [100]],
    ["Cheese Corn Sandwich", [100]],
    ["Tandoori Sandwich", [110]],
    ["Cheese Paneer Sandwich", [120]],
  ]),
  ...mk("pasta", [
    ["White Sauce Pasta", [120]],
    ["Red Sauce Pasta", [120]],
    ["Mix Sauce Pasta", [150]],
  ]),
  ...mk("garlic-bread", [
    ["Stick Garlic Bread", [100]],
    ["Stuff Garlic Bread", [120]],
    ["Cheese Bite", [150]],
  ]),
  ...mk("fries", [
    ["Crispy French Fries", [80]],
    ["Masala Fries", [90]],
    ["Peri Peri Fries", [120], { featured: true }],
  ]),
  ...mk("wraps", [
    ["Spicy Wrap", [80]],
    ["Veg. Spicy Wrap", [90]],
    ["Paneer Wrap", [120]],
  ]),
  ...mk("mojito", [
    ["Classic Mojito", [90]],
    ["Green Apple Mojito", [100]],
    ["Soft Mojito", [100]],
    ["Zeera Lemon Mojito", [120]],
    ["Lemon Mojito", [120]],
    ["Watermelon Mojito", [120]],
    ["Fresh Mojito", [140]],
  ]),
  ...mk("shakes", [
    ["Oreo with Kit Kat Shake", [130], { featured: true }],
    ["Chocolate Shake", [100]],
    ["Strawberry Shake", [100]],
    ["Butter Scotch Shake", [100]],
    ["Banana Shake", [80]],
    ["Mango Shake", [90]],
  ]),
  ...mk("cold-coffee", [
    ["Classic Cold Coffee", [80], { featured: true }],
    ["Ice Cold Coffee", [100]],
    ["Chocolate Cold Coffee", [120]],
    ["Strong Cold Coffee", [120]],
  ]),
  ...mk("hot-coffee", [
    ["Regular Hot Coffee", [50]],
    ["Black Hot Coffee", [60]],
    ["Strong Hot Coffee", [70]],
    ["Chocolate Hot Coffee", [100]],
    ["Creamy Hot Coffee", [100]],
    ["Brown Hot Coffee", [110]],
  ]),
  ...mk("other", [["Chocolava Cake", [80]]]),
];

export const sizesFor = (item: MenuItem) =>
  item.prices.length > 1 ? (categories.find((c) => c.id === item.category)?.sizes ?? []) : [];

export const offers = [
  { id: "two", title: "Meal for Two", price: 450, items: ["Medium Cheese Burst Pizza", "Grilled Cheese Sandwich", "Cold Drink (600 ml)"] },
  { id: "three", title: "Meal for Three", price: 550, items: ["Medium Super Magic Pizza", "Small Super Veg Pizza", "Cold Drink (600 ml)", "White Sauce Pasta"] },
  { id: "four", title: "Meal for Four", price: 800, items: ["Veg Supreme Pizza", "2 Aloo Tikki Burgers", "2 Grilled Sandwiches", "Cold Drink (1.25 L)", "French Fries"] },
];

export const deals = [
  { id: "pizza-deal", title: "Pizza Offer", text: "Buy 2 mix Large pizzas, get 1 Regular pizza free." },
  { id: "burger-deal", title: "Burger Offer", text: "Buy 2 mix Medium pizzas, get 1 Aloo Tikki burger free." },
];

// Owner-editable conditions shown on all offers.
export const offerTerms = "Valid while the restaurant runs the offer. Please confirm availability when ordering.";
