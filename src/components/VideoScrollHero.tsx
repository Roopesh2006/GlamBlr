import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useMotionValue, MotionValue } from 'motion/react';
import { Sparkles, Compass, Scroll, ArrowRight, Shield, Clock } from 'lucide-react';

interface VideoScrollHeroProps {
  onExploreClick: () => void;
  onJoinClick: () => void;
  appDarkMode?: boolean;
}

// Separate, highly performance-optimized progress bar that subscribes directly to scroll updates
// preventing unnecessary parent component re-renders during active touch or scroll gestures.
interface TrajectoryProgressProps {
  scrollYProgress: MotionValue<number>;
}

function TrajectoryProgress({ scrollYProgress }: TrajectoryProgressProps) {
  const [percent, setPercent] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setPercent(Math.round(latest * 15));
  });

  const width = useTransform(scrollYProgress, (progress) => `${progress * 100}%`);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full shadow-lg">
      <div className="w-16 md:w-28 h-1.5 bg-white/15 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
          style={{ width }}
        />
      </div>
      <span className="text-[9.5px] font-mono text-amber-300 font-extrabold uppercase tracking-widest shrink-0">
        TRAJECTORY &nbsp;{percent}%
      </span>
    </div>
  );
}

export default function VideoScrollHero({ onExploreClick, onJoinClick, appDarkMode = false }: VideoScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom high-performance, GPU-friendly motion value
  const scrollYProgress = useMotionValue(0);

  // High performance custom scroll listener targeting rect offsets inside an active requestAnimationFrame loop.
  // This completely bypasses any iframe constraints or target offset bugs and is 100% stable.
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = containerRef.current!.getBoundingClientRect();
          const containerHeight = containerRef.current!.offsetHeight;
          const windowHeight = window.innerHeight;
          
          const scrolled = -rect.top;
          const maxScroll = containerHeight - windowHeight;
          
          if (maxScroll > 0) {
            const progress = Math.max(0, Math.min(1, scrolled / maxScroll));
            scrollYProgress.set(progress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call to set correct positions based on viewport status
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollYProgress]);

  // CONTINUOUS & GORGEOUS BACKGROUND CROSSFADES (No black voids or empty intervals!)
  const bg1Opacity = useTransform(scrollYProgress, [0, 0.45, 0.52], [1, 1, 0]);
  const bg2Opacity = useTransform(scrollYProgress, [0.42, 0.50, 0.78, 0.85], [0, 1, 1, 0]);
  const bg3Opacity = useTransform(scrollYProgress, [0.75, 0.82, 1], [0, 1, 1]);

  // BACKGROUND SUB-ZOOM SCALING (very subtle and elegant, avoiding low-res look)
  const bg1Scale = useTransform(scrollYProgress, [0, 0.52], [1, 1.05]);
  const bg2Scale = useTransform(scrollYProgress, [0.42, 0.85], [1.04, 1.01]);
  const bg3Scale = useTransform(scrollYProgress, [0.75, 1], [1.04, 1.01]);

  // CHOREOGRAPHED NON-OVERLAPPING MULTI-CARD ANIMATION SLOTS
  // Slide 1 Welcome Card Transforms
  const slide1Opacity = useTransform(scrollYProgress, [0, 0.35, 0.45], [1, 1, 0]);
  const slide1Y = useTransform(scrollYProgress, [0, 0.35, 0.45], [0, 0, -50]);
  const slide1Pointer = useTransform(scrollYProgress, [0, 0.42], ["auto", "none"]);

  // Slide 2 Quality Criteria Card Transforms
  const slide2Opacity = useTransform(scrollYProgress, [0.38, 0.45, 0.70, 0.78], [0, 1, 1, 0]);
  const slide2Y = useTransform(scrollYProgress, [0.38, 0.45, 0.70, 0.78], [50, 0, 0, -50]);
  const slide2Pointer = useTransform(scrollYProgress, [0.38, 0.45, 0.70, 0.78], ["none", "auto", "auto", "none"]);

  // Slide 3 SLA Booking Card Transforms
  const slide3Opacity = useTransform(scrollYProgress, [0.72, 0.78, 1], [0, 1, 1]);
  const slide3Y = useTransform(scrollYProgress, [0.72, 0.78, 1], [50, 0, 0]);
  const slide3Pointer = useTransform(scrollYProgress, [0.72, 0.78], ["none", "auto"]);

  return (
    <div ref={containerRef} className="relative h-[330vh] w-full bg-[#0B0B13] text-white overflow-visible">
      
      {/* Sticky layout container stays fully screen-pinned during scroll lifecycle */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* ==================== 1. VIVID, CLEAR & RADIANT LANDING MEDIA BACKDROPS ==================== */}

        {/* BACKGROUND LAYER 1: Cinematic Lobby Video (with solid high-res instant fallback) */}
        <motion.div 
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          style={{ 
            opacity: bg1Opacity,
            scale: bg1Scale,
          }}
        >
          {/* HD Fallback Image - guarantees the beautiful styling scene loads instantly and remains visible */}
          <img
            src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1920&q=95"
            alt="GlamBlr Luxury"
            className="absolute inset-0 w-full h-full object-cover select-none filter brightness-100 contrast-[1.02]"
            referrerPolicy="no-referrer"
          />
          <video
            src="https://player.vimeo.com/external/371433846.hd.mp4?s=2312abfb106a849db84aeb7346617c62bb1e17ca&profile_id=175&oauth2_token_id=57447761"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover select-none filter brightness-[0.98] contrast-[1.03]"
          />
          {/* Radiant gold-slanted vignette to reinforce luxury color styling, providing beautiful text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B13]/60 via-transparent to-[#0B0B13]/15 z-1" />
          <div className="absolute inset-0 bg-amber-900/[0.03] mix-blend-overlay z-1" />
        </motion.div>

        {/* BACKGROUND LAYER 2: Vivid & Highly Visible Wellness Image */}
        <motion.div 
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          style={{ 
            opacity: bg2Opacity,
            scale: bg2Scale,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=95"
            alt="Meticulous bespoke treatments"
            className="w-full h-full object-cover select-none filter brightness-100 contrast-[1.02]"
            referrerPolicy="no-referrer"
          />
          {/* Vivid overlay cross gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B13]/30 via-transparent to-[#0B0B13]/60 z-1" />
          <div className="absolute inset-0 bg-amber-900/[0.02] mix-blend-color-burn z-1" />
        </motion.div>

        {/* BACKGROUND LAYER 3: Modern Architectural Sanctuary Living Image */}
        <motion.div 
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          style={{ 
            opacity: bg3Opacity,
            scale: bg3Scale,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1920&q=95"
            alt="Award winning architecture salon lobby"
            className="w-full h-full object-cover select-none filter brightness-100 contrast-[1.03]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B13]/65 via-transparent to-[#0B0B13]/25 z-1" />
        </motion.div>


        {/* ==================== 2. LATERAL PREMIUM GEOMETRIC DETAILS ==================== */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none z-10" />

        <div className="absolute inset-y-0 left-6 md:left-12 w-px bg-white/5 border-l border-dashed border-white/10 pointer-events-none z-20 flex flex-col justify-between py-12">
          <span className="text-[7.5px] font-mono tracking-widest text-[#D4AF37] uppercase -rotate-90 -translate-x-6 origin-left">GRID_COORDINATES_09</span>
          <span className="text-[7.5px] font-mono tracking-widest text-slate-500 uppercase -rotate-90 -translate-x-6 origin-left">GLAMBLR_PROXIMITY_CORE</span>
        </div>
        <div className="absolute inset-y-0 right-6 md:right-12 w-px bg-white/5 border-r border-dashed border-white/10 pointer-events-none z-20 flex flex-col justify-between py-12 text-right">
          <span className="text-[7.5px] font-mono tracking-widest text-slate-500 uppercase rotate-90 translate-x-6 origin-right">VERIFIED_DIRECT_SLA_SECURITY</span>
          <span className="text-[7.5px] font-mono tracking-widest text-[#D4AF37] uppercase rotate-90 translate-x-6 origin-right">PARITY_RATES_LOCK</span>
        </div>


        {/* ==================== 3. CHOREOGRAPHED NON-OVERLAPPING STACK ==================== */}
        {/* We place each card inside an absolute coordinates block. This guarantees they occupy the exact same physical position and can never displace or push each other! */}
        <div className="relative z-30 max-w-4xl mx-auto px-6 w-full h-[500px] flex items-center justify-center">
          
          {/* SLIDE 1 CARD: WELCOME OVERVIEW */}
          <motion.div
            style={{
              opacity: slide1Opacity,
              y: slide1Y,
              pointerEvents: slide1Pointer as any,
              position: 'absolute'
            }}
            className="w-full max-w-2xl flex flex-col items-center text-center"
          >
            {/* Premium Frosted Capsule */}
            <div className="bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 shadow-[0_24px_50px_rgba(0,0,0,0.6)] w-full hover:border-[#D4AF37]/30 transition-colors duration-300">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.07] backdrop-blur-md rounded-full border border-[#D4AF37]/45 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-[9.5px] font-mono text-amber-100 uppercase tracking-[0.25em] font-extrabold flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-400" /> Bangalore's Hand-Audited Lounge Grid
                </span>
              </div>

              <h1 className="font-serif italic text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
                A Private Heaven <br />
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent font-medium">
                  For Sophisticated Stylers
                </span>
              </h1>

              <p className="text-xs md:text-sm text-slate-200 font-sans max-w-xl mx-auto leading-relaxed mt-4 font-light">
                We hand-audit Bangalore's most exclusive salon architectural masterpieces. Undergo bespoke routines with zero wait times. Secure private slot reservations smoothly.
              </p>

              <div className="pt-6 flex flex-col sm:flex-row items-center gap-4 justify-center">
                <button
                  onClick={onExploreClick}
                  className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs uppercase font-extrabold tracking-widest rounded-xl shadow-lg hover:shadow-xl hover:shadow-amber-400/20 hover:scale-[1.03] active:scale-98 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" /> Explore Active Grid
                </button>
                <button
                  onClick={onJoinClick}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs uppercase font-extrabold tracking-widest rounded-xl hover:scale-[1.03] active:scale-98 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Scroll className="w-4 h-4 text-amber-300" /> List Your Lounge
                </button>
              </div>

              <div className="pt-5 flex flex-col items-center gap-0.5 text-amber-400/80">
                <span className="text-[9px] font-mono tracking-widest uppercase animate-pulse">Scroll to inspect design hallmarks</span>
                <span className="text-xs">↓</span>
              </div>
            </div>
          </motion.div>

          {/* SLIDE 2 CARD: QUALITY BENCHMARKS */}
          <motion.div
            style={{
              opacity: slide2Opacity,
              y: slide2Y,
              pointerEvents: slide2Pointer as any,
              position: 'absolute'
            }}
            className="w-full max-w-2xl flex flex-col items-center text-center"
          >
            {/* Premium Frosted Capsule */}
            <div className="bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 shadow-[0_24px_50px_rgba(0,0,0,0.6)] w-full hover:border-[#D4AF37]/30 transition-colors duration-300">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 backdrop-blur-md rounded-full border border-emerald-500/35 mb-4">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[9.5px] font-mono text-emerald-400 uppercase tracking-[0.25em] font-extrabold">
                  42 Strict Luxury Hallmarks
                </span>
              </div>

              <h2 className="font-serif italic text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.12]">
                Unmatched Quality <br />
                <span className="text-amber-400 font-medium">In Every Audited Detail</span>
              </h2>

              <p className="text-xs md:text-sm text-slate-200 font-sans max-w-xl mx-auto leading-relaxed mt-4 font-light">
                From organic essential therapies to clinical cosmetic standard validation, only boutique lounges passing our 42-stage checklist enter the premium grid.
              </p>

              {/* Operational indicators Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-6 w-full">
                <div className="bg-black/40 backdrop-blur-md border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span className="text-xl font-serif text-amber-400 font-black italic">42</span>
                  <span className="text-[8.5px] font-mono text-slate-300 uppercase mt-0.5 tracking-wider">Hallmarks</span>
                </div>
                <div className="bg-black/40 backdrop-blur-md border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span className="text-xl font-serif text-amber-400 font-black italic">№ 1</span>
                  <span className="text-[8.5px] font-mono text-slate-300 uppercase mt-0.5 tracking-wider">Curation tier</span>
                </div>
                <div className="bg-black/40 backdrop-blur-md border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span className="text-xl font-serif text-amber-400 font-black italic">100%</span>
                  <span className="text-[8.5px] font-mono text-slate-300 uppercase mt-0.5 tracking-wider">Price Parity</span>
                </div>
                <div className="bg-black/40 backdrop-blur-md border border-white/5 p-3 rounded-xl flex flex-col items-center">
                  <span className="text-xl font-serif text-emerald-400 font-black italic">Direct</span>
                  <span className="text-[8.5px] font-mono text-slate-300 uppercase mt-0.5 tracking-wider">SLA Security</span>
                </div>
              </div>

              <div className="pt-5 flex flex-col items-center gap-0.5 text-amber-400/80">
                <span className="text-[9px] font-mono tracking-widest uppercase animate-pulse">Scroll to lock reservations instantly</span>
                <span className="text-xs">↓</span>
              </div>
            </div>
          </motion.div>

          {/* SLIDE 3 CARD: RELIABLE SLA BOOKINGS */}
          <motion.div
            style={{
              opacity: slide3Opacity,
              y: slide3Y,
              pointerEvents: slide3Pointer as any,
              position: 'absolute'
            }}
            className="w-full max-w-2xl flex flex-col items-center text-center"
          >
            {/* Premium Frosted Capsule */}
            <div className="bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 shadow-[0_24px_50px_rgba(0,0,0,0.6)] w-full hover:border-[#D4AF37]/30 transition-colors duration-300">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 backdrop-blur-md rounded-full border border-amber-400/50 mb-4">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[9.5px] font-mono text-amber-300 uppercase tracking-[0.25em] font-extrabold">
                  Verified Bookings & Real-Time Sync
                </span>
              </div>

              <h2 className="font-serif italic text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.12]">
                Instant SLA Lock <br />
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent font-medium">
                  Your Direct Parity Priority
                </span>
              </h2>

              <p className="text-xs md:text-sm text-slate-200 font-sans max-w-xl mx-auto leading-relaxed mt-4 font-light">
                Bypass double-booking frustrations and crowded waiting lobbies. Select your preferred slot, reserve directly with complete calendar accuracy, and step right into therapeutic bliss.
              </p>

              <div className="pt-6 flex flex-col sm:flex-row items-center gap-3 justify-center">
                <button
                  onClick={() => {
                    const target = document.getElementById('discovery_lounge_anchor');
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 to-[#D4AF37] hover:from-amber-300 hover:to-amber-500 text-slate-950 text-xs uppercase font-extrabold tracking-widest rounded-xl hover:scale-105 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20"
                >
                  Enter Discovery Lounge Deck <ArrowRight className="w-4 h-4 animate-pulse" />
                </button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ==================== 4. OPTIMIZED HIGH-PERFORMANCE PROGRESS SUB-WIDGET ==================== */}
        <TrajectoryProgress scrollYProgress={scrollYProgress} />

      </div>

    </div>
  );
}
