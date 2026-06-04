import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Sparkles, UserCheck, Clock, MapPin, Activity, Award, Heart, Shield, ArrowRight, CornerDownRight } from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  color: string;
  psychology: string;
  occupancy: string;
  waitMin: number;
  stylistName: string;
  stylistTitle: string;
  icon: string;
  specialtyText: string;
  image: string;
}

interface HeroSceneProps {
  appDarkMode?: boolean;
}

export default function HeroScene({ appDarkMode = false }: HeroSceneProps) {
  const [activeZoneId, setActiveZoneId] = useState<string>('royal_hair');

  const zones: Zone[] = [
    {
      id: 'royal_hair',
      name: 'Royal Hair & Styling Deck',
      color: '#A07D1A', // Gold
      psychology: 'Prestige & Personal Radiance',
      occupancy: '3 of 4 Chairs Occupied',
      waitMin: 12,
      stylistName: 'Master Vivek K.',
      stylistTitle: 'French Balayage Legend',
      icon: '💇',
      specialtyText: 'Olaplex structure, Silk protein & high density blowouts. Double-brushed custom coloring formulas matching your texture DNA.',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=700'
    },
    {
      id: 'medspa_scalp',
      name: 'MedSpa & Japanese HeadBasin',
      color: '#10B981', // Emerald Recovery
      psychology: 'Healing & Cognitive Decompression',
      occupancy: '1 of 3 Basins Active',
      waitMin: 0,
      stylistName: 'Dr. Kritika S.',
      stylistTitle: 'Trichologist & Scalp Specialist',
      icon: '💆',
      specialtyText: '11-Step Scalp Scan, Aromatherapy steam misting & organic hot compresses. Experience cognitive decompression in silent spa cocoons.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=700'
    },
    {
      id: 'bridal_boudoir',
      name: 'Private Bridal Boudoir',
      color: '#EC4899', // Pink
      psychology: 'Empowerment & Sacred Celebration',
      occupancy: 'Reserving Elite Slots Only',
      waitMin: 45,
      stylistName: 'Maestra Priyanka P.',
      stylistTitle: 'Sabyasachi Styling Artist',
      icon: '👑',
      specialtyText: 'HD airbrush, heavy heirloom saree draping & premium signature gold glow. Ancestral draping arts paired with absolute privacy.',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=700'
    },
    {
      id: 'gentlemen_razor',
      name: 'Executive Grooming Bar',
      color: '#3B82F6', // Blue
      psychology: 'Refinement & Grounded Comfort',
      occupancy: '2 of 2 Recliners Free',
      waitMin: 0,
      stylistName: 'Senior Barber Sameer',
      stylistTitle: 'Sandalwood Razor Sculptor',
      icon: '🧔',
      specialtyText: 'Italian gold-plated razor sculpts, charcoal hot pores detox towels, and single-malt coffee therapies in premium leather recliners.',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=700'
    }
  ];

  const activeZone = zones.find(z => z.id === activeZoneId) || zones[0];

  return (
    <div 
      className="w-full bg-[#FAF7F1] dark:bg-[#12121E] border border-[#E1DBCE] dark:border-indigo-950/60 rounded-3xl overflow-hidden p-5 md:p-6 shadow-[0_8px_30px_rgba(44,38,33,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-colors duration-300 text-left space-y-6"
    >
      {/* Top Banner Control Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[#E1DBCE] dark:border-indigo-950/40 pb-4">
        <div>
          <span className="text-[10px] font-mono text-[#A07D1A] dark:text-amber-500 font-bold tracking-[0.25em] block uppercase">
            🗺️ Live Atelier Dashboard
          </span>
          <h4 className="font-serif italic text-xl text-slate-800 dark:text-slate-100 font-bold">
            Interactive Salon Spaces
          </h4>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400 uppercase tracking-widest font-extrabold">
          <Activity className="w-3.5 h-3.5 text-[#A07D1A] animate-pulse" />
          <span>Real-time Operations Scanner</span>
        </div>
      </div>

      {/* Grid Layout containing Tab Selector list + Visual Preview presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[380px]">
        
        {/* Left Column (5/12): Horizontal list of space selections */}
        <div className="lg:col-span-4 flex flex-col justify-start space-y-2">
          <p className="text-[11px] text-slate-400 font-mono tracking-wider uppercase mb-1 font-bold">
            Choose Treatment Zone:
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {zones.map((z) => {
              const isSelected = z.id === activeZoneId;
              return (
                <button
                  key={z.id}
                  onClick={() => setActiveZoneId(z.id)}
                  className={`relative p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-1.5 align-top ${
                    isSelected
                      ? 'bg-white dark:bg-[#181829] border-[#A07D1A] dark:border-amber-500/80 shadow-[0_4px_20px_rgba(160,125,26,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] scale-[1.02] z-10'
                      : 'bg-white/40 dark:bg-[#151525]/30 border-[#E1DBCE] dark:border-indigo-950/45 hover:border-slate-400 dark:hover:border-indigo-900 text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-[#18182c]/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{z.icon}</span>
                    <span className={`text-xs font-serif font-semibold italic truncate ${isSelected ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-400'}`}>
                      {z.name.replace(' & Styling Deck', '').replace(' & Japanese HeadBasin', '').replace(' Private Boudoir', '')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between w-full pt-1">
                    <span 
                      className="text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded"
                      style={{ 
                        backgroundColor: isSelected ? `${z.color}15` : 'transparent',
                        color: z.color
                      }}
                    >
                      {z.waitMin === 0 ? '🟢 READY' : `⏱️ ${z.waitMin}m WAIT`}
                    </span>
                    {isSelected && (
                      <motion.div layoutId="gold_dot" className="w-1.5 h-1.5 rounded-full bg-[#A07D1A] dark:bg-amber-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column (8/12): Stunning Visual Deck Showcase with transition effects */}
        <div className="lg:col-span-8 flex flex-col md:grid md:grid-cols-2 gap-4 bg-white dark:bg-[#161625] border border-[#E1DBCE]/60 dark:border-indigo-950/40 rounded-2xl p-4 shadow-2xs">
          
          {/* visual image side */}
          <div className="relative aspect-video md:aspect-auto md:h-full rounded-xl overflow-hidden group shadow-2xs">
            
            {/* Live Camera Feed watermark */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-md text-[8px] font-mono text-white/90 font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              Live Visual Feed
            </div>

            <AnimatePresence mode="wait">
              <motion.img
                key={activeZone.image}
                src={activeZone.image}
                alt={activeZone.name}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            {/* Gradient shadow wash overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-3 left-3 right-3 text-left">
              <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider block">
                ✦ Space Psychology
              </span>
              <span className="text-[11.5px] text-white font-serif italic truncate font-bold block mt-0.5">
                {activeZone.psychology}
              </span>
            </div>
          </div>

          {/* interactive text details side */}
          <div className="flex flex-col justify-between py-1 space-y-4">
            <div className="space-y-3.5">
              
              {/* Heading */}
              <div>
                <span className="px-2 py-0.5 bg-[#A07D1A]/10 text-[#805C06] dark:bg-amber-500/10 dark:text-amber-400 rounded text-[9px] font-mono font-extrabold tracking-widest uppercase">
                  ACTIVE LOUNGE MATRIX
                </span>
                <h3 className="font-serif italic text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 mt-1 leading-tight text-left">
                  {activeZone.name}
                </h3>
              </div>

              <div className="h-px bg-slate-100 dark:bg-indigo-950/50" />

              {/* Description */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeZone.specialtyText}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed text-left"
                >
                  {activeZone.specialtyText}
                </motion.p>
              </AnimatePresence>

              {/* live details panel */}
              <div className="bg-[#FAF7F1]/80 dark:bg-[#121220]/50 border border-[#E1DBCE]/60 dark:border-indigo-950/30 p-3 rounded-xl space-y-2 text-left">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-mono">ACTIVE DESIGNER:</span>
                  <span className="font-serif italic font-extrabold text-[#A07D1A] dark:text-amber-400">
                    {activeZone.stylistName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[9.5px] text-slate-500 dark:text-slate-400 pl-1.5 border-l border-[#A07D1A]/30">
                  <CornerDownRight className="w-3 h-3 text-[#A07D1A]" />
                  <span>{activeZone.stylistTitle}</span>
                </div>
                
                <div className="h-px bg-slate-200/50 dark:bg-slate-800/40" />

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-mono">SEAT OCCUPANCY:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {activeZone.occupancy}
                  </span>
                </div>
              </div>

            </div>

            {/* Price guarantee & Secure booking slot CTA */}
            <div className="space-y-2 text-left pt-2">
              <span className="text-[8.5px] text-slate-400 font-mono tracking-widest block uppercase text-center md:text-left leading-none">
                🔒 Direct Parity pricing SLA verified
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
