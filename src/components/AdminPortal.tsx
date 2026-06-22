import React, { useState, useMemo, useEffect } from 'react';
import { X, Shield, Users, Store, Send, CheckCircle2, Trash2, CalendarCheck, HelpCircle, RefreshCw, KeyRound, ArrowRight, Sparkles, Navigation, Plus, DollarSign, Clock, Image, Tag, Edit3, Save, Phone, Mail, MapPinIcon } from 'lucide-react';
import { Salon, Booking, Service, Offer } from '../types';

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
  const [joinPrice, setJoinPrice] = useState('$$$');
  const [joinServices, setJoinServices] = useState('');
  const [joinDescription, setJoinDescription] = useState('');

  // Shop Owner states
  const [ownerSelectedSalonId, setOwnerSelectedSalonId] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState(false);
  const [ownerSalon, setOwnerSalon] = useState<Salon | null>(null);
  const [ownerEditMode, setOwnerEditMode] = useState(false);
  const [editedSalon, setEditedSalon] = useState<Salon | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newOffer, setNewOffer] = useState<Partial<Offer>>({
    title: '', description: '', discountPercent: 10, validUntil: '', code: '', isActive: true
  });
  const [showAddOffer, setShowAddOffer] = useState(false);

  // Admin states
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Create Salon states
  const [newSalonName, setNewSalonName] = useState('');
  const [newSalonArea, setNewSalonArea] = useState<'Indiranagar' | 'Koramangala' | 'Whitefield' | 'Jayanagar' | 'HSR Layout' | 'Banaswadi'>('Indiranagar');
  const [newSalonPrice, setNewSalonPrice] = useState<'$$' | '$$$' | '$$$$'>('$$$');
  const [newSalonHours, setNewSalonHours] = useState('09:00 AM - 09:00 PM');
  const [newSalonSpecs, setNewSalonSpecs] = useState('');
  const [newSalonDescription, setNewSalonDescription] = useState('');
  const [newSalonServicesText, setNewSalonServicesText] = useState(`Haircut & Styling | 1500 | 45 mins | Grooming\nLuxury Gold Facials | 6000 | 75 mins | Skin`);
  const [newSalonPhone, setNewSalonPhone] = useState('');
  const [newSalonEmail, setNewSalonEmail] = useState('');
  const [newSalonAddress, setNewSalonAddress] = useState('');

  useEffect(() => {
    if (isOpen) {
      setJoinShopName('');
      setJoinOwnerName('');
      setJoinContact('');
      setJoinDescription('');
      setJoinServices('');
      
      setOwnerPassword('');
      setOwnerSelectedSalonId(salons[0]?.id || '');
      setIsOwnerAuthenticated(false);
      setOwnerSalon(null);
      setOwnerEditMode(false);
      setEditedSalon(null);

      setAdminUsername('');
      setAdminPassword('');
      setIsAdminAuthenticated(false);
    }
  }, [isOpen, salons]);

  const handleJoinSubmitWhatsapp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinShopName || !joinOwnerName || !joinContact) {
      alert("Please provide Shop Name, Owner Name, and Contact Number coordinates.");
      return;
    }

    const compiledMessage = `Hello GlamBlr Platform! I'd love to list my luxury lounge on your marketplace.\n\n` +
      `SHOP NAME: ${joinShopName}\n` +
      `OWNER/REPRESENTATIVE: ${joinOwnerName}\n` +
      `CONTACT PHONE: ${joinContact}\n` +
      `SECTOR AREA: ${joinArea}\n` +
      `PRICING ESTIMATE: ${joinPrice}\n` +
      `PREMIUM SERVICES: ${joinServices || "Luxury Grooming, Balayage, Facials"}\n` +
      `DESIGN CONCEPT & HISTORY: ${joinDescription || "A high-end styling lounge."}`;

    const waUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(compiledMessage)}`;
    window.open(waUrl, '_blank');
  };

  const handleOwnerAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    const salon = salons.find(s => s.id === ownerSelectedSalonId);
    if (!salon) return;

    const expectedPassword = "shop" + salon.id; 
    
    if (ownerPassword === "goldowner" || ownerPassword === expectedPassword || ownerPassword === "admin123") {
      setIsOwnerAuthenticated(true);
      setOwnerSalon(salon);
      setEditedSalon({ ...salon });
    } else {
      alert(`Invalid credential code! For development, try: shop${salon.id} or admin123`);
    }
  };

  const handleAdminAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if ((adminUsername === 'admin' && adminPassword === 'goldadmin') || (adminUsername === 'admin' && adminPassword === 'admin123')) {
      setIsAdminAuthenticated(true);
    } else {
      alert("Invalid GlamBlr secretariat access credentials. (Try: admin / admin123)");
    }
  };

  const handleCreateSalon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSalonName || !newSalonDescription) {
      alert("Please complete Name and Description coordinates.");
      return;
    }

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
        images: ["https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800"],
        phone: newSalonPhone,
        email: newSalonEmail,
        address: newSalonAddress
      };

      const res = await fetch('/api/salons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Could not construct new salon coordinates");
      
      alert(`Construct complete: ${newSalonName} is now registered on the live GlamBlr grid!`);
      setNewSalonName('');
      setNewSalonDescription('');
      setNewSalonSpecs('');
      setNewSalonPhone('');
      setNewSalonEmail('');
      setNewSalonAddress('');
      onRefreshData();
    } catch (err) {
      console.error(err);
      alert("Construction failed. Check server log files.");
    }
  };

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

  const handleSaveSalonEdits = async () => {
    if (!editedSalon) return;
    
    try {
      const res = await fetch(`/api/salons/${editedSalon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedSalon)
      });
      
      if (res.ok) {
        setOwnerSalon(editedSalon);
        setOwnerEditMode(false);
        onRefreshData();
        alert('Salon details updated successfully!');
      } else {
        throw new Error('Failed to update');
      }
    } catch (err) {
      console.error(err);
      alert('Update failed. Server may not support PUT on salons yet.');
      // Fallback: update local state
      setOwnerSalon(editedSalon);
      setOwnerEditMode(false);
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim() || !editedSalon) return;
    setEditedSalon({
      ...editedSalon,
      images: [...editedSalon.images, newImageUrl.trim()]
    });
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    if (!editedSalon) return;
    const newImages = editedSalon.images.filter((_, i) => i !== index);
    setEditedSalon({ ...editedSalon, images: newImages });
  };

  const handleAddOffer = () => {
    if (!newOffer.title || !newOffer.code || !editedSalon) return;
    const offer: Offer = {
      id: `offer-${Date.now()}`,
      title: newOffer.title,
      description: newOffer.description || '',
      discountPercent: newOffer.discountPercent || 10,
      validUntil: newOffer.validUntil || '2026-12-31',
      code: newOffer.code,
      isActive: true
    };
    setEditedSalon({
      ...editedSalon,
      offers: [...(editedSalon.offers || []), offer]
    });
    setNewOffer({ title: '', description: '', discountPercent: 10, validUntil: '', code: '', isActive: true });
    setShowAddOffer(false);
  };

  const handleToggleOffer = (offerId: string) => {
    if (!editedSalon) return;
    setEditedSalon({
      ...editedSalon,
      offers: (editedSalon.offers || []).map(o => 
        o.id === offerId ? { ...o, isActive: !o.isActive } : o
      )
    });
  };

  const handleDeleteOffer = (offerId: string) => {
    if (!editedSalon) return;
    setEditedSalon({
      ...editedSalon,
      offers: (editedSalon.offers || []).filter(o => o.id !== offerId)
    });
  };

  const ownerBookings = useMemo(() => {
    if (!ownerSalon) return [];
    return bookings.filter(b => b.salonId === ownerSalon.id);
  }, [bookings, ownerSalon]);

  const ownerRevenue = useMemo(() => {
    return ownerBookings.reduce((sum, b) => b.status === 'confirmed' || b.status === 'completed' ? sum + b.service.price : sum, 0);
  }, [ownerBookings]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      
      <div className="bg-white dark:bg-[#12121E] border border-[#E1DBCE] dark:border-indigo-950/60 rounded-2xl w-full max-w-5xl h-[90vh] md:h-[85vh] flex flex-col overflow-hidden text-left shadow-2xl relative scale-in">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-500 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

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

        <div className="flex-1 overflow-y-auto p-6 md:p-8">

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
                      <option value="$$">Signature Standard ($$)</option>
                      <option value="$$$">Premium Luxury ($$$)</option>
                      <option value="$$$$">Ultra Prestige Elite ($$$$)</option>
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
                      placeholder="Describe your design aesthetics, premium brands you carry (e.g., Dyson, Chanel, Kerastase), and floor architecture..."
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
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{ownerSalon?.area} coordinate line - {ownerSalon?.openHours}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-left sm:text-right shrink-0">
                      <div className="bg-white/60 dark:bg-black/30 border border-slate-200/50 dark:border-neutral-800 p-2.5 rounded-lg">
                        <span className="text-[8.5px] font-mono text-slate-400 block whitespace-nowrap">Confirmed Bookings</span>
                        <span className="text-sm font-bold text-[#A07D1A] dark:text-amber-400">{ownerBookings.length} Guests</span>
                      </div>
                      <div className="bg-white/60 dark:bg-black/30 border border-slate-200/50 dark:border-neutral-800 p-2.5 rounded-lg">
                        <span className="text-[8.5px] font-mono text-slate-400 block whitespace-nowrap">Parly Revenue</span>
                        <span className="text-sm font-bold text-emerald-500">Rs.{ownerRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Salon Management Tabs */}
                  <div className="flex gap-2 border-b border-[#E1DBCE] dark:border-indigo-950/40 pb-2">
                    <button
                      onClick={() => { setOwnerEditMode(false); }}
                      className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider font-extrabold rounded-lg transition-all ${!ownerEditMode ? 'bg-[#A07D1A] text-white' : 'text-slate-500 hover:text-[#A07D1A]'}`}
                    >
                      Bookings
                    </button>
                    <button
                      onClick={() => { setOwnerEditMode(true); setEditedSalon(ownerSalon ? { ...ownerSalon } : null); }}
                      className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider font-extrabold rounded-lg transition-all ${ownerEditMode ? 'bg-[#A07D1A] text-white' : 'text-slate-500 hover:text-[#A07D1A]'}`}
                    >
                      Edit Profile & Offers
                    </button>
                  </div>

                  {!ownerEditMode ? (
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
                                  <div>{b.service.name}</div>
                                  <span className="px-1.5 py-0.5 mt-1 inline-block bg-slate-100 dark:bg-indigo-950/30 text-slate-500 dark:text-slate-400 text-[8.5px] font-mono font-bold uppercase rounded">
                                    {b.service.category} - {b.service.duration}
                                  </span>
                                </td>
                                <td className="p-3 font-mono text-[10px]">{b.customerPhone}</td>
                                <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">Rs.{b.service.price}</td>
                                <td className="p-3">
                                  {b.status === 'confirmed' ? (
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        onClick={() => handleUpdateBookingStatus(b.id, 'completed')}
                                        className="px-2.5 py-1.5 bg-[#FAF7F2] hover:bg-[#A07D1A]/5 text-[#A07D1A] dark:text-amber-400 dark:bg-emerald-900/10 border border-[#D4AF37]/35 text-[9px] uppercase font-bold rounded cursor-pointer leading-none hover:scale-103 transition-transform"
                                      >
                                        Complete
                                      </button>
                                      <button
                                        onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-500 border border-rose-200 text-[8px] uppercase font-bold rounded cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : b.status === 'completed' ? (
                                    <span className="px-2 py-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-mono font-black uppercase">
                                      Completed
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded text-[9px] font-mono font-black uppercase">
                                      Cancelled
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
                  ) : (
                    <div className="space-y-6">
                      {editedSalon && (
                        <>
                          {/* Edit Basic Info */}
                          <div className="bg-white dark:bg-[#161625] border border-[#E1DBCE] dark:border-indigo-950/45 rounded-xl p-5 space-y-4">
                            <div className="flex items-center justify-between">
                              <h5 className="font-serif italic font-bold text-sm text-[#1E1A17] dark:text-white flex items-center gap-1.5">
                                <Edit3 className="w-4 h-4 text-[#A07D1A]" /> Edit Salon Details
                              </h5>
                              <button
                                onClick={handleSaveSalonEdits}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase font-extrabold tracking-wider rounded-lg cursor-pointer transition-all flex items-center gap-1"
                              >
                                <Save className="w-3.5 h-3.5" /> Save Changes
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono font-bold uppercase text-slate-400">Salon Name</label>
                                <input
                                  type="text"
                                  value={editedSalon.name}
                                  onChange={(e) => setEditedSalon({ ...editedSalon, name: e.target.value })}
                                  className="w-full bg-[#FAF7F2] dark:bg-[#12121E] border border-[#E1DBCE] px-3 py-1.5 text-xs rounded-lg"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono font-bold uppercase text-slate-400">Area</label>
                                <select
                                  value={editedSalon.area}
                                  onChange={(e) => setEditedSalon({ ...editedSalon, area: e.target.value as any })}
                                  className="w-full bg-[#FAF7F2] dark:bg-[#12121E] border border-[#E1DBCE] px-3 py-1.5 text-xs rounded-lg"
                                >
                                  {['Indiranagar', 'Koramangala', 'Whitefield', 'Jayanagar', 'HSR Layout', 'Banaswadi'].map(a => (
                                    <option key={a} value={a}>{a}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono font-bold uppercase text-slate-400">Open Hours</label>
                                <input
                                  type="text"
                                  value={editedSalon.openHours}
                                  onChange={(e) => setEditedSalon({ ...editedSalon, openHours: e.target.value })}
                                  className="w-full bg-[#FAF7F2] dark:bg-[#12121E] border border-[#E1DBCE] px-3 py-1.5 text-xs rounded-lg"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono font-bold uppercase text-slate-400">Phone</label>
                                <input
                                  type="text"
                                  value={editedSalon.phone || ''}
                                  onChange={(e) => setEditedSalon({ ...editedSalon, phone: e.target.value })}
                                  className="w-full bg-[#FAF7F2] dark:bg-[#12121E] border border-[#E1DBCE] px-3 py-1.5 text-xs rounded-lg"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono font-bold uppercase text-slate-400">Email</label>
                                <input
                                  type="email"
                                  value={editedSalon.email || ''}
                                  onChange={(e) => setEditedSalon({ ...editedSalon, email: e.target.value })}
                                  className="w-full bg-[#FAF7F2] dark:bg-[#12121E] border border-[#E1DBCE] px-3 py-1.5 text-xs rounded-lg"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono font-bold uppercase text-slate-400">Address</label>
                                <input
                                  type="text"
                                  value={editedSalon.address || ''}
                                  onChange={(e) => setEditedSalon({ ...editedSalon, address: e.target.value })}
                                  className="w-full bg-[#FAF7F2] dark:bg-[#12121E] border border-[#E1DBCE] px-3 py-1.5 text-xs rounded-lg"
                                />
                              </div>
                              <div className="md:col-span-2 space-y-1">
                                <label className="text-[9px] font-mono font-bold uppercase text-slate-400">Description</label>
                                <textarea
                                  rows={2}
                                  value={editedSalon.description}
                                  onChange={(e) => setEditedSalon({ ...editedSalon, description: e.target.value })}
                                  className="w-full bg-[#FAF7F2] dark:bg-[#12121E] border border-[#E1DBCE] px-3 py-1.5 text-xs rounded-lg"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Images Management */}
                          <div className="bg-white dark:bg-[#161625] border border-[#E1DBCE] dark:border-indigo-950/45 rounded-xl p-5 space-y-4">
                            <h5 className="font-serif italic font-bold text-sm text-[#1E1A17] dark:text-white flex items-center gap-1.5">
                              <Image className="w-4 h-4 text-[#A07D1A]" /> Manage Images ({editedSalon.images.length})
                            </h5>
                            
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                              {editedSalon.images.map((img, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-[#E1DBCE]">
                                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  <button
                                    onClick={() => handleRemoveImage(idx)}
                                    className="absolute top-1 right-1 p-1 bg-rose-500/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    title="Remove image"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="Paste image URL here..."
                                className="flex-1 bg-[#FAF7F2] dark:bg-[#12121E] border border-[#E1DBCE] px-3 py-2 text-xs rounded-lg"
                              />
                              <button
                                onClick={handleAddImage}
                                disabled={!newImageUrl.trim()}
                                className="px-4 py-2 bg-[#A07D1A] text-white text-[10px] uppercase font-extrabold rounded-lg cursor-pointer disabled:opacity-40"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Offers Management */}
                          <div className="bg-white dark:bg-[#161625] border border-[#E1DBCE] dark:border-indigo-950/45 rounded-xl p-5 space-y-4">
                            <div className="flex items-center justify-between">
                              <h5 className="font-serif italic font-bold text-sm text-[#1E1A17] dark:text-white flex items-center gap-1.5">
                                <Tag className="w-4 h-4 text-[#A07D1A]" /> Active Offers
                              </h5>
                              <button
                                onClick={() => setShowAddOffer(!showAddOffer)}
                                className="px-3 py-1.5 bg-[#A07D1A] text-white text-[10px] uppercase font-extrabold rounded-lg cursor-pointer"
                              >
                                {showAddOffer ? 'Cancel' : 'Add Offer'}
                              </button>
                            </div>

                            {showAddOffer && (
                              <div className="bg-[#FAF7F2] dark:bg-[#12121E] border border-[#E1DBCE] p-4 rounded-lg space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-mono font-bold uppercase text-slate-400">Offer Title</label>
                                    <input
                                      type="text"
                                      value={newOffer.title}
                                      onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                                      placeholder="Summer Special"
                                      className="w-full bg-white dark:bg-[#161625] border border-[#E1DBCE] px-3 py-1.5 text-xs rounded-lg"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-mono font-bold uppercase text-slate-400">Discount %</label>
                                    <input
                                      type="number"
                                      value={newOffer.discountPercent}
                                      onChange={(e) => setNewOffer({ ...newOffer, discountPercent: Number(e.target.value) })}
                                      className="w-full bg-white dark:bg-[#161625] border border-[#E1DBCE] px-3 py-1.5 text-xs rounded-lg"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-mono font-bold uppercase text-slate-400">Code</label>
                                    <input
                                      type="text"
                                      value={newOffer.code}
                                      onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value.toUpperCase() })}
                                      placeholder="SUMMER20"
                                      className="w-full bg-white dark:bg-[#161625] border border-[#E1DBCE] px-3 py-1.5 text-xs rounded-lg"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-mono font-bold uppercase text-slate-400">Valid Until</label>
                                    <input
                                      type="date"
                                      value={newOffer.validUntil}
                                      onChange={(e) => setNewOffer({ ...newOffer, validUntil: e.target.value })}
                                      className="w-full bg-white dark:bg-[#161625] border border-[#E1DBCE] px-3 py-1.5 text-xs rounded-lg"
                                    />
                                  </div>
                                  <div className="col-span-2 space-y-1">
                                    <label className="text-[9px] font-mono font-bold uppercase text-slate-400">Description</label>
                                    <input
                                      type="text"
                                      value={newOffer.description}
                                      onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                                      placeholder="20% off on all hair treatments..."
                                      className="w-full bg-white dark:bg-[#161625] border border-[#E1DBCE] px-3 py-1.5 text-xs rounded-lg"
                                    />
                                  </div>
                                </div>
                                <button
                                  onClick={handleAddOffer}
                                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase font-extrabold rounded-lg cursor-pointer"
                                >
                                  Create Offer
                                </button>
                              </div>
                            )}

                            <div className="space-y-2">
                              {(editedSalon.offers || []).map((offer) => (
                                <div key={offer.id} className={`flex items-center justify-between p-3 rounded-lg border ${offer.isActive ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800'}`}>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-serif italic font-bold text-sm text-[#1E1A17] dark:text-white">{offer.title}</span>
                                      <span className="px-1.5 py-0.5 bg-[#A07D1A] text-white text-[8px] font-mono font-bold uppercase rounded">{offer.code}</span>
                                      <span className={`px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase rounded ${offer.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'}`}>
                                        {offer.isActive ? 'ACTIVE' : 'INACTIVE'}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{offer.description}</p>
                                    <p className="text-[9px] text-slate-400 font-mono">{offer.discountPercent}% off - Valid until {offer.validUntil}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleToggleOffer(offer.id)}
                                      className={`px-2 py-1 text-[8px] uppercase font-bold rounded cursor-pointer ${offer.isActive ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}
                                    >
                                      {offer.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteOffer(offer.id)}
                                      className="p-1 text-rose-500 hover:bg-rose-100 rounded cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {(editedSalon.offers || []).length === 0 && (
                                <p className="text-xs text-slate-400 text-center py-4">No offers created yet. Add your first offer above!</p>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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
                  
                  <div className="flex items-center justify-between border-b border-[#E1DBCE] dark:border-indigo-950 pb-3">
                    <div>
                      <h4 className="font-serif italic text-xl text-[#A07D1A] dark:text-amber-400 font-bold">Secretariat Dashboard</h4>
                      <p className="text-xs text-slate-500 font-mono uppercase mt-0.5">ACTIVE ADMIN PROTOCOL ACCESS</p>
                    </div>
                    <button
                      onClick={() => setIsAdminAuthenticated(false)}
                      className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/30 text-[10px] uppercase font-bold tracking-wider rounded cursor-pointer transition-all"
                    >
                      Logout Session
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
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
                                  <button
                                    onClick={() => handleDeleteSalon(s.id, s.name)}
                                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-950/30 border border-transparent hover:border-rose-500/20 rounded cursor-pointer hover:scale-105 transition-transform"
                                    title="Revoke Salon listing"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

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
                              <option value="$$">$$ Standard</option>
                              <option value="$$$">$$$ Prestige</option>
                              <option value="$$$$">$$$$ Ultra Luxe</option>
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

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9.5px] font-mono font-bold tracking-wider uppercase text-slate-400">Phone</label>
                            <input
                              type="tel"
                              value={newSalonPhone}
                              onChange={(e) => setNewSalonPhone(e.target.value)}
                              placeholder="+91 80..."
                              className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-3 py-1.5 text-xs rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9.5px] font-mono font-bold tracking-wider uppercase text-slate-400">Email</label>
                            <input
                              type="email"
                              value={newSalonEmail}
                              onChange={(e) => setNewSalonEmail(e.target.value)}
                              placeholder="salon@email.com"
                              className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-3 py-1.5 text-xs rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9.5px] font-mono font-bold tracking-wider uppercase text-slate-400">Address</label>
                          <input
                            type="text"
                            value={newSalonAddress}
                            onChange={(e) => setNewSalonAddress(e.target.value)}
                            placeholder="Full street address..."
                            className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950 px-3 py-1.5 text-xs rounded-lg"
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
                          Deploy New Salon Coordinates
                        </button>
                      </form>
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
