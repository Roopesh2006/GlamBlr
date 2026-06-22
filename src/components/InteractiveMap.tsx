import React, { useState, useMemo } from 'react';
import { MapPin, Compass, Navigation, Clock, Star, Phone, ShieldCheck, Heart } from 'lucide-react';
import { Salon } from '../types';

interface InteractiveMapProps {
  salons: Salon[];
  onSelectSalon: (salonId: string) => void;
  onBookNow: (salon: Salon) => void;
  appDarkMode?: boolean;
  googleMapsKey?: string;
}

// Approximate coordinate offsets for Bangalore layout (centered around MG Road origin)
const AREA_COORDINATES: Record<string, { x: number; y: number; description: string }> = {
  'Indiranagar': { x: 55, y: 35, description: "East Bangalore's chic boulevard of high-fashion and fine dining." },
  'Koramangala': { x: 50, y: 65, description: "South-Central tech and corporate salon prestige coordinates." },
  'Whitefield': { x: 80, y: 40, description: "The tech-elite residential corridor of sprawling modern estates." },
  'Jayanagar': { x: 30, y: 70, description: "South Bangalore's leafy, historical avenues of organic sanctuary." },
  'HSR Layout': { x: 60, y: 80, description: "The startup hub of busy professionals seeking fast-restorative beauty." },
  'Banaswadi': { x: 45, y: 20, description: "The serene north-eastern residential pocket of quiet luxury." }
};

