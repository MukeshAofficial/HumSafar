
import React from 'react';
import { MapPin, Sparkles, CarFront } from 'lucide-react';

const steps = [
  {
    icon: <MapPin size={32} className="text-white" />,
    color: 'bg-blue-600',
    lightColor: 'bg-blue-50',
    title: 'Set Your Route',
    description: 'Enter your home and work locations, and set your regular schedule. We calculate the optimal pickup points.'
  },
  {
    icon: <Sparkles size={32} className="text-white" />,
    color: 'bg-purple-600',
    lightColor: 'bg-purple-50',
    title: 'Get Matched',
    description: 'Our AI finds verified commuters with overlapping routes. No huge detours, just smooth connections.',
  },
  {
    icon: <CarFront size={32} className="text-white" />,
    color: 'bg-emerald-600',
    lightColor: 'bg-emerald-50',
    title: 'Ride & Save',
    description: 'Share the cost of fuel and parking. Drivers earn to cover expenses, riders pay less than public transit.'
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="relative pt-20 md:pt-24 pb-24 bg-slate-50/50 dark:bg-slate-950 scroll-mt-20 transition-colors duration-500 overflow-hidden">
      {/* Background Glows for Dark Mode */}
      <div className="hidden dark:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
            Three Simple Steps
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">How HumSafar Works</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">Start saving on your commute in less than 2 minutes. It's designed to be simple, safe, and smart.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-[2.5rem] p-10 border border-slate-200/60 dark:border-slate-800 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.05)] hover:-translate-y-2"
            >
              {/* Step Number Badge */}
              <div className="absolute top-8 right-8 text-4xl font-black text-slate-200/50 dark:text-slate-700/50 group-hover:text-emerald-500/20 transition-colors">
                0{index + 1}
              </div>

              {/* Icon Container */}
              <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200 dark:shadow-black/20 mb-8 transform group-hover:rotate-6 transition-transform duration-300`}>
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                {step.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {step.description}
              </p>

              {/* Decorative background element on hover */}
              <div className={`absolute bottom-0 left-0 w-full h-1.5 ${step.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-b-[2.5rem]`} />
            </div>
          ))}
        </div>

        {/* Bottom Trust Line */}
        <div className="mt-16 text-center">
            <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Trusted by 50,000+ daily commuters
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </p>
        </div>
      </div>

      {/* Subtle Division Line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 pointer-events-none">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800/80 to-transparent" />
      </div>
    </section>
  );
};

export default HowItWorks;
