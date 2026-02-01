
import React from 'react';
import { ArrowRight, Leaf, PiggyBank, Users } from 'lucide-react';

interface HeroProps {
  onGetStarted: (tab?: any) => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section className="relative pt-24 pb-20 md:pt-36 md:pb-24 overflow-hidden border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-500 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.03)] dark:shadow-none">
      {/* Clean Gradient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Base Gradient Layer */}
        <div className="absolute inset-0 bg-white dark:bg-slate-950 transition-colors duration-500" />
        
        {/* Primary Linear Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/80 via-white/50 to-white dark:from-emerald-900/20 dark:via-slate-950/80 dark:to-slate-950 transition-all duration-700" />

        {/* Dynamic Dark Mode Glows */}
        <div className="hidden dark:block absolute -top-48 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px] animate-pulse" />
        <div className="hidden dark:block absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] delay-700" />
        
        {/* Soft Radial Glow for Depth */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-400/10 dark:bg-emerald-400/10 rounded-full blur-[120px]" />
        
        {/* Subtle Bottom Fade */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-emerald-900/30 backdrop-blur-md border border-emerald-200/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live in 25+ Cities
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.05]">
            Share Your Daily Commute. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
              Save Money.
            </span> Reduce Traffic.
          </h1>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            HumSafar connects neighbors going the same way. Cut your commute costs by up to 50% while helping the planet.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button 
              onClick={() => onGetStarted('find-ride')}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
            >
              Find a Ride
              <ArrowRight size={22} />
            </button>
            <button 
              onClick={() => onGetStarted('create-ride')}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-lg font-bold rounded-2xl shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
            >
              Offer a Ride
            </button>
          </div>

          {/* Value Props Pills */}
          <div className="flex flex-wrap justify-center gap-8 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-sm">
              <PiggyBank className="text-emerald-500" size={16} />
              <span>Save ~$200/month</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-sm">
              <Users className="text-blue-500" size={16} />
              <span>Verified Community</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-sm">
              <Leaf className="text-green-500" size={16} />
              <span>Eco-friendly Choice</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
