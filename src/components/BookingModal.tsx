import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, CheckCircle, ShieldCheck, Ticket, CircleSlash, Sparkles } from 'lucide-react';
import { Salon, Service, Booking } from '../types';

interface BookingModalProps {
  salon: Salon | null;
  isOpen: boolean;
  onClose: () => void;
  initialService?: Service;
}

export default function BookingModal({ salon, isOpen, onClose, initialService }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [bookingId, setBookingId] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedService(initialService || (salon && salon.services[0]) || null);
      
      // Auto-populate tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split('T')[0]);
      setSelectedTime('11:00 AM');
      setCustomerName('');
      setCustomerPhone('');
      setFormError('');
    }
  }, [isOpen, initialService, salon]);

  if (!isOpen || !salon) return null;

  // Generate 7 days starting from tomorrow
  const getNext7Days = () => {
    const days = [];
    const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        value: dateStr,
        dayName: weekdayNames[date.getDay()],
        dayNum: date.getDate(),
        month: monthNames[date.getMonth()]
      });
    }
    return days;
  };

  const timeSlots = [
    '09:30 AM', '11:00 AM', '12:30 PM', '02:00 PM', 
    '03:30 PM', '05:00 PM', '06:30 PM', '08:00 PM'
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      setFormError('Please enter a valid 10-digit phone number.');
      return;
    }

    const newBookingId = `GLAM-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setBookingId(newBookingId);

    const newBooking: Booking = {
      id: newBookingId,
      salonId: salon.id,
      salonName: salon.name,
      service: selectedService!,
      date: selectedDate,
      time: selectedTime,
      customerName,
      customerPhone,
      status: 'confirmed'
    };

    // Save to localStorage
    try {
      const savedBookingsStr = localStorage.getItem('glamblr_bookings');
      const savedBookings = savedBookingsStr ? JSON.parse(savedBookingsStr) : [];
      savedBookings.unshift(newBooking);
      localStorage.setItem('glamblr_bookings', JSON.stringify(savedBookings));
    } catch (err) {
      console.error('Failed to preserve booking locally', err);
    }

    setStep(4);
  };

  return (
    <div id="booking_modal_portal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent backdrop overlay */}
      <div className="absolute inset-0 bg-[#07070E] bg-opacity-85 backdrop-blur-md" onClick={onClose} />

      {/* Glass card style overlay mapping */}
      <div className="relative w-full max-w-lg bg-[#0F0F1A] border border-[rgba(212,175,55,0.25)] rounded-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] shadow-[0_0_50px_rgba(212,175,55,0.25)] z-10 text-white flex flex-col justify-between">
        
        {/* Header content section */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
          <div>
            <span className="text-[10px] text-[#D4AF37] uppercase tracking-[0.25em] font-semibold">Reserve Experience</span>
            <h3 className="font-serif italic text-xl text-[#F5D97F] font-semibold">{salon.name}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Step progress bullets */}
        {step < 4 && (
          <div className="flex items-center justify-between text-xs text-gray-400 mb-6 font-mono border-b border-white/5 pb-3">
            <span className={`${step === 1 ? 'text-[#D4AF37] font-bold' : ''}`}>1. Select Service</span>
            <span className="text-white/10">/</span>
            <span className={`${step === 2 ? 'text-[#D4AF37] font-bold' : ''}`}>2. Choose Schedule</span>
            <span className="text-white/10">/</span>
            <span className={`${step === 3 ? 'text-[#D4AF37] font-bold' : ''}`}>3. Confirm Credentials</span>
          </div>
        )}

        {/* STEP 1: SELECT SERVICE */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-lg text-white mb-3">Choose Your Desired Service:</h4>
            <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2 select-service-list">
              {salon.services.map((svc, idx) => (
                <label
                  key={idx}
                  className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedService?.name === svc.name
                      ? 'bg-[rgba(212,175,55,0.08)] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                      : 'bg-white/5 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="booking_service"
                      checked={selectedService?.name === svc.name}
                      onChange={() => setSelectedService(svc)}
                      className="mt-1 accent-[#D4AF37] h-4 w-4"
                    />
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-white/10 text-white/90 mb-1.5">
                        {svc.category}
                      </span>
                      <div className="font-serif text-white font-semibold group-hover:text-[#F5D97F]">{svc.name}</div>
                      <p className="text-xs text-[#8888AA] mt-0.5">Approx. duration: {svc.duration}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif font-bold text-[#D4AF37] text-lg">₹{svc.price.toLocaleString('en-IN')}</div>
                    <span className="text-[10px] text-[#8888AA]">Incl. Taxes</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-white/5">
              <button
                disabled={!selectedService}
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-gradient-to-r from-[#A07D1A] via-[#D4AF37] to-[#F5D97F] text-[#07070E] font-bold rounded-xl text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-40 select-none cursor-pointer"
              >
                Proceed to Date
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CHOOSE DATE / TIME */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-lg text-white mb-2">Determine Fitting Appointment:</h4>
            
            {/* 7 Days Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {getNext7Days().map((day) => (
                <button
                  key={day.value}
                  onClick={() => setSelectedDate(day.value)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-200 ${
                    selectedDate === day.value
                      ? 'bg-[rgba(212,175,55,0.08)] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                      : 'bg-[#161625] border-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="text-[10px] text-gray-400 capitalize font-medium">{day.dayName}</span>
                  <span className="text-serif text-lg font-bold text-[#F5D97F] my-0.5">{day.dayNum}</span>
                  <span className="text-[10px] text-[#8888AA] uppercase font-bold tracking-wider">{day.month}</span>
                </button>
              ))}
            </div>

            {/* Time Slot Header */}
            <div className="flex items-center gap-2 mt-5 text-gray-400 text-xs font-semibold">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>Select Available Time Slot:</span>
            </div>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                    selectedTime === time
                      ? 'bg-[#D4AF37] text-[#07070E] border-[#D4AF37]'
                      : 'bg-white/5 border-white/5 text-white/80 hover:border-white/20'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            <p className="text-[10px] text-gray-500 italic mt-3 text-center sm:text-left">
              Hours of operation: {salon.openHours} (Closed on standard holidays)
            </p>

            <div className="flex justify-between pt-4 mt-4 border-t border-white/5">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 bg-transparent border border-white/10 hover:border-white/20 text-white rounded-xl text-sm"
              >
                Back
              </button>
              <button
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-gradient-to-r from-[#A07D1A] via-[#D4AF37] to-[#F5D97F] text-[#07070E] font-bold rounded-xl text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-40 cursor-pointer"
              >
                Continue to Confirm
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRM CREDENTIALS */}
        {step === 3 && (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <h4 className="font-serif font-semibold text-lg text-white mb-2">Identify Your Booking Account:</h4>
            
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2 mb-4">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Selected Service</span>
                <span className="text-white font-serif">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Appointment Time</span>
                <span className="text-white font-serif">{selectedDate} at {selectedTime}</span>
              </div>
              <div className="h-0.5 bg-white/5 my-2"></div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-gray-400">Total Premium Sum</span>
                <span className="text-lg text-[#D4AF37] font-serif font-bold">₹{selectedService?.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Input fields */}
            <div className="space-y-3 text-left">
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wider">Your Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    placeholder="E.g., Ananya Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#D4AF37] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wider">Contact Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number, e.g. 9845012345"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#D4AF37] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              {formError && (
                <p className="text-xs text-[#FF6B9D] font-semibold text-center mt-1 animate-pulse">
                  ⚠️ {formError}
                </p>
              )}
            </div>

            <div className="flex justify-between pt-4 mt-6 border-t border-white/5">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-transparent border border-white/10 hover:border-white/20 text-white rounded-xl text-sm"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-[#A07D1A] via-[#D4AF37] to-[#F5D97F] text-[#07070E] font-bold rounded-xl text-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer"
              >
                Confirm Luxury Reservation
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: SUCCESS! */}
        {step === 4 && (
          <div className="text-center py-6 space-y-5 animate-fadeIn">
            <div className="mx-auto w-16 h-16 rounded-full bg-[rgba(212,175,55,0.08)] border border-[#D4AF37] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.2)] animate-pulse">
              <CheckCircle className="w-9 h-9 text-[#D4AF37] fill-[#07070E]" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Reservation Secured</span>
              <h4 className="font-serif italic text-2xl text-[#F5D97F] mt-1 mb-1">Your Glow Journey Awaits!</h4>
              <p className="text-xs text-gray-400">A digital receipt and confirmation has been processed.</p>
            </div>

            {/* Receipt ticket detail */}
            <div className="relative mx-auto max-w-sm bg-[#161625] border border-[rgba(212,175,55,0.25)] rounded-2xl p-5 text-left overflow-hidden">
              {/* Ticket stub side rings */}
              <div className="absolute top-1/2 -left-3.5 w-7 h-7 bg-[#0F0F1A] border-r border-[rgba(212,175,55,0.25)] rounded-full -translate-y-1/2"></div>
              <div className="absolute top-1/2 -right-3.5 w-7 h-7 bg-[#0F0F1A] border-l border-[rgba(212,175,55,0.25)] rounded-full -translate-y-1/2"></div>
              
              <div className="space-y-3.5 text-xs text-gray-300 font-mono">
                <div className="flex items-center justify-between col-span-2 border-b border-dashed border-white/10 pb-2">
                  <span className="font-serif font-bold text-white tracking-widest text-[#F5D97F]">GLAMBLR TICKET</span>
                  <span className="text-white/50">{selectedDate}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase text-[#8888AA]">Premium Oasis</span>
                  <p className="text-white font-serif italic text-sm font-semibold">{salon.name}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase text-[#8888AA]">Couture Service</span>
                  <p className="text-white font-serif">{selectedService?.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-dashed border-white/10 pt-3">
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase text-[#8888AA]">Scheduled On</span>
                    <p className="text-white text-[11px] font-semibold">{selectedTime}</p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <span className="text-[8px] uppercase text-[#8888AA]">Booking Core ID</span>
                    <p className="text-[#D4AF37] font-bold text-[11px] tracking-wide">{bookingId}</p>
                  </div>
                </div>

                {/* Secure Badge */}
                <div className="flex items-center justify-center gap-1.5 pt-2 text-[9px] text-gray-400 uppercase tracking-widest text-center border-t border-white/5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Verified Luxury Account
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-10 py-3 bg-[rgba(212,175,55,0.06)] border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#07070E] font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Dismiss Receipt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
