import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface StatItem {
  target: number;
  suffix: string;
  label: string;
  decimals?: number;
}

const STATS_DATA: StatItem[] = [
  { target: 200, suffix: '+', label: 'Premium Salons' },
  { target: 15000, suffix: '+', label: 'Happy Clients' },
  { target: 4.8, suffix: '', label: 'Average Rating', decimals: 1 },
  { target: 48, suffix: '', label: 'Bangalore Areas' }
];

export default function StatsSection() {
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Safety timeout fallback to guarantee animation starts in nested iFrames
    const timer = setTimeout(() => {
      if (!hasTriggered) {
        setHasTriggered(true);
      }
    }, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [hasTriggered]);

  useEffect(() => {
    if (!hasTriggered) return;

    let startTime: number | null = null;
    const duration = 2200; // Elegant, smooth 2.2s count timeline

    // Premium expo ease-out curve for high-end feel
    const easeOutExpo = (x: number): number => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    let rAFId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = easeOutExpo(progress);

      const nextCounts = STATS_DATA.map((s) => {
        const val = easeProgress * s.target;
        return s.decimals ? Math.round(val * 10) / 10 : Math.round(val);
      });

      setCounts(nextCounts);

      if (progress < 1) {
        rAFId = requestAnimationFrame(animate);
      } else {
        setCounts(STATS_DATA.map((s) => s.target));
      }
    };

    rAFId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rAFId);
    };
  }, [hasTriggered]);

  return (
    <motion.section
      ref={containerRef}
      id="stats_section_grid"
      className="relative py-16 px-4 max-w-7xl mx-auto z-10 transition-colors"
      initial={{ opacity: 0, y: 55 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS_DATA.map((stat, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden bg-white dark:bg-[#161625] border border-[#E1DBCE] dark:border-indigo-950 rounded-2xl p-6 text-center transform hover:-translate-y-1.5 transition-all duration-300 hover:shadow-lg dark:hover:shadow-[0_0_35px_rgba(251,191,36,0.08)]"
          >
            {/* Subtle inner gold accent lines */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#D4AF37] dark:border-amber-400 opacity-55 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#D4AF37] dark:border-amber-400 opacity-55 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#D4AF37] dark:border-amber-400 opacity-55 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#D4AF37] dark:border-amber-400 opacity-55 group-hover:opacity-100 transition-opacity"></div>

            <div className="font-serif italic text-3xl md:text-4xl lg:text-5xl font-black text-[#805C06] dark:text-amber-400">
              {counts[idx].toLocaleString(undefined, {
                minimumFractionDigits: stat.decimals ? 1 : 0,
                maximumFractionDigits: stat.decimals ? 1 : 0
              })}
              {stat.suffix}
            </div>
            
            <p className="mt-2.5 text-[11px] md:text-xs text-[#5C534C] dark:text-slate-300 tracking-widest uppercase font-extrabold font-mono">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
