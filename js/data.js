/* ============================================================
   VOID — data.js
   Каталог товаров
   ============================================================ */

const CATALOG = [
  {
    id: "oversized-tee",
    name: "Void Oversized Tee",
    price: 85,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=900&auto=format&fit=crop",
    imgAlt: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=900&auto=format&fit=crop",
    desc: "Heavyweight 240 gsm cotton jersey with dropped shoulders and a boxy, architectural cut. Garment-dyed for a lived-in depth of black."
  },
  {
    id: "heavyweight-hoodie",
    name: "Heavyweight Hoodie",
    price: 160,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=900&auto=format&fit=crop",
    imgAlt: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=900&auto=format&fit=crop&sat=-100",
    desc: "480 gsm brushed-back fleece, double-layered hood and hidden kangaroo pocket. Cut oversized — take your usual size for the intended silhouette."
  },
  {
    id: "field-jacket",
    name: "Streetwear Field Jacket",
    price: 290,
    category: "men",
    sizes: ["M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=900&auto=format&fit=crop",
    imgAlt: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=900&auto=format&fit=crop",
    desc: "Water-repellent cotton ripstop with matte hardware, four utility pockets and a packable hood. Built for the city, styled for the dark."
  },
  {
    id: "cargo-pants",
    name: "Utility Cargo Pants",
    price: 145,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=900&auto=format&fit=crop",
    imgAlt: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=900&auto=format&fit=crop",
    desc: "Relaxed straight leg with articulated knees and six low-profile pockets. Cotton twill with a touch of stretch for all-day movement."
  },
  {
    id: "wide-jeans",
    name: "Wide Leg Jeans",
    price: 170,
    category: "men",
    sizes: ["S", "M", "L"],
    img: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=900&auto=format&fit=crop",
    imgAlt: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=900&auto=format&fit=crop",
    desc: "Rigid 14 oz Japanese denim in a wide, floor-skimming cut. Stone-washed once — designed to age beautifully with wear."
  },
  {
    id: "minimal-shirt",
    name: "Minimalist Poplin Shirt",
    price: 120,
    category: "men",
    sizes: ["S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=900&auto=format&fit=crop",
    imgAlt: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=900&auto=format&fit=crop",
    desc: "Crisp organic cotton poplin, concealed placket and a single chest pocket. The quiet anchor of any layered look."
  },
  {
    id: "runner-sneakers",
    name: "Void Runner Sneakers",
    price: 210,
    category: "men",
    sizes: ["40", "41", "42", "43", "44", "45"],
    img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=900&auto=format&fit=crop",
    imgAlt: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=900&auto=format&fit=crop",
    desc: "Sculpted EVA sole, matte leather overlays and reflective underlay details. Engineered for comfort, finished for the editorial shot."
  },
  {
    id: "wool-overcoat",
    name: "Wool Overcoat",
    price: 340,
    category: "men",
    sizes: ["M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=900&auto=format&fit=crop",
    imgAlt: "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=900&auto=format&fit=crop",
    desc: "Double-faced Italian wool with hand-finished lapels and a relaxed shoulder. Fully lined in cupro for weightless warmth."
  },
  {
    id: "slip-dress",
    name: "Bias Slip Dress",
    price: 230,
    category: "women",
    sizes: ["S", "M", "L"],
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop",
    imgAlt: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=900&auto=format&fit=crop",
    desc: "Bias-cut sandwashed silk that moves like water. Adjustable straps and a midi length that works from day to after dark."
  },
  {
    id: "cropped-knit",
    name: "Cropped Rib Knit",
    price: 130,
    category: "women",
    sizes: ["S", "M", "L"],
    img: "https://images.unsplash.com/photo-1551489186-cf8726f514f8?q=80&w=900&auto=format&fit=crop",
    imgAlt: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=900&auto=format&fit=crop",
    desc: "Chunky ribbed merino blend, cropped to hit at the waist. Soft against skin, structured in silhouette."
  },
  {
    id: "tailored-blazer",
    name: "Tailored Blazer",
    price: 260,
    category: "women",
    sizes: ["S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=900&auto=format&fit=crop",
    imgAlt: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop",
    desc: "Single-breasted, sharply shouldered, endlessly versatile. Cut from a fluid wool-blend suiting with a half-canvas construction."
  },
  {
    id: "column-skirt",
    name: "Pleated Column Skirt",
    price: 140,
    category: "women",
    sizes: ["S", "M", "L"],
    img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=900&auto=format&fit=crop",
    imgAlt: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=900&auto=format&fit=crop",
    desc: "Knife pleats pressed into a fluid crepe that catches light with every step. Elastic back waist for an effortless fit."
  },
  {
    id: "leather-tote",
    name: "Structured Leather Tote",
    price: 320,
    category: "accessories",
    sizes: ["One Size"],
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=900&auto=format&fit=crop",
    imgAlt: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=900&auto=format&fit=crop",
    desc: "Full-grain leather, hand-burnished edges and a suede-lined interior. Fits a 14-inch laptop and everything the day demands."
  },
  {
    id: "canvas-backpack",
    name: "Canvas Utility Backpack",
    price: 150,
    category: "accessories",
    sizes: ["One Size"],
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=900&auto=format&fit=crop",
    imgAlt: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=900&auto=format&fit=crop",
    desc: "Waxed canvas with matte black hardware, a padded 15-inch laptop sleeve and a weatherproof roll-top closure."
  },
  {
    id: "logo-cap",
    name: "Void Logo Cap",
    price: 60,
    category: "accessories",
    sizes: ["One Size"],
    img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=900&auto=format&fit=crop",
    imgAlt: "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=900&auto=format&fit=crop",
    desc: "Six-panel brushed cotton cap with tonal embroidery and an adjustable metal closure. The finishing touch, understated."
  },
  {
    id: "steel-watch",
    name: "Mono Steel Watch",
    price: 450,
    category: "accessories",
    sizes: ["One Size"],
    img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=900&auto=format&fit=crop",
    imgAlt: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=900&auto=format&fit=crop",
    desc: "Brushed 316L steel case, sapphire crystal and a Japanese automatic movement. No logo on the dial — only time."
  }
];

const CATEGORY_LABELS = { men: "Men", women: "Women", accessories: "Accessories" };
