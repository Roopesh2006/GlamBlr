import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, Sparkles, Trash2, ShieldAlert, Award } from 'lucide-react';
import { Booking } from '../types';

interface BookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshTrigger?: number;
}

export default function BookingsDrawer({ isOpen, onClose, onRefreshTrigger }: BookingsDrawerProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadBookings();
    }
  }, [isOpen, onRefreshTrigger]);

  const loadBookings = () => {
    try {
      const saved = localStorage.getItem('glamblr_bookings');
      if (saved) {
        setBookings(JSON.parse(saved));
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    try {
      localStorage.setItem('glamblr_bookings', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="bookings_drawer_root" className="fixed inset-0 z-50 overflow-hidden">
      {/* Drawer Overlay */}
      <div className="absolute inset-0 bg-[#07070E] bg-opacity-70 backdrop-blur-sm" onClick={onClose} />

      <div 
        data-lenis-prevent
        className="absolute top-0 right-0 bottom-0 w-full sm:max-w-md bg-[#0F0F1A] border-l border-[rgba(212,175,55,0.2)] shadow-2xl flex flex-col justify-between text-white animate-slideIn"
      >
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-serif italic text-lg text-white font-semibold">Your Luxury Reservations</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Drawer Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full border border-dashed border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37]/50">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="font-serif italic text-[#F5D97F] text-sm">No Active Registrations Found</p>
              <p className="text-xs text-[#8888AA] max-w-xs mx-auto">
                Explore Bangalore's finest, perform the AI Style DNA quiz, and lock down your aesthetic experience.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">
                Showing {bookings.length} reservations
              </span>
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="group relative bg-[#161625] border border-[rgba(212,175,55,0.15)] rounded-2xl p-4 space-y-3 shadow-md hover:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif italic text-[15px] text-[#F5D97F] font-semibold">{b.salonName}</h4>
                      <p className="text-xs text-white font-semibold mt-0.5">{b.service.name}</p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(b.id, e)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-[#FF6B9D] border border-transparent hover:border-red-500/10 transition-colors cursor-pointer"
                      title="Delete reservation entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="h-px bg-white/5" />

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-300">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]/70" />
                      <span>{b.date}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]/70" />
                      <span>{b.time}</span>
                    </div>
                  </div>

                  <div className="bg-white/5 p-2 rounded-lg text-[10px] space-y-0.5 text-gray-400">
                    <div className="flex justify-between">
                      <span>Recipient</span>
                      <span className="text-white font-serif">{b.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reserve ID</span>
                      <span className="text-[#D4AF37] font-bold">{b.id}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer info */}
        <div className="p-6 border-t border-white/5 bg-black/30">
          <p className="text-[10px] text-gray-500 text-center leading-relaxed italic">
            Need to change scheduled hours? Please reach concierge at +91 98450 90022.
          </p>
        </div>

      </div>
    </div>
  );
}
