import React from 'react';
import { Star, MapPin, Award, Tag } from 'lucide-react';
import { Salon } from '../types';

interface SalonCardProps {
  key?: string;
  salon: Salon;
  onSelect: (salonId: string) => void;
  onBookNow: (salon: Salon) => void;
}

export default function SalonCard({ salon, onSelect, onBookNow }: SalonCardProps) {
  const topServices = (salon.services || []).slice(0, 3);
  const activeOffers = salon.offers?.filter(o => o.isActive) || [];
  const bestOffer = activeOffers.length > 0 
    ? activeOffers.reduce((prev, curr) => curr.discountPercent > prev.discountPercent ? curr : prev)
    : null;

  const formatPrice = (range: string) => {
    const map: Record<string, string> = {
      '$$': 'Signature ($$)',
      '$$$': 'Premium ($$$)',
      '$$$$': 'Ultra Luxury ($$$$)'
    };
    return map[range] || range;
  };

  return (
    <div
      onClick={() => onSelect(salon.id)}
      id={`salon_card_${salon.id}`}
      className="group relative flex flex-col bg-white dark:bg-[#12121E] border border-[#E1DBCE] dark:border-indigo-950/60 hover:border-[#A07D1A] dark:hover:border-amber-500 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(44,38,33,0.03)] hover:shadow-[0_12px_28px_rgba(160,125,26,0.06)] dark:hover:shadow-[0_12px_28px_rgba(212,175,55,0.08)] transform hover:-translate-y-1.5 transition-all duration-300 cursor-pointer h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {salon.isLuxury && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-0.5 bg-[#A07D1A] text-white font-bold text-[8.5px] uppercase tracking-wider rounded-lg shadow-md">
            <Award className="w-3.5 h-3.5 fill-white text-white" /> Ultra Luxe
          </div>
        )}

        {bestOffer && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white font-bold text-[8px] uppercase tracking-wider rounded-lg shadow-md">
            <Tag className="w-3 h-3" /> {bestOffer.discountPercent}% OFF
          </div>
        )}

        <img
          src={salon.images?.[0] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800"}
          alt={salon.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#12121E] via-transparent to-transparent opacity-80"></div>
        
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-0.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-[#E1DBCE] dark:border-indigo-950/50 rounded-full text-[#A07D1A] dark:text-amber-400 font-mono text-[9px] font-bold tracking-wider shadow-2xs">
          <MapPin className="w-3 h-3 text-[#A07D1A] dark:text-amber-500" /> {salon.area || "Bengaluru"}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between text-left">
        <div className="space-y-2.5">
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

          <h4 className="font-serif italic text-xl font-bold text-[#1E1A17] dark:text-[#FCFAF7] group-hover:text-[#A07D1A] dark:group-hover:text-amber-400 transition-colors leading-tight">
            {salon.name}
          </h4>

          <p className="text-xs text-[#5C534C] dark:text-slate-400 line-clamp-2 leading-relaxed h-[36px]">
            {salon.description}
          </p>

          {bestOffer && (
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-900/10 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <Tag className="w-3 h-3" />
              Use code <span className="font-extrabold">{bestOffer.code}</span> for {bestOffer.discountPercent}% off
            </div>
          )}

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

        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-900/45 flex items-center justify-between gap-3">
          <span className="text-[9.5px] text-[#5C534C] dark:text-slate-400 font-mono uppercase tracking-wider font-semibold">
            Slots Live Today
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
    </div>
  );
}
