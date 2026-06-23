import React from 'react';
import { Star, MapPin, Award } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Salon } from '../types';

interface SalonCardProps {
  key?: string;
  salon: Salon;
  onSelect: (salonId: string) => void;
  onBookNow: (salon: Salon) => void;
}

export default function SalonCard({ salon, onSelect, onBookNow }: SalonCardProps) {
  // Get unique categories for pills or top 3 services
  const topServices = (salon.services || []).slice(0, 3);

  // Setup spring-driven 3D magnetic tilt mechanics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 140, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);
  const translateX = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);
  const translateY = useSpring(useTransform(y, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set((mouseX / width) - 0.5);
    y.set((mouseY / height) - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="h-full w-full"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        onClick={() => onSelect(salon.id)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        id={`salon_card_${salon.id}`}
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
        className="group relative flex flex-col bg-white dark:bg-[#12121E] border border-[#E1DBCE] dark:border-indigo-950/60 hover:border-[#A07D1A] dark:hover:border-amber-500 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(44,38,33,0.03)] hover:shadow-[0_20px_40px_rgba(160,125,26,0.1)] dark:hover:shadow-[0_20px_40px_rgba(212,175,55,0.12)] transition-shadow duration-300 cursor-pointer h-full"
      >
        {/* Luxury image header - high translateZ for depth */}
        <div 
          className="relative aspect-[4/3] overflow-hidden" 
          style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}
        >
          {/* Luxury Badge overlays */}
          {salon.isLuxury && (
            <div 
              className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-0.5 bg-[#A07D1A] text-white font-bold text-[8.5px] uppercase tracking-wider rounded-lg shadow-md"
              style={{ transform: 'translateZ(55px)' }}
            >
              <Award className="w-3.5 h-3.5 fill-white text-white" /> Ultra Luxe
            </div>
          )}

          <img
            src={salon.images?.[0] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800"}
            alt={salon.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
          {/* Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#12121E] via-transparent to-transparent opacity-80"></div>
          
          {/* Geographic Area Badge */}
          <div 
            className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-0.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-[#E1DBCE] dark:border-indigo-950/50 rounded-full text-[#A07D1A] dark:text-amber-400 font-mono text-[9px] font-bold tracking-wider shadow-2xs"
            style={{ transform: 'translateZ(45px)' }}
          >
            <MapPin className="w-3 h-3 text-[#A07D1A] dark:text-amber-500" /> {salon.area || "Bengaluru"}
          </div>
        </div>

        {/* Card Content body */}
        <div 
          className="p-5 flex-1 flex flex-col justify-between text-left"
          style={{ transform: 'translateZ(25px)', transformStyle: 'preserve-3d' }}
        >
          <div className="space-y-2.5" style={{ transform: 'translateZ(35px)' }}>
            {/* Rating stars & price tier */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[#A07D1A] dark:text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => {
                  const isHalf = i === 4 && salon.rating % 1 !== 0;
                  const isFilled = i < Math.floor(salon.rating);
                  return (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        isFilled 
                          ? 'fill-[#A07D1A] dark:fill-amber-500 text-[#A07D1A] dark:text-amber-500' 
                          : isHalf 
                          ? 'text-[#A07D1A] dark:text-amber-500 opacity-60' 
                          : 'text-slate-200 dark:text-slate-700'
                      }`}
                    />
                  );
                })}
                <span className="text-xs font-extrabold text-slate-850 dark:text-slate-200 ml-1">{salon.rating}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">({salon.reviewCount})</span>
              </div>
              <div className="text-xs font-mono font-bold text-[#A07D1A] dark:text-amber-400 tracking-wider bg-[#FAF6F0] dark:bg-slate-900 px-2 py-0.5 rounded border border-[#E1DBCE]/40 dark:border-indigo-950/45">
                {salon.priceRange}
              </div>
            </div>

            {/* Active Offer Badge indicator */}
            {salon.offerTitle && (
              <div className="text-[9px] font-mono font-black uppercase tracking-widest text-[#A07D1A] dark:text-amber-400 bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/20 px-2 py-0.5 w-fit rounded-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                PROMO ACTIVE
              </div>
            )}

            {/* Salon Name */}
            <h4 className="font-serif italic text-xl font-bold text-[#1E1A17] dark:text-[#FCFAF7] group-hover:text-[#A07D1A] dark:group-hover:text-amber-400 transition-colors leading-tight">
              {salon.name}
            </h4>

            {/* Brief description */}
            <p className="text-xs text-[#5C534C] dark:text-slate-400 line-clamp-2 leading-relaxed h-[36px]">
              {originalDescription(salon.description)}
            </p>

            {/* Top 3 services list */}
            <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-100 dark:border-slate-900/40 mt-2">
              {topServices.map((svc, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md border border-[#E1DBCE]/60 dark:border-indigo-950/40 bg-[#FAF7F2] dark:bg-[#161625] text-[#5C534C] dark:text-slate-300 text-[9.5px] font-sans hover:border-[#A07D1A]/50 dark:hover:border-amber-500/50 transition-colors"
                 >
                  {svc.name.split(' & ')[0]}
                </span>
              ))}
            </div>
          </div>

          {/* CTA "Book Now" Button */}
          <div 
            className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-900/45 flex items-center justify-between gap-3"
            style={{ transform: 'translateZ(40px)' }}
          >
            <span className="text-[9.5px] text-[#5C534C] dark:text-slate-400 font-mono uppercase tracking-wider font-semibold">
              ⏱️ Slots Live Today
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookNow(salon);
              }}
              className="px-4 py-1.5 bg-[#FAF6F0] dark:bg-slate-900 hover:bg-[#A07D1A] dark:hover:bg-amber-400 border border-[#A07D1A] dark:border-amber-500 text-[#A07D1A] dark:text-amber-400 hover:text-white dark:hover:text-slate-950 font-bold rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
            >
              Book Now
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

// Helper to keep descriptions tidy
function originalDescription(desc: string) {
  if (desc.includes('Nestled in the upscale')) {
    return 'Premier French salon boudoir delivering master styling and custom color diagnostics.';
  }
  return desc;
}
