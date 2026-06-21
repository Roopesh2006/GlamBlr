import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Compass, MapPin, Smile, Flame, Play, ArrowRight, Heart, Award, CalendarCheck, HelpCircle, Star, Quote, RefreshCw } from 'lucide-react';

// Core imports
import { Salon, Service, Booking } from './types';
import { LUX_SALONS } from './data';
import ParticleField from './components/3d/ParticleField';
import HeroScene from './components/3d/HeroScene';
import StatsSection from './components/sections/StatsSection';
import StyleQuiz from './components/StyleQuiz';
import BookingModal from './components/BookingModal';
import SalonCard from './components/SalonCard';
import BookingsDrawer from './components/BookingsDrawer';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ExploreLounge from './components/ExploreLounge';
import SalonDetail from './components/SalonDetail';
import SalonLobby from './components/3d/SalonLobby';

// New luxury overlays and integrations
import VideoScrollHero from './components/VideoScrollHero';
import InteractiveMap from './components/InteractiveMap';
import ConciergeChatBot from './components/ConciergeChatBot';
import AdminPortal from './components/AdminPortal';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'explore' | 'salon-detail'>('home');
  const [selectedSalonId, setSelectedSalonId] = useState<string | null>(null);

  // Real-time server-synced parameters
  const [salons, setSalons] = useState<Salon[]>(LUX_SALONS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  
  // Custom global light/dark theme toggle
  const [appDarkMode, setAppDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('glamblr_darkmode');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const toggleDarkMode = () => {
    setAppDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('glamblr_darkmode', String(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };
  
  // Modal states
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  
  // Booking flow inputs
  const [bookingSalon, setBookingSalon] = useState<Salon | null>(null);
  const [bookingService, setBookingService] = useState<Service | undefined>(undefined);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Initial queries passed into explore page
  const [initialExploreSearchQuery, setInitialExploreSearchQuery] = useState('');
  
  // Trigger loaders for bookings
  const [bookingsRefreshToggle, setBookingsRefreshToggle] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);

  // Time of Day Greeting State
  const [timeOfDayGreeting, setTimeOfDayGreeting] = useState("Hello, Beautiful ✦");

  // Direct marketplace search parameters
  const [heroSearchArea, setHeroSearchArea] = useState('All');
  const [heroSearchService, setHeroSearchService] = useState('All');
  const [heroSearchPrice, setHeroSearchPrice] = useState('All');

  // Fetch salons and reservation logs from fullstack backend
  const fetchSalonsAndBookings = async () => {
    try {
      const resSalons = await fetch('/api/salons');
      if (resSalons.ok) {
        const dataSalons = await resSalons.json();
        setSalons(dataSalons);
      }
      const resBookings = await fetch('/api/bookings');
      if (resBookings.ok) {
        const dataBookings = await resBookings.json();
        setBookings(dataBookings);
        setBookingsCount(dataBookings.length);
      }
    } catch (err) {
      console.error("Error loading server-synced parameters:", err);
    }
  };

  useEffect(() => {
    // Calculated Greeting
    const hours = new Date().getHours();
    if (hours < 12) {
      setTimeOfDayGreeting("Good Morning, Beautiful ✦");
    } else if (hours < 17) {
      setTimeOfDayGreeting("Good Afternoon, Beautiful ✦");
    } else {
      setTimeOfDayGreeting("Good Evening, Beautiful ✦");
    }

    // Load initial listings & sets interval poll to sync queues
    fetchSalonsAndBookings();
    const interval = setInterval(fetchSalonsAndBookings, 8000);

    return () => clearInterval(interval);
  }, [bookingsRefreshToggle]);

  // Synchronize dark mode state to document root for global components and styles
  useEffect(() => {
    const root = document.documentElement;
    if (appDarkMode) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, [appDarkMode]);

  const updateBookingsCount = () => {
    try {
      const saved = localStorage.getItem('glamblr_bookings');
      if (saved) {
        const bookingsList = JSON.parse(saved);
        setBookingsCount(bookingsList.length);
      } else {
        setBookingsCount(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Safe navigation wrapper
  const navigateTo = (page: 'home' | 'explore' | 'salon-detail', searchQuery: string = '', resetHeroFilters: boolean = false) => {
    setInitialExploreSearchQuery(searchQuery);
    if (resetHeroFilters) {
      setHeroSearchArea('All');
      setHeroSearchService('All');
      setHeroSearchPrice('All');
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Retrieve active selected salon object
  const activeSalon = useMemo(() => {
    if (!selectedSalonId) return null;
    return salons.find((s) => s.id === selectedSalonId) || null;
  }, [selectedSalonId, salons]);

  // Handle direct "Book Now" clicked on cards
  const handleOpenBooking = (salon: Salon, service?: Service) => {
    setBookingSalon(salon);
    setBookingService(service);
    setBookingModalOpen(true);
  };

  // Category Quick Select Data
  const categoriesList = [
    { label: 'Traditional Bridal', value: 'bridal', count: 'Sabysachi & HD Artistry', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=150' },
    { label: 'Couture Coloring', value: 'hair', count: 'French Balayage & Glaze', img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=150' },
    { label: 'Japanese Head Spa', value: 'spa', count: 'Thai & Steam Compress', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=150' },
    { label: 'Keratin Revive', value: 'hair', count: 'Silk Protein restructure', img: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=150' },
    { label: 'Chromium Nail Art', value: 'nails', count: 'Acrylic & 24K gold foil', img: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=150' },
    { label: 'Executive Grooming', value: 'grooming', count: 'Sandalwood razor sculpts', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=150' }
  ];

  // Testimonials Review quotes
  const localTestimonials = [
    { name: 'Kritika Hegde', role: 'Vogue BLR Contributor', quote: 'The Japanese Head Spa at Crown & Coat is pure, unadulterated high-end relaxation. GlamBlr has completely revolutionized how I book my weekend self-care routines.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', area: 'Whitefield', rating: 5 },
    { name: 'Sameer Sen', role: 'Indiranagar Resident', quote: 'I booked the Sandalwood Shave at Gilded Groom. The coordinates were perfect, verification was seamless, and the single-malt coffee was amazing. Best luxury lounge platform.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', area: 'Indiranagar', rating: 5 },
    { name: 'Priyanka Pai', role: 'Mehendi Artist', quote: 'Secured my bridal gold session through Maison de l’Or on GlamBlr. The 98% compatibility match from the DNA quiz was scarily accurate. Highly recommended!', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', area: 'Jayanagar', rating: 5 }
  ];

  return (
    <div className={`relative min-h-screen selection:bg-[#D4AF37] selection:text-black transition-colors duration-300 ${
      appDarkMode ? 'bg-[#0E0E15] text-[#FCFAF7] dark' : 'text-[#1E1A17] bg-[#FBF9F4]'
    }`}>
      
      {/* 1. IMMERSIVE FIXED PARTICLE FIELD GROUND */}
      <ParticleField />

      {/* 2. NAVIGATION BAR LAYER */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => navigateTo(page as any, '')}
        onOpenQuiz={() => setIsQuizOpen(true)}
        bookingsCount={bookingsCount}
        onOpenBookingsDrawer={() => setIsBookingsOpen(true)}
        appDarkMode={appDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenPartners={() => setIsAdminPortalOpen(true)}
      />

      {/* 3. MAIN SWAP ROUTING SECTIONS */}
      {currentPage === 'home' && (
        <div className="animate-fadeIn">
          
          {/* [A] CINEMATIC VIDEO SCROLL HERO */}
          <VideoScrollHero
            onExploreClick={() => {
              const target = document.getElementById('discovery_lounge_anchor');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onJoinClick={() => setIsAdminPortalOpen(true)}
            appDarkMode={appDarkMode}
          />

          {/* [B] CORE MARKETPLACE CONSOLE & SEARCH BLOCK */}
          <section id="discovery_lounge_anchor" className="relative py-12 z-10">
            <div className="max-w-4xl mx-auto px-6">
              
              {/* HIGH UTILITY SLOTS SEARCH CONSOLE (The Marketplace Core) */}
              <div className="bg-white dark:bg-[#161625] border border-[#E1DBCE] dark:border-indigo-950 rounded-2xl p-6 md:p-8 space-y-5 shadow-lg dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
                  <span className="text-[10.5px] font-mono text-[#A07D1A] dark:text-amber-400 font-extrabold tracking-widest uppercase">
                    ⚡ Secure Real-Time Reservation
                  </span>
                  <span className="self-start px-2 py-0.5 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/25 rounded text-[9px] font-mono font-extrabold uppercase tracking-widest">
                    🟢 142 Slots Ready Today
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Location drop-selector */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[9.5px] font-mono uppercase tracking-widest text-[#A07D1A] dark:text-amber-500 font-extrabold">
                      Location / Area
                    </label>
                    <select 
                      value={heroSearchArea} 
                      onChange={(e) => setHeroSearchArea(e.target.value)}
                      className="bg-white dark:bg-[#1C1C2D] border border-[#E1DBCE] dark:border-indigo-950/80 hover:border-[#A07D1A] dark:hover:border-amber-400 rounded-lg p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="All" className="text-slate-800 dark:bg-[#12121E]">Bengaluru (All Areas)</option>
                      <option value="Indiranagar" className="text-slate-800 dark:bg-[#12121E]">Indiranagar</option>
                      <option value="Koramangala" className="text-slate-800 dark:bg-[#12121E]">Koramangala</option>
                      <option value="Whitefield" className="text-slate-800 dark:bg-[#12121E]">Whitefield</option>
                      <option value="Jayanagar" className="text-slate-800 dark:bg-[#12121E]">Jayanagar</option>
                      <option value="HSR Layout" className="text-slate-800 dark:bg-[#12121E]">HSR Layout</option>
                      <option value="Banaswadi" className="text-slate-800 dark:bg-[#12121E]">Banaswadi</option>
                    </select>
                  </div>

                  {/* Service/Specialty category drop-selector */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[9.5px] font-mono uppercase tracking-widest text-[#A07D1A] dark:text-amber-500 font-extrabold">
                      Specialty Care
                    </label>
                    <select 
                      value={heroSearchService} 
                      onChange={(e) => setHeroSearchService(e.target.value)}
                      className="bg-white dark:bg-[#1C1C2D] border border-[#E1DBCE] dark:border-indigo-950/80 hover:border-[#A07D1A] dark:hover:border-amber-400 rounded-lg p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="All" className="text-slate-800 dark:bg-[#12121E]">All Specialties</option>
                      <option value="Hair" className="text-slate-800 dark:bg-[#12121E]">Hair (Balayage/Botox)</option>
                      <option value="Skin" className="text-slate-800 dark:bg-[#12121E]">Skin (Facial/Clinic)</option>
                      <option value="Nails" className="text-slate-800 dark:bg-[#12121E]">Nails (Art/Ext)</option>
                      <option value="Bridal" className="text-slate-800 dark:bg-[#12121E]">Traditional Bridal</option>
                      <option value="Spa" className="text-slate-800 dark:bg-[#12121E]">Spa (Japanese Head Spa)</option>
                      <option value="Grooming" className="text-slate-800 dark:bg-[#12121E]">Executive Grooming</option>
                    </select>
                  </div>

                  {/* Price quotient drop-selector */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[9.5px] font-mono uppercase tracking-widest text-[#A07D1A] dark:text-amber-500 font-extrabold">
                      Prestige Tier
                    </label>
                    <select 
                      value={heroSearchPrice} 
                      onChange={(e) => setHeroSearchPrice(e.target.value)}
                      className="bg-white dark:bg-[#1C1C2D] border border-[#E1DBCE] dark:border-indigo-950/80 hover:border-[#A07D1A] dark:hover:border-amber-400 rounded-lg p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="All" className="text-slate-800 dark:bg-[#12121E]">All Budgets</option>
                      <option value="₹₹" className="text-slate-800 dark:bg-[#12121E]">Signature (₹₹)</option>
                      <option value="₹₹₹" className="text-slate-800 dark:bg-[#12121E]">Premium (₹₹₹)</option>
                      <option value="₹₹₹₹" className="text-slate-800 dark:bg-[#12121E]">Ultra Luxury (₹₹₹₹)</option>
                    </select>
                  </div>

                </div>

                {/* Search Slot button triggers navigation */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="text-[10px] text-[#A07D1A] dark:text-amber-500/80 italic font-mono text-left leading-relaxed max-w-sm">
                    🔒 Zero platform surcharges. All bookings backed by Direct Parity price guarantee.
                  </span>
                  <button
                    onClick={() => navigateTo('explore')}
                    className="px-6 py-3.5 bg-[#A07D1A] hover:bg-[#805C06] dark:bg-amber-400 dark:text-slate-900 dark:hover:bg-white text-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:scale-[1.02] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 font-mono"
                  >
                    Search Live Slots <ArrowRight className="w-4 h-4 text-white dark:text-slate-900 shrink-0" />
                  </button>
                </div>
              </div>

              {/* Brand trust credits */}
              <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-6 text-[10.5px] font-mono text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider">
                <span>⭐⭐⭐⭐⭐ 1,200 Verified Audits</span>
                <span>•</span>
                <span>🛡️ 100% Secure Checkout</span>
                <span>•</span>
                <span>⚡ Instant API Cal Sync</span>
              </div>

            </div>
          </section>

          {/* [B] BRAND TICKER OVERFLOW COCOON */}
          <section id="scrolling_brand_cocoon" className="relative py-8 bg-[#FAF6F0] dark:bg-[#12121F] border-y border-[#E1DBCE] dark:border-indigo-950/60 z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center gap-6 justify-between">
              <span className="text-[10px] font-mono text-[#A07D1A] dark:text-amber-500 uppercase tracking-[0.25em] font-extrabold shrink-0">
                Lounge Affiliates:
              </span>
              <div className="flex-1 overflow-hidden relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
                <div className="animate-marquee whitespace-nowrap flex gap-12 text-xs font-serif font-semibold tracking-[0.18em] italic text-[#5C534C]/70 dark:text-slate-400/70">
                  <span>CHANEL LUXE BEAUTÉ</span>
                  <span>DIOR PRIVE COUTURE</span>
                  <span>KÉRASTASE CHRONOLOGISTE</span>
                  <span>SABYASACHI BRIDAL BRANDS</span>
                  <span>DYSON PROFESSIONAL ELITE</span>
                  <span>HUDA BEAUTY METALLIC</span>
                  <span>NYKKA BLACK LABEL PLATINUM</span>
                  {/* Duplicate for infinite loop */}
                  <span>CHANEL LUXE BEAUTÉ</span>
                  <span>DIOR PRIVE COUTURE</span>
                  <span>KÉRASTASE CHRONOLOGISTE</span>
                  <span>SABYASACHI BRIDAL BRANDS</span>
                  <span>DYSON PROFESSIONAL ELITE</span>
                  <span>HUDA BEAUTY METALLIC</span>
                  <span>NYKKA BLACK LABEL PLATINUM</span>
                </div>
              </div>
            </div>
          </section>

          {/* [C] CATEGORY QUICK SELECT H-SCROLL */}
          <section id="category_quick_select" className="relative py-16 px-6 max-w-7xl mx-auto z-10 text-left space-y-6">
            <div className="flex flex-col sm:flex-row items-baseline justify-[#A07D1A] justify-between gap-2 border-b border-[#E1DBCE] dark:border-indigo-950/50 pb-2.5">
              <div>
                <span className="text-[10px] text-[#A07D1A] dark:text-amber-500 tracking-[0.25em] font-bold block uppercase">Bespoke Categories</span>
                <h3 className="font-serif italic text-2xl md:text-3xl text-[#1E1A17] dark:text-white font-semibold">Discovery Quick Select</h3>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 leading-none shrink-0 italic">Swipe to browse curation menu →</span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin select-category-row">
              {categoriesList.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => navigateTo('explore', cat.value)}
                  className="group relative flex-col shrink-0 w-44 bg-white dark:bg-[#12121E] border border-[#E1DBCE] dark:border-indigo-950/50 hover:border-[#A07D1A] dark:hover:border-amber-500 rounded-2xl p-4 text-left transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer hover:shadow-xs block"
                >
                  <img src={cat.img} alt={cat.label} className="w-10 h-10 object-cover rounded-xl border border-slate-100 dark:border-indigo-950/20 mb-3 group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  <div className="font-serif italic text-sm font-bold text-[#1E1A17] dark:text-[#FCFAF7] group-hover:text-[#A07D1A] dark:group-hover:text-amber-400 transition-colors">{cat.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{cat.count}</div>
                  <ArrowRight className="absolute right-4 bottom-4 w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-[#A07D1A] dark:group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </section>

          {/* [K] COUTURE 3D LOBBY TOUR PORTAL */}
          <SalonLobby 
            appDarkMode={appDarkMode} 
            onToggleDarkMode={toggleDarkMode} 
          />

          {/* [D] FEATURED SALONS GRID */}
          <section id="featured_salons" className="relative py-16 px-6 max-w-7xl mx-auto z-10 text-left space-y-8">
            <div className="flex items-end justify-between border-b border-[#E1DBCE] dark:border-indigo-950/50 pb-3">
              <div>
                <span className="text-[10px] text-[#A07D1A] dark:text-amber-500 tracking-[0.25em] font-bold block uppercase">Hand-audited Curation</span>
                <h3 className="font-serif italic text-2xl md:text-3xl text-[#1E1A17] dark:text-white font-semibold">Featured Lounges</h3>
              </div>
              <button
                onClick={() => navigateTo('explore')}
                className="text-xs uppercase tracking-widest text-[#A07D1A] dark:text-amber-500 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                View All Lounges <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {salons.filter((s) => s.isFeatured).slice(0, 6).map((salon) => (
                <SalonCard
                  key={salon.id}
                  salon={salon}
                  onSelect={(id) => {
                    setSelectedSalonId(id);
                    setCurrentPage('salon-detail');
                    window.scrollTo({ top: 0 });
                  }}
                  onBookNow={(s) => handleOpenBooking(s)}
                />
              ))}
            </div>
          </section>

          {/* [MAP] INTERACTIVE LUXURY BENGALURU MAP */}
          <section id="interactive_lounge_cartography" className="relative py-16 px-6 max-w-7xl mx-auto z-10 text-left space-y-6">
            <div className="border-b border-[#E1DBCE] dark:border-indigo-950/50 pb-3">
              <span className="text-[10px] text-[#A07D1A] dark:text-amber-500 tracking-[0.25em] font-bold block uppercase">Cartography Lounge Grid</span>
              <h3 className="font-serif italic text-2xl md:text-4xl text-[#1E1A17] dark:text-white font-semibold">Bengaluru Interactive Salon Coordinates</h3>
            </div>
            <InteractiveMap
              salons={salons}
              onSelectSalon={(id) => {
                setSelectedSalonId(id);
                setCurrentPage('salon-detail');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBookNow={(s) => handleOpenBooking(s)}
              appDarkMode={appDarkMode}
            />
          </section>

          {/* [OP] REAL WORLD MARKETPLACE OPERATIONS CONTROL CENTER (Solving authentic user search & routing pain points!) */}
          <section id="marketplace_operations" className="relative py-16 px-6 max-w-7xl mx-auto z-10 text-left space-y-10">
            <div className="space-y-2 border-b border-[#E1DBCE] dark:border-indigo-950/50 pb-3">
              <span className="text-[10px] text-[#A07D1A] dark:text-amber-500 tracking-[0.25em] font-bold block uppercase">
                🚀 Dynamic Operational Intelligence
              </span>
              <h3 className="font-serif italic text-2xl md:text-4xl text-[#1E1A17] dark:text-white font-semibold">
                Bengaluru Marketplace Operations
              </h3>
              <p className="text-xs text-[#5C534C] dark:text-slate-400 max-w-2xl leading-relaxed">
                We don't just list addresses; we actively bridge service-level agreements (SLAs), pricing parity guarantees, and relocation matrices so you have total autonomy.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              
              {/* Op Module 1: Artist Relocation ledger */}
              <div className="bg-white dark:bg-[#12121E] border border-[#E1DBCE] dark:border-indigo-950/55 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-2xs">
                <div className="space-y-1.5 text-left">
                  <div className="w-9 h-9 rounded-lg bg-[#A07D1A]/10 flex items-center justify-center text-[#A07D1A] dark:text-amber-400 mb-1 font-bold">
                    👥
                  </div>
                  <h4 className="font-serif italic text-lg font-bold text-[#1E1A17] dark:text-white">
                    Star Stylist Tracker
                  </h4>
                  <p className="text-[11.5px] text-[#5C534C] dark:text-slate-400 leading-normal">
                    Elite designers shift salons frequently. Secure appointment access directly at their true, verified active lounges.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Master Vivek K.', skill: 'French Balayage', prev: 'Bounce Salon', curr: 'Gilded Groom', code: 'royal_hair' },
                    { name: 'Maestra Priyanka', skill: 'Bridal Heritage', prev: 'Play Salon', curr: 'Maison de l’Or', code: 'bridal_boudoir' },
                    { name: 'Dr. Kritika S.', skill: 'Trichology Scan', prev: 'Independent', curr: 'Crown & Coat', code: 'medspa_scalp' }
                  ].map((lead, index) => (
                    <div key={index} className="flex items-center justify-between p-2.5 bg-[#FAF7F2] dark:bg-[#161625] border border-[#E1DBCE]/60 dark:border-indigo-950/45 text-xs">
                      <div>
                        <div className="font-serif italic font-bold text-slate-800 dark:text-slate-200 leading-tight">{lead.name}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">{lead.skill} • was at {lead.prev}</div>
                      </div>
                      <button 
                        onClick={() => navigateTo('explore', lead.curr)}
                        className="text-[10px] font-mono text-[#A07D1A] dark:text-amber-400 font-extrabold hover:underline"
                      >
                        🔍 @ {lead.curr}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Op Module 2: Live queue capacity matrix */}
              <div className="bg-white dark:bg-[#12121E] border border-[#E1DBCE] dark:border-indigo-950/55 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-2xs">
                <div className="space-y-1.5 text-left">
                  <div className="w-9 h-9 rounded-lg bg-[#1E3F66]/10 dark:bg-indigo-950/30 flex items-center justify-center text-[#1E3F66] dark:text-amber-400 mb-1 font-bold">
                    ⏱️
                  </div>
                  <h4 className="font-serif italic text-lg font-bold text-[#1E1A17] dark:text-white">
                    Live Wait Time index
                  </h4>
                  <p className="text-[11.5px] text-[#5C534C] dark:text-slate-400 leading-normal">
                    Real-time queue load indices updated by desk client APIs. Compare bottlenecks before stepping out.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { zone: 'Indiranagar Core', load: 'HIGH', wait: '35 mins delay', pct: 88, color: 'bg-rose-500' },
                    { zone: 'Whitefield Prestige', load: 'NORMAL', wait: '12 mins delay', pct: 45, color: 'bg-amber-500' },
                    { zone: 'Koramangala Luxe', load: 'READY', wait: 'Immediate Seats', pct: 15, color: 'bg-[#10B981]' }
                  ].map((row, idx) => (
                    <div key={idx} className="space-y-1 text-left text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center justify-between font-mono text-[10.5px]">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{row.zone}</span>
                        <span className="font-mono font-extrabold text-slate-600 dark:text-slate-400">{row.wait}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-indigo-950/40 h-2 rounded-full overflow-hidden">
                        <div className={`${row.color} h-full`} style={{ width: `${row.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Op Module 3: Price Parity Guarantee Certification */}
              <div className="bg-[#FAF6F0] dark:bg-[#161625] border border-[#D4AF37]/45 dark:border-indigo-950/50 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-2xs">
                <div className="space-y-2 text-left">
                  <div className="w-9 h-9 rounded-lg bg-[#A07D1A]/10 text-[#A07D1A] dark:text-amber-400 flex items-center justify-center mb-1 font-bold">
                    📜
                  </div>
                  <h4 className="font-serif italic text-lg font-extrabold text-[#A07D1A] dark:text-amber-400">
                    Menu Price Parity SLA
                  </h4>
                  <p className="text-[11.5px] text-[#5C534C] dark:text-slate-400 leading-relaxed">
                    Other aggregators double-premium list menu items or charge platform surcharges. GlamBlr enforces a strict <strong>Direct Parity Guarantee</strong>. You pay the exact official desk fee—no commission markup, guaranteed.
                  </p>
                </div>

                <div className="p-3 bg-white dark:bg-[#12121E] border border-[#E1DBCE] dark:border-indigo-950/35 rounded-xl text-[10px] font-mono text-slate-500 dark:text-slate-400 space-y-1.5 font-bold">
                  <div className="flex items-center justify-between text-[#805C06] dark:text-amber-400 font-extrabold">
                    <span>AUDIT LICENSE VERIFIED:</span>
                    <span>ACTIVE</span>
                  </div>
                  <p className="text-[9.5px] leading-tight text-slate-400 dark:text-slate-500">
                    SLA-Ref: BLR-PAR-2026. All booking checkouts receive a copy of original salon menu tables.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* [E] HOW IT WORKS STEP TIMELINE */}
          <section id="how_it_works" className="relative py-16 px-6 max-w-7xl mx-auto z-10 text-center space-y-10">
            <div className="space-y-2">
              <span className="text-[10px] text-[#A07D1A] dark:text-amber-500 tracking-[0.25em] font-bold block uppercase">Bespoke Experience</span>
              <h3 className="font-serif italic text-2xl md:text-4xl text-[#1E1A17] dark:text-white font-semibold">How It Works</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Audit Discovery', desc: 'Query Bangalore areas, choose specific specialties, or search using smart parameters like bridal treatment tiers.' },
                { step: '02', title: 'Couture Booking', desc: 'Secure customized slots, pre-select specialized designer services, and enter verified mobile credentials.' },
                { step: '03', title: 'Glow Premium', desc: 'Arrive at private partner boudoirs, take luxury elixir therapies, and unlock your true biological radiate glow.' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group relative bg-white dark:bg-[#12121E] border border-[#E1DBCE] dark:border-indigo-950/55 hover:border-[#A07D1A] dark:hover:border-amber-500 rounded-2xl p-6.5 text-left hover:-translate-y-1 transition-all duration-305 shadow-2xs"
                >
                  <span className="font-serif italic text-4xl font-extrabold text-[#A07D1A] dark:text-amber-400 block opacity-40 group-hover:opacity-100 transition-opacity mb-2">
                    {item.step}
                  </span>
                  <h4 className="font-serif italic text-lg text-[#1E1A17] dark:text-white font-semibold">{item.title}</h4>
                  <p className="text-xs text-[#5C534C] dark:text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* [F] SCROLL COUNTER STATS SECTION */}
          <StatsSection />

          {/* [G] AI STYLE DNA QUIZ BRUTALIST CALLOUT BRAND */}
          <section id="dna_quiz_cocoon" className="relative py-16 px-6 max-w-7xl mx-auto z-10 text-center">
            <div className="relative bg-[#FAF6F0] dark:bg-[#161625] border border-[#D4AF37]/50 dark:border-indigo-950/65 rounded-2xl p-8 md:p-12 overflow-hidden flex flex-col items-center justify-center space-y-5 shadow-xs">
              {/* background visual circles */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-tr from-[rgba(160,125,26,0.03)] to-transparent blur-3xl pointer-events-none"></div>
              
              <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-[#D4AF37] flex items-center justify-center animate-bounce shadow-2xs">
                <Sparkles className="w-6 h-6 text-[#A07D1A] dark:text-amber-400" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-[#A07D1A] dark:text-amber-400 tracking-[0.25em] font-bold block uppercase">Predictive Diagnostics</span>
                <h4 className="font-serif italic text-2xl md:text-3xl text-[#1E1A17] dark:text-white font-extrabold max-w-lg leading-tight">
                  Don't know your specific style?<br />
                  <span className="text-[#A07D1A] dark:text-amber-400">Let AI compute your DNA Match.</span>
                </h4>
                <p className="text-xs text-[#5C534C] dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Provide brief texture and budget coordinates, analyze styling match ratios, and immediately get 3 tailored top salons.
                </p>
              </div>

              <button
                onClick={() => setIsQuizOpen(true)}
                className="px-8 py-3.5 bg-[#A07D1A] dark:bg-amber-400 hover:bg-[#805C06] dark:text-slate-900 dark:hover:bg-white text-white font-extrabold rounded-xl text-xs uppercase tracking-widest hover:scale-102 hover:shadow-xs transition-all cursor-pointer"
              >
                Scan My Style DNA
              </button>
            </div>
          </section>

          {/* [H] TESTIMONIALS SECTION */}
          <section id="testimonials_cocoon" className="relative py-16 px-6 max-w-7xl mx-auto z-10 text-center space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] text-[#A07D1A] dark:text-amber-500 tracking-[0.25em] font-bold block uppercase">Vogue & Co. verified</span>
              <h3 className="font-serif italic text-2xl md:text-4xl text-[#1E1A17] dark:text-white font-semibold">Lounge Reviews</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {localTestimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#12121E] border border-[#E1DBCE]/80 dark:border-indigo-950/55 rounded-2xl p-6 text-left relative overflow-hidden flex flex-col justify-between h-full hover:border-[#A07D1A] dark:hover:border-amber-500 transition-colors shadow-2xs"
                >
                  <Quote className="absolute right-4 top-4 w-10 h-10 text-slate-100 dark:text-slate-900/40 stroke-[1.5]" />
                  
                  <div className="space-y-4">
                    <div className="flex text-[#A07D1A] dark:text-amber-500 gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#A07D1A] dark:fill-amber-500 text-[#A07D1A] dark:text-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-300 italic leading-relaxed">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-5 mt-5 border-t border-slate-100 dark:border-slate-900/45">
                    <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <div className="text-xs font-serif font-bold text-slate-800 dark:text-slate-100">{t.name}</div>
                      <div className="text-[9px] text-[#A07D1A] dark:text-amber-500 font-mono uppercase font-bold">{t.role} • {t.area}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      )}

      {currentPage === 'explore' && (
        <ExploreLounge
          initialSearchQuery={initialExploreSearchQuery}
          initialArea={heroSearchArea}
          initialService={heroSearchService}
          initialPrice={heroSearchPrice}
          onSelectSalon={(id) => {
            setSelectedSalonId(id);
            setCurrentPage('salon-detail');
            window.scrollTo({ top: 0 });
          }}
          onBookNow={(s) => handleOpenBooking(s)}
          salons={salons}
        />
      )}

      {currentPage === 'salon-detail' && (
        <SalonDetail
          salon={activeSalon}
          onBack={() => navigateTo('explore', '')}
          onBookService={(svc) => {
            if (activeSalon) {
              handleOpenBooking(activeSalon, svc);
            }
          }}
          onBookAny={() => {
            if (activeSalon) {
              handleOpenBooking(activeSalon);
            }
          }}
        />
      )}

      {/* 4. FOOTER COMPONENT */}
      <Footer
        onNavigate={(page) => navigateTo(page as any, '')}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      {/* 5. MODALS & SLIDE DRAWERS OVERLAYS */}
      <StyleQuiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSelectSalonToBook={(id) => {
          const matchedSalon = salons.find((s) => s.id === id);
          if (matchedSalon) {
            handleOpenBooking(matchedSalon);
          }
        }}
      />

      <BookingsDrawer
        isOpen={isBookingsOpen}
        onClose={() => {
          setIsBookingsOpen(false);
          updateBookingsCount();
        }}
        onRefreshTrigger={bookingsRefreshToggle}
      />

      <BookingModal
        salon={bookingSalon}
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          updateBookingsCount();
          setBookingsRefreshToggle((prev) => prev + 1);
        }}
        initialService={bookingService}
      />

      {/* 6. REAL-TIME AI CONCIERGE CHATBOT */}
      <ConciergeChatBot 
        appDarkMode={appDarkMode} 
        onNavigateToExplore={(search) => navigateTo('explore', search || '')}
      />

      {/* 7. PARTNERS, SALON OWNERS & ADMIN MANAGEMENT PORTAL */}
      <AdminPortal
        isOpen={isAdminPortalOpen}
        onClose={() => {
          setIsAdminPortalOpen(false);
          fetchSalonsAndBookings();
        }}
        salons={salons}
        bookings={bookings}
        onRefreshData={fetchSalonsAndBookings}
        appDarkMode={appDarkMode}
      />

    </div>
  );
}
