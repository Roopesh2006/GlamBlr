import { GoogleGenAI } from "@google/genai";
import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to file-backed lightweight database
const DB_PATH = path.join(process.cwd(), "db.json");

// Define Initial Salons to match data.ts
const INITIAL_SALONS = [
  {
    id: "1",
    name: "Maison de l’Or",
    area: "Indiranagar",
    rating: 4.9,
    reviewCount: 342,
    priceRange: "₹₹₹₹",
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800"
    ],
    services: [
      { name: "Balayage & Couture Toning", price: 9500, duration: "180 mins", category: "Hair" },
      { name: "Kérastase Chronologiste Caviar Rite", price: 6500, duration: "90 mins", category: "Hair" },
      { name: "Bridal Glow-Up Signature Makeup", price: 25000, duration: "240 mins", category: "Bridal" },
      { name: "Caviar Radiance Luxury Facial", price: 7500, duration: "75 mins", category: "Skin" },
      { name: "Nail extensions with 24K Gold Leaf", price: 4500, duration: "90 mins", category: "Nails" }
    ],
    openHours: "09:00 AM - 09:00 PM",
    specialties: ["French Balayage", "Hair Botox", "High-End Bridal Makeup"],
    isLuxury: true,
    isFeatured: true,
    description: "Nestled in the upscale heart of Indiranagar, Maison de l’Or is Bangalore’s premier salon sanctuary. Drawing inspiration from luxury Parisian boudoirs, we deliver absolute perfection using premium elixir treatments, custom color diagnostics, and master-crafted styles.",
    reviewsCount: 342,
    reviews: [
      { id: "r1", author: "Ananya Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150", rating: 5, text: "The absolute pinnacle of luxury. The gold leaf manicures and Kérastase rituals are unmatched. Truly world-class services!", date: "2 days ago", area: "Indiranagar" }
    ]
  },
  {
    id: "2",
    name: "Aura Premium Wellness",
    area: "Koramangala",
    rating: 4.8,
    reviewCount: 218,
    priceRange: "₹₹₹",
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800"
    ],
    services: [
      { name: "Luxury Deep Tissue Massage", price: 4800, duration: "90 mins", category: "Spa" },
      { name: "HydraFacial Platinum Glow", price: 6200, duration: "60 mins", category: "Skin" },
      { name: "Aroma Infused Steam & Soak", price: 3000, duration: "45 mins", category: "Spa" }
    ],
    openHours: "10:00 AM - 08:30 PM",
    specialties: ["Luxury Spa Treatments", "HydraFacials", "Collagen Therapies"],
    isLuxury: true,
    isFeatured: true,
    description: "Aura Premium Wellness offers a transcendent escape from the city’s concrete noise. Unwind in private state-of-the-art therapist rooms with customizable aromatherapy profiles, state-of-the-art oxygen-infused showers, and elite skincare solutions.",
    reviewsCount: 218,
    reviews: []
  },
  {
    id: "3",
    name: "Gilded Groom Barbers",
    area: "Whitefield",
    rating: 4.7,
    reviewCount: 154,
    priceRange: "₹₹",
    images: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800"
    ],
    services: [
      { name: "Sandalwood Razor Beard Sculpt", price: 1800, duration: "45 mins", category: "Grooming" },
      { name: "Charcoal Charcoal Hair Restoration", price: 3500, duration: "60 mins", category: "Grooming" }
    ],
    openHours: "08:00 AM - 10:00 PM",
    specialties: ["Sandalwood Edge Shave", "Elite Hair Scapes", "Nose & Ears Waxing"],
    isLuxury: true,
    isFeatured: true,
    description: "Located within the tech corridor of Whitefield, Gilded Groom Barbers provides state-of-the-art executive aesthetics. Relax in genuine vintage leather chairs while our certified master barbers sculpt coordinates utilizing fine high-gravity sandalwood oils.",
    reviewsCount: 154,
    reviews: []
  },
  {
    id: "4",
    name: "The Indigo Alchemist",
    area: "Jayanagar",
    rating: 4.95,
    reviewCount: 98,
    priceRange: "₹₹₹",
    images: [
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=800"
    ],
    services: [
      { name: "Japanese Head Spa & Therapy", price: 4200, duration: "75 mins", category: "Spa" },
      { name: "Organic Root Pigmentation", price: 5800, duration: "120 mins", category: "Hair" }
    ],
    openHours: "09:30 AM - 08:30 PM",
    specialties: ["Japanese Head Massage", "Balayage Artisanry", "Organic Infusions"],
    isLuxury: true,
    isFeatured: false,
    description: "Nestled among green, historical Jayanagar, The Indigo Alchemist is a haven for plant-derived premium restoration and slow fashion hair. We use only biological active elixirs alongside traditional East Asian scalp micro-steamers.",
    reviewsCount: 98,
    reviews: []
  },
  {
    id: "5",
    name: "Crown & Coat Salon",
    area: "HSR Layout",
    rating: 4.65,
    reviewCount: 76,
    priceRange: "₹₹",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800"
    ],
    services: [
      { name: "Keratin Deep Repair Cure", price: 3200, duration: "90 mins", category: "Hair" },
      { name: "Royal Shellac Metallic Gel Art", price: 1500, duration: "45 mins", category: "Nails" }
    ],
    openHours: "10:00 AM - 09:00 PM",
    specialties: ["Keratin Restoration", "Gold Gel Overlay", "Duo Quick Shifting"],
    isLuxury: true,
    isFeatured: false,
    description: "Welcome to HSR Layout’s premium quick-curated salon experience. Our focus at Crown & Coat is delivering elite beauty coordinates for busy professionals. Walk in exhausted, leave radiant in under ninety minutes.",
    reviewsCount: 76,
    reviews: []
  },
  {
    id: "6",
    name: "Maison de l'Homme",
    area: "Banaswadi",
    rating: 4.88,
    reviewCount: 112,
    priceRange: "₹₹₹",
    images: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800"
    ],
    services: [
      { name: "Elite Haircut & Scalp Detox", price: 2200, duration: "60 mins", category: "Grooming" },
      { name: "Hot Stone Stress Melting Ritual", price: 4500, duration: "90 mins", category: "Spa" }
    ],
    openHours: "09:00 AM - 09:00 PM",
    specialties: ["Scalp Micro-Detox", "Sandalwood Beard Scalp", "Japanese Head Spa"],
    isLuxury: true,
    isFeatured: false,
    description: "Maison de l'Homme is a boutique luxury concept sanctuary specifically for executive male beauty and grooming in Banaswadi. Complete with high-contrast obsidian backplanes, comfortable leather pods, and premium single-malt tasting logs.",
    reviewsCount: 112,
    reviews: []
  }
];

