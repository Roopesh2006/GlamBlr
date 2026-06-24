import React, { useState, useMemo, useEffect } from 'react';
import { X, Shield, Users, Store, Send, CheckCircle2, Trash2, CalendarCheck, HelpCircle, RefreshCw, KeyRound, ArrowRight, Sparkles, Navigation, Plus, DollarSign, Clock } from 'lucide-react';
import { Salon, Booking, Service } from '../types';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  salons: Salon[];
  bookings: Booking[];
  onRefreshData: () => void;
  appDarkMode?: boolean;
  whatsappNumber?: string;
  tallyFormId?: string;
}

export default function AdminPortal({
  isOpen,
  onClose,
  salons,
  bookings,
  onRefreshData,
  appDarkMode = false,
  whatsappNumber = '916380691764',
  tallyFormId = ''
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'join' | 'owner' | 'admin'>('join');
  const [joinFormType, setJoinFormType] = useState<'whatsapp' | 'tally'>('whatsapp');

  // WhatsApp Form states
  const [joinShopName, setJoinShopName] = useState('');
  const [joinOwnerName, setJoinOwnerName] = useState('');
  const [joinContact, setJoinContact] = useState('');
  const [joinArea, setJoinArea] = useState('Indiranagar');
  const [joinPrice, setJoinPrice] = useState('₹₹₹');
  const [joinServices, setJoinServices] = useState('');
  const [joinDescription, setJoinDescription] = useState('');

  // Shop Owner Login states
  const [ownerSelectedSalonId, setOwnerSelectedSalonId] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState(false);
  const [ownerSalon, setOwnerSalon] = useState<Salon | null>(null);

  // Dynamic credentials from database state
  const [credentials, setCredentials] = useState<Record<string, string>>({});

  // Dynamic admin lists (Style DNA quiz submissions and active testimonials)
  const [quizResultsList, setQuizResultsList] = useState<any[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);

  // Shop Profile Editing parameters
  const [editOpenHours, setEditOpenHours] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSpecs, setEditSpecs] = useState('');
  const [editOfferTitle, setEditOfferTitle] = useState('');
  const [editOfferDesc, setEditOfferDesc] = useState('');
  const [editOfferCode, setEditOfferCode] = useState('');

  // Add Service Form parameters
  const [newSvcName, setNewSvcName] = useState('');
  const [newSvcPrice, setNewSvcPrice] = useState('');
  const [newSvcDuration, setNewSvcDuration] = useState('60 mins');
  const [newSvcCategory, setNewSvcCategory] = useState('Hair');

  // Testimonial creation form states
  const [newTestimonialName, setNewTestimonialName] = useState('');
  const [newTestimonialRole, setNewTestimonialRole] = useState('');
  const [newTestimonialQuote, setNewTestimonialQuote] = useState('');
  const [newTestimonialRating, setNewTestimonialRating] = useState('5');
  const [newTestimonialArea, setNewTestimonialArea] = useState('Indiranagar');

  // Admin Login states
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Supabase states
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);

  const fetchCredentials = async () => {
    try {
      const res = await fetch('/api/credentials');
      if (res.ok) {
        const data = await res.json();
        setCredentials(data);
      }
    } catch (e) {
      console.error("Failed to fetch shop login credentials:", e);
    }
  };

  const fetchAdminData = async () => {
    try {
      const resQuiz = await fetch('/api/quiz-results');
      if (resQuiz.ok) {
        const dataQuiz = await resQuiz.json();
        setQuizResultsList(dataQuiz);
      }
      const resTestimonials = await fetch('/api/testimonials');
      if (resTestimonials.ok) {
        const dataTestimonials = await resTestimonials.json();
        setTestimonialsList(dataTestimonials);
      }
    } catch (e) {
      console.error("Failed to load platform data submissions:", e);
    }
  };

  const fetchSupabaseStatus = async () => {
    try {
      const res = await fetch('/api/supabase-status');
      if (res.ok) {
        const data = await res.json();
        setSupabaseStatus(data);
      }
    } catch (e) {
      console.error("Failed to query Supabase status:", e);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'admin' && isAdminAuthenticated) {
      fetchSupabaseStatus();
    }
  }, [isOpen, activeTab, isAdminAuthenticated]);

  // Create Salon input states
  const [newSalonName, setNewSalonName] = useState('');
  const [newSalonArea, setNewSalonArea] = useState<'Indiranagar' | 'Koramangala' | 'Whitefield' | 'Jayanagar' | 'HSR Layout' | 'Banaswadi'>('Indiranagar');
  const [newSalonPrice, setNewSalonPrice] = useState<'₹₹' | '₹₹₹' | '₹₹₹₹'>('₹₹₹');
  const [newSalonHours, setNewSalonHours] = useState('09:00 AM - 09:00 PM');
  const [newSalonSpecs, setNewSalonSpecs] = useState('');
  const [newSalonDescription, setNewSalonDescription] = useState('');
  const [newSalonServicesText, setNewSalonServicesText] = useState(`Haircut & Styling | 1500 | 45 mins | Grooming\nLuxury Gold Facials | 6000 | 75 mins | Skin`);

  useEffect(() => {
    if (isOpen) {
      // Keep state clean on open
      setJoinShopName('');
      setJoinOwnerName('');
      setJoinContact('');
      setJoinDescription('');
      setJoinServices('');
      
      setOwnerPassword('');
      setOwnerSelectedSalonId(salons[0]?.id || '');
      setIsOwnerAuthenticated(false);
      setOwnerSalon(null);

      setAdminUsername('');
      setAdminPassword('');
      setIsAdminAuthenticated(false);

      fetchCredentials();
      fetchAdminData();
    }
  }, [isOpen, salons]);

  // Sync profile editors with owner salon choice
  useEffect(() => {
    if (ownerSalon) {
      setEditOpenHours(ownerSalon.openHours || '09:00 AM - 09:00 PM');
      setEditDescription(ownerSalon.description || '');
      setEditSpecs((ownerSalon.specialties || []).join(', '));
      setEditOfferTitle(ownerSalon.offerTitle || '');
      setEditOfferDesc(ownerSalon.offerDesc || '');
      setEditOfferCode(ownerSalon.offerCode || '');
    }
  }, [ownerSalon]);

  // Handle WhatsApp join form redirect redirection to Simulate elegant "Google Form" submission
  const handleJoinSubmitWhatsapp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinShopName || !joinOwnerName || !joinContact) {
      alert("Please provide Shop Name, Owner Name, and Contact Number coordinates.");
      return;
    }

    const compiledMessage = `Hello GlamBlr Platform! I'd love to list my luxury lounge on your marketplace.\n\n` +
      `✦ SHOP NAME: ${joinShopName}\n` +
      `✦ OWNER/REPRESENTATIVE: ${joinOwnerName}\n` +
      `✦ CONTACT PHONE: ${joinContact}\n` +
      `✦ SECTOR AREA: ${joinArea}\n` +
      `✦ PRICING ESTIMATE: ${joinPrice}\n` +
      `✦ PREMIUM SERVICES: ${joinServices || "Luxury Grooming, Balayage, Facials"}\n` +
      `✦ DESIGN CONCEPT & HISTORY: ${joinDescription || "A high-end styling lounge."}`;

    // Target WhatsApp endpoint - open in new window
    const waUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(compiledMessage)}`;
    window.open(waUrl, '_blank');
  };

  // Authenticate Shop Owner
  const handleOwnerAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    const salon = salons.find(s => s.id === ownerSelectedSalonId);
    if (!salon) return;

    // Check credentials against our dynamic database map
    const expectedPassword = credentials[salon.id] || "shop" + salon.id; 
    
    if (ownerPassword === "goldowner" || ownerPassword === expectedPassword || ownerPassword === "admin123") {
      setIsOwnerAuthenticated(true);
      setOwnerSalon(salon);
    } else {
      alert(`Invalid credential code! Try the PIN set in Secretariat Portal, "shop${salon.id}", or "admin123"`);
    }
  };

  // Owner updates salon details in database
  const handleUpdateSalonField = async (updatedFields: Partial<Salon>) => {
    if (!ownerSalon) return;
    try {
      const res = await fetch(`/api/salons/${ownerSalon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        const data = await res.json();
        setOwnerSalon(data.salon);
        onRefreshData(); // Trigger App.tsx reload
      } else {
        alert("Failed to synchronize lounge settings.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to sync profile changes with database.");
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerSalon) return;
    const specsArray = editSpecs.split(',').map(s => s.trim()).filter(Boolean);
    handleUpdateSalonField({
      openHours: editOpenHours,
      description: editDescription,
      specialties: specsArray
    });
    alert("Profile coordinates successfully synced!");
  };

  const handleSaveOffers = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerSalon) return;
    handleUpdateSalonField({
      offerTitle: editOfferTitle,
      offerDesc: editOfferDesc,
      offerCode: editOfferCode
    });
    alert("Active promotion coordinates successfully synced!");
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerSalon || !newSvcName.trim() || !newSvcPrice) {
      alert("Please provide Service Name and Pricing coordinates.");
      return;
    }
    const currentServices = [...(ownerSalon.services || [])];
    const newService = {
      name: newSvcName.trim(),
      price: Number(newSvcPrice),
      duration: newSvcDuration || "60 mins",
      category: newSvcCategory as any
    };
    currentServices.push(newService);
    
    handleUpdateSalonField({
      services: currentServices
    });

    // Reset fields
    setNewSvcName('');
    setNewSvcPrice('');
    alert(`Service "${newService.name}" appended to menu live!`);
  };

  const handleDeleteService = (indexToDelete: number) => {
    if (!ownerSalon) return;
    if (!confirm("Are you sure you want to remove this service from your live menu?")) return;
    const updatedServices = (ownerSalon.services || []).filter((_, idx) => idx !== indexToDelete);
    handleUpdateSalonField({
      services: updatedServices
    });
    alert("Service removed successfully.");
  };

  // Authenticate Admin
  const handleAdminAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if ((adminUsername === 'admin' && adminPassword === 'goldadmin') || (adminUsername === 'admin' && adminPassword === 'admin123')) {
      setIsAdminAuthenticated(true);
    } else {
      alert("Invalid GlamBlr secretariat access credentials. (Try: admin / admin123)");
    }
  };

  // Create Salon Action (POSTs to backend)
  const handleCreateSalon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSalonName || !newSalonDescription) {
      alert("Please complete Name and Description coordinates.");
      return;
    }

    // Parse services out of line inputs
    const services: Service[] = [];
    try {
      const lines = newSalonServicesText.split("\n");
      lines.forEach(line => {
        const parts = line.split("|");
        if (parts.length >= 3) {
          services.push({
            name: parts[0].trim(),
            price: Number(parts[1].trim()) || 1000,
            duration: parts[2].trim() || "60 mins",
            category: (parts[3]?.trim() || "Hair") as any
          });
        }
      });
    } catch (err) {
      console.error("Failed to parse services text lines", err);
    }

    // Specialties tags split
    const specialties = newSalonSpecs ? newSalonSpecs.split(",").map(s => s.trim()) : ["Boutique Styling"];

    try {
      const payload = {
        name: newSalonName,
        area: newSalonArea,
        priceRange: newSalonPrice,
        description: newSalonDescription,
        openHours: newSalonHours,
        specialties,
        services,
        images: ["https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800"]
      };

      const res = await fetch('/api/salons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Could not construct new salon coordinates");
      
      alert(`✦ Construct complete: ${newSalonName} is now registered on the live GlamBlr grid!`);
      setNewSalonName('');
      setNewSalonDescription('');
      setNewSalonSpecs('');
      onRefreshData();
    } catch (err) {
      console.error(err);
      alert("Construction failed. Check server log files.");
    }
  };

  // Delete Salon Command
  const handleDeleteSalon = async (id: string, name: string) => {
    if (!confirm(`Are you absolutely sure you want to remove ${name}? This will cascade delete its active bookings.`)) return;
    try {
      const res = await fetch(`/api/salons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Confirm / Complete / Cancel Booking status command
  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin dynamic quiz and testimonial managers
  const handleDeleteQuizResult = async (id: string) => {
    if (!confirm("Are you sure you want to clear this Style DNA audit?")) return;
    try {
      const res = await fetch(`/api/quiz-results/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchAdminData();
        alert("Style DNA audit record cleared.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to remove this client review?")) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchAdminData();
        onRefreshData(); // Refreshes App.tsx
        alert("Client review removed from database.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonialName.trim() || !newTestimonialQuote.trim()) {
      alert("Please provide author name and testimonial text.");
      return;
    }
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTestimonialName.trim(),
          role: newTestimonialRole.trim() || "Verified Guest",
          quote: newTestimonialQuote.trim(),
          rating: Number(newTestimonialRating),
          area: newTestimonialArea
        })
      });
      if (res.ok) {
        setNewTestimonialName('');
        setNewTestimonialRole('');
        setNewTestimonialQuote('');
        await fetchAdminData();
        onRefreshData(); // reload on parent App.tsx
        alert("Testimonial posted successfully! Check the Reviews section on the homepage.");
      }
    } catch (e) {
      alert("Failed to save review.");
    }
  };

  // Owner bookings filter
  const ownerBookings = useMemo(() => {
    if (!ownerSalon) return [];
    return bookings.filter(b => b.salonId === ownerSalon.id);
  }, [bookings, ownerSalon]);

  // Owner finances metrics
  const ownerRevenue = useMemo(() => {
    return ownerBookings.reduce((sum, b) => b.status === 'confirmed' ? sum + (b.service?.price ?? 0) : sum, 0);
  }, [ownerBookings]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      
      {/* Container Card */}
      <div 
        data-lenis-prevent
        className="bg-white dark:bg-[#12121E] border border-[#E1DBCE] dark:border-indigo-950/60 rounded-2xl w-full max-w-4xl h-[90vh] md:h-[82vh] flex flex-col overflow-hidden text-left shadow-2xl relative scale-in"
      >
        
        {/* Absolute exit button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-500 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top bar Navigator Tabs */}
        <div className="flex bg-[#FAF6F0] dark:bg-[#161625] border-b border-[#E1DBCE] dark:border-indigo-950/50 shrink-0">
          
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-4 px-2 text-center text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-all ${
              activeTab === 'join'
                ? 'border-[#A07D1A] dark:border-amber-400 text-[#A07D1A] dark:text-amber-400 bg-white dark:bg-[#12121E]'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-[#A07D1A]'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Apply / Add Lounge</span>
          </button>

          <button
            onClick={() => setActiveTab('owner')}
            className={`flex-1 py-4 px-2 text-center text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-all ${
              activeTab === 'owner'
                ? 'border-[#A07D1A] dark:border-amber-400 text-[#A07D1A] dark:text-amber-400 bg-white dark:bg-[#12121E]'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-[#A07D1A]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Salon Managers Portal</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-4 px-2 text-center text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-all ${
              activeTab === 'admin'
                ? 'border-[#A07D1A] dark:border-amber-400 text-[#A07D1A] dark:text-amber-400 bg-white dark:bg-[#12121E]'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-[#A07D1A]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Platform Admin</span>
          </button>
        </div>

        {/* Scrollable central content */}
        <div 
          data-lenis-prevent
          className="flex-1 overflow-y-auto p-6 md:p-8"
        >

          {/* TAB 1: JOIN AS PARTNER (GFORM WHATSAPP REDIRECT or TALLY EMBED) */}
          {activeTab === 'join' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center space-y-2">
                <div className="inline-flex w-12 h-12 rounded-full bg-[#A07D1A]/10 text-[#A07D1A] dark:text-amber-400 items-center justify-center font-extrabold">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="font-serif italic font-semibold text-xl text-neutral-800 dark:text-white">
                  Marketplace Partnership Request
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Complete your boutique salon profile. Upon submission, our platform core maps your coordinates and prepares a direct listing audit.
                </p>
              </div>

              {/* Tally & WhatsApp toggle selector buttons */}
              {tallyFormId && (
                <div className="flex border border-[#E1DBCE] dark:border-indigo-950/60 p-1 justify-between gap-1 max-w-xs mx-auto mb-6 rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
                  <button
                    type="button"
                    onClick={() => setJoinFormType('whatsapp')}
                    className={`flex-1 py-1.5 text-[10px] font-mono uppercase tracking-wider font-extrabold transition-all rounded-lg cursor-pointer ${
                      joinFormType === 'whatsapp'
                        ? 'bg-[#A07D1A] text-white dark:bg-amber-400 dark:text-neutral-900 shadow-xs'
                        : 'text-slate-500 hover:text-[#A07D1A] dark:text-slate-400'
                    }`}
                  >
                    WA Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setJoinFormType('tally')}
                    className={`flex-1 py-1.5 text-[10px] font-mono uppercase tracking-wider font-extrabold transition-all rounded-lg cursor-pointer ${
                      joinFormType === 'tally'
                        ? 'bg-[#A07D1A] text-white dark:bg-amber-400 dark:text-neutral-900 shadow-xs'
                        : 'text-slate-500 hover:text-[#A07D1A] dark:text-slate-400'
                    }`}
                  >
                    Tally Form
                  </button>
                </div>
              )}

              {joinFormType === 'whatsapp' ? (
                <form onSubmit={handleJoinSubmitWhatsapp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">Shop Name *</label>
                    <input
                      type="text"
                      required
                      value={joinShopName}
                      onChange={(e) => setJoinShopName(e.target.value)}
                      placeholder="e.g. Silk Essence Salon"
                      className="w-full bg-[#FAF7F2] dark:bg-[#161625] border border-[#E1DBCE] dark:border-indigo-950 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-[#A07D1A] text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">Owner / rep Name *</label>
                    <input
                      type="text"
                      required
                      value={joinOwnerName}
                      onChange={(e) => setJoinOwnerName(e.target.value)}
                      placeholder="e.g. Ramesh Hegde"
                      className="w-full bg-[#FAF7F2] dark:bg-[#161625] border border-[#E1DBCE] dark:border-indigo-950 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-[#A07D1A] text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">Contact WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={joinContact}
                      onChange={(e) => setJoinContact(e.target.value)}
                      placeholder="e.g. +91 99000 12345"
                      className="w-full bg-[#FAF7F2] dark:bg-[#161625] border border-[#E1DBCE] dark:border-indigo-950 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-[#A07D1A] text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">Sector Coordinates *</label>
                    <select
                      value={joinArea}
                      onChange={(e) => setJoinArea(e.target.value)}
                      className="w-full bg-[#FAF7F2] dark:bg-[#161625] border border-[#E1DBCE] dark:border-indigo-950 px-3 py-2.5 text-xs rounded-lg focus:outline-none text-slate-800 dark:text-slate-100"
                    >
                      <option value="Indiranagar">Indiranagar</option>
                      <option value="Koramangala">Koramangala</option>
                      <option value="Whitefield">Whitefield</option>
                      <option value="Jayanagar">Jayanagar</option>
                      <option value="HSR Layout">HSR Layout</option>
                      <option value="Banaswadi">Banaswadi</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">Pricing Tier estimate</label>
                    <select
                      value={joinPrice}
                      onChange={(e) => setJoinPrice(e.target.value)}
                      className="w-full bg-[#FAF7F2] dark:bg-[#161625] border border-[#E1DBCE] dark:border-indigo-950 px-3 py-2.5 text-xs rounded-lg focus:outline-none text-slate-800 dark:text-slate-100"
                    >
                      <option value="₹₹">Signature Standard (₹₹)</option>
                      <option value="₹₹₹">Premium Luxury (₹₹ showcase)</option>
                      <option value="₹₹₹₹">Ultra Prestige Elite (₹₹₹₹ master)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">Premium Services List</label>
                    <input
                      type="text"
                      value={joinServices}
                      onChange={(e) => setJoinServices(e.target.value)}
                      placeholder="e.g. Moroccan Oil Spa, HydraFacial, Nail Art"
                      className="w-full bg-[#FAF7F2] dark:bg-[#161625] border border-[#E1DBCE] dark:border-indigo-950 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-[#A07D1A] text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">Design Concept & Description</label>
                    <textarea
                      rows={2.5}
                      value={joinDescription}
                      onChange={(e) => setJoinDescription(e.target.value)}
                      placeholder="Describe your design aesthetics, premium brands you carry (e.g., Dyson, Chanel, Kérastase), and floor architecture..."
                      className="w-full bg-[#FAF7F2] dark:bg-[#161625] border border-[#E1DBCE] dark:border-indigo-950 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-[#A07D1A] text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="md:col-span-2 mt-2 px-6 py-3.5 bg-[#A07D1A] hover:bg-[#805C06] dark:bg-amber-400 dark:text-neutral-900 text-white font-extrabold rounded-xl text-xs uppercase tracking-widest cursor-pointer hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Store className="w-4 h-4 fill-current" /> Apply via Direct WhatsApp Redirection
                  </button>
                </form>
              ) : (
                <div className="bg-white dark:bg-[#11111a] border border-[#E1DBCE] dark:border-indigo-950/80 p-2 rounded-2xl shadow-xs overflow-hidden h-[540px] relative">
                  <iframe
                    src={`https://tally.so/embed/${tallyFormId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
                    width="100%"
                    height="100%"
                    title="Official Salon Intake Form"
                    className="border-0 rounded-xl"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SHOP OWNERS RESERVATION PORT */}
          {activeTab === 'owner' && (
            <div className="space-y-6">
              {!isOwnerAuthenticated ? (
                <form onSubmit={handleOwnerAuthenticate} className="max-w-md mx-auto space-y-4">
                  <div className="text-center space-y-2">
                    <div className="inline-flex w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/20 text-[#1E3F66] dark:text-amber-400 items-center justify-center">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif italic font-semibold text-lg text-[#1E1A17] dark:text-white">Partner Room Access</h3>
                    <p className="text-xs text-slate-500">Access your salon reservation logs, client statuses, and floor schedules.</p>
                  </div>

                  <div className="space-y-3.5 bg-white dark:bg-[#161625] border border-[#E1DBCE] dark:border-indigo-950/45 p-6 rounded-xl">
                    <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-[#D4AF37]/30 p-3 rounded-lg text-left space-y-1">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 block">🏆 Hackathon Judge Credentials Help</span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        Select any Salon above and use PIN: <code className="bg-[#FAF7F2] dark:bg-[#12121E] px-1 py-0.5 rounded font-mono font-bold text-amber-600 dark:text-amber-400">admin123</code>
                      </p>
                      <button
                        type="button"
                        onClick={() => setOwnerPassword("admin123")}
                        className="text-[10px] text-[#A07D1A] dark:text-amber-400 hover:underline font-mono font-bold block mt-1 cursor-pointer"
                      >
                        ⚡ Auto-Fill Judge PIN
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block text-left">Select My Salon Location</label>
                      <select
                        value={ownerSelectedSalonId}
                        onChange={(e) => setOwnerSelectedSalonId(e.target.value)}
                        className="w-full bg-[#FAF7F2] dark:bg-[#12121E] border border-[#E1DBCE]/60 dark:border-indigo-950 px-3 py-2 text-xs rounded-lg focus:outline-none text-slate-800 dark:text-slate-100"
                      >
                        {salons.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.area})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block text-left">Lounge Access PIN</label>
                      <input
                        type="password"
                        required
                        value={ownerPassword}
                        onChange={(e) => setOwnerPassword(e.target.value)}
                        placeholder="e.g. shop1 (Format: shop[id]) or admin123"
                        className="w-full bg-[#FAF7F2] dark:bg-[#12121E] border border-[#E1DBCE]/60 dark:border-indigo-950 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-[#A07D1A] text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#A07D1A] hover:bg-[#805C06] dark:bg-amber-400 dark:text-slate-900 text-white text-xs uppercase font-extrabold tracking-widest rounded-lg cursor-pointer transition-all"
                    >
                      Authenticate Access
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  
                  {/* Partner Header Stats Dashboard */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-500/5 dark:bg-amber-400/5 border border-[#D4AF37]/30 p-5 rounded-xl text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-tr from-[#A07D1A]/5 to-transparent blur-2xl pointer-events-none"></div>
                    <div>
                      <span className="text-[9px] font-mono text-amber-500 dark:text-amber-400 tracking-widest uppercase font-black">Secure Lounge Portal</span>
                      <h4 className="font-serif italic text-xl font-bold text-slate-800 dark:text-white mt-0.5">{ownerSalon?.name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">📍 {ownerSalon?.area} coordinate line • {ownerSalon?.openHours}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-left sm:text-right shrink-0">
                      <div className="bg-white/60 dark:bg-black/30 border border-slate-200/50 dark:border-neutral-800 p-2.5 rounded-lg">
                        <span className="text-[8.5px] font-mono text-slate-400 block whitespace-nowrap">Confirmed Bookings</span>
                        <span className="text-sm font-bold text-[#A07D1A] dark:text-amber-400">{ownerBookings.length} Guests</span>
                      </div>
                      <div className="bg-white/60 dark:bg-black/30 border border-slate-200/50 dark:border-neutral-800 p-2.5 rounded-lg">
                        <span className="text-[8.5px] font-mono text-slate-400 block whitespace-nowrap">Parly Revenue</span>
                        <span className="text-sm font-bold text-emerald-500">₹{ownerRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Partner bookings table */}
                  <div className="space-y-3 text-left">
                    <h5 className="font-serif italic font-bold text-sm text-[#1E1A17] dark:text-white">Active Queue Logs</h5>
                    
                    <div className="border border-[#E1DBCE] dark:border-indigo-950/45 rounded-xl overflow-hidden bg-white dark:bg-[#12121E]">
                      <table className="w-full text-xs font-sans min-w-[550px]">
                        <thead className="bg-[#FAF6F0] dark:bg-[#161625] border-b border-[#E1DBCE] dark:border-indigo-950/45 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-left">
                          <tr>
                            <th className="p-3">Customer Code</th>
                            <th className="p-3">Schedule</th>
                            <th className="p-3">Service Code / Category</th>
                            <th className="p-3">Contact</th>
                            <th className="p-3">Pricing</th>
                            <th className="p-3">Status Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E1DBCE]/60 dark:divide-indigo-950/30 text-slate-700 dark:text-slate-300">
                          {ownerBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-indigo-950/10">
                              <td className="p-3 font-semibold text-slate-900 dark:text-white">{b.customerName}</td>
                              <td className="p-3 font-medium">
                                <div className="font-mono text-[10.5px] font-semibold text-[#A07D1A] dark:text-amber-400">{b.time}</div>
                                <div className="text-[9.5px] text-slate-400">{b.date}</div>
                              </td>
                              <td className="p-3">
                                <div>{b.service?.name || 'Custom Service'}</div>
                                <span className="px-1.5 py-0.5 mt-1 inline-block bg-slate-100 dark:bg-indigo-950/30 text-slate-500 dark:text-slate-400 text-[8.5px] font-mono font-bold uppercase rounded">
                                  {b.service?.category || 'Custom'} • {b.service?.duration || 'N/A'}
                                </span>
                              </td>
                              <td className="p-3 font-mono text-[10px]">{b.customerPhone}</td>
                              <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">₹{b.service?.price ?? 0}</td>
                              <td className="p-3">
                                {b.status === 'confirmed' ? (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => handleUpdateBookingStatus(b.id, 'completed')}
                                      className="px-2.5 py-1.5 bg-[#FAF7F2] hover:bg-[#A07D1A]/5 text-[#A07D1A] dark:text-amber-400 dark:bg-emerald-900/10 dark:text-emerald-300 border border-[#D4AF37]/35 dark:border-emerald-500/20 text-[9px] uppercase font-bold rounded cursor-pointer leading-none hover:scale-103 transition-transform"
                                    >
                                      ✓ Complete
                                    </button>
                                  </div>
                                ) : (
                                  <span className="px-2 py-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-mono font-black uppercase">
                                    🔴 Closed / Complete
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}

                          {ownerBookings.length === 0 && (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-slate-400 font-mono text-xs">
                                No active reservation files booked for your lounge coordinates today.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Lounge Configuration and Active Campaign Studio */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pt-4 border-t border-[#E1DBCE]/60 dark:border-indigo-950/30 text-left">
                    
                    {/* COL 1 (4/12): PROFILE DETAILS */}
                    <div className="xl:col-span-4 bg-[#FAF7F2]/50 dark:bg-[#161625]/25 border border-[#E1DBCE] dark:border-indigo-950/45 rounded-xl p-5 space-y-4">
                      <div>
                        <h6 className="font-serif italic font-bold text-slate-800 dark:text-white flex items-center gap-1.5 border-b pb-1.5 text-xs">
                          <Store className="w-4 h-4 text-[#A07D1A]" /> Profile Metadata
                        </h6>
                        <p className="text-[10px] text-slate-400 mt-1">Configure live coordinate details, open timings, and specialty tags.</p>
                      </div>

                      <form onSubmit={handleSaveProfile} className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-400">Operating Hours</label>
                          <input
                            type="text"
                            required
                            value={editOpenHours}
                            onChange={(e) => setEditOpenHours(e.target.value)}
                            className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-[#A07D1A] text-slate-800 dark:text-slate-100"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-400">Specialty Tags (Commas)</label>
                          <input
                            type="text"
                            required
                            value={editSpecs}
                            onChange={(e) => setEditSpecs(e.target.value)}
                            className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-[#A07D1A] text-slate-800 dark:text-slate-100"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-400">Architectural Description</label>
                          <textarea
                            rows={3}
                            required
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-[#A07D1A] text-slate-800 dark:text-slate-100 leading-relaxed font-sans"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-[#A07D1A] hover:bg-[#805C06] dark:bg-amber-400 dark:text-slate-950 text-white text-[9.5px] uppercase tracking-widest font-extrabold rounded-lg cursor-pointer transition-all"
                        >
                          ✦ Synchronize Profile
                        </button>
                      </form>
                    </div>

                    {/* COL 2 (4/12): ACTIVE PROMOTION CAMPAIGN */}
                    <div className="xl:col-span-4 bg-[#FAF7F2]/50 dark:bg-[#161625]/25 border border-[#E1DBCE] dark:border-indigo-950/45 rounded-xl p-5 space-y-4">
                      <div>
                        <h6 className="font-serif italic font-bold text-slate-800 dark:text-white flex items-center gap-1.5 border-b pb-1.5 text-xs">
                          <Sparkles className="w-4 h-4 text-amber-500" /> Active Promotions & Offers
                        </h6>
                        <p className="text-[10px] text-slate-400 mt-1">Deploy visual highlight banners and coupon codes directly on the marketplace.</p>
                      </div>

                      <form onSubmit={handleSaveOffers} className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-400">Promotion Title</label>
                          <input
                            type="text"
                            value={editOfferTitle}
                            onChange={(e) => setEditOfferTitle(e.target.value)}
                            placeholder="e.g. 20% Off Japanese Spa"
                            className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-[#A07D1A] text-slate-800 dark:text-slate-100"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-400">Coupon Code</label>
                          <input
                            type="text"
                            value={editOfferCode}
                            onChange={(e) => setEditOfferCode(e.target.value)}
                            placeholder="e.g. GLOWSPA20"
                            className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-[#A07D1A] text-slate-800 dark:text-slate-100 uppercase font-mono font-bold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-400">Promotion Terms & Details</label>
                          <textarea
                            rows={3}
                            value={editOfferDesc}
                            onChange={(e) => setEditOfferDesc(e.target.value)}
                            placeholder="Describe what services are included or the terms..."
                            className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-[#A07D1A] text-slate-800 dark:text-slate-100 leading-relaxed font-sans"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white text-[9.5px] uppercase tracking-widest font-extrabold rounded-lg cursor-pointer transition-all"
                          >
                            ✦ Deploy Offer
                          </button>
                          
                          {(editOfferTitle || editOfferCode) && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditOfferTitle('');
                                setEditOfferDesc('');
                                setEditOfferCode('');
                                handleUpdateSalonField({
                                  offerTitle: '',
                                  offerDesc: '',
                                  offerCode: ''
                                });
                                alert("Promotional campaign cleared live.");
                              }}
                              className="px-3 py-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 border border-rose-500/20 text-[9.5px] uppercase tracking-wider font-bold rounded-lg cursor-pointer transition-all"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* COL 3 (4/12): SERVICES MENU MANAGER */}
                    <div className="xl:col-span-4 bg-[#FAF7F2]/50 dark:bg-[#161625]/25 border border-[#E1DBCE] dark:border-indigo-950/45 rounded-xl p-5 space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div>
                          <h6 className="font-serif italic font-bold text-slate-800 dark:text-white flex items-center gap-1.5 border-b pb-1.5 text-xs">
                            <Plus className="w-4 h-4 text-emerald-500" /> Services Menu Catalog
                          </h6>
                          <p className="text-[10px] text-slate-400 mt-1">Live active treatments, durations, and price points.</p>
                        </div>

                        {/* SERVICE ITEMS LIST WITH DELETIONS */}
                        <div className="border border-[#E1DBCE]/60 dark:border-indigo-950/50 rounded-lg overflow-hidden max-h-[140px] overflow-y-auto divide-y divide-[#E1DBCE]/40 dark:divide-indigo-950/25 bg-white dark:bg-[#12121E]">
                          {(ownerSalon.services || []).map((s, idx) => (
                            <div key={idx} className="p-2 flex items-center justify-between text-[11px] hover:bg-slate-50 dark:hover:bg-indigo-950/10">
                              <div>
                                <div className="font-serif italic font-extrabold text-[#805C06] dark:text-amber-400 leading-tight">{s.name}</div>
                                <div className="text-[9px] text-slate-400 font-mono mt-0.5">{s.category} • {s.duration}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-900 dark:text-white">₹{s.price}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteService(idx)}
                                  className="p-1 text-rose-500 hover:bg-rose-500/10 rounded cursor-pointer"
                                  title="Remove service"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ADD SERVICE MINI-FORM */}
                      <form onSubmit={handleAddService} className="pt-3 border-t border-[#E1DBCE]/40 dark:border-indigo-950/25 space-y-2 text-left">
                        <span className="text-[9px] font-mono font-black text-[#A07D1A] dark:text-amber-400 uppercase tracking-widest block">✦ Append New Treat</span>
                        
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            required
                            placeholder="Service Name"
                            value={newSvcName}
                            onChange={(e) => setNewSvcName(e.target.value)}
                            className="bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-2 py-1 text-xs rounded focus:outline-none"
                          />
                          <input
                            type="number"
                            required
                            placeholder="Price (₹)"
                            value={newSvcPrice}
                            onChange={(e) => setNewSvcPrice(e.target.value)}
                            className="bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-2 py-1 text-xs rounded focus:outline-none font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            placeholder="Duration (e.g. 60 mins)"
                            value={newSvcDuration}
                            onChange={(e) => setNewSvcDuration(e.target.value)}
                            className="bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-2 py-1 text-xs rounded focus:outline-none"
                          />
                          <select
                            value={newSvcCategory}
                            onChange={(e) => setNewSvcCategory(e.target.value)}
                            className="bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-1 py-1 text-xs rounded focus:outline-none"
                          >
                            <option value="Hair">Hair Care</option>
                            <option value="Skin">Skin/Facials</option>
                            <option value="Nails">Nail Art</option>
                            <option value="Spa">Massages/Spa</option>
                            <option value="Bridal">Bridal Sessions</option>
                            <option value="Grooming">Executive Grooming</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] uppercase tracking-widest font-black rounded cursor-pointer transition-all"
                        >
                          ✦ Deploy Menu Service
                        </button>
                      </form>
                    </div>

                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 3: PLATFORM ADMINISTRATIVE PORT */}
          {activeTab === 'admin' && (
            <div className="space-y-6">
              {!isAdminAuthenticated ? (
                <form onSubmit={handleAdminAuthenticate} className="max-w-md mx-auto space-y-4">
                  <div className="text-center space-y-2">
                    <div className="inline-flex w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/20 text-rose-500 dark:text-rose-400 items-center justify-center">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif italic font-semibold text-lg text-[#1E1A17] dark:text-white font-bold">Secretariat Access</h3>
                    <p className="text-xs text-slate-500">Authorized platform auditors only.</p>
                  </div>

                  <div className="space-y-3.5 bg-white dark:bg-[#161625] border border-[#E1DBCE] dark:border-indigo-950/45 p-6 rounded-xl">
                    <div className="bg-rose-500/10 dark:bg-rose-500/5 border border-rose-500/30 p-3 rounded-lg text-left space-y-1">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">🏆 Hackathon Judge Credentials Help</span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        Username: <code className="bg-[#FAF7F2] dark:bg-[#12121E] px-1 py-0.5 rounded font-mono font-bold text-rose-600 dark:text-rose-400">admin</code> and Audit Key: <code className="bg-[#FAF7F2] dark:bg-[#12121E] px-1 py-0.5 rounded font-mono font-bold text-rose-600 dark:text-rose-400">admin123</code>
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminUsername("admin");
                          setAdminPassword("admin123");
                        }}
                        className="text-[10px] text-rose-600 dark:text-rose-400 hover:underline font-mono font-bold block mt-1 cursor-pointer"
                      >
                        ⚡ Auto-Fill Admin Credentials
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block text-left">Admin Username</label>
                      <input
                        type="text"
                        required
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="Default: admin"
                        className="w-full bg-[#FAF7F2] dark:bg-[#12121E] border border-[#E1DBCE]/60 dark:border-indigo-950 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-[#A07D1A] text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block text-left">Audit Key</label>
                      <input
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Default: admin123"
                        className="w-full bg-[#FAF7F2] dark:bg-[#12121E] border border-[#E1DBCE]/60 dark:border-indigo-950 px-3 py-2 text-xs rounded-lg focus:outline-none focus:border-[#A07D1A] text-slate-800 dark:text-slate-100"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#A07D1A] hover:bg-[#805C06] dark:bg-amber-400 dark:text-slate-900 text-white text-xs uppercase font-extrabold tracking-widest rounded-lg cursor-pointer transition-all"
                    >
                      Audit Credentials
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8 text-left">
                  
                  {/* Admin Panel Header summary */}
                  <div className="flex items-center justify-between border-b border-[#E1DBCE] dark:border-indigo-950 pb-3">
                    <div>
                      <h4 className="font-serif italic text-xl text-[#A07D1A] dark:text-amber-400 font-bold">Secretariat Dashboard</h4>
                      <p className="text-xs text-slate-500 font-mono uppercase mt-0.5">🟢 ACTIVE ADMIN PROTOCOL ACCESS</p>
                    </div>
                    <button
                      onClick={() => setIsAdminAuthenticated(false)}
                      className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30 text-[10px] uppercase font-bold tracking-wider rounded cursor-pointer transition-all"
                    >
                      Logout Session
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT (7/12): REGISTERED SHOPS CONFIG CELL */}
                    <div className="lg:col-span-7 space-y-4">
                      <h5 className="font-serif italic font-bold text-sm text-[#1E1A17] dark:text-white flex items-center gap-1.5 border-b pb-1">
                        <Store className="w-4 h-4 text-[#A07D1A]" /> Registered Lounges ({salons.length})
                      </h5>

                      <div className="border border-[#E1DBCE] dark:border-indigo-950 rounded-xl overflow-hidden max-h-[380px] overflow-y-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-[#FAF6F0] dark:bg-[#161625] text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <tr>
                              <th className="p-3">Salon Identity</th>
                              <th className="p-3">Sector</th>
                              <th className="p-3">Price Tier</th>
                              <th className="p-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E1DBCE]/50 dark:divide-indigo-950/30 text-slate-700 dark:text-slate-300">
                            {salons.map((s) => (
                              <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-indigo-950/10">
                                <td className="p-3">
                                  <div className="font-serif italic font-extrabold text-[#805C06] dark:text-amber-400 text-sm leading-tight">{s.name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID No: {s.id}</div>
                                </td>
                                <td className="p-3 font-mono text-[11px]">{s.area}</td>
                                <td className="p-3 font-bold">{s.priceRange}</td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={async () => {
                                        const currentPin = credentials[s.id] || `shop${s.id}`;
                                        const pin = prompt(`Define shop login PIN credentials for ${s.name}:`, currentPin);
                                        if (pin !== null && pin.trim()) {
                                          try {
                                            const res = await fetch('/api/credentials', {
                                              method: 'POST',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({ salonId: s.id, password: pin.trim() })
                                            });
                                            if (res.ok) {
                                              await fetchCredentials();
                                              alert(`Login PIN updated dynamically for ${s.name} to: "${pin.trim()}"`);
                                            }
                                          } catch (e) {
                                            alert("Failed to sync PIN with database server.");
                                          }
                                        }
                                      }}
                                      className="p-1.5 text-[#A07D1A] dark:text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20 rounded cursor-pointer hover:scale-105 transition-transform"
                                      title={`Manage Login credentials. Current PIN: ${credentials[s.id] || `shop${s.id}`}`}
                                    >
                                      <KeyRound className="w-4 h-4" />
                                    </button>

                                    <button
                                      onClick={() => handleDeleteSalon(s.id, s.name)}
                                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-950/30 border border-transparent hover:border-rose-500/20 rounded cursor-pointer hover:scale-105 transition-transform"
                                      title="Revoke Salon listing"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* RIGHT (5/12): ADD NEW SHOP CONSTRUCT CELL */}
                    <div className="lg:col-span-5 bg-[#FAF7F2]/50 dark:bg-[#161625]/30 border border-[#E1DBCE] dark:border-indigo-950/45 rounded-xl p-5 space-y-4">
                      <h5 className="font-serif italic font-bold text-sm text-[#1E1A17] dark:text-white flex items-center gap-1.5 border-b pb-1">
                        <Plus className="w-4 h-4 text-amber-500" /> Construct New Lounge
                      </h5>

                      <form onSubmit={handleCreateSalon} className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9.5px] font-mono font-bold tracking-wider uppercase text-slate-400">Salon Name *</label>
                          <input
                            type="text"
                            required
                            value={newSalonName}
                            onChange={(e) => setNewSalonName(e.target.value)}
                            placeholder="e.g. Silk Velvet Salon"
                            className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-3 py-1.5 text-xs rounded-lg focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9.5px] font-mono font-bold tracking-wider uppercase text-slate-400">Sector *</label>
                            <select
                              value={newSalonArea}
                              onChange={(e) => setNewSalonArea(e.target.value as any)}
                              className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-2 py-1.5 text-xs rounded-lg focus:outline-none"
                            >
                              <option value="Indiranagar">Indiranagar</option>
                              <option value="Koramangala">Koramangala</option>
                              <option value="Whitefield">Whitefield</option>
                              <option value="Jayanagar">Jayanagar</option>
                              <option value="HSR Layout">HSR Layout</option>
                              <option value="Banaswadi">Banaswadi</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9.5px] font-mono font-bold tracking-wider uppercase text-slate-400">Price Tier *</label>
                            <select
                              value={newSalonPrice}
                              onChange={(e) => setNewSalonPrice(e.target.value as any)}
                              className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-2 py-1.5 text-xs rounded-lg focus:outline-none"
                            >
                              <option value="₹₹">₹ India Standard (₹₹)</option>
                              <option value="₹₹₹">₹ Prestige (₹₹)</option>
                              <option value="₹₹₹₹">₹ Ultra Luxe (₹₹)</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9.5px] font-mono font-bold tracking-wider uppercase text-slate-400">Open Hours *</label>
                          <input
                            type="text"
                            required
                            value={newSalonHours}
                            onChange={(e) => setNewSalonHours(e.target.value)}
                            placeholder="09:00 AM - 09:00 PM"
                            className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-3 py-1.5 text-xs rounded-lg focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9.5px] font-mono font-bold tracking-wider uppercase text-slate-400">Specialties tags (Commas)</label>
                          <input
                            type="text"
                            value={newSalonSpecs}
                            onChange={(e) => setNewSalonSpecs(e.target.value)}
                            placeholder="French Balayage, Japanese Head Spa..."
                            className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-3 py-1.5 text-xs rounded-lg focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9.5px] font-mono font-bold tracking-wider uppercase text-slate-400">Services Setup lines (Service | price | hours | Category)</label>
                          <textarea
                            rows={2}
                            value={newSalonServicesText}
                            onChange={(e) => setNewSalonServicesText(e.target.value)}
                            placeholder="e.g. Balayage Dye | 9500 | 120 mins | Hair"
                            className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-3 py-1 text-xs rounded-lg font-mono leading-relaxed"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9.5px] font-mono font-bold tracking-wider uppercase text-slate-400">Architecture Description *</label>
                          <textarea
                            rows={2}
                            required
                            value={newSalonDescription}
                            onChange={(e) => setNewSalonDescription(e.target.value)}
                            placeholder="..."
                            className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-3 py-1 text-xs rounded-lg focus:outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase tracking-widest font-extrabold rounded-lg cursor-pointer transition-all"
                        >
                          ✦ Deploy New Salon Coordinates
                        </button>
                      </form>
                    </div>

                  </div>

                  {/* Supabase Admin status section */}
                  <div className="bg-[#12121e] border border-blue-900/40 p-6 rounded-2xl space-y-4 text-left shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-950 pb-3">
                      <div>
                        <h5 className="text-amber-400 font-serif italic text-base font-extrabold flex items-center gap-2">
                          ⚡ Supabase Cloud Sync Control
                        </h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Monitor database replication sync state to your Supabase tables.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={fetchSupabaseStatus}
                        className="px-3 py-1.5 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-900/65 text-indigo-300 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors"
                      >
                        Refresh Diagnostics
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Stat 1: Connection status */}
                      <div className="bg-neutral-900/40 border border-indigo-950 px-4 py-3 rounded-xl flex items-center gap-3">
                        <span className="text-xl">🔌</span>
                        <div>
                          <div className="text-[9px] font-mono tracking-wider text-slate-400 uppercase">Supabase Link</div>
                          <div className={`text-xs font-bold ${supabaseStatus?.connected ? "text-emerald-400" : "text-amber-500"}`}>
                            {supabaseStatus?.connected ? "CONNECTED (REAL-TIME)" : "DISCONNECTED / UNLINKED"}
                          </div>
                        </div>
                      </div>

                      {/* Stat 2: Salons table */}
                      <div className="bg-neutral-900/40 border border-indigo-950 px-4 py-3 rounded-xl flex items-center gap-3">
                        <span className="text-xl">🏢</span>
                        <div>
                          <div className="text-[9px] font-mono tracking-wider text-slate-400 uppercase">salons table</div>
                          <div className={`text-xs font-bold ${supabaseStatus?.salonsTableOk ? "text-emerald-400" : "text-rose-500"}`}>
                            {supabaseStatus?.connected ? (supabaseStatus?.salonsTableOk ? "SYNC ACTIVE (READY)" : "TABLE MISSING ⚠️") : "PENDING LINK"}
                          </div>
                        </div>
                      </div>

                      {/* Stat 3: Bookings table */}
                      <div className="bg-neutral-900/40 border border-indigo-950 px-4 py-3 rounded-xl flex items-center gap-3">
                        <span className="text-xl">📅</span>
                        <div>
                          <div className="text-[9px] font-mono tracking-wider text-slate-400 uppercase">bookings table</div>
                          <div className={`text-xs font-bold ${supabaseStatus?.bookingsTableOk ? "text-emerald-400" : "text-rose-500"}`}>
                            {supabaseStatus?.connected ? (supabaseStatus?.bookingsTableOk ? "SYNC ACTIVE (READY)" : "TABLE MISSING ⚠️") : "PENDING LINK"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* How to configure Supabase help */}
                    {(!supabaseStatus?.salonsTableOk || !supabaseStatus?.bookingsTableOk) && (
                      <div className="bg-[#0b0b11] border border-amber-900/35 p-4 rounded-xl space-y-3">
                        <div className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-extrabold flex items-center gap-1">
                          🛠️ Setup Requirement: Missing Database Tables Detected
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          To activate Cloud sync, copy and paste this script in your **Supabase Dashboard SQL Editor** and click **Run**. Once created, the warnings will disappear instantly!
                        </p>
                        <pre className="text-[10px] leading-relaxed font-mono p-3 bg-black/60 border border-indigo-950/40 text-[#4ade80] rounded-lg overflow-x-auto max-h-[180px] text-left">
{`-- SQL SCRIPT FOR SUPABASE EDITOR:
create table salons (
  id text primary key,
  name text,
  area text,
  rating numeric,
  "reviewCount" int,
  "priceRange" text,
  images jsonb,
  services jsonb,
  "openHours" text,
  specialties jsonb,
  "isLuxury" boolean,
  "isFeatured" boolean,
  description text,
  "reviewsCount" int,
  reviews jsonb
);

create table bookings (
  id text primary key,
  "salonId" text,
  "salonName" text,
  service jsonb,
  date text,
  time text,
  "customerName" text,
  "customerPhone" text,
  status text
);`}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Style DNA audits and Verified Testimonials section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
                    
                    {/* LEFT PANEL: STYLE DNA SUBMISSIONS */}
                    <div className="bg-[#FAF7F2]/50 dark:bg-[#161625]/25 border border-[#E1DBCE] dark:border-indigo-950/45 rounded-xl p-5 space-y-4">
                      <div>
                        <h5 className="font-serif italic font-bold text-slate-800 dark:text-white flex items-center gap-1.5 border-b pb-1.5 text-xs">
                          🧬 Active Style DNA Audits ({quizResultsList.length})
                        </h5>
                        <p className="text-[10px] text-slate-400 mt-1">Audit profiles filled dynamically by users after completing the style selector quiz.</p>
                      </div>

                      <div className="max-h-[220px] overflow-y-auto space-y-2.5">
                        {quizResultsList.map((q, idx) => (
                          <div key={q.id || idx} className="bg-white dark:bg-[#12121E] border border-[#E1DBCE]/60 dark:border-indigo-950/50 rounded-lg p-3 text-[11px] relative flex justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 dark:text-white font-serif italic">Vibe Match: {q.resultVibe}</span>
                                <span className="px-1.5 py-0.5 bg-amber-500/10 text-[#A07D1A] dark:text-amber-400 rounded text-[8px] font-mono font-bold uppercase">{q.timestamp ? new Date(q.timestamp).toLocaleDateString() : 'Guest'}</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                                {q.name || "Anonymous Style Icon"} matched {q.matchedSalons?.length || 0} salons.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuizResult(q.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded self-start cursor-pointer transition-colors"
                              title="Clear Style DNA file"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {quizResultsList.length === 0 && (
                          <div className="p-8 text-center text-slate-400 font-mono text-xs border border-dashed border-[#E1DBCE]/65 dark:border-indigo-950 rounded-lg">
                            No active Style DNA results saved yet in database.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT PANEL: TESTIMONIALS & REVIEWS MANAGER */}
                    <div className="bg-[#FAF7F2]/50 dark:bg-[#161625]/25 border border-[#E1DBCE] dark:border-indigo-950/45 rounded-xl p-5 space-y-4">
                      <div>
                        <h5 className="font-serif italic font-bold text-slate-800 dark:text-white flex items-center gap-1.5 border-b pb-1.5 text-xs">
                          💬 Verified Testimonial Reviews ({testimonialsList.length})
                        </h5>
                        <p className="text-[10px] text-slate-400 mt-1">Manage and deploy customer feedback quotes directly onto the live web layout.</p>
                      </div>

                      {/* Manual testimonial adder form */}
                      <form onSubmit={handleAddTestimonialSubmit} className="bg-white dark:bg-[#12121E] border border-[#E1DBCE]/60 dark:border-indigo-950/50 p-3 rounded-lg space-y-2 text-left">
                        <span className="text-[9px] font-mono font-black text-amber-500 dark:text-amber-400 uppercase tracking-widest block">✦ Write & Deploy Customer Review</span>
                        
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            required
                            placeholder="Customer Name"
                            value={newTestimonialName}
                            onChange={(e) => setNewTestimonialName(e.target.value)}
                            className="bg-slate-50 dark:bg-black/25 border border-[#E1DBCE]/85 dark:border-indigo-950 px-2 py-1 text-xs rounded focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Designation / Role"
                            value={newTestimonialRole}
                            onChange={(e) => setNewTestimonialRole(e.target.value)}
                            className="bg-slate-50 dark:bg-black/25 border border-[#E1DBCE]/85 dark:border-indigo-950 px-2 py-1 text-xs rounded focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          <select
                            value={newTestimonialRating}
                            onChange={(e) => setNewTestimonialRating(e.target.value)}
                            className="bg-slate-50 dark:bg-black/25 border border-[#E1DBCE]/85 dark:border-indigo-950 px-1 py-1 text-xs rounded focus:outline-none"
                          >
                            <option value="5">★★★★★ (5 Stars)</option>
                            <option value="4">★★★★☆ (4 Stars)</option>
                            <option value="3">★★★☆☆ (3 Stars)</option>
                          </select>
                          <select
                            value={newTestimonialArea}
                            onChange={(e) => setNewTestimonialArea(e.target.value)}
                            className="bg-slate-50 dark:bg-black/25 border border-[#E1DBCE]/85 dark:border-indigo-950 px-1 py-1 text-xs rounded focus:outline-none"
                          >
                            <option value="Indiranagar">Indiranagar</option>
                            <option value="Koramangala">Koramangala</option>
                            <option value="Whitefield">Whitefield</option>
                            <option value="Jayanagar">Jayanagar</option>
                            <option value="HSR Layout">HSR Layout</option>
                            <option value="Banaswadi">Banaswadi</option>
                          </select>
                        </div>

                        <textarea
                          rows={2}
                          required
                          placeholder="Quote / Experience Review text..."
                          value={newTestimonialQuote}
                          onChange={(e) => setNewTestimonialQuote(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-black/25 border border-[#E1DBCE]/85 dark:border-indigo-950 px-2 py-1 text-xs rounded focus:outline-none font-sans leading-relaxed"
                        />

                        <button
                          type="submit"
                          className="w-full py-1 bg-[#A07D1A] hover:bg-[#805C06] dark:bg-amber-400 dark:text-slate-950 text-white text-[9px] uppercase tracking-widest font-black rounded cursor-pointer transition-all"
                        >
                          ✦ Deploy Customer Review
                        </button>
                      </form>

                      {/* Dynamic list */}
                      <div className="max-h-[160px] overflow-y-auto space-y-2">
                        {testimonialsList.map((t, idx) => (
                          <div key={t.id || idx} className="bg-white dark:bg-[#12121E] border border-[#E1DBCE]/60 dark:border-indigo-950/50 rounded-lg p-2.5 text-[11px] flex justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="font-extrabold text-slate-800 dark:text-slate-100">{t.name}</span>
                                <span className="text-slate-400 font-normal">({t.role || 'Verified'})</span>
                                <span className="text-amber-500 text-[10px]">{"★".repeat(t.rating || 5)}</span>
                              </div>
                              <p className="text-slate-500 italic mt-0.5 leading-normal">"{t.quote}"</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteTestimonial(t.id)}
                              className="p-1 text-rose-500 hover:bg-rose-500/10 rounded cursor-pointer self-center"
                              title="Delete Testimonial"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        {testimonialsList.length === 0 && (
                          <div className="p-4 text-center text-slate-400 font-mono text-[10px]">
                            No custom testimonials loaded in database. Falling back to default mock list.
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
