
import React from 'react';
import { Car, Instagram, Twitter, Linkedin, ArrowRight } from 'lucide-react';

interface FooterProps {
  onGetStarted: (tab?: any) => void;
  onAboutClick: () => void;
  onPricingClick: () => void;
  onLogoClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onGetStarted, onAboutClick, onPricingClick, onLogoClick }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    const el = document.querySelector(target);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-slate-950 pt-20 text-slate-300 scroll-mt-20 border-t border-slate-900 transition-colors duration-300 overflow-hidden relative">
      {/* Background Ambient Glow */}
      <div className="hidden dark:block absolute -bottom-24 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="mx-auto px-4 md:px-0 max-w-7xl relative z-10">
        
        {/* Glassy Final CTA Box */}
        <div className="relative mx-auto max-w-fit rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-16 text-center text-white mb-24 overflow-hidden border-2 border-emerald-400/40 shadow-[0_32px_64px_-16px_rgba(16,185,129,0.15)] dark:shadow-[0_32px_64px_-16px_rgba(16,185,129,0.05)] transition-transform hover:scale-[1.02] duration-500">
            {/* Glass Background Effects */}
            <div className="absolute inset-0 bg-emerald-500/[0.08] dark:bg-emerald-500/[0.12] backdrop-blur-3xl z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none z-0"></div>
            
            {/* Vibrant Glow Orbs */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-400/10 dark:bg-emerald-400/20 rounded-full blur-[60px] z-0 animate-pulse"></div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-600/5 dark:bg-emerald-600/15 rounded-full blur-[60px] z-0"></div>
            
            <div className="relative z-10 px-4 md:px-12">
                <h2 className="text-3xl md:text-5xl font-black mb-12 tracking-tight leading-none">
                    Ready to improve your commute?
                </h2>
                
                <div className="flex flex-col sm:flex-row justify-center gap-5">
                    <button 
                      onClick={() => onGetStarted('find-ride')}
                      className="px-10 py-5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 hover:-translate-y-1 flex items-center justify-center gap-2 group active:scale-95"
                    >
                        Find a Ride 
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => onGetStarted('create-ride')}
                      className="px-10 py-5 bg-white/10 backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/20 hover:-translate-y-1 active:scale-95"
                    >
                        Offer a Ride
                    </button>
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-4 gap-12 mb-20 px-4">
          <div className="col-span-1 md:col-span-1 space-y-6">
             <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={onLogoClick}
             >
                <div className="p-2.5 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/20 group-hover:bg-emerald-600 transition-colors">
                    <Car size={24} />
                </div>
                <span className="text-2xl font-black text-white tracking-tighter">HumSafar</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
                Reimagining the way we move through our cities. Sustainable, affordable, and built on community trust.
            </p>
            <div className="flex gap-4">
                <a href="#" className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all border border-slate-800">
                    <Twitter size={20} />
                </a>
                <a href="#" className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all border border-slate-800">
                    <Instagram size={20} />
                </a>
                <a href="#" className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all border border-slate-800">
                    <Linkedin size={20} />
                </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-widest mb-8">Platform</h4>
            <ul className="space-y-4 text-slate-400 font-medium">
                <li><a href="#how-it-works" onClick={(e) => handleNavClick(e, '#how-it-works')} className="hover:text-emerald-500 transition-colors">How it Works</a></li>
                <li><button onClick={onPricingClick} className="hover:text-emerald-500 transition-colors text-left">Pricing</button></li>
                <li><a href="#safety" onClick={(e) => handleNavClick(e, '#safety')} className="hover:text-emerald-500 transition-colors">Safety Features</a></li>
                <li><a href="#why-us" onClick={(e) => handleNavClick(e, '#why-us')} className="hover:text-emerald-500 transition-colors">Trust Circles</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-widest mb-8">Company</h4>
            <ul className="space-y-4 text-slate-400 font-medium">
                <li><button onClick={onAboutClick} className="hover:text-emerald-500 transition-colors text-left">About Us</button></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Our Impact</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-widest mb-8">Legal</h4>
            <ul className="space-y-4 text-slate-400 font-medium">
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Community Guidelines</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Deep Footer */}
      <div className="w-full bg-black/40 py-10 border-t border-slate-900/50">
        <div className="mx-auto px-6 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <span>© 2024 HumSafar Inc.</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span>Made for professional commuters.</span>
            </div>
            <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-slate-500">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