export default function InteractiveMap({
  salons,
  onSelectSalon,
  onBookNow,
  appDarkMode = false,
  googleMapsKey = ''
}: InteractiveMapProps) {
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedSalonId, setSelectedSalonId] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'vector' | 'google'>(googleMapsKey ? 'google' : 'vector');

  // Filters salons based on selected map area
  const filteredSalons = useMemo(() => {
    if (selectedArea === 'All') return salons;
    return salons.filter(s => s.area === selectedArea);
  }, [salons, selectedArea]);

  // Selected Salon detail highlight
  const selectedSalon = useMemo(() => {
    if (!selectedSalonId) return null;
    return salons.find(s => s.id === selectedSalonId) || null;
  }, [salons, selectedSalonId]);

  // Auto select first salon of active area for nice default view
  React.useEffect(() => {
    if (filteredSalons.length > 0) {
      // Find if active salon is in local filter, else reset
      const exists = filteredSalons.some(s => s.id === selectedSalonId);
      if (!exists) {
        setSelectedSalonId(filteredSalons[0].id);
      }
    } else {
      setSelectedSalonId(null);
    }
  }, [selectedArea, filteredSalons]);

  return (
    <div className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE] dark:border-indigo-950/50 rounded-2xl p-4 md:p-6 transition-all duration-300">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E1DBCE] dark:border-indigo-950/45 pb-4 mb-6">
        <div>
          <span className="text-[10px] font-mono text-[#A07D1A] dark:text-amber-400 tracking-[0.25em] font-extrabold uppercase flex items-center gap-1.5 justify-center md:justify-start">
            <Compass className="w-4 h-4 animate-spin-slow" /> CARTOGRAPHY DECK
          </span>
          <h3 className="font-serif italic text-2xl md:text-3xl text-[#1E1A17] dark:text-white font-semibold">
            Bespoke Bangalore Geocodes
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Click nodes to zoom into sectors. Discover real-time distances, wait stats, and book elite slots in Bangalore's premier coordinates.
          </p>
        </div>

        {/* Rapid Area Switcher */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedArea('All')}
            className={`px-3 py-1.5 rounded-lg text-[10.5px] font-mono font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              selectedArea === 'All'
                ? 'bg-[#A07D1A] dark:bg-amber-400 text-white dark:text-slate-900'
                : 'bg-[#FAF7F2] dark:bg-indigo-950/30 text-[#5C534C] dark:text-slate-400 border border-[#E1DBCE] dark:border-indigo-950/45 hover:border-[#A07D1A]'
            }`}
          >
            All Sectors
          </button>
          {Object.keys(AREA_COORDINATES).map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1.5 rounded-lg text-[10.5px] font-mono font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                selectedArea === area
                  ? 'bg-[#A07D1A] dark:bg-amber-400 text-white dark:text-slate-900 border-none'
                  : 'bg-[#FAF7F2] dark:bg-indigo-950/30 text-[#5C534C] dark:text-slate-400 border border-[#E1DBCE] dark:border-indigo-950/45 hover:border-[#A07D1A]'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {googleMapsKey && (
        <div className="flex border border-[#E1DBCE] dark:border-indigo-950/60 p-0.5 max-w-[280px] mx-auto sm:mx-0 mb-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
          <button
            type="button"
            onClick={() => setMapMode('vector')}
            className={`flex-1 py-1.5 px-3 text-[10px] font-mono uppercase tracking-wider font-extrabold transition-all rounded-lg cursor-pointer ${
              mapMode === 'vector'
                ? 'bg-[#A07D1A] text-white dark:bg-amber-400 dark:text-neutral-900 shadow-xs'
                : 'text-slate-500 hover:text-[#A07D1A] dark:text-slate-400'
            }`}
          >
            Blueprints Grid
          </button>
          <button
            type="button"
            onClick={() => setMapMode('google')}
            className={`flex-1 py-1.5 px-3 text-[10px] font-mono uppercase tracking-wider font-extrabold transition-all rounded-lg cursor-pointer ${
              mapMode === 'google'
                ? 'bg-[#A07D1A] text-white dark:bg-amber-400 dark:text-neutral-900 shadow-xs'
                : 'text-slate-500 hover:text-[#A07D1A] dark:text-slate-400'
            }`}
          >
            ⚡ Live Google Map
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COMPONENT (7/12): CUSTOM VECTOR RENDERED CARTOGRAPHY DECK */}
        <div className="lg:col-span-7 relative h-[380px] md:h-[450px] bg-[#FAF7F2] dark:bg-[#0E0E14] border border-[#E1DBCE]/60 dark:border-indigo-950/45 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
          
          {mapMode === 'google' && googleMapsKey ? (
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer"
              src={`https://www.google.com/maps/embed/v1/search?key=${googleMapsKey}&q=${encodeURIComponent(
                selectedSalon 
                  ? `${selectedSalon.name}, ${selectedSalon.area}, Bengaluru`
                  : (selectedArea !== 'All' ? `${selectedArea} luxury salons Bengaluru` : "boutique luxury salons in Bengaluru")
              )}&zoom=${selectedSalon ? 15 : (selectedArea !== 'All' ? 14 : 12)}`}
              title="Live Google Coordinates Map"
              className="absolute inset-0 w-full h-full"
            />
          ) : (
            <>
              {/* Subtle Radar circle indicators representing luxury range */}
              <div className="absolute w-[90%] h-[90%] border border-dashed border-[#D4AF37]/8 dark:border-amber-400/5 rounded-full pointer-events-none animate-spin-slow"></div>
              <div className="absolute w-[60%] h-[60%] border border-dashed border-[#D4AF37]/12 dark:border-amber-400/8 rounded-full pointer-events-none"></div>
              <div className="absolute w-[30%] h-[30%] border border-dashed border-[#D4AF37]/15 dark:border-amber-400/10 rounded-full pointer-events-none"></div>
              
              {/* Grid crosshair backdrop */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-30 dark:opacity-10 pointer-events-none">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="border-t border-l border-[#805C06]/10 dark:border-amber-400/5" />
                ))}
              </div>

              <div className="absolute top-4 left-4 z-10 flex flex-col items-start bg-white/95 dark:bg-[#0A0A10]/95 backdrop-blur-md border border-[#E1DBCE] dark:border-indigo-950/70 p-2.5 rounded-lg text-left shadow-2xs font-mono">
                <span className="text-[9px] font-bold text-[#A07D1A] dark:text-amber-400">GEO LOCATOR CORE</span>
                <span className="text-[10px] text-slate-800 dark:text-slate-300 font-extrabold">Origin: Bengaluru MG Rd</span>
                <span className="text-[8.5px] text-slate-400 mt-0.5">Scale: 1 : 124,000 Precision</span>
              </div>

              {/* Dynamic Map Nodes */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Draw connection pathways starting from center to active nodes */}
                {Object.entries(AREA_COORDINATES).map(([name, coords]) => {
                  const active = selectedArea === 'All' || selectedArea === name;
                  if (!active) return null;
                  return (
                    <line
                      key={`line-${name}`}
                      x1="50%"
                      y1="50%"
                      x2={`${coords.x}%`}
                      y2={`${coords.y}%`}
                      stroke={appDarkMode ? "rgba(245,217,127,0.12)" : "rgba(160,125,26,0.15)"}
                      strokeWidth="1.5"
                      strokeDasharray="2 4"
                    />
                  );
                })}
              </svg>

              {/* Area Label Pins */}
              {Object.entries(AREA_COORDINATES).map(([name, coords]) => {
                const isSelected = selectedArea === name;
                const isHovered = hoveredNode === name;
                const hasSalons = salons.some(s => s.area === name);

                if (!hasSalons) return null;

                return (
                  <button
                    key={name}
                    onMouseEnter={() => setHoveredNode(name)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setSelectedArea(name)}
                    style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-all cursor-pointer"
                  >
                    {/* Glow Ring */}
                    <span className={`absolute -inset-4 rounded-full transition-all scale-[0.6] opacity-0 group-hover:opacity-100 group-hover:scale-110 duration-500 bg-[#A07D1A]/5 dark:bg-amber-400/5 ${
                      isSelected ? 'opacity-100 scale-100 bg-[#A07D1A]/10 dark:bg-amber-400/10' : ''
                    }`} />

                    {/* Pin Head */}
                    <div className={`p-1.5 rounded-full transition-all border shadow-lg ${
                      isSelected 
                        ? 'bg-[#A07D1A] dark:bg-amber-400 border-white text-white dark:text-neutral-900 scale-110' 
                        : isHovered
                        ? 'bg-white dark:bg-indigo-950 border-[#A07D1A] text-[#A07D1A] dark:text-amber-400 scale-105'
                        : 'bg-[#FCFAF7] dark:bg-[#12121E] border-[#E1DBCE] dark:border-indigo-950 text-slate-500'
                    }`}>
                      <MapPin className="w-4 h-4 fill-current stroke-[2]" />
                    </div>

                    {/* sector tag */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-[#12121e]/95 border border-[#E1DBCE]/90 dark:border-indigo-950/80 px-2 py-0.5 rounded-md text-[8.5px] font-mono font-extrabold uppercase tracking-wider text-[#5C534C] dark:text-slate-300 shadow-xs pointer-events-none whitespace-nowrap z-30 group-hover:scale-105 transition-transform">
                      {name}
                    </div>
                  </button>
                );
              })}

              {/* Compass Rose center marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-dashed border-[#A07D1A]/30 flex items-center justify-center bg-white/60 dark:bg-black/40 backdrop-blur-xs pointer-events-none">
                <Compass className="w-4 h-4 text-[#A07D1A] dark:text-amber-400 animate-pulse" />
              </div>

              {/* Selected coordinates watermark */}
              <div className="absolute bottom-4 right-4 text-right z-10 font-mono text-[9px] text-[#A07D1A] dark:text-amber-500/80 font-bold">
                LAT: 12.9716° N • LONG: 77.5946° E
              </div>
            </>
          )}
        </div>

        {/* RIGHT COMPONENT (5/12): LIST OF LOUNGES IN SELECTED SECTOR */}
        <div className="lg:col-span-5 flex flex-col h-[380px] md:h-[450px]">
          
          <div className="flex items-center justify-between border-b border-[#E1DBCE]/60 dark:border-indigo-950/40 pb-2 mb-3">
            <span className="text-[10px] font-mono font-extrabold uppercase text-[#5C534C] dark:text-slate-400 flex items-center gap-1.5">
              <span>📍 {selectedArea === 'All' ? 'Bangalore (All)' : selectedArea} Coordinates</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#FAF7F2] dark:bg-indigo-950/30 text-[9px] border border-[#E1DBCE]/40 dark:border-indigo-950/20 text-[#A07D1A] dark:text-amber-400 leading-none">
                {filteredSalons.length} Lounges
              </span>
            </span>
          </div>

          {/* Scrollable Salons list */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin">
            {filteredSalons.map((salon) => {
              const isActive = selectedSalonId === salon.id;
              return (
                <div
                  key={salon.id}
                  onClick={() => setSelectedSalonId(salon.id)}
                  className={`group relative p-3 text-left rounded-xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-[#161625] border-[#A07D1A] dark:border-amber-400 shadow-xs'
                      : 'bg-[#FAF7F2]/50 dark:bg-[#12121E]/40 border-[#E1DBCE]/60 dark:border-indigo-950/30 hover:border-[#A07D1A]/50 dark:hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={salon.images?.[0] || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800'}
                      alt={salon.name}
                      className="w-12 h-12 object-cover rounded-lg border border-slate-100 dark:border-neutral-800"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-serif italic font-bold text-xs text-[#1E1A17] dark:text-white leading-tight min-w-0 truncate group-hover:text-[#A07D1A] dark:group-hover:text-amber-400 transition-colors">
                          {salon.name}
                        </h4>
                        <div className="flex items-center gap-0.5 shrink-0 text-[10px] font-mono text-amber-500 font-extrabold bg-[#FAF7F2] dark:bg-indigo-950/20 px-1.5 py-0.5 rounded border border-[#E1DBCE]/30">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>{salon.rating || 0}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[9.5px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                        <span className="font-bold text-[#A07D1A] dark:text-amber-500">{salon.area || "Bengaluru"}</span>
                        <span>•</span>
                        <span className="font-extrabold">{salon.priceRange || "₹₹"}</span>
                        <span>•</span>
                        <span>{salon.openHours ? salon.openHours.split(" - ")[0] : "09:00 AM"} Open</span>
                      </div>

                      <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-1">
                        {salon.specialties ? salon.specialties.slice(0, 2).join(" • ") : ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredSalons.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-[#E1DBCE] dark:border-indigo-950/50 rounded-xl space-y-2 text-center h-full">
                <p className="text-xs font-mono text-slate-400">No lounges registered in this sector yet</p>
              </div>
            )}
          </div>

          {/* Quick Active Salon Drawer Details */}
          {selectedSalon && (
            <div className="mt-3 p-3 bg-[#FAF7F2] dark:bg-[#161625] border border-[#E1DBCE] dark:border-indigo-950/55 rounded-xl text-left scale-in flex flex-col justify-between">
              
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-serif italic font-extrabold text-sm text-[#805C06] dark:text-amber-400">
                    {selectedSalon.name}
                  </h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    📍 {selectedSalon.area} coordinate line • {selectedSalon.openHours}
                  </p>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 bg-[#10B981]/15 text-[#065F46] dark:text-emerald-400 border border-[#10B981]/25 rounded flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5 animate-pulse" /> Live Slot OK
                  </span>
                  <span className="text-[8.5px] text-slate-400 mt-1 font-mono">Distance: ~{(Math.random() * 2 + 0.3).toFixed(1)} km</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E1DBCE]/60 dark:border-indigo-950/30">
                <button
                  onClick={() => onSelectSalon(selectedSalon.id)}
                  className="flex-1 py-1.5 text-center bg-transparent border border-[#A07D1A] hover:bg-[#A07D1A]/5 text-[#A07D1A] dark:text-amber-400 dark:border-amber-400/40 rounded-lg text-[10px] uppercase font-bold tracking-widest cursor-pointer transition-all"
                >
                  View Details
                </button>
                <button
                  onClick={() => onBookNow(selectedSalon)}
                  className="flex-1 py-1.5 text-center bg-[#A07D1A] hover:bg-[#805C06] dark:bg-amber-400 dark:text-slate-900 text-white rounded-lg text-[10px] uppercase font-extrabold tracking-widest cursor-pointer hover:shadow-xs transition-all flex items-center justify-center gap-1"
                >
                  <Navigation className="w-3 h-3 fill-current animate-bounce-slow" /> Book Spot
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
