import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sparkles, Compass, MapPin, Smile, Flame, Play, ArrowRight, Heart, Award, CalendarCheck, HelpCircle, Star, Quote, RefreshCw, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';

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

  // Noomo Custom Interactive Spring Cursor Refs
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);
  const cursorTextRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;

    let targetDotScale = 1;
    let targetRingScale = 1;
    let currentDotScale = 1;
    let currentRingScale = 1;
    let targetRingColor = 'rgba(160, 125, 26, 0.45)';
    let targetRingBg = 'rgba(0, 0, 0, 0)';

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        if (cursorDotRef.current) cursorDotRef.current.style.opacity = '1';
        if (cursorRingRef.current) cursorRingRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = '0';
      if (cursorRingRef.current) cursorRingRef.current.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      isVisible = true;
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = '1';
      if (cursorRingRef.current) cursorRingRef.current.style.opacity = '1';
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isInput = target.closest('input, textarea, select, [contenteditable="true"]');
      const isHoverable = target.closest('button, a, [role="button"], .group, .cursor-pointer, .noomo-magnetic, [data-cursor-text]');
      
      if (isInput) {
        targetDotScale = 0.4;
        targetRingScale = 1.4;
        targetRingColor = 'rgba(160, 125, 26, 0.25)';
        targetRingBg = 'rgba(0, 0, 0, 0)';
        if (cursorTextRef.current) cursorTextRef.current.style.opacity = '0';
      } else if (isHoverable) {
        targetDotScale = 1.2;
        targetRingScale = 1.8;
        targetRingColor = 'rgba(212, 175, 55, 0.8)';
        targetRingBg = 'rgba(160, 125, 26, 0.08)';
        
        const text = isHoverable.getAttribute('data-cursor-text') || "";
        if (cursorTextRef.current) {
          cursorTextRef.current.textContent = text;
          cursorTextRef.current.style.opacity = text ? '1' : '0';
        }
      } else {
        targetDotScale = 1;
        targetRingScale = 1;
        targetRingColor = 'rgba(160, 125, 26, 0.45)';
        targetRingBg = 'rgba(0, 0, 0, 0)';
        if (cursorTextRef.current) cursorTextRef.current.style.opacity = '0';
      }
    };

    const handleMouseDown = () => {
      targetDotScale = 0.6;
      targetRingScale = 0.8;
    };

    const handleMouseUp = () => {
      targetDotScale = 1;
      targetRingScale = 1;
    };

    let animationFrameId = 0;
    const updateCursor = () => {
      // Linear interpolation (lerp) for trailing ring inertia effect
      const ease = 0.15;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      currentDotScale += (targetDotScale - currentDotScale) * 0.2;
      currentRingScale += (targetRingScale - currentRingScale) * 0.2;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0) scale(${currentDotScale})`;
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX - 12}px, ${ringY - 12}px, 0) scale(${currentRingScale})`;
        cursorRingRef.current.style.borderColor = targetRingColor;
        cursorRingRef.current.style.backgroundColor = targetRingBg;
      }

      animationFrameId = requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    updateCursor();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // premium cubic inertia easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 2,
    });

    // Append Lenis active class
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);
    (window as any).lenisInstance = lenis;

    return () => {
      lenis.destroy();
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Scroll to top on page transition or salon select
  useEffect(() => {
    const lenis = (window as any).lenisInstance;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [currentPage, selectedSalonId]);

  // Real-time server-synced parameters
  const [salons, setSalons] = useState<Salon[]>(LUX_SALONS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
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

  // Prevent background scroll and disable Lenis when any modal or drawer is open
  useEffect(() => {
    const isAnyModalOpen = isQuizOpen || isBookingsOpen || bookingModalOpen || isAdminPortalOpen;
    const lenis = (window as any).lenisInstance;
    
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('overflow-hidden');
      if (lenis) {
        lenis.stop();
      }
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('overflow-hidden');
      if (lenis) {
        lenis.start();
      }
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('overflow-hidden');
      if (lenis) {
        lenis.start();
      }
    };
  }, [isQuizOpen, isBookingsOpen, bookingModalOpen, isAdminPortalOpen]);

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

  // Public application configuration variables loaded securely from fullstack backend
  const [appConfig, setAppConfig] = useState<any>({
    googleMapsKey: '',
    emailjsServiceId: '',
    emailjsTemplateId: '',
    emailjsPublicKey: '',
    tallyFormId: '',
    whatsappNumber: '916380691764',
    supabaseUrl: '',
    supabaseAnonKey: ''
  });

  const fetchAppConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setAppConfig(data);
      }
    } catch (err) {
      console.error("Failed to load app config from server:", err);
    }
  };

  const categoriesRef = React.useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesRef.current) {
      const scrollAmount = 350;
      categoriesRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
      const resTestimonials = await fetch('/api/testimonials');
      if (resTestimonials.ok) {
        const dataTestimonials = await resTestimonials.json();
        setTestimonials(dataTestimonials);
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

    // Load configurations and listings
    fetchAppConfig();
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

  // Reusable Noomo Agency spring motion preset
  const noomoScrollProps = {
    initial: { opacity: 0, y: 55 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-120px" },
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 45 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <div className={`relative min-h-screen selection:bg-[#D4AF37] selection:text-black transition-colors duration-700 ${
      appDarkMode ? 'bg-[#08080E] text-[#FCFAF7] dark' : 'text-[#1A1715] bg-[#FAF8F4]'
    }`}>
      
      {/* NOOMO INTERACTIVE SPRING CURSOR WITH DUAL-ELEMENT NATIVE RENDER LOOP */}
      <div
        ref={cursorDotRef}
        className="hidden md:block fixed pointer-events-none z-[999999] rounded-full bg-[#A07D1A] dark:bg-amber-400 opacity-0 transition-opacity duration-300"
        style={{
          width: 6,
          height: 6,
          boxShadow: "0 0 10px rgba(212, 175, 55, 0.45)",
          top: 0,
          left: 0,
          willChange: "transform",
        }}
      />
      <div
        ref={cursorRingRef}
        className="hidden md:block fixed pointer-events-none z-[999998] rounded-full border border-[#A07D1A]/50 dark:border-amber-400/50 opacity-0 transition-opacity duration-300"
        style={{
          width: 24,
          height: 24,
          top: 0,
          left: 0,
          willChange: "transform",
        }}
      >
        <span
          ref={cursorTextRef}
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-black/90 dark:bg-white/95 text-white dark:text-black border border-white/10 dark:border-black/10 px-2.5 py-0.5 rounded-lg font-mono text-[8px] font-black tracking-widest uppercase shadow-[0_4px_12px_rgba(0,0,0,0.25)] whitespace-nowrap opacity-0 transition-opacity duration-200"
        />
      </div>
      
      {/* SLEEPIEST FLOATING AMBIENT HEALTH & WELLNESS ORBS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/[0.05] dark:bg-violet-500/[0.07] blur-[130px] cosmic-orb-1" />
        <div className="absolute top-[60%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/[0.03] dark:bg-amber-400/[0.05] blur-[150px] cosmic-orb-2" />
      </div>

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
              navigateTo('explore', '');
            }}
            onJoinClick={() => setIsAdminPortalOpen(true)}
            appDarkMode={appDarkMode}
          />

          {/* [B] CORE MARKETPLACE CONSOLE & SEARCH BLOCK */}
          <motion.section
            id="discovery_lounge_anchor"
            className="relative py-12 z-10"
            {...noomoScrollProps}
          >
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
          </motion.section>

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
          <motion.section
            id="category_quick_select"
            className="relative py-16 px-6 max-w-7xl mx-auto z-10 text-left space-y-6 animate-fadeIn"
            {...noomoScrollProps}
          >
            <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 border-b border-[#E1DBCE] dark:border-indigo-950/50 pb-3">
              <div>
                <span className="text-[10px] text-[#A07D1A] dark:text-amber-500 tracking-[0.25em] font-bold block uppercase font-mono">Bespoke Categories</span>
                <h3 className="font-serif italic text-3xl md:text-5xl text-[#1E1A17] dark:text-white font-semibold">
                  Discovery <span className="noomo-outline-text font-sans font-light tracking-tight">Quick Select</span>
                </h3>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs text-slate-400 dark:text-slate-500 italic hidden sm:inline">Swipe or click arrows to browse curation menu →</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scrollCategories('left')}
                    className="p-2 border border-[#E1DBCE] dark:border-indigo-950/50 bg-white/5 hover:border-[#A07D1A] dark:hover:border-amber-500 rounded-full text-[#A07D1A] dark:text-amber-400 hover:bg-[#FAF6F0] dark:hover:bg-slate-900 cursor-pointer transition-colors focus:outline-none"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollCategories('right')}
                    className="p-2 border border-[#E1DBCE] dark:border-indigo-950/50 bg-white/5 hover:border-[#A07D1A] dark:hover:border-amber-500 rounded-full text-[#A07D1A] dark:text-amber-400 hover:bg-[#FAF6F0] dark:hover:bg-slate-900 cursor-pointer transition-colors focus:outline-none"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div ref={categoriesRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin select-category-row">
              {categoriesList.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => navigateTo('explore', cat.value)}
                  className="group relative flex-col shrink-0 w-48 bg-white dark:bg-[#12121E]/75 backdrop-blur-md border border-[#E1DBCE] dark:border-indigo-950/50 hover:border-[#A07D1A] dark:hover:border-amber-500 rounded-2xl p-5 text-left transition-all duration-300 transform hover:-translate-y-2 cursor-pointer hover:shadow-lg noomo-magnetic block noomo-grid-card"
                  data-cursor-text="GO"
                >
                  <img src={cat.img} alt={cat.label} className="w-12 h-12 object-cover rounded-2xl border border-slate-100 dark:border-indigo-950/20 mb-4 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="font-serif italic text-base font-bold text-[#1E1A17] dark:text-[#FCFAF7] group-hover:text-[#A07D1A] dark:group-hover:text-amber-400 transition-colors">{cat.label}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{cat.count}</div>
                  <ArrowRight className="absolute right-5 bottom-5 w-4.5 h-4.5 text-slate-300 dark:text-slate-600 group-hover:text-[#A07D1A] dark:group-hover:text-amber-400 group-hover:translate-x-1.5 transition-all" />
                </button>
              ))}
            </div>
          </motion.section>

          {/* [K] COUTURE 3D LOBBY TOUR PORTAL */}
          <SalonLobby 
            appDarkMode={appDarkMode} 
            onToggleDarkMode={toggleDarkMode} 
          />

          {/* [D] FEATURED SALONS GRID */}
          <motion.section
            id="featured_salons"
            className="relative py-16 px-6 max-w-7xl mx-auto z-10 text-left space-y-8"
            {...noomoScrollProps}
          >
            <div className="flex items-end justify-between border-b border-[#E1DBCE] dark:border-indigo-950/50 pb-3">
              <div>
                <span className="text-[10px] text-[#A07D1A] dark:text-amber-500 tracking-[0.25em] font-bold block uppercase font-mono">Hand-audited Curation</span>
                <h3 className="font-serif italic text-3xl md:text-5xl text-[#1E1A17] dark:text-white font-semibold">
                  Featured <span className="noomo-outline-text font-sans font-light tracking-tight">Lounges</span>
                </h3>
              </div>
              <button
                onClick={() => navigateTo('explore')}
                className="text-xs uppercase tracking-widest text-[#A07D1A] dark:text-amber-500 hover:underline font-extrabold flex items-center gap-1 cursor-pointer noomo-magnetic px-4 py-2 rounded-full border border-[#E1DBCE] dark:border-indigo-950/50 bg-white/5"
              >
                View All Lounges <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {salons.filter((s) => s.isFeatured).slice(0, 6).map((salon) => (
                <motion.div key={salon.id} variants={staggerItem} className="h-full w-full">
                  <SalonCard
                    salon={salon}
                    onSelect={(id) => {
                       setSelectedSalonId(id);
                       setCurrentPage('salon-detail');
                       window.scrollTo({ top: 0 });
                    }}
                    onBookNow={(s) => handleOpenBooking(s)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* [MAP] INTERACTIVE LUXURY BENGALURU MAP */}
          <motion.section
            id="interactive_lounge_cartography"
            className="relative py-16 px-6 max-w-7xl mx-auto z-10 text-left space-y-6"
            {...noomoScrollProps}
          >
            <div className="border-b border-[#E1DBCE] dark:border-indigo-950/50 pb-3">
              <span className="text-[10px] text-[#A07D1A] dark:text-amber-500 tracking-[0.25em] font-bold block uppercase font-mono">Cartography Lounge Grid</span>
              <h3 className="font-serif italic text-3xl md:text-5xl text-[#1E1A17] dark:text-white font-semibold">
                Bengaluru Salon <span className="noomo-outline-text font-sans font-light tracking-tight">Coordinates</span>
              </h3>
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
              googleMapsKey={appConfig.googleMapsKey}
            />
          </motion.section>

          {/* [OP] REAL WORLD MARKETPLACE OPERATIONS CONTROL CENTER (Solving authentic user search & routing pain points!) */}
          <motion.section
            id="marketplace_operations"
            className="relative py-16 px-6 max-w-7xl mx-auto z-10 text-left space-y-10"
            {...noomoScrollProps}
          >
            <div className="space-y-2 border-b border-[#E1DBCE] dark:border-indigo-950/50 pb-3">
              <span className="text-[10px] text-[#A07D1A] dark:text-amber-500 tracking-[0.25em] font-bold block uppercase font-mono">
                🚀 Dynamic Operational Intelligence
              </span>
              <h3 className="font-serif italic text-3xl md:text-5xl text-[#1E1A17] dark:text-white font-semibold">
                Marketplace <span className="noomo-outline-text font-sans font-light tracking-tight">Operations</span>
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
          </motion.section>

          {/* [E] HOW IT WORKS STEP TIMELINE */}
          <motion.section
            id="how_it_works"
            className="relative py-16 px-6 max-w-7xl mx-auto z-10 text-center space-y-10"
            {...noomoScrollProps}
          >
            <div className="space-y-2">
              <span className="text-[10px] text-[#A07D1A] dark:text-amber-500 tracking-[0.25em] font-bold block uppercase font-mono">Bespoke Experience</span>
              <h3 className="font-serif italic text-3xl md:text-5xl text-[#1E1A17] dark:text-white font-semibold">
                How It <span className="noomo-outline-text font-sans font-light tracking-tight">Works</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Audit Discovery', desc: 'Query Bangalore areas, choose specific specialties, or search using smart parameters like bridal treatment tiers.' },
                { step: '02', title: 'Couture Booking', desc: 'Secure customized slots, pre-select specialized designer services, and enter verified mobile credentials.' },
                { step: '03', title: 'Glow Premium', desc: 'Arrive at private partner boudoirs, take luxury elixir therapies, and unlock your true biological radiate glow.' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group relative bg-white dark:bg-[#12121E]/80 backdrop-blur-md border border-[#E1DBCE] dark:border-indigo-950/55 hover:border-[#A07D1A] dark:hover:border-amber-500 rounded-[2rem] p-8 text-left hover:-translate-y-2 transition-all duration-300 shadow-2xs noomo-magnetic noomo-grid-card"
                >
                  <span className="font-serif italic text-5xl font-black text-[#A07D1A]/10 dark:text-amber-400/10 block mb-2 leading-none">
                    {item.step}
                  </span>
                  <h4 className="font-serif italic text-xl text-[#1E1A17] dark:text-white font-bold">{item.title}</h4>
                  <p className="text-xs text-[#5C534C] dark:text-slate-400 mt-2 leading-relaxed font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* [F] SCROLL COUNTER STATS SECTION */}
          <StatsSection />

          {/* [G] AI STYLE DNA QUIZ BRUTALIST CALLOUT BRAND */}
          <motion.section
            id="dna_quiz_cocoon"
            className="relative py-16 px-6 max-w-7xl mx-auto z-10 text-center"
            {...noomoScrollProps}
          >
            <div className="relative bg-[#FAF6F0] dark:bg-[#161625] border border-[#D4AF37]/50 dark:border-indigo-950/65 rounded-[2.5rem] p-10 md:p-16 overflow-hidden flex flex-col items-center justify-center space-y-6 shadow-md noomo-grid-card">
              {/* background visual circles */}
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-tr from-[rgba(160,125,26,0.05)] to-transparent blur-3xl pointer-events-none"></div>
              
              <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-900 border border-[#D4AF37] flex items-center justify-center animate-bounce shadow-xs relative z-10">
                <Sparkles className="w-7 h-7 text-[#A07D1A] dark:text-amber-400" />
              </div>

              <div className="space-y-3 relative z-10">
                <span className="text-[10px] text-[#A07D1A] dark:text-amber-400 tracking-[0.25em] font-bold block uppercase font-mono">Predictive Diagnostics</span>
                <h4 className="font-serif italic text-3xl md:text-5xl text-[#1E1A17] dark:text-white font-extrabold max-w-2xl leading-tight font-light">
                  Don't know your specific style?<br />
                  <span className="text-[#A07D1A] dark:text-amber-400">Let AI compute your <span className="noomo-outline-text font-sans font-light tracking-tight">DNA Match</span>.</span>
                </h4>
                <p className="text-xs md:text-sm text-[#5C534C] dark:text-slate-400 max-w-md mx-auto leading-relaxed font-light">
                  Provide brief texture and budget coordinates, analyze styling match ratios, and immediately get 3 tailored top salons.
                </p>
              </div>

              <button
                onClick={() => setIsQuizOpen(true)}
                className="px-8 py-4 bg-[#A07D1A] dark:bg-amber-400 hover:bg-white dark:hover:bg-white text-white dark:text-slate-900 font-extrabold rounded-full text-xs uppercase tracking-widest hover:scale-105 transition-all duration-300 cursor-pointer shadow-md noomo-magnetic"
              >
                Scan My Style DNA
              </button>
            </div>
          </motion.section>

          {/* [H] TESTIMONIALS SECTION */}
          <motion.section
            id="testimonials_cocoon"
            className="relative py-16 px-6 max-w-7xl mx-auto z-10 text-center space-y-8"
            {...noomoScrollProps}
          >
            <div className="space-y-2">
              <span className="text-[10px] text-[#A07D1A] dark:text-amber-500 tracking-[0.25em] font-bold block uppercase font-mono">Vogue & Co. verified</span>
              <h3 className="font-serif italic text-3xl md:text-5xl text-[#1E1A17] dark:text-white font-semibold">
                Lounge <span className="noomo-outline-text font-sans font-light tracking-tight">Reviews</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(testimonials && testimonials.length > 0 ? testimonials : localTestimonials).map((t, idx) => (
                <motion.div
                  key={idx}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.25}
                  whileDrag={{ scale: 1.05, rotate: idx % 2 === 0 ? 1.5 : -1.5, zIndex: 30 }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  data-cursor-text="DRAG ME"
                  className="bg-white dark:bg-[#12121E] border border-[#E1DBCE]/80 dark:border-indigo-950/55 rounded-2xl p-6 text-left relative overflow-hidden flex flex-col justify-between h-full hover:border-[#A07D1A] dark:hover:border-amber-500 transition-colors shadow-2xs cursor-grab active:cursor-grabbing select-none"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Quote className="absolute right-4 top-4 w-10 h-10 text-slate-100 dark:text-slate-900/40 stroke-[1.5] pointer-events-none" />
                  
                  <div className="space-y-4 pointer-events-none">
                    <div className="flex text-[#A07D1A] dark:text-amber-500 gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#A07D1A] dark:fill-amber-500 text-[#A07D1A] dark:text-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-300 italic leading-relaxed">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-5 mt-5 border-t border-slate-100 dark:border-slate-900/45 pointer-events-none">
                    <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <div className="text-xs font-serif font-bold text-slate-800 dark:text-slate-100">{t.name}</div>
                      <div className="text-[9px] text-[#A07D1A] dark:text-amber-500 font-mono uppercase font-bold">{t.role} • {t.area}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

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
          googleMapsKey={appConfig.googleMapsKey}
        />
      )}

      {/* 4. FOOTER COMPONENT */}
      <Footer
        onNavigate={(page) => navigateTo(page as any, '')}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenPartners={() => setIsAdminPortalOpen(true)}
      />

      {/* 5. MODALS & SLIDE DRAWERS OVERLAYS */}
      <StyleQuiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        salons={salons}
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
        emailjsServiceId={appConfig.emailjsServiceId}
        emailjsTemplateId={appConfig.emailjsTemplateId}
        emailjsPublicKey={appConfig.emailjsPublicKey}
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
        whatsappNumber={appConfig.whatsappNumber}
        tallyFormId={appConfig.tallyFormId}
      />

      {/* 8. ELEGANT FLOATING SCROLL TO TOP BUTTON (Noomo Style) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            whileHover={{ scale: 1.1, translateY: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 p-3.5 bg-white/80 dark:bg-[#12121E]/80 backdrop-blur-md border border-[#E1DBCE] dark:border-indigo-950/70 hover:border-[#A07D1A] dark:hover:border-amber-500 rounded-full text-[#A07D1A] dark:text-amber-400 hover:text-white dark:hover:text-slate-950 hover:bg-[#A07D1A] dark:hover:bg-amber-400 shadow-[0_8px_24px_rgba(44,38,33,0.1)] transition-colors duration-300 cursor-pointer focus:outline-none"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
