import React, { useState, useEffect } from 'react';
import { X, Sparkles, Smile, Flame, Settings, MapPin, Check, Heart, Shield } from 'lucide-react';
import { Salon } from '../types';
import { LUX_SALONS } from '../data';

export const getRealPriceText = (symbols: string) => {
  if (symbols === '₹₹') return '₹1,000 - ₹3,000';
  if (symbols === '₹₹₹') return '₹3,000 - ₹7,000';
  if (symbols === '₹₹₹₹') return '₹7,000+';
  return symbols || '₹1,000 - ₹3,000';
};

interface StyleQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSalonToBook: (salonId: string) => void;
  salons?: Salon[];
}

export default function StyleQuiz({ isOpen, onClose, onSelectSalonToBook, salons = LUX_SALONS }: StyleQuizProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [profileResult, setProfileResult] = useState<{
    title: string;
    description: string;
    vibe: string;
    matchedSalons: { salon: Salon; matchPercentage: number }[];
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAnswers({});
      setIsLoading(false);
      setProfileResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectOption = (questionKey: string, value: string) => {
    const updatedAnswers = { ...answers, [questionKey]: value };
    setAnswers(updatedAnswers);
    
    if (step < 5) {
      setStep((prev) => prev + 1);
    } else {
      // Finalize and trigger loading state
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        calculateBestMatches(updatedAnswers);
      }, 3000);
    }
  };

  const calculateBestMatches = (currentAnswers: Record<string, string>) => {
    // Generate a persona based on vibe
    const vibe = currentAnswers.vibe || 'Natural Glow';
    const concern = currentAnswers.concern || 'Color refresh';
    const budget = currentAnswers.budget || '₹₹₹';
    const area = currentAnswers.area || 'Anywhere';

    let title = 'The Glow Goddess';
    let description = 'You embody pure classic luxury and radiant glamour. You look for elite service standards, nourishing botanical elixirs, and bespoke custom coloring.';

    if (vibe === 'Minimal Clean') {
      title = 'The Zen Minimalist';
      description = 'You appreciate clean geometric precision, quiet relaxation, and weightless natural textures. You value eco-conscious materials and highly skilled artists.';
    } else if (vibe === 'Edgy Chic') {
      title = 'The Modern Trailblazer';
      description = 'You are bold, daring, and ahead of the trends. You look for sharp razor styling, customized extensions, and vibrant pigment infusions.';
    } else if (vibe === 'Natural Glow') {
      title = 'The Wellness Devotee';
      description = 'You seek deep inner tranquility, organic skin treatments, and holistic luxury. You value quiet spa cocoons and high-density blowouts.';
    }

    // Filter and score all salons based on traits - highly robust to prevent any crashes
    const validSalons = (salons || []).filter(s => s && s.id);
    const scoredSalons = validSalons.map((salon) => {
      let score = 70; // baseline

      const salonArea = salon.area || '';
      const salonPriceRange = salon.priceRange || '₹₹';
      const isLuxury = salon.isLuxury || false;

      // Area bonus
      if (area !== 'Anywhere' && area !== 'Any') {
        // map answers areas (North BLR / South BLR / etc) to actual salon areas
        const matchesArea = 
          (area === 'North BLR' && salonArea === 'Banaswadi') ||
          (area === 'South BLR' && (salonArea === 'Koramangala' || salonArea === 'HSR Layout' || salonArea === 'Jayanagar')) ||
          (area === 'East BLR' && (salonArea === 'Indiranagar' || salonArea === 'Whitefield'));
        if (matchesArea) score += 15;
      }

      // Budget match - safe length check using fallback
      if (salonPriceRange === budget) {
        score += 15;
      } else if (Math.abs(salonPriceRange.length - budget.length) === 1) {
        score += 5;
      }

      // Specialty / service category matchup
      if (isLuxury && (vibe === 'Bold Glam' || vibe === 'Natural Glow')) {
        score += 10;
      }

      // clamp score
      score = Math.min(98, Math.max(82, score));
      // add a tiny bit of random realism
      score += Math.floor(Math.random() * 2);

      return {
        salon,
        matchPercentage: score
      };
    });

    // Sort by match percentage
    const topMatches = scoredSalons
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 3);

    // Save style DNA results dynamically to database
    try {
      fetch('/api/quiz-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          vibe,
          concern,
          budget,
          area,
          matchedSalons: topMatches.map(m => ({ id: m.salon?.id || '', name: m.salon?.name || '', match: m.matchPercentage }))
        })
      }).catch(err => console.warn("Style DNA server sync delay:", err));
    } catch (e) {
      console.warn("Quiz results save bypassed:", e);
    }

    setProfileResult({
      title,
      description,
      vibe,
      matchedSalons: topMatches
    });
  };

  const getStepHeaderValue = () => {
    return Math.floor((step / 5) * 100);
  };

  return (
    <div id="style_quiz_modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent backdrop overlay */}
      <div className="absolute inset-0 bg-[#07070E] bg-opacity-80 backdrop-blur-md" onClick={onClose} />

      {/* Main glass card modal container */}
      <div 
        data-lenis-prevent
        className="relative w-full max-w-2xl bg-[#0F0F1A] border border-[rgba(212,175,55,0.25)] rounded-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] shadow-[0_0_50px_rgba(212,175,55,0.25)] z-10 text-white flex flex-col justify-between"
      >
        
        {/* Header decoration */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
            <h3 className="font-serif italic text-lg md:text-xl text-[#F5D97F] tracking-wide">AI Style DNA Profiler</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors">
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* LOADING STATE FOR DNA helix simulation */}
        {isLoading && (
          <div className="my-10 flex flex-col items-center justify-center py-12 text-center">
            {/* The rotating DNA spirals using visual pure absolute CSS geometry */}
            <div className="relative w-16 h-24 mb-6 flex justify-between">
              {/* Helix strand A */}
              <div className="absolute inset-0 flex flex-col justify-between items-center animate-spin" style={{ animationDuration: '3s' }}>
                <div className="w-4 h-4 rounded-full bg-[#D4AF37] shadow-[0_0_12px_#D4AF37]"></div>
                <div className="w-0.5 h-16 bg-gradient-to-b from-[#D4AF37] to-[#FF6B9D]"></div>
                <div className="w-4 h-4 rounded-full bg-[#FF6B9D] shadow-[0_0_12px_#FF6B9D]"></div>
              </div>
              {/* Helix strand B with delay */}
              <div className="absolute inset-0 flex flex-col justify-between items-center animate-spin" style={{ animationDuration: '3s', animationDelay: '-1.5s' }}>
                <div className="w-4 h-4 rounded-full bg-[#FF6B9D] shadow-[0_0_12px_#FF6B9D]"></div>
                <div className="w-0.5 h-16 bg-gradient-to-b from-[#FF6B9D] to-[#D4AF37]"></div>
                <div className="w-4 h-4 rounded-full bg-[#D4AF37] shadow-[0_0_12px_#D4AF37]"></div>
              </div>
            </div>
            <h4 className="text-xl font-serif text-[#F5D97F] italic tracking-wide animate-pulse">Mapping Your Style DNA...</h4>
            <p className="text-sm text-[#8888AA] mt-2 max-w-sm">Comparing bio-textures, color aesthetics, and Bangalore area parameters with premium salon profiles.</p>
          </div>
        )}

        {/* QUIZ ACTIVE STEPS */}
        {!isLoading && !profileResult && (
          <div>
            {/* Progress bar */}
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-8">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F5D97F] to-[#A07D1A] transition-all duration-300"
                style={{ width: `${getStepHeaderValue()}%` }}
              />
            </div>

            {/* Q1: What's your vibe? */}
            {step === 1 && (
              <div className="animate-fadeIn">
                <span className="text-xs text-[#D4AF37] tracking-[0.2em] font-bold uppercase">DNA Diagnostics • Step 1 of 5</span>
                <h4 className="text-xl md:text-2xl font-serif text-[#FFF] mt-1 mb-6">Describe your primary stylistic vibe:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Minimal Clean', val: 'Minimal Clean', desc: 'Sleek geometric shapes, natural balances, organic simplicity', icon: Smile },
                    { label: 'Bold Glam', val: 'Bold Glam', desc: 'Dazzling cosmetics, vivid extensions, show-stopping colors', icon: Flame },
                    { label: 'Natural Glow', val: 'Natural Glow', desc: 'Moisture locks, high-density blowouts, fresh herbal glows', icon: Heart },
                    { label: 'Edgy Chic', val: 'Edgy Chic', desc: 'Razor sculpting, textured fringe, rock-inspired trends', icon: Settings }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('vibe', opt.val)}
                      className="group relative backdrop-blur-md bg-[rgba(22,22,37,0.4)] hover:bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.15)] hover:border-[#D4AF37] rounded-xl p-5 text-left transition-all hover:-translate-y-1 duration-200"
                    >
                      <opt.icon className="w-8 h-8 text-[#D4AF37] mb-3 group-hover:scale-110 transition-transform" />
                      <div className="font-serif font-semibold text-white group-hover:text-[#F5D97F] transition-colors">{opt.label}</div>
                      <div className="text-xs text-[#8888AA] mt-1 group-hover:text-white/80 transition-colors leading-relaxed">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Q2: Hair Length */}
            {step === 2 && (
              <div className="animate-fadeIn">
                <span className="text-xs text-[#D4AF37] tracking-[0.2em] font-bold uppercase">DNA Diagnostics • Step 2 of 5</span>
                <h4 className="text-xl md:text-2xl font-serif text-[#FFF] mt-1 mb-6">What is your current hair configuration:</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Short / Pixie / Crop', val: 'Short', desc: 'Razor trims and sculpted styles' },
                    { label: 'Medium / Collar / Bob', val: 'Medium', desc: 'High-density bouncy blowouts' },
                    { label: 'Long / Below Shoulders', val: 'Long', desc: 'Couture extensions & balayage' },
                    { label: 'Varies / Shaved / Sculpted', val: 'Varies', desc: 'Specialized scalp therapies' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('hair', opt.val)}
                      className="group p-5 backdrop-blur-md bg-[rgba(22,22,37,0.4)] hover:bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.15)] hover:border-[#D4AF37] rounded-xl text-center transition-all duration-200"
                    >
                      <div className="font-serif font-semibold text-white group-hover:text-[#F5D97F] transition-colors">{opt.label}</div>
                      <div className="text-xs text-[#8888AA] mt-2 group-hover:text-white/80 transition-colors">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Q3: Top concern today? */}
            {step === 3 && (
              <div className="animate-fadeIn">
                <span className="text-xs text-[#D4AF37] tracking-[0.2em] font-bold uppercase">DNA Diagnostics • Step 3 of 5</span>
                <h4 className="text-xl md:text-2xl font-serif text-[#FFF] mt-1 mb-6">What is your primary focus / concern today?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Damage Repair & Hydration', val: 'Damage repair', desc: 'Deep silk restructuring, collagen mask diagnostics' },
                    { label: 'High Volume & Blowout', val: 'Volume', desc: 'Bouncy luxury volume, traditional blowout' },
                    { label: 'Color Refresh / Balayage', val: 'Color refresh', desc: 'French coloring, custom root blending' },
                    { label: 'Complex Skin Solutions', val: 'Deep treatment', desc: 'Dermal micro-peel, platinum hydration' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('concern', opt.val)}
                      className="group p-5 bg-[rgba(22,22,37,0.4)] hover:bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.15)] hover:border-[#D4AF37] rounded-xl text-left transition-all duration-200"
                    >
                      <div className="font-serif font-semibold text-white group-hover:text-[#F5D97F] transition-colors">{opt.label}</div>
                      <div className="text-xs text-[#8888AA] mt-2 group-hover:text-white/80 transition-colors leading-relaxed">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Q4: Budget preference? */}
            {step === 4 && (
              <div className="animate-fadeIn">
                <span className="text-xs text-[#D4AF37] tracking-[0.2em] font-bold uppercase">DNA Diagnostics • Step 4 of 5</span>
                <h4 className="text-xl md:text-2xl font-serif text-[#FFF] mt-1 mb-6">Select your luxury quotient tier:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'High-Street Chic', val: '₹₹', displayPrice: '₹1,000 - ₹3,000', desc: 'Accessible master-level cuts' },
                    { label: 'Premium Indulgence', val: '₹₹₹', displayPrice: '₹3,000 - ₹7,000', desc: 'Signature elixirs & premium styling' },
                    { label: 'Elite Pure Luxury', val: '₹₹₹₹', displayPrice: '₹7,000+', desc: 'Private boudoirs, imported gold leaf art' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('budget', opt.val)}
                      className="group p-5 bg-[rgba(22,22,37,0.4)] hover:bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.15)] hover:border-[#D4AF37] rounded-xl text-center transition-all duration-200"
                    >
                      <div className="text-xl text-[#D4AF37] font-bold mb-2">{opt.displayPrice}</div>
                      <div className="font-serif font-semibold text-white group-hover:text-[#F5D97F] transition-colors mb-1">{opt.label}</div>
                      <div className="text-xs text-[#8888AA] group-hover:text-white/80 transition-colors">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Q5: Preferred area? */}
            {step === 5 && (
              <div className="animate-fadeIn">
                <span className="text-xs text-[#D4AF37] tracking-[0.2em] font-bold uppercase">DNA Diagnostics • Step 5 of 5</span>
                <h4 className="text-xl md:text-2xl font-serif text-[#FFF] mt-1 mb-6">Choose your preferred Bangalore geographic zone:</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'East Bangalore', val: 'East BLR', desc: 'Indiranagar, Whitefield' },
                    { label: 'South Bangalore', val: 'South BLR', desc: 'Koramangala, Jayanagar, HSR Layout' },
                    { label: 'North Bangalore', val: 'North BLR', desc: 'Banaswadi, Hebbal' },
                    { label: 'Anywhere In BLR', val: 'Anywhere', desc: 'Willing to travel for the absolute best' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => handleSelectOption('area', opt.val)}
                      className="group p-5 bg-[rgba(22,22,37,0.4)] hover:bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.15)] hover:border-[#D4AF37] rounded-xl text-left transition-all duration-200"
                    >
                      <MapPin className="w-5 h-5 text-[#D4AF37] mb-2 group-hover:translate-x-1 transition-transform" />
                      <div className="font-serif font-semibold text-white group-hover:text-[#F5D97F] transition-colors">{opt.label}</div>
                      <div className="text-xs text-[#8888AA] mt-1 group-hover:text-white/80 transition-colors">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* RESULTS SCREEN */}
        {!isLoading && profileResult && (
          <div className="animate-fadeIn">
            {/* Persona header card */}
            <div className="relative text-center p-6 bg-gradient-to-tr from-[rgba(22,22,37,0.7)] via-[rgba(212,175,55,0.06)] to-[rgba(255,107,157,0.06)] border border-[rgba(212,175,55,0.2)] rounded-2xl mb-8">
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 scale-90 border border-[rgba(212,175,55,0.4)] rounded-full bg-black/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 fill-[#D4AF37]" /> Checked Profile
              </div>

              <div className="w-12 h-12 rounded-full bg-[rgba(212,175,55,0.1)] border border-[#D4AF37] flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <span className="text-xs text-[#8888AA] tracking-[0.2em] font-bold uppercase block">Your Style DNA Result</span>
              <h4 className="text-2xl md:text-3xl font-serif italic text-[#F5D97F] font-bold mt-1">{profileResult.title}</h4>
              <p className="text-sm text-[#8888AA] mt-3 max-w-lg mx-auto leading-relaxed">{profileResult.description}</p>
            </div>

            {/* Matched salons */}
            <h5 className="font-serif italic text-lg text-white mb-4">Your Gold Matched Salons:</h5>
            <div className="space-y-4 mb-6">
              {profileResult.matchedSalons.map(({ salon, matchPercentage }) => (
                <div
                  key={salon.id}
                  className="group flex flex-col sm:flex-row gap-4 items-center bg-[#161625] border border-[rgba(212,175,55,0.15)] rounded-xl p-4 transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                >
                  <img
                    src={salon.images?.[0] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800"}
                    alt={salon.name}
                    className="w-full sm:w-28 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                      <div className="font-serif text-[#F5D97F] text-lg font-semibold">{salon.name}</div>
                      <div className="px-2.5 py-0.5 rounded-full border border-dashed border-[#D4AF37] bg-[rgba(212,175,55,0.08)] text-xs text-[#F5D97F] font-mono tracking-wider">
                        {matchPercentage}% compatibility Match
                      </div>
                    </div>
                    <p className="text-xs text-[#8888AA] mt-1">{salon.area || "Bengaluru"} • Star Rating {salon.rating || 0} ★ • {getRealPriceText(salon.priceRange)}</p>
                    <p className="text-xs text-white/70 line-clamp-1 mt-1.5 italic">"{salon.description || ""}"</p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectSalonToBook(salon.id);
                      onClose();
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#A07D1A] via-[#D4AF37] to-[#F5D97F] text-[#07070E] font-bold rounded-xl text-xs hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] hover:scale-[1.03] transition-all cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setStep(1);
                  setProfileResult(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-[rgba(212,175,55,0.3)] hover:border-[#D4AF37] text-white/80 hover:text-white text-xs font-semibold hover:bg-white/5 transition-all"
              >
                Restart Profile Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
