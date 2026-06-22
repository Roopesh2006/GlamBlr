import React, { useState, useMemo, useEffect } from 'react';
import { Search, Sparkles, MapPin, Grid2x2 as Grid, Layers, ListFilter, ArrowUpDown, Clock, Compass } from 'lucide-react';
import { Salon } from '../types';
import { LUX_SALONS } from '../data';
import SalonCard from './SalonCard';

interface ExploreLoungeProps {
  onSelectSalon: (salonId: string) => void;
  onBookNow: (salon: Salon) => void;
  initialSearchQuery?: string;
  initialArea?: string;
  initialService?: string;
  initialPrice?: string;
  salons?: Salon[];
}

export default function ExploreLounge({ 
  onSelectSalon, 
  onBookNow, 
  initialSearchQuery = '',
  initialArea = 'All',
  initialService = 'All',
  initialPrice = 'All',
  salons = LUX_SALONS
}: ExploreLoungeProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [activeArea, setActiveArea] = useState(initialArea || 'All');
  const [activeService, setActiveService] = useState(initialService || 'All');
  const [activePrice, setActivePrice] = useState(initialPrice || 'All');
  const [activeRating, setActiveRating] = useState('All');
  const [sortBy, setSortBy] = useState('top-rated');

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  useEffect(() => {
    if (initialArea && initialArea !== 'All') {
      setActiveArea(initialArea);
    }
  }, [initialArea]);

  useEffect(() => {
    if (initialService && initialService !== 'All') {
      setActiveService(initialService);
    }
  }, [initialService]);

  useEffect(() => {
    if (initialPrice && initialPrice !== 'All') {
      setActivePrice(initialPrice);
    }
  }, [initialPrice]);

  const isAISmartTriggered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return q.includes('bridal') || q.includes('cheap') || q.includes('budget') || q.includes('near me') || q.includes('best');
  }, [searchQuery]);

  const filtersAndSort = useMemo(() => {
    let area = activeArea;
    let service = activeService;
    let price = activePrice;
    let rating = activeRating;
    let sort = sortBy;
    let aiNote = '';

    const q = searchQuery.toLowerCase().trim();

    if (q) {
      if (q.includes('bridal')) {
        service = 'Bridal';
        sort = 'top-rated';
        aiNote = 'Auto-applied Bridal Salon treatments filter';
      }
      if (q.includes('cheap') || q.includes('budget')) {
        price = '$$';
        aiNote = 'Filtered to High-Street Budget tiers';
      }
      if (q.includes('near me')) {
        area = 'Indiranagar';
        aiNote = 'Simulating coordinates: Showing Indiranagar salons';
      }
      if (q.includes('best')) {
        sort = 'top-rated';
        rating = '4.8+';
        aiNote = 'Sorted & Filtered to Peak Luxury salons';
      }
    }

    return { area, service, price, rating, sort, aiNote };
  }, [searchQuery, activeArea, activeService, activePrice, activeRating, sortBy]);

  const filteredSalons = useMemo(() => {
    const { area, service, price, rating, sort } = filtersAndSort;

    let items = [...salons];

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const cleanedQ = q
        .replace('bridal', '')
        .replace('cheap', '')
        .replace('budget', '')
        .replace('near me', '')
        .replace('best', '')
        .trim();

      if (cleanedQ) {
        items = items.filter((s) => {
          return (
            s.name.toLowerCase().includes(cleanedQ) ||
            s.area.toLowerCase().includes(cleanedQ) ||
            s.description.toLowerCase().includes(cleanedQ) ||
            s.specialties.some((spec) => spec.toLowerCase().includes(cleanedQ))
          );
        });
      }
    }

    if (area !== 'All') {
      items = items.filter((s) => s.area === area);
    }

    if (service !== 'All') {
      items = items.filter((s) => s.services.some((svc) => svc.category === service));
    }

    if (price !== 'All') {
      items = items.filter((s) => s.priceRange === price);
    }

    if (rating !== 'All') {
      const threshold = parseFloat(rating.replace('+', '').trim());
      items = items.filter((s) => s.rating >= threshold);
    }

    if (sort === 'top-rated') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'reviews') {
      items.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sort === 'price-low') {
      items.sort((a, b) => {
        const priceA = a.services?.[0]?.price ?? 0;
        const priceB = b.services?.[0]?.price ?? 0;
        return priceA - priceB;
      });
    } else if (sort === 'price-high') {
      items.sort((a, b) => {
        const priceA = a.services?.[0]?.price ?? 0;
        const priceB = b.services?.[0]?.price ?? 0;
        return priceB - priceA;
      });
    }

    return items;
  }, [searchQuery, filtersAndSort]);

  const areas = ['All', 'Indiranagar', 'Koramangala', 'Whitefield', 'Jayanagar', 'HSR Layout', 'Banaswadi'];
  const services = ['All', 'Hair', 'Skin', 'Nails', 'Bridal', 'Spa', 'Grooming'];
  const prices = ['All', '$$', '$$$', '$$$$'];
  const ratings = ['All', '4.5+', '4.8+'];

  return (
    <div id="explore_discovery_lounge" className="relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto space-y-8 text-slate-850 dark:text-[#FCFAF7] min-h-screen">
      
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-tr from-[rgba(160,125,26,0.03)] to-transparent blur-3xl pointer-events-none"></div>

      <div className="text-center md:text-left space-y-2.5 max-w-2xl">
        <span className="text-xs text-[#A07D1A] dark:text-amber-500 tracking-[0.25em] font-extrabold uppercase block scale-95 justify-center md:justify-start flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 fill-[#A07D1A]/10 text-[#A07D1A] dark:text-amber-500" /> Elite Discoveries
        </span>
        <h2 className="font-serif italic text-3xl md:text-5xl font-extrabold text-[#1E1A17] dark:text-white leading-tight">
          Find Your Perfect Match
        </h2>
        <p className="text-xs md:text-sm text-[#5C534C] dark:text-slate-400 leading-relaxed">
          Filter through Bengaluru's gold-standard salons, book couture treatments, and uncover specialized aesthetics in real-time.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-xl text-left">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by salon name, service specialties, or 'best bridal near me'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#12121E] border border-[#E1DBCE] dark:border-indigo-950/60 text-slate-800 dark:text-[#FCFAF7] rounded-2xl py-3 pl-12 pr-4 text-xs md:text-sm focus:outline-none focus:shadow-xs transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 bg-white dark:bg-[#12121E] px-4 py-2.5 rounded-2xl border border-[#E1DBCE] dark:border-indigo-950/60 max-w-xs justify-between">
            <ArrowUpDown className="w-4 h-4 text-[#A07D1A] dark:text-amber-400" />
            <span className="text-xs text-slate-400 font-mono">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-850 dark:text-[#FCFAF7] focus:outline-none font-bold font-serif italic cursor-pointer"
            >
              <option value="top-rated" className="bg-white dark:bg-[#12121E] text-slate-800 dark:text-slate-200">Top Rated</option>
              <option value="reviews" className="bg-white dark:bg-[#12121E] text-slate-800 dark:text-slate-200">Highly Reviewed</option>
              <option value="price-low" className="bg-white dark:bg-[#12121E] text-slate-800 dark:text-slate-200">Price: Low-High</option>
              <option value="price-high" className="bg-white dark:bg-[#12121E] text-slate-800 dark:text-slate-200">Price: High-Low</option>
            </select>
          </div>
        </div>

        {isAISmartTriggered && (
          <div className="flex items-center gap-2.5 p-3.5 bg-[#FAF6F0] dark:bg-[#161625] border border-[#D4AF37]/50 dark:border-indigo-950/45 rounded-2xl text-xs text-[#805C06] dark:text-amber-300 animate-fadeIn text-left">
            <Sparkles className="w-4 h-4 text-[#A07D1A] dark:text-amber-400 animate-pulse fill-[#A07D1A]" />
            <div>
              <span className="font-extrabold uppercase tracking-wider text-[10px] bg-[#A07D1A]/10 text-[#805C06] dark:text-amber-450 px-1.5 py-0.5 rounded mr-2 font-mono border border-[#A07D1A]/20 dark:border-indigo-950/20">AI-Filtered</span>
              <span className="italic font-serif text-slate-700 dark:text-slate-300">{filtersAndSort.aiNote}</span>
            </div>
          </div>
        )}
      </div>

      <div className="sticky top-[64px] z-20 py-3 bg-[#FCFAF6]/95 dark:bg-[#0E0E15]/95 backdrop-blur-md -mx-6 px-6 border-b border-[#E1DBCE] dark:border-indigo-950/60 space-y-3 shadow-2xs">
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin select-area-pills text-left">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase tracking-widest shrink-0 min-w-[50px]">Area:</span>
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setActiveArea(area)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide shrink-0 transition-all border cursor-pointer ${
                filtersAndSort.area === area
                  ? 'bg-[#A07D1A] text-white border-[#A07D1A] font-bold shadow-xs'
                  : 'bg-white dark:bg-[#161625] text-slate-600 dark:text-slate-300 border-[#E1DBCE] dark:border-indigo-950/50 hover:border-slate-400'
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin select-services-pills text-left">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase tracking-widest shrink-0 min-w-[50px]">Type:</span>
          {services.map((svc) => (
            <button
              key={svc}
              onClick={() => setActiveService(svc)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide shrink-0 transition-all border cursor-pointer ${
                filtersAndSort.service === svc
                  ? 'bg-[#A07D1A] text-white border-[#A07D1A] font-bold shadow-xs'
                  : 'bg-white dark:bg-[#161625] text-slate-600 dark:text-slate-300 border-[#E1DBCE] dark:border-indigo-950/50 hover:border-slate-400'
              }`}
            >
              {svc}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-1 border-t border-[#E1DBCE] dark:border-indigo-950/40 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>Price Category:</span>
            {prices.map((p) => (
              <button
                key={p}
                onClick={() => setActivePrice(p)}
                className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] cursor-pointer transition-all ${
                  filtersAndSort.price === p
                    ? 'text-[#A07D1A] dark:text-amber-400 border-b-2 border-[#A07D1A] dark:border-amber-400 scale-105 font-bold'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-[#E1DBCE] dark:bg-indigo-950/50 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <span>Star Rating:</span>
            {ratings.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRating(r)}
                className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-all font-bold ${
                  filtersAndSort.rating === r
                    ? 'text-[#A07D1A] dark:text-amber-400 border-b-2 border-[#A07D1A] dark:border-amber-400 scale-105 font-bold'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500 font-mono uppercase tracking-widest border-b border-[#E1DBCE] dark:border-indigo-950/45 pb-2">
          <span>Bengaluru Discovery Grid</span>
          <span className="font-extrabold text-slate-700 dark:text-slate-300">Showing {filteredSalons.length} Premium salons</span>
        </div>

        {filteredSalons.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#12121E] border border-[#E1DBCE] dark:border-indigo-950/65 rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FAF6F0] dark:bg-slate-900 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500">
              <Compass className="w-6 h-6 text-[#A07D1A] dark:text-amber-400" />
            </div>
            <h4 className="font-serif italic text-xl text-[#A07D1A] dark:text-amber-400 font-bold">No Salons Matched Filters</h4>
            <p className="text-xs text-[#5C534C] dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              We couldn't find any match under current categories. Try clearing search filters or entering 'cheap Indiranagar' to test AI triggers.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveArea('All');
                setActiveService('All');
                setActivePrice('All');
                setActiveRating('All');
                setSortBy('top-rated');
              }}
              className="px-5 py-2 bg-[#FAF6F0] dark:bg-slate-900 border border-[#A07D1A] dark:border-amber-500 text-[#A07D1A] dark:text-amber-400 font-bold rounded-xl text-xs hover:bg-[#A07D1A] hover:text-white dark:hover:text-slate-950 transition-all cursor-pointer"
            >
              Clear All Discovery Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSalons.map((salon) => (
              <SalonCard
                key={salon.id}
                salon={salon}
                onSelect={onSelectSalon}
                onBookNow={onBookNow}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
