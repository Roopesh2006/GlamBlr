import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, MapPin, Award, CalendarCheck, Quote } from 'lucide-react';
import { Salon, Service } from '../types';

interface SalonDetailProps {
  salon: Salon | null;
  onBack: () => void;
  onBookService: (service: Service) => void;
  onBookAny: () => void;
  googleMapsKey?: string;
}

export default function SalonDetail({ salon, onBack, onBookService, onBookAny, googleMapsKey = '' }: SalonDetailProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!salon) return null;

  // Group services by category
  const categories: Record<string, Service[]> = {};
  salon.services.forEach((service) => {
    if (!categories[service.category]) {
      categories[service.category] = [];
    }
    categories[service.category].push(service);
  });

  return (
    <div id="salon_detail_wrapper" className="relative z-10 pt-24 pb-20 text-[#1E1A17] dark:text-[#FCFAF7] min-h-screen">
      
      {/* Parallax Hero Image Container */}
      <div className="relative w-full h-[45vh] md:h-[55vh] overflow-hidden">
        <img
          src={(salon.images || [])[activeImageIndex] || (salon.images || [])[0] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800"}
          alt={salon.name}
          className="w-full h-full object-cover transform scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {/* Shadow Vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F1] dark:from-[#0E0E15] via-[#FAF7F1]/20 dark:via-[#0E0E15]/20 to-black/20"></div>

        {/* Back navigation CTA */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-[#12121E]/90 border border-[#E1DBCE] dark:border-indigo-950/50 hover:border-[#A07D1A] dark:hover:border-amber-400 rounded-xl text-xs font-mono uppercase tracking-widest text-slate-800 dark:text-slate-200 hover:text-[#A07D1A] dark:hover:text-amber-400 transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to discovery
        </button>

        {/* Floating Core Information Block */}
        <div className="absolute bottom-6 left-6 right-6 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4 z-10 text-left">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 bg-[#A07D1A] text-white font-extrabold text-[9px] uppercase tracking-wider rounded-xl shadow-md">
                {salon.isLuxury ? 'Ultra Luxe' : 'Signature Tier'}
              </span>
              <span className="px-2.5 py-0.5 bg-white/95 dark:bg-slate-900/95 border border-[#E1DBCE] dark:border-indigo-950/45 rounded-xl text-xs font-extrabold text-[#A07D1A] dark:text-amber-400">
                📍 {salon.area} Area
              </span>
            </div>

            <h2 className="font-serif italic text-3xl md:text-5xl lg:text-6xl font-bold text-[#1E1A17] dark:text-white leading-none">
              {salon.name}
            </h2>

            <div className="flex items-center gap-3 text-xs md:text-sm text-slate-700 dark:text-slate-300 font-mono">
              <div className="flex items-center gap-1 text-[#A07D1A] dark:text-amber-400 font-extrabold">
                <Star className="w-4 h-4 fill-[#A07D1A] dark:fill-amber-400" />
                <span className="text-[#1E1A17] dark:text-[#FCFAF7]">{salon.rating}</span>
              </div>
              <span>•</span>
              <span className="text-[#5C534C] dark:text-slate-400 font-semibold">{salon.reviewCount} verified audits</span>
              <span>•</span>
              <span className="text-[#A07D1A] dark:text-amber-400 font-bold">{salon.priceRange} quotient</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Structural Layout Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: 8 Units */}
        <div className="lg:col-span-8 space-y-10 text-left">
              {/* About description */}
          <div className="bg-white dark:bg-[#12121E] border border-[#E1DBCE] dark:border-indigo-950/60 p-6 md:p-8 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-serif italic text-2xl text-[#A07D1A] dark:text-amber-400 font-bold border-b border-slate-100 dark:border-slate-800/40 pb-2.5">
              The Aesthetic Philosophy
            </h3>
            <p className="text-sm text-[#5C534C] dark:text-slate-300 leading-relaxed">
              {salon.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {(salon.specialties || []).map((spec, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#FAF6F0] dark:bg-[#161625] border border-[#D4AF37]/45 dark:border-indigo-950/35 rounded-xl text-xs text-[#805C06] dark:text-amber-350"
                >
                  ✦ {spec}
                </span>
              ))}
            </div>
          </div>

          {/* ACTIVE PROMOTION BANNER */}
          {salon.offerTitle && (
            <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-dashed border-[#D4AF37] p-6 rounded-2xl text-left space-y-2 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-[#D4AF37]/10 blur-xl pointer-events-none"></div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">⚡ Limited-Time Active Promotion</span>
              <h4 className="font-serif italic text-lg font-bold text-[#A07D1A] dark:text-amber-400">{salon.offerTitle}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">{salon.offerDesc}</p>
              {salon.offerCode && (
                <div className="mt-2 inline-block bg-[#FAF6F0] dark:bg-[#161625] border border-[#D4AF37]/35 px-2.5 py-1 rounded font-mono text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                  Use Promo Code: <span className="underline select-all">{salon.offerCode}</span>
                </div>
              )}
            </div>
          )}

          {/* GALLERY LIST */}
          <div className="space-y-3">
            <h4 className="font-serif italic text-lg text-[#1E1A17] dark:text-[#FCFAF7] font-semibold">Lounge Ambiance Galleries</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {(salon.images || []).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`aspect-video rounded-xl overflow-hidden border transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#A07D1A] dark:border-amber-400 scale-[1.03] shadow-[0_4px_14px_rgba(160,125,26,0.15)]'
                      : 'border-[#E1DBCE] dark:border-indigo-950/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="gallery thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* GROUPED SERVICES CATALOG */}
          <div className="bg-white dark:bg-[#12121E] border border-[#E1DBCE] dark:border-indigo-950/60 p-6 md:p-8 rounded-2xl space-y-6 shadow-sm">
            <div className="flex justify-between items-baseline border-b border-slate-100 dark:border-slate-800/40 pb-3">
              <h3 className="font-serif italic text-2xl text-[#A07D1A] dark:text-amber-400 font-bold">
                Treatment Elixir Menu
              </h3>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono text-right">Pricing inclusive of VAT</span>
            </div>

            {Object.entries(categories).map(([categoryName, servicesList]) => (
              <div key={categoryName} className="space-y-3 select-menu-category text-left">
                <span className="text-xs font-mono font-bold text-[#A07D1A] dark:text-amber-500 uppercase tracking-[0.2em] block border-b border-dashed border-[#E1DBCE] dark:border-indigo-950/45 pb-1 w-fit">
                  {categoryName} Specialists
                </span>
                
                <div className="space-y-2.5">
                  {servicesList.map((svc, i) => (
                    <div
                      key={i}
                      className="group flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-4 bg-[#FAF7F2] dark:bg-[#161625] hover:bg-[#FAF6F0] dark:hover:bg-slate-900 rounded-xl border border-[#E1DBCE]/60 dark:border-indigo-950/30 hover:border-[#A07D1A] dark:hover:border-amber-500 transition-all text-left"
                    >
                      <div className="space-y-1 text-left">
                        <div className="font-serif italic text-base text-[#1E1A17] dark:text-[#FCFAF7] group-hover:text-[#A07D1A] dark:group-hover:text-amber-400 transition-colors font-bold text-left">
                          {svc.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#5C534C] dark:text-slate-400 justify-start text-left">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Session Time: {svc.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div className="font-serif font-bold text-lg text-[#A07D1A] dark:text-amber-400">
                          ₹{svc.price.toLocaleString('en-IN')}
                        </div>
                        <button
                          onClick={() => onBookService(svc)}
                          className="px-4 py-2 bg-[#A07D1A] dark:bg-amber-400 text-white dark:text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wide hover:shadow-[0_4px_10px_rgba(160,125,26,0.3)] transition-all cursor-pointer"
                        >
                          Reserve Item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* VERIFIED AUDITS REVIEWS */}
          <div className="space-y-4">
            <h3 className="font-serif italic text-xl text-[#1E1A17] dark:text-[#FCFAF7] font-semibold">Verified Customer Testimonials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {salon.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white dark:bg-[#12121E] border border-[#E1DBCE]/85 dark:border-indigo-950/50 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-2xs text-left"
                >
                  <Quote className="absolute right-4 top-4 w-10 h-10 text-slate-100 dark:text-slate-900/40 stroke-[1.5]" />
                  
                  <div className="flex items-center gap-2.5 text-left">
                    <img src={rev.avatar} alt={rev.author} className="w-9 h-9 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div className="text-left">
                      <div className="text-xs font-serif font-bold text-[#A07D1A] dark:text-amber-400">{rev.author}</div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase">{rev.area} Auditee • {rev.date}</span>
                    </div>
                  </div>
                  <div className="flex text-[#A07D1A] dark:text-amber-400 gap-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#A07D1A] dark:fill-amber-400 text-[#A07D1A] dark:text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-350 italic leading-relaxed text-left">
                    "{rev.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: 4 Units (STICKY BOOKING SIDEBAR) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main sticky details panel */}
          <div className="sticky top-24 bg-white dark:bg-[#12121E] border border-[#E1DBCE] dark:border-indigo-950/60 p-6 rounded-2xl space-y-5 text-left shadow-md">
            <span className="text-[10px] text-[#A07D1A] dark:text-amber-500 uppercase tracking-[0.25em] font-bold block">Consolidated Overview</span>
            <div className="font-serif italic text-xl text-[#1E1A17] dark:text-[#FCFAF7] font-bold leading-tight">Reserve Your Luxury Appointment</div>
            
            <div className="h-0.5 bg-slate-100 dark:bg-slate-900/50"></div>

            <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Operating hours:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 text-[11px]">{salon.openHours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Total Specialists:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 text-[11px]">8 Senior Stylists</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Diagnostics:</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">Active Hair Scanner</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={onBookAny}
                className="w-full py-3.5 bg-[#A07D1A] dark:bg-amber-400 text-white dark:text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:shadow-[0_4px_14px_rgba(160,125,26,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4 text-white dark:text-slate-950" /> Book Experience
              </button>
            </div>

            {/* Custom styled map or live Google Maps Embed */}
            {googleMapsKey ? (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#E1DBCE] dark:border-indigo-950/60 shadow-xs">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                  src={`https://www.google.com/maps/embed/v1/search?key=${googleMapsKey}&q=${encodeURIComponent(
                    `${salon.name}, ${salon.area}, Bengaluru`
                  )}&zoom=15`}
                  title={`${salon.name} Venue Map`}
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            ) : (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#E1DBCE] dark:border-indigo-950/60 bg-[#FAF6F0] dark:bg-[#161625] flex flex-col justify-between p-4">
                {/* Map grid lines simulation using SVG */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#A07D1A" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Glowing location ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-[rgba(160,125,26,0.1)] border border-[#A07D1A] dark:border-amber-500 flex items-center justify-center mx-auto animate-pulse">
                    <MapPin className="w-4 h-4 text-[#A07D1A] dark:text-amber-500 fill-[#A07D1A] dark:fill-amber-500" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-800 dark:text-slate-100 tracking-widest uppercase truncate">{salon.area}</p>
                </div>

                {/* Map decorations */}
                <div className="text-[8px] text-[#A07D1A]/50 font-mono tracking-wider text-left">MAP VIEW • BENGALURU GPS</div>
                <div className="text-[8.5px] text-[#A07D1A] dark:text-amber-500 font-mono tracking-widest text-right">SECURE PIN POINTED</div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
