
import React from 'react';
import { X, IndianRupee, Fuel, Settings, Zap, Users } from 'lucide-react';

interface PricingModalProps {
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          <button 
            onClick={onClose}
            aria-label="Close pricing details"
            className="absolute top-6 right-6 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 group z-20"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IndianRupee size={32} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">How Pricing Works</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Transparent, community-driven fuel sharing costs.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <Fuel className="text-emerald-500" size={20} />
                <h3 className="font-bold text-slate-900 dark:text-white">Fuel Share Basis</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Costs are calculated based on the distance (km) and current fuel prices. It's a non-profit share to cover direct trip expenses.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="text-blue-500" size={20} />
                <h3 className="font-bold text-slate-900 dark:text-white">Maintenance Offset</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                A small contribution (included in the total) helps the driver cover wear and tear, making daily commuting sustainable.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="text-amber-500" size={20} />
                <h3 className="font-bold text-slate-900 dark:text-white">EV Discount</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Electric vehicle drivers often have 30-40% lower ride costs, encouraging eco-friendly transport choices across the community.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-purple-500" size={20} />
                <h3 className="font-bold text-slate-900 dark:text-white">Occupancy Effect</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                The more people sharing a ride, the lower the per-person cost. Full cars are the most economical way to commute.
              </p>
            </div>
          </div>

          <div className="mt-10 p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-[2rem] text-center">
             <p className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-2">Zero Platform Commission</p>
             <p className="text-sm text-emerald-600 dark:text-emerald-500 font-medium">
                HumSafar does not take a cut from your fuel share. 100% of the money goes directly to the driver's wallet.
             </p>
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-8 py-4 bg-slate-900 dark:bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-slate-200 dark:shadow-none"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;