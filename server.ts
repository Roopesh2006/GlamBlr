import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { LUX_SALONS } from "./src/data";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let supabase: any = null;
if (supabaseUrl && supabaseServiceKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false
      }
    });
    console.log("[Supabase Info] Client initialized with Service Role Key.");
  } catch (err) {
    console.error("[Supabase Error] Failed to initialize client:", err);
  }
} else if (supabaseUrl && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false
      }
    });
    console.log("[Supabase Info] Client initialized with Anon Key.");
  } catch (err) {
    console.error("[Supabase Error] Failed to initialize client with Anon:", err);
  }
}

// Path to file-backed lightweight database
const DB_PATH = path.join(process.cwd(), "db.json");

// Define Initial Salons to match data.ts
const INITIAL_SALONS = LUX_SALONS;

// Seed raw database with mock data if not existing
const loadDB = () => {
  const defaultTestimonials = [
    { id: "t1", name: "Kritika Hegde", role: "Vogue BLR Contributor", quote: "The Japanese Head Spa at Crown & Coat is pure, unadulterated high-end relaxation. GlamBlr has completely revolutionized how I book my weekend self-care routines.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100", area: "Whitefield", rating: 5 },
    { id: "t2", name: "Sameer Sen", role: "Indiranagar Resident", quote: "I booked the Sandalwood Shave at Gilded Groom. The coordinates were perfect, verification was seamless, and the single-malt coffee was amazing. Best luxury lounge platform.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100", area: "Indiranagar", rating: 5 },
    { id: "t3", name: "Priyanka Pai", role: "Mehendi Artist", quote: "Secured my bridal gold session through Maison de l’Or on GlamBlr. The 98% compatibility match from the DNA quiz was scarily accurate. Highly recommended!", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100", area: "Jayanagar", rating: 5 }
  ];

  const defaultCredentials = {
    "1": "shop1",
    "2": "shop2",
    "3": "shop3",
    "4": "shop4",
    "5": "shop5",
    "6": "shop6"
  };

  if (!fs.existsSync(DB_PATH)) {
    const data = {
      salons: INITIAL_SALONS,
      bookings: [],
      testimonials: defaultTestimonials,
      quizResults: [],
      credentials: defaultCredentials
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    const data = JSON.parse(raw);
    
    // Auto-migrate old generic salon lists to luxury catalog
    if (!data.salons || data.salons.length < INITIAL_SALONS.length || (data.salons[0] && data.salons[0].name === "Luxe Hair Studio")) {
      data.salons = INITIAL_SALONS;
    }

    if (!data.bookings) data.bookings = [];
    if (!data.testimonials || data.testimonials.length === 0) data.testimonials = defaultTestimonials;
    if (!data.quizResults) data.quizResults = [];
    if (!data.credentials) data.credentials = defaultCredentials;

    // Save upgraded structure back
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return data;
  } catch (err) {
    console.error("Database read error, recreating", err);
    const data = {
      salons: INITIAL_SALONS,
      bookings: [],
      testimonials: defaultTestimonials,
      quizResults: [],
      credentials: defaultCredentials
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
// API ENDPOINTS & SUPABASE SYNC LOGIC
// -------------------------------------------------------------

// Global config access for the React Client
app.get("/api/config", (req, res) => {
  res.json({
    googleMapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    emailjsServiceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
    emailjsTemplateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
    emailjsPublicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
    tallyFormId: process.env.NEXT_PUBLIC_TALLY_FORM_ID || "",
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916380691764",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  });
});

// Supabase Connection Status and Schema Builder Assistant endpoint
app.get("/api/supabase-status", async (req, res) => {
  if (!supabase) {
    return res.json({
      connected: false,
      reason: "No Supabase credentials detected in .env"
    });
  }

  try {
    const { error: salonsError } = await supabase.from("salons").select("id").limit(1);
    const { error: bookingsError } = await supabase.from("bookings").select("id").limit(1);

    res.json({
      connected: true,
      salonsTableOk: !salonsError || salonsError.code !== "PGRST116" && salonsError.message.indexOf("does not exist") === -1,
      bookingsTableOk: !bookingsError || bookingsError.code !== "PGRST116" && bookingsError.message.indexOf("does not exist") === -1,
      salonsError: salonsError ? salonsError.message : null,
      bookingsError: bookingsError ? bookingsError.message : null
    });
  } catch (err: any) {
    res.json({
      connected: false,
      reason: err.message || "Failed to query Supabase metadata"
    });
  }
});

// Active list of Salons (with background Supabase fetch fallback)
app.get("/api/salons", async (req, res) => {
  const db = loadDB();

  // Try fetching from Supabase to stay dynamically synced
  if (supabase) {
    try {
      const { data, error } = await supabase.from("salons").select("*");
      if (!error && data && data.length > 0) {
        // Update local memory
        db.salons = data;
        saveDB(db);
        return res.json(data);
      }
    } catch (e) {
      console.warn("[Supabase Read Alert] Fallback to local salons database mapping.");
    }
  }

  res.json(db.salons);
});

// Admin adds a salon
app.post("/api/salons", async (req, res) => {
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

  // Sync to Supabase cloud if active
  if (supabase) {
    try {
      const { error } = await supabase.from("salons").upsert(newSalon);
      if (error) {
        console.warn("[Supabase Sync Warning] Salons upsert failed. Ensure 'salons' table is setup on Supabase.", error.message);
      } else {
        console.log("[Supabase Sync] Salon upsert complete on Cloud DB:", newSalon.name);
      }
    } catch (err: any) {
      console.error("[Supabase Sync Error]", err.message);
    }
  }

  res.json({ success: true, salon: newSalon });
});

// Admin deletes a salon
app.delete("/api/salons/:id", async (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.salons = db.salons.filter((s: any) => s.id !== id);
  db.bookings = db.bookings.filter((b: any) => b.salonId !== id); // cascading clear bookings
  saveDB(db);

  // Sync delete to Supabase
  if (supabase) {
    try {
      await supabase.from("salons").delete().eq("id", id);
      await supabase.from("bookings").delete().eq("salonId", id);
      console.log("[Supabase Sync] Cascade deletes complete for salon:", id);
    } catch (err) {
      console.error("[Supabase Delete Sync Error]", err);
    }
  }

  res.json({ success: true });
});

// Update an existing salon (Open hours, Description, Specialties, Services, Offers)
app.put("/api/salons/:id", async (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const index = db.salons.findIndex((s: any) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Salon not found" });
  }

  // Overwrite specific modified parameters
  db.salons[index] = {
    ...db.salons[index],
    ...req.body
  };
  saveDB(db);

  // Sync to Supabase cloud if active
  if (supabase) {
    try {
      const { error } = await supabase.from("salons").upsert(db.salons[index]);
      if (error) {
        console.warn("[Supabase Sync Put Salon Warning]", error.message);
      } else {
        console.log("[Supabase Sync] Salon updated on Cloud DB:", db.salons[index].name);
      }
    } catch (err: any) {
      console.error("[Supabase Sync Put Salon Error]", err.message);
    }
  }

  res.json({ success: true, salon: db.salons[index] });
});

// Active Bookings list
app.get("/api/bookings", async (req, res) => {
  const db = loadDB();

  // Try reading from Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase.from("bookings").select("*").order("id", { ascending: false });
      if (!error && data) {
        db.bookings = data;
        saveDB(db);
        return res.json(data);
      }
    } catch (e) {
      console.warn("[Supabase Bookings Alert] Fallback to local booking listings mapping.");
    }
  }

  res.json(db.bookings);
});

// Client makes a booking
app.post("/api/bookings", async (req, res) => {
  const { signupMode, id, salonId, salonName, service, date, time, customerName, customerPhone } = req.body;

  if (!salonId || !service || !date || !time || !customerName || !customerPhone) {
    return res.status(400).json({ error: "Booking missing required parameters" });
  }

  const db = loadDB();
  const newBooking = {
    id: id || (String(Date.now()) + Math.floor(Math.random() * 100)),
    salonId,
    salonName,
    service,
    date,
    time,
    customerName,
    customerPhone,
    status: "confirmed"
  };

  db.bookings.unshift(newBooking);
  saveDB(db);

  // Sync booking insert to Supabase Cloud Database
  if (supabase) {
    try {
      const { error } = await supabase.from("bookings").insert(newBooking);
      if (error) {
        console.warn("[Supabase Sync Bookings Warning] Ensure 'bookings' table exists on Supabase with appropriate structure.", error.message);
      } else {
        console.log("[Supabase Sync Bookings] Client booking synchronised on Cloud:", newBooking.id);
      }
    } catch (err: any) {
      console.error("[Supabase Sync Bookings Error]", err.message);
    }
  }

  res.json({ success: true, booking: newBooking });
});

// Update Booking Status (Cancel, reschedule or change)
app.put("/api/bookings/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = loadDB();
  
  const booking = db.bookings.find((b: any) => b.id === id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  booking.status = status || booking.status;
  saveDB(db);

  // Sync to Supabase
  if (supabase) {
    try {
      const { error } = await supabase.from("bookings").update({ status: booking.status }).eq("id", id);
      if (error) {
        console.warn("[Supabase Sync Booking Update Alert]", error.message);
      } else {
        console.log("[Supabase Sync] Updated booking status on Cloud Database:", id);
      }
    } catch (err) {
      console.error("[Supabase Status Sync Error]", err);
    }
  }

  res.json({ success: true, booking });
});

// Delete Booking
app.delete("/api/bookings/:id", async (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.bookings = db.bookings.filter((b: any) => b.id !== id);
  saveDB(db);

  // Sync delete to Supabase
  if (supabase) {
    try {
      await supabase.from("bookings").delete().eq("id", id);
      console.log("[Supabase Sync Bookings Delete] Complete on Cloud DB:", id);
    } catch (err) {
      console.error("[Supabase Booking Delete Sync Error]", err);
    }
  }

  res.json({ success: true });
});


// -------------------------------------------------------------
// VERIFIED TESTIMONIALS ENDPOINTS (DYNAMICAL DATABASE INTEGRATED)
// -------------------------------------------------------------
app.get("/api/testimonials", async (req, res) => {
  const db = loadDB();

  // Try reading from Supabase table if active
  if (supabase) {
    try {
      const { data, error } = await supabase.from("testimonials").select("*").order("id", { ascending: false });
      if (!error && data && data.length > 0) {
        db.testimonials = data;
        saveDB(db);
        return res.json(data);
      }
    } catch (e) {
      console.warn("[Supabase Testimonials Sync Check Fallback]");
    }
  }

  res.json(db.testimonials || []);
});

app.post("/api/testimonials", async (req, res) => {
  const { name, role, quote, avatar, area, rating } = req.body;
  if (!name || !quote) {
    return res.status(400).json({ error: "Author Name and Quote text are required." });
  }

  const db = loadDB();
  const newTestimonial = {
    id: String(Date.now()),
    name,
    role: role || "Verified Guest",
    quote,
    avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
    area: area || "Bengaluru",
    rating: Number(rating) || 5
  };

  if (!db.testimonials) db.testimonials = [];
  db.testimonials.unshift(newTestimonial);
  saveDB(db);

  // Sync to Supabase Cloud
  if (supabase) {
    try {
      await supabase.from("testimonials").upsert(newTestimonial);
    } catch (err: any) {
      console.warn("[Supabase Sync Testimonials Warning]", err.message);
    }
  }

  res.json({ success: true, testimonial: newTestimonial });
});

app.delete("/api/testimonials/:id", async (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  if (db.testimonials) {
    db.testimonials = db.testimonials.filter((t: any) => t.id !== id);
    saveDB(db);
  }

  // Delete from Supabase
  if (supabase) {
    try {
      await supabase.from("testimonials").delete().eq("id", id);
    } catch (err: any) {
      console.warn("[Supabase Testimonials Delete Alert]", err.message);
    }
  }

  res.json({ success: true });
});


// -------------------------------------------------------------
// STYLE QUIZ SUBMISSIONS / DNA AUDITS ENDPOINTS (FULL DATABASE BACKED)
// -------------------------------------------------------------
app.get("/api/quiz-results", async (req, res) => {
  const db = loadDB();

  // Try reading from Supabase if connected
  if (supabase) {
    try {
      const { data, error } = await supabase.from("quiz_results").select("*").order("id", { ascending: false });
      if (!error && data) {
        db.quizResults = data;
        saveDB(db);
        return res.json(data);
      }
    } catch (e) {
      console.warn("[Supabase Quiz Results Sync Fallback]");
    }
  }

  res.json(db.quizResults || []);
});

app.post("/api/quiz-results", async (req, res) => {
  const { title, description, vibe, concern, budget, area, matchedSalons } = req.body;
  const db = loadDB();
  const newSubmission = {
    id: String(Date.now()) + Math.floor(Math.random() * 100),
    title: title || "Glow Devotee",
    description: description || "Analyzing custom style parameters...",
    vibe: vibe || "Natural Glow",
    concern: concern || "Damage repair",
    budget: budget || "₹₹₹",
    area: area || "Anywhere",
    matchedSalons: matchedSalons || [],
    timestamp: new Date().toISOString()
  };

  if (!db.quizResults) db.quizResults = [];
  db.quizResults.unshift(newSubmission);
  saveDB(db);

  // Sync to Supabase
  if (supabase) {
    try {
      await supabase.from("quiz_results").insert(newSubmission);
    } catch (err: any) {
      console.warn("[Supabase Quiz Results Sync Insertion Warning]", err.message);
    }
  }

  res.json({ success: true, result: newSubmission });
});

app.delete("/api/quiz-results/:id", async (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  if (db.quizResults) {
    db.quizResults = db.quizResults.filter((q: any) => q.id !== id);
    saveDB(db);
  }

  // Delete from Supabase
  if (supabase) {
    try {
      await supabase.from("quiz_results").delete().eq("id", id);
    } catch (err: any) {
      console.warn("[Supabase Quiz Result Sync Delete Warning]", err.message);
    }
  }

  res.json({ success: true });
});


// -------------------------------------------------------------
// SECURE SHOP PASSWORD / CREDENTIALS MANAGEMENT
// -------------------------------------------------------------
app.get("/api/credentials", (req, res) => {
  const db = loadDB();
  res.json(db.credentials || {});
});

app.post("/api/credentials", (req, res) => {
  const { salonId, password } = req.body;
  if (!salonId || !password) {
    return res.status(400).json({ error: "salonId and password parameters are required." });
  }

  const db = loadDB();
  if (!db.credentials) db.credentials = {};
  db.credentials[salonId] = password;
  saveDB(db);

  res.json({ success: true, credentials: db.credentials });
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