// Seed raw database with mock data if not existing
const loadDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    const data = {
      salons: INITIAL_SALONS,
      bookings: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Database read error, recreating", err);
    const data = {
      salons: INITIAL_SALONS,
      bookings: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
};

const saveDB = (data: any) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
};

// Warm initialization
loadDB();

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// Active list of Salons
app.get("/api/salons", (req, res) => {
  const db = loadDB();
  res.json(db.salons);
});

// Admin adds a salon
app.post("/api/salons", (req, res) => {
  const { name, area, priceRange, description, openHours, specialties, services, images } = req.body;
  
  if (!name || !area) {
    return res.status(400).json({ error: "Salon Name and Area are required" });
  }

  const db = loadDB();
  const newSalon = {
    id: String(Date.now()),
    name,
    area,
    rating: 5.0, // default new salon to pristine 5 stars
    reviewCount: 1,
    priceRange: priceRange || "₹₹₹",
    images: images && images.length ? images : ["https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800"],
    services: services || [],
    openHours: openHours || "09:00 AM - 09:00 PM",
    specialties: specialties || [],
    isLuxury: true,
    isFeatured: false,
    description: description || `Welcome to ${name} in ${area}, Bangalore's newly listed premium sanctuary.`,
    reviewsCount: 1,
    reviews: []
  };

  db.salons.push(newSalon);
  saveDB(db);
  res.json({ success: true, salon: newSalon });
});

