import React, { useEffect, useRef, useState } from 'react';

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

    return () => {
      observer.disconnect();
    };
  }, [hasTriggered]);

  useEffect(() => {
    if (!hasTriggered) return;

    let startTime: number | null = null;
    const duration = 1500; // 1.5s animation

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const nextCounts = STATS_DATA.map((s) => {
        return Math.floor(progress * s.target * 10) / 10;
      });

      setCounts(nextCounts);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // clamp exactly to target values at the end of animation
        setCounts(STATS_DATA.map((s) => s.target));
      }
    };

    requestAnimationFrame(animate);
  }, [hasTriggered]);

  return (
    <section ref={containerRef} id="stats_section_grid" className="relative py-16 px-4 max-w-7xl mx-auto z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS_DATA.map((stat, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden bg-white/80 dark:bg-[#12121E]/60 border border-[#E1DBCE] dark:border-indigo-950/60 rounded-2xl p-6 text-center transform hover:-translate-y-1.5 transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_0_30px_rgba(212,175,55,0.06)]"
          >
            {/* Subtle inner gold accent lines */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#D4AF37]/35 dark:border-amber-500/30 opacity-45 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#D4AF37]/35 dark:border-amber-500/30 opacity-45 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#D4AF37]/35 dark:border-amber-500/30 opacity-45 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#D4AF37]/35 dark:border-amber-500/30 opacity-45 group-hover:opacity-100 transition-opacity"></div>

            <div className="font-serif italic text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#A07D1A] dark:text-amber-400">
              {counts[idx].toLocaleString(undefined, {
                minimumFractionDigits: stat.decimals ? 1 : 0,
                maximumFractionDigits: stat.decimals ? 1 : 0
              })}
              {stat.suffix}
            </div>
            
            <p className="mt-2.5 text-[10.5px] md:text-xs text-[#5C534C] dark:text-slate-400 tracking-widest uppercase font-extrabold font-mono">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
