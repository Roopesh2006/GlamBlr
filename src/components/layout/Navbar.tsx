import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Compass, UserCheck, Menu, X, BookOpen, Clock, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenQuiz: () => void;
  bookingsCount: number;
  onOpenBookingsDrawer: () => void;
  appDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onOpenPartners?: () => void;
}

export default function Navbar({ 
  currentPage, 
  onNavigate, 
  onOpenQuiz, 
  bookingsCount, 
  onOpenBookingsDrawer,
  appDarkMode = false,
  onToggleDarkMode,
  onOpenPartners
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparentHero = currentPage === 'home' && !isScrolled;

  return (
    <nav
      id="glamblr_navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? appDarkMode
            ? 'bg-[#0E0E15]/95 backdrop-blur-md border-b border-indigo-950/60 py-3.5 shadow-md'
            : 'bg-[#FBF9F4]/90 backdrop-blur-md border-b border-[rgba(160,125,26,0.15)] py-3.5 shadow-sm'
          : 'bg-slate-950/45 backdrop-blur-md border-b border-white/5 py-4 hover:bg-slate-950/65'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO AREA - LUXURY BRONZE & GOLD EMBLEM */}
        <div
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {/* Custom vector glowing golden logo */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#A07D1A] via-[#D4AF37] to-[#F5D97F] p-[1.5px] shadow-sm group-hover:scale-105 transition-all">
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${appDarkMode || isTransparentHero ? 'bg-[#12121e]' : 'bg-[#FCFAF6]'}`}>
              <span className={`font-serif font-bold text-lg tracking-tighter italic ${appDarkMode || isTransparentHero ? 'text-amber-300' : 'text-[#A07D1A]'}`}>G</span>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif italic text-2xl font-bold bg-gradient-to-r from-[#805C06] via-[#A07D1A] to-[#D4AF37] bg-clip-text text-transparent tracking-wide leading-none">
              GlamBlr
            </h1>
            <span className={`text-[7.5px] tracking-[0.35em] uppercase font-bold mt-1 leading-none ${appDarkMode || isTransparentHero ? 'text-slate-400' : 'text-[#5C534C]'}`}>
              Bengaluru Luxe
            </span>
          </div>
        </div>

        {/* DESKTOP NAV ITEMS - WARMLY TONED */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Home', id: 'home' },
            { label: 'Discovery Lounge', id: 'explore' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`text-xs uppercase tracking-[0.15em] font-semibold hover:text-[#A07D1A] transition-colors cursor-pointer relative py-1 ${
                currentPage === item.id 
                  ? (appDarkMode || isTransparentHero)
                    ? 'text-amber-400'
                    : 'text-[#A07D1A]' 
                  : (appDarkMode || isTransparentHero) 
                    ? 'text-slate-200 hover:text-white' 
                    : 'text-[#4E443C]'
              }`}
            >
              {item.label}
              {currentPage === item.id && (
                <span className={`absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full ${
                  (appDarkMode || isTransparentHero) ? 'bg-amber-400' : 'bg-[#A07D1A]'
                }`} />
              )}
            </button>
          ))}

          {/* Style DNA Trigger link with modern psychology spark icon */}
          <button
            onClick={onOpenQuiz}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] cursor-pointer transition-all hover:-translate-y-0.5 ${
              isTransparentHero 
                ? 'text-amber-400 hover:text-amber-300' 
                : 'text-[#A07D1A] hover:text-[#805C06]'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isTransparentHero ? 'text-amber-400' : 'text-[#A07D1A]'}`} /> AI Style DNA
          </button>

          {/* Bookings shortcut */}
          <button
            onClick={onOpenBookingsDrawer}
            className={`relative p-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 px-3 shadow-2xs ${
              appDarkMode || isTransparentHero 
                ? 'border-white/10 hover:border-amber-400/50 bg-white/[0.06] text-slate-300 hover:text-white' 
                : 'border-[#D4AF37]/20 hover:border-[#A07D1A] bg-[#FAF6F0] text-[#4E443C] hover:text-[#A07D1A]'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${appDarkMode || isTransparentHero ? 'text-slate-300' : 'text-[#A07D1A]'}`} />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Bookings</span>
            {bookingsCount > 0 && (
              <span className="bg-[#A07D1A] text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {bookingsCount}
              </span>
            )}
          </button>

          {/* Nav Theme Switcher */}
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                appDarkMode || isTransparentHero 
                  ? 'border-white/10 bg-white/[0.06] text-amber-400 hover:bg-white/[0.12]' 
                  : 'border-[#D4AF37]/20 bg-[#FAF6F0] text-indigo-900 hover:bg-slate-100'
              }`}
              title="Toggle Day/Night Aesthetics"
            >
              {appDarkMode || isTransparentHero ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* ACTIONS */}
        <div className="hidden md:flex items-center gap-3">
          {onOpenPartners && (
            <button
              onClick={onOpenPartners}
              className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-extrabold cursor-pointer border transition-all ${
                appDarkMode || isTransparentHero
                  ? 'border-white/10 bg-white/[0.05] text-amber-400 hover:border-amber-400'
                  : 'border-[#E1DBCE] bg-[#FAF7F2] text-[#805C06] hover:border-[#A07D1A]'
              }`}
            >
              👑 Partner Room
            </button>
          )}

          <button
            onClick={() => onNavigate('explore')}
            className="px-5 py-2.5 bg-gradient-to-r from-[#A07D1A] to-[#D4AF37] text-white font-bold rounded-xl text-xs uppercase tracking-[0.12em] hover:shadow-md transition-all cursor-pointer"
          >
            Reserve Salon
          </button>
        </div>

        {/* MOBILE MENU TRIGGER */}
        <div className="md:hidden flex items-center gap-2">
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className={`p-1.5 rounded-xl border ${
                appDarkMode || isTransparentHero ? 'border-white/10 bg-white/[0.06] text-amber-400' : 'border-[#D4AF37]/20 bg-[#FAF6F0] text-[#4E443C]'
              }`}
            >
              {appDarkMode || isTransparentHero ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={onOpenBookingsDrawer}
            className={`relative p-1.5 rounded-full border ${
              appDarkMode || isTransparentHero ? 'border-white/10 bg-white/[0.06] text-slate-300' : 'border-[#D4AF37]/20 bg-[#FAF6F0] text-[#4E443C]'
            }`}
          >
            <Clock className={`w-4 h-4 ${appDarkMode || isTransparentHero ? 'text-slate-300' : 'text-[#A07D1A]'}`} />
            {bookingsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#A07D1A] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {bookingsCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1.5 rounded-xl border ${
              appDarkMode || isTransparentHero ? 'border-white/10 bg-white/[0.06] text-slate-300' : 'border-[#D4AF37]/20 bg-[#FAF6F0] text-[#4E443C]'
            }`}
          >
            {mobileMenuOpen ? (
              <X className={`w-5 h-5 ${appDarkMode || isTransparentHero ? 'text-amber-400' : 'text-[#A07D1A]'}`} />
            ) : (
              <Menu className={`w-5 h-5 ${appDarkMode || isTransparentHero ? 'text-amber-400' : 'text-[#A07D1A]'}`} />
            )}
          </button>
        </div>

      </div>

      {/* MOBILE NAV OVERLAY */}
      {mobileMenuOpen && (
        <div className={`absolute top-[100%] left-0 right-0 py-6 px-6 md:hidden space-y-4 shadow-lg flex flex-col items-stretch text-center z-50 ${
          appDarkMode || isTransparentHero ? 'bg-[#0E0E15] border-b border-slate-900 text-white' : 'bg-[#FBF9F4] border-b border-[rgba(160,125,26,0.15)] text-slate-800'
        }`}>
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className={`text-xs uppercase tracking-widest font-semibold py-2 border-b ${
              appDarkMode ? 'border-slate-900' : 'border-gray-100'
            } ${
              currentPage === 'home' 
                ? (appDarkMode || isTransparentHero) ? 'text-amber-400 font-bold' : 'text-[#A07D1A]' 
                : (appDarkMode || isTransparentHero) ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('explore');
              setMobileMenuOpen(false);
            }}
            className={`text-xs uppercase tracking-widest font-semibold py-2 border-b ${
              appDarkMode ? 'border-slate-900' : 'border-gray-100'
            } ${
              currentPage === 'explore' 
                ? (appDarkMode || isTransparentHero) ? 'text-amber-400 font-bold' : 'text-[#A07D1A]' 
                : (appDarkMode || isTransparentHero) ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            Discovery Lounge
          </button>
          <button
            onClick={() => {
              onOpenQuiz();
              setMobileMenuOpen(false);
            }}
            className={`flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest py-2 border-b ${
              appDarkMode ? 'border-slate-900' : 'border-gray-100'
            } ${
              (appDarkMode || isTransparentHero) ? 'text-amber-400' : 'text-[#A07D1A]'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${(appDarkMode || isTransparentHero) ? 'text-amber-400' : 'text-[#A07D1A]'}`} /> AI Style DNA
          </button>
          {onOpenPartners && (
            <button
              onClick={() => {
                onOpenPartners();
                setMobileMenuOpen(false);
              }}
              className={`text-xs uppercase tracking-widest font-extrabold text-amber-500 py-2 border-b ${
                appDarkMode ? 'border-slate-900' : 'border-gray-100'
              }`}
            >
              👑 PARTNERS PORTAL
            </button>
          )}
          <button
            onClick={() => {
              onNavigate('explore');
              setMobileMenuOpen(false);
            }}
            className="mt-2 w-full py-3 bg-[#A07D1A] text-white font-bold rounded-xl text-xs uppercase tracking-widest shadow-md"
          >
            Reserve Salon
          </button>
        </div>
      )}
    </nav>
  );
}