// Admin deletes a salon
app.delete("/api/salons/:id", (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.salons = db.salons.filter((s: any) => s.id !== id);
  db.bookings = db.bookings.filter((b: any) => b.salonId !== id); // cascading clear bookings
  saveDB(db);
  res.json({ success: true });
});

// Active Bookings list
app.get("/api/bookings", (req, res) => {
  const db = loadDB();
  res.json(db.bookings);
});

// Client makes a booking
app.post("/api/bookings", (req, res) => {
  const { salonId, salonName, service, date, time, customerName, customerPhone } = req.body;

  if (!salonId || !service || !date || !time || !customerName || !customerPhone) {
    return res.status(400).json({ error: "Booking missing required parameters" });
  }

  const db = loadDB();
  const newBooking = {
    id: String(Date.now()) + Math.floor(Math.random() * 100),
    salonId,
    salonName,
    service,
    date,
    time,
    customerName,
    customerPhone,
    status: "confirmed"
  };

  db.bookings.push(newBooking);
  saveDB(db);
  res.json({ success: true, booking: newBooking });
});

// Update Booking Status (Cancel, reschedule or change)
app.put("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = loadDB();
  
  const booking = db.bookings.find((b: any) => b.id === id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  booking.status = status || booking.status;
  saveDB(db);
  res.json({ success: true, booking });
});

// Delete Booking
app.delete("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.bookings = db.bookings.filter((b: any) => b.id !== id);
  saveDB(db);
  res.json({ success: true });
});

// -------------------------------------------------------------
// CHATBOT WITH GEMINI
// -------------------------------------------------------------
app.post("/api/chat", async (req, res) => {
  const { message, chatHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      // Graceful local fallback if Gemini key is not set up
      return res.json({
        reply: `✦ Welcome to GlamBlr Concierge! I'm running in localized secure offline mode. You can find beautiful luxury slots in Indiranagar, Koramangala or Whitefield. Our flagship is Maison de l'Or! (Configure GEMINI_API_KEY for dynamic boutique AI conversations)`
      });
    }

    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });

    const db = loadDB();
    const salonsSummary = db.salons.map((s: any) => (
      `- ${s.name} (ID: ${s.id}) in ${s.area}. Specialties: ${s.specialties.join(", ")}. Price: ${s.priceRange}. Open: ${s.openHours}.`
    )).join("\n");

    const systemInstruction = `
      You are the dynamic "GlamBlr Royal AI Concierge", a high-fashion, ultra-composed boutique styling advisor for Bangalore's absolute elite salon marketplace.
      Your tone is sophisticated, elegant, respectful, yet extremely engaging and direct. Use royal phrases, botanical/sensory descriptions (e.g. sandalwood, gold leaf, obsidian glaze), but keep the replies reasonably concise (1-3 short paragraphs max).
      
      Here is the live, real-time list of luxury salons registered on GlamBlr today:
      ${salonsSummary}

      Guidelines:
      1. Guide the luxury patron to the best salon for their aesthetic wishes.
      2. If they ask about Balayage, suggest Maison de l'Or. Japanese Head Spa: suggest The Indigo Alchemist or Aura Premium. Executive masculine/beard grooming: Gilded Groom Barbers.
      3. Be highly helpful about specific areas (Indiranagar, Koramangala, Whitefield, Jayanagar, HSR, Banaswadi).
      4. Always format your responses elegantly with asterisks and bullets. Do not speak like an artificial computer. Introduce yourself dynamically as GlamBlr's Concierge.
    `;

    // Format chat history for Gemini API
    const formattedContents = chatHistory ? chatHistory.map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    })) : [];

    // Append the current message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const geminiRes = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = geminiRes.text || "I am currently meditating on standard fragrance oils. Could you repeat that, my dear?";
    res.json({ reply });

  } catch (err: any) {
    console.error("Gemini API server-route error:", err);
    res.status(500).json({ error: "Failed to query AI, please try again." });
  }
});

// -------------------------------------------------------------
// VITE OR STATIC SERVING MIDDLEWARE
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Mount Vite Dev Server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Assets Static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[GlamBlr Platform] Full-stack engine running on http://localhost:${PORT}`);
  });
}

startServer();
