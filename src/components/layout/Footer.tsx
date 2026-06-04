import React from 'react';
import { Sparkles, MapPin, ShieldCheck, Mail, Phone, Flame } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenQuiz: () => void;
}

export default function Footer({ onNavigate, onOpenQuiz }: FooterProps) {
  return (
    <footer id="glamblr_footer" className="relative bg-[#FAF6F0] dark:bg-[#0E0E15] border-t border-[#E1DBCE] dark:border-indigo-950/60 z-10 pt-16 pb-12 px-6 overflow-hidden">
      
      {/* Absolute background accent */}
      <div className="absolute -bottom-10 right-0 w-80 h-80 rounded-full bg-gradient-to-tr from-[rgba(160,125,26,0.04)] to-transparent blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* COL 1: LOGO + TAGLINE */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#A07D1A] via-[#D4AF37] to-[#F5D97F] p-[1.5px]">
              <div className="w-full h-full bg-[#FCFAF6] dark:bg-[#12121E] rounded-[6px] flex items-center justify-center">
                <span className="font-serif text-[#A07D1A] dark:text-amber-400 font-bold text-sm italic">G</span>
              </div>
            </div>
            <h4 className="font-serif italic text-xl font-bold text-[#1E1A17] dark:text-white tracking-wider">GlamBlr</h4>
          </div>
          <p className="text-xs text-[#5C534C] dark:text-slate-400 leading-relaxed max-w-xs">
            Bangalore’s benchmark digital marketplace for elite salon discovery, luxury spa bookings, and bespoke aesthetic consultations.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#5C534C] dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#A07D1A] dark:text-amber-500" />
            <span>Official SuperXgen 2026 Build</span>
          </div>
        </div>

        {/* COL 2: DESTINATIONS */}
        <div className="space-y-4 text-left">
          <h5 className="font-serif text-sm font-semibold text-[#A07D1A] dark:text-amber-500 tracking-wider uppercase">Lounge Areas</h5>
          <ul className="space-y-2 text-xs text-[#5C534C] dark:text-slate-400">
            {['Indiranagar Couture', 'Koramangala Premium', 'Whitefield Silicon Elite', 'Jayanagar Heritage', 'HSR Layout Hub'].map((area) => (
              <li key={area} className="hover:text-[#A07D1A] dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5" onClick={() => onNavigate('explore')}>
                <MapPin className="w-3.5 h-3.5 text-[#A07D1A] dark:text-amber-500" /> {area}
              </li>
            ))}
          </ul>
        </div>

        {/* COL 3: DISCOVERY LINKS */}
        <div className="space-y-4 text-left">
          <h5 className="font-serif text-sm font-semibold text-[#A07D1A] dark:text-amber-500 tracking-wider uppercase">Quick Links</h5>
          <ul className="space-y-2 text-xs text-[#5C534C] dark:text-slate-400">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-[#A07D1A] dark:hover:text-amber-400 transition-colors">
                Marketplace Home
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('explore')} className="hover:text-[#A07D1A] dark:hover:text-amber-400 transition-colors">
                Discovery Lounge
              </button>
            </li>
            <li>
              <button onClick={onOpenQuiz} className="text-[#A07D1A] dark:text-amber-500 hover:underline font-semibold flex items-center gap-1">
                ✦ AI Style DNA Quiz
              </button>
            </li>
            <li>
              <a href="#" className="hover:text-[#A07D1A] dark:hover:text-amber-400 transition-colors">
                Partner Registration
              </a>
            </li>
          </ul>
        </div>

        {/* COL 4: CONTACT & LEGAL */}
        <div className="space-y-4 text-left">
          <h5 className="font-serif text-sm font-semibold text-[#A07D1A] dark:text-amber-500 tracking-wider uppercase">Concierge Office</h5>
          <p className="text-xs text-[#5C534C] dark:text-slate-400 leading-relaxed">
            Bengaluru Innovation HQ<br />
            100 Feet Road, HAL Stage II,<br />
            Indiranagar, Bangalore - 560038
          </p>
          <div className="space-y-1.5 text-xs text-[#5C534C] dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#A07D1A] dark:text-amber-500" />
              <span>+91 98450 90022</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#A07D1A] dark:text-amber-500" />
              <span>concierge@glamblr.luxury</span>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER BOTTOM */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#E1DBCE] dark:border-indigo-950/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-4">
        <div>
          © 2026 GlamBlr Technologies Private Limited. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#A07D1A] dark:hover:text-amber-400 transition-colors">Terms of Luxury Service</a>
          <a href="#" className="hover:text-[#A07D1A] dark:hover:text-amber-400 transition-colors">Privacy Principles</a>
        </div>
      </div>

    </footer>
  );
}
