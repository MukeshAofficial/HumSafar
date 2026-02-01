
import React from 'react';
import { X, Car, Leaf, Globe, ShieldCheck, Heart } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-8 md:p-12 overflow-y-auto max-h-[90vh] no-scrollbar">
          <button 
            onClick={onClose}
            aria-label="Close about us"
            className="absolute top-6 right-6 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
              <Car size={32} />
            </div>
            <div>
               <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">About HumSafar</h2>
               <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest mt-2">Connecting Neighbors, Saving the Planet</p>
            </div>
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <Globe className="text-blue-500" size={20} />
                 Our Mission
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Founded in 2024, HumSafar was born out of a simple observation: millions of cars commute to the same IT parks and office hubs daily with only one occupant. Our mission is to transform these empty seats into a vibrant, trust-based mobility network.
              </p>
            </section>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                 <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Leaf size={20} />
                 </div>
                 <h4 className="font-bold text-slate-900 dark:text-white">Eco-First Approach</h4>
                 <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                   Every shared commute removes a car from the road, directly reducing CO2 emissions and urban traffic congestion.
                 </p>
              </div>

              <div className="space-y-3">
                 <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <ShieldCheck size={20} />
                 </div>
                 <h4 className="font-bold text-slate-900 dark:text-white">Safety by Design</h4>
                 <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                   We leverage professional circles and verified workplace identities to ensure you're always riding with someone you can trust.
                 </p>
              </div>
            </div>

            <section className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-start gap-4">
               <div className="bg-white dark:bg-slate-700 p-3 rounded-2xl shadow-sm">
                  <Heart className="text-rose-500" size={24} fill="currentColor" />
               </div>
               <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Community Values</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    We believe in punctuality, respect, and the power of a friendly morning greeting. HumSafar isn't just a platform; it's a neighborhood initiative built for and by commuters.
                  </p>
               </div>
            </section>
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-10 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;