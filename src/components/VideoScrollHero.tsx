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
  
  const scrollToNextSlide = (slideIndex: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight;
    let targetScroll = containerTop;
    
    if (slideIndex === 1) {
      targetScroll = containerTop + containerHeight * 0.41;
    } else if (slideIndex === 2) {
      targetScroll = containerTop + containerHeight * 0.76;
    }
    
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };
  
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
        
        {/* SLEEPIEST BEAUTIFUL FLOATING BACKGROUND ORBS */}
        <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden opacity-35">
          <div className="absolute top-1/4 left-1/4 w-[380px] h-[380px] rounded-full bg-indigo-500/30 blur-[130px] cosmic-orb-1" />
          <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] rounded-full bg-amber-500/15 blur-[150px] cosmic-orb-2" />
        </div>
        
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
        <div className="relative z-30 max-w-4xl mx-auto px-6 w-full h-[520px] flex items-center justify-center">
          
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
            <div className="bg-[#030308]/75 backdrop-blur-3xl border border-white/10 rounded-[2.25rem] p-8 md:p-11 shadow-[0_30px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(212,175,55,0.05)] w-full hover:border-amber-400/30 transition-all duration-500 relative overflow-hidden group">
              {/* Nolan Omura floating number watermark */}
              <div className="absolute top-6 right-8 text-[7rem] font-serif italic text-white/[0.04] select-none font-medium leading-none pointer-events-none">01</div>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.05] backdrop-blur-md rounded-full border border-white/10 mb-5 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[9.5px] font-mono text-amber-200 uppercase tracking-[0.25em] font-extrabold flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-400" /> Bangalore's Hand-Audited Lounge Grid
                </span>
              </div>

              <h1 className="font-serif italic text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.12] relative z-10">
                A Private Heaven <br />
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent font-medium">
                  For Sophisticated Stylers
                </span>
              </h1>

              <p className="text-xs md:text-sm text-slate-300 font-sans max-w-xl mx-auto leading-relaxed mt-5 font-light relative z-10">
                We hand-audit Bangalore's most exclusive salon architectural masterpieces. Undergo bespoke routines with zero wait times. Secure private slot reservations smoothly.
              </p>

              <div className="pt-8 flex flex-col sm:flex-row items-center gap-4 justify-center relative z-10">
                <button
                  onClick={onExploreClick}
                  className="w-full sm:w-auto px-7 py-4 bg-amber-400 hover:bg-white text-slate-950 text-xs uppercase font-extrabold tracking-widest rounded-full shadow-lg hover:shadow-xl hover:shadow-amber-400/20 hover:scale-[1.03] active:scale-98 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer noomo-magnetic"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" /> Explore Active Grid
                </button>
                <button
                  onClick={onJoinClick}
                  className="w-full sm:w-auto px-7 py-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs uppercase font-extrabold tracking-widest rounded-full hover:scale-[1.03] active:scale-98 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer noomo-magnetic"
                >
                  <Scroll className="w-4 h-4 text-amber-400" /> List Your Lounge
                </button>
              </div>

              <button
                onClick={() => scrollToNextSlide(1)}
                className="group/scroll pt-6 flex flex-col items-center gap-1.5 text-amber-400/60 hover:text-amber-400 focus:outline-none relative z-10 cursor-pointer w-full"
              >
                <span className="text-[9.5px] font-mono tracking-widest uppercase animate-pulse group-hover/scroll:translate-y-[-2px] transition-transform duration-300">
                  Click or Scroll to inspect design hallmarks
                </span>
                <div className="w-5 h-8 border border-amber-400/30 group-hover/scroll:border-amber-400/80 rounded-full flex justify-center p-1 transition-colors">
                  <motion.div
                    animate={{
                      y: [0, 8, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-1.5 h-2 bg-amber-400 rounded-full"
                  />
                </div>
              </button>
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
            <div className="bg-[#030308]/75 backdrop-blur-3xl border border-white/10 rounded-[2.25rem] p-8 md:p-11 shadow-[0_30px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(16,185,129,0.03)] w-full hover:border-emerald-400/30 transition-all duration-500 relative overflow-hidden group">
              {/* Nolan Omura floating number watermark */}
              <div className="absolute top-6 right-8 text-[7rem] font-serif italic text-white/[0.04] select-none font-medium leading-none pointer-events-none">02</div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 backdrop-blur-md rounded-full border border-emerald-500/25 mb-5 relative z-10">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[9.5px] font-mono text-emerald-300 uppercase tracking-[0.25em] font-extrabold">
                  42 Strict Luxury Hallmarks
                </span>
              </div>

              <h2 className="font-serif italic text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.12] relative z-10">
                Unmatched Quality <br />
                <span className="text-amber-400 font-medium">In Every Audited Detail</span>
              </h2>

              <p className="text-xs md:text-sm text-slate-300 font-sans max-w-xl mx-auto leading-relaxed mt-5 font-light relative z-10">
                From organic essential therapies to clinical cosmetic standard validation, only boutique lounges passing our 42-stage checklist enter the premium grid.
              </p>

              {/* Operational indicators Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-7 w-full relative z-10">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col items-center hover:bg-white/10 transition-colors">
                  <span className="text-2xl font-serif text-amber-400 font-black italic">42</span>
                  <span className="text-[8.5px] font-mono text-slate-300 uppercase mt-0.5 tracking-wider">Hallmarks</span>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col items-center hover:bg-white/10 transition-colors">
                  <span className="text-2xl font-serif text-amber-400 font-black italic">№ 1</span>
                  <span className="text-[8.5px] font-mono text-slate-300 uppercase mt-0.5 tracking-wider">Curation tier</span>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col items-center hover:bg-white/10 transition-colors">
                  <span className="text-2xl font-serif text-amber-400 font-black italic">100%</span>
                  <span className="text-[8.5px] font-mono text-slate-300 uppercase mt-0.5 tracking-wider">Price Parity</span>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col items-center hover:bg-white/10 transition-colors">
                  <span className="text-2xl font-serif text-emerald-400 font-black italic">Direct</span>
                  <span className="text-[8.5px] font-mono text-slate-300 uppercase mt-0.5 tracking-wider">SLA Security</span>
                </div>
              </div>

              <button
                onClick={() => scrollToNextSlide(2)}
                className="group/scroll pt-6 flex flex-col items-center gap-1.5 text-amber-400/60 hover:text-amber-400 focus:outline-none relative z-10 cursor-pointer w-full"
              >
                <span className="text-[9.5px] font-mono tracking-widest uppercase animate-pulse group-hover/scroll:translate-y-[-2px] transition-transform duration-300">
                  Click or Scroll to lock reservations instantly
                </span>
                <div className="w-5 h-8 border border-amber-400/30 group-hover/scroll:border-amber-400/80 rounded-full flex justify-center p-1 transition-colors">
                  <motion.div
                    animate={{
                      y: [0, 8, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-1.5 h-2 bg-amber-400 rounded-full"
                  />
                </div>
              </button>
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
            <div className="bg-[#030308]/75 backdrop-blur-3xl border border-white/10 rounded-[2.25rem] p-8 md:p-11 shadow-[0_30px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(245,158,11,0.03)] w-full hover:border-amber-400/30 transition-all duration-500 relative overflow-hidden group">
              {/* Nolan Omura floating number watermark */}
              <div className="absolute top-6 right-8 text-[7rem] font-serif italic text-white/[0.04] select-none font-medium leading-none pointer-events-none">03</div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 backdrop-blur-md rounded-full border border-amber-400/35 mb-5 relative z-10">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[9.5px] font-mono text-amber-300 uppercase tracking-[0.25em] font-extrabold">
                  Verified Bookings & Real-Time Sync
                </span>
              </div>

              <h2 className="font-serif italic text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.12] relative z-10">
                Instant SLA Lock <br />
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent font-medium">
                  Your Direct Parity Priority
                </span>
              </h2>

              <p className="text-xs md:text-sm text-slate-300 font-sans max-w-xl mx-auto leading-relaxed mt-5 font-light relative z-10">
                Bypass double-booking frustrations and crowded waiting lobbies. Select your preferred slot, reserve directly with complete calendar accuracy, and step right into therapeutic bliss.
              </p>

              <div className="pt-8 flex flex-col sm:flex-row items-center gap-3 justify-center relative z-10">
                <button
                  onClick={() => {
                    const target = document.getElementById('discovery_lounge_anchor');
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full sm:w-auto px-8 py-4.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-white hover:to-white text-slate-950 text-xs uppercase font-extrabold tracking-widest rounded-full hover:scale-105 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/10 noomo-magnetic"
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
