
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DollarSign, Zap, ShieldCheck, Heart, Leaf, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const benefits = [
  {
    icon: <DollarSign className="text-emerald-600" size={24} />,
    title: 'Lower Travel Costs',
    description: 'Drivers offset fuel & maintenance costs. Riders save compared to ride-hailing apps or owning a car.'
  },
  {
    icon: <Zap className="text-amber-500" size={24} />,
    title: 'Real-time Matching',
    description: 'Our AI adjusts to traffic and schedule changes instantly, finding you the best route in seconds.'
  },
  {
    icon: <ShieldCheck className="text-blue-600" size={24} />,
    title: 'Secure & Verified',
    description: 'Government ID verification, employer email checks, and community ratings ensure a safe ride.'
  },
  {
    icon: <Heart className="text-purple-600" size={24} />,
    title: 'Women-Only Safe Rides',
    description: 'A dedicated mode that matches female riders with verified female drivers for ultimate peace of mind.'
  },
  {
    icon: <Leaf className="text-green-600" size={24} />,
    title: 'Sustainable Commuting',
    description: 'Reduce your carbon footprint. Every shared ride takes a car off the road and lowers emissions.'
  },
  {
    icon: <Calendar className="text-rose-500" size={24} />,
    title: 'Flexible Schedules',
    description: 'Set recurring rides for your daily commute or book a one-off trip when you need it.'
  }
];

const Benefits: React.FC = () => {
  const totalItems = benefits.length;
  const extendedBenefits = [...benefits, ...benefits, ...benefits];
  const initialIndex = totalItems;

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (activeIndex >= totalItems * 2) {
      setActiveIndex(activeIndex - totalItems);
    }
    else if (activeIndex < totalItems) {
      setActiveIndex(activeIndex + totalItems);
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const cardWidth = isMobile ? containerWidth * 0.82 : 440;
  const gap = isMobile ? 12 : 32;
  
  const offset = (containerWidth / 2) - (cardWidth / 2) - (activeIndex * (cardWidth + gap));
  const displayIndex = activeIndex % totalItems;

  return (
    <section id="why-us" className="relative py-24 bg-slate-50/50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 overflow-hidden select-none scroll-mt-20 transition-colors duration-500">
      {/* Central Glow for Dark Mode */}
      <div className="hidden dark:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-24">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
            The HumSafar Advantage
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Why HumSafar?</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">Join thousands of professional commuters making the smart switch to shared mobility.</p>
        </div>

        <div className="relative group max-w-6xl mx-auto" ref={containerRef}>
          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-8 z-40">
            <button 
              onClick={handlePrev}
              className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 hover:scale-105 active:scale-95 transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft size={28} />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-8 z-40">
            <button 
              onClick={handleNext}
              className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 hover:scale-105 active:scale-95 transition-all"
              aria-label="Next slide"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Slider Track */}
          <div 
            className={`flex items-center ${isTransitioning ? 'transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]' : 'transition-none'}`}
            style={{ 
              transform: `translateX(${offset}px)`,
              gap: `${gap}px`,
              paddingTop: '32px',
              paddingBottom: '32px'
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedBenefits.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div 
                  key={index}
                  className="shrink-0 transition-all duration-500 ease-out flex items-center justify-center"
                  style={{ 
                    width: `${cardWidth}px`,
                    transform: isActive ? 'scale(1.2)' : 'scale(0.8)',
                    opacity: isActive ? 1 : 0.3,
                    zIndex: isActive ? 20 : 10
                  }}
                >
                  <div 
                    className={`w-full p-10 md:p-12 rounded-[3.5rem] bg-white dark:bg-slate-900/80 backdrop-blur-md border-2 transition-all duration-500 ${
                      isActive 
                        ? 'border-emerald-100 dark:border-emerald-900/50 shadow-[0_40px_80px_-20px_rgba(16,185,129,0.12)]' 
                        : 'border-transparent bg-white/40 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600 flex items-center justify-center mb-8 shadow-sm">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">{item.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Indicators */}
          <div className="flex justify-center items-center gap-3 mt-16">
            {benefits.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (isTransitioning) return;
                  setIsTransitioning(true);
                  setActiveIndex(totalItems + index);
                }}
                className={`transition-all duration-500 rounded-full h-2 ${
                  index === displayIndex 
                    ? 'w-10 bg-emerald-500 shadow-md shadow-emerald-500/20' 
                    : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
