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
}

export default function Navbar({ 
  currentPage, 
  onNavigate, 
  onOpenQuiz, 
  bookingsCount, 
  onOpenBookingsDrawer,
  appDarkMode = false,
  onToggleDarkMode
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

  return (
    <nav
      id="glamblr_navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? appDarkMode
            ? 'bg-[#0E0E15]/95 backdrop-blur-md border-b border-indigo-950/60 py-3.5 shadow-md'
            : 'bg-[#FBF9F4]/90 backdrop-blur-md border-b border-[rgba(160,125,26,0.15)] py-3.5 shadow-sm'
          : 'bg-transparent py-6'
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
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${appDarkMode ? 'bg-[#12121e]' : 'bg-[#FCFAF6]'}`}>
              <span className="font-serif text-[#A07D1A] font-bold text-lg tracking-tighter italic">G</span>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif italic text-2xl font-bold bg-gradient-to-r from-[#805C06] via-[#A07D1A] to-[#D4AF37] bg-clip-text text-transparent tracking-wide leading-none">
              GlamBlr
            </h1>
            <span className={`text-[7.5px] tracking-[0.35em] uppercase font-bold mt-1 leading-none ${appDarkMode ? 'text-slate-400' : 'text-[#5C534C]'}`}>
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
                  ? 'text-[#A07D1A]' 
                  : appDarkMode 
                    ? 'text-slate-300' 
                    : 'text-[#4E443C]'
              }`}
            >
              {item.label}
              {currentPage === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#A07D1A] rounded-full" />
              )}
            </button>
          ))}

          {/* Style DNA Trigger link with modern psychology spark icon */}
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 text-xs text-[#A07D1A] hover:text-[#805C06] font-bold uppercase tracking-[0.15em] cursor-pointer transition-all hover:-translate-y-0.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A07D1A]" /> AI Style DNA
          </button>

          {/* Bookings shortcut */}
          <button
            onClick={onOpenBookingsDrawer}
            className={`relative p-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 px-3 shadow-2xs ${
              appDarkMode 
                ? 'border-indigo-950/60 hover:border-amber-500/50 bg-[#161625] text-slate-300 hover:text-white' 
                : 'border-[#D4AF37]/20 hover:border-[#A07D1A] bg-[#FAF6F0] text-[#4E443C] hover:text-[#A07D1A]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#A07D1A]" />
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
                appDarkMode 
                  ? 'border-indigo-950/60 bg-[#161625] text-amber-400 hover:bg-[#1C1C2D]' 
                  : 'border-[#D4AF37]/20 bg-[#FAF6F0] text-indigo-900 hover:bg-slate-100'
              }`}
              title="Toggle Day/Night Aesthetics"
            >
              {appDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* ACTIONS */}
        <div className="hidden md:flex items-center gap-3">
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
                appDarkMode ? 'border-slate-800 bg-slate-900 text-amber-400' : 'border-[#D4AF37]/20 bg-[#FAF6F0] text-[#4E443C]'
              }`}
            >
              {appDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={onOpenBookingsDrawer}
            className={`relative p-1.5 rounded-full border ${
              appDarkMode ? 'border-slate-850 bg-slate-900 text-slate-300' : 'border-[#D4AF37]/20 bg-[#FAF6F0] text-[#4E443C]'
            }`}
          >
            <Clock className="w-4 h-4 text-[#A07D1A]" />
            {bookingsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#A07D1A] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {bookingsCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1.5 rounded-xl border ${
              appDarkMode ? 'border-slate-850 bg-slate-900 text-slate-300' : 'border-[#D4AF37]/20 bg-[#FAF6F0] text-[#4E443C]'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#A07D1A]" /> : <Menu className="w-5 h-5 text-[#A07D1A]" />}
          </button>
        </div>

      </div>

      {/* MOBILE NAV OVERLAY */}
      {mobileMenuOpen && (
        <div className={`absolute top-[100%] left-0 right-0 py-6 px-6 md:hidden space-y-4 shadow-lg flex flex-col items-stretch text-center z-50 ${
          appDarkMode ? 'bg-[#0E0E15] border-b border-slate-900 text-white' : 'bg-[#FBF9F4] border-b border-[rgba(160,125,26,0.15)] text-slate-800'
        }`}>
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className={`text-xs uppercase tracking-widest font-semibold py-2 border-b ${
              appDarkMode ? 'border-slate-900' : 'border-gray-100'
            } ${currentPage === 'home' ? 'text-[#A07D1A]' : ''}`}
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
            } ${currentPage === 'explore' ? 'text-[#A07D1A]' : ''}`}
          >
            Discovery Lounge
          </button>
          <button
            onClick={() => {
              onOpenQuiz();
              setMobileMenuOpen(false);
            }}
            className={`flex items-center justify-center gap-2 text-xs font-bold text-[#A07D1A] uppercase tracking-widest py-2 border-b ${
              appDarkMode ? 'border-slate-900' : 'border-gray-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#A07D1A]" /> AI Style DNA
          </button>
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
