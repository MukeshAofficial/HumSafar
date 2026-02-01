
import React from 'react';
import { Star, CheckCircle2, ShieldCheck, Smartphone, Landmark, Users } from 'lucide-react';

const TrustSafety: React.FC = () => {
  return (
    <section id="safety" className="py-24 bg-emerald-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 overflow-hidden relative scroll-mt-20 transition-colors duration-300">
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px]"></div>
      </div>

      <div className="mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="lg:w-1/2 space-y-8">
                <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs border border-emerald-200 dark:border-emerald-800 tracking-wider uppercase">
                    Built on Community Trust
                </div>
                <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                    Ride with people<br/>you can actually trust.
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
                    We've removed the friction of document uploads by focusing on professional and verified social circles that exist within our IT Parks and campuses.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500 text-white rounded-lg">
                                    <Smartphone size={20} />
                                </div>
                                <span className="font-bold text-slate-900 dark:text-slate-200">Instant OTP Login</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Secure phone-linked accounts via SMS verification for every member.</p>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500 text-white rounded-lg">
                                    <Landmark size={20} />
                                </div>
                                <span className="font-bold text-slate-900 dark:text-slate-200">IT Park Network</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Automatic trust badges for users working in the same verified professional zones.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500 text-white rounded-lg">
                                    <Users size={20} />
                                </div>
                                <span className="font-bold text-slate-900 dark:text-slate-200">Mutual Confirmation</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Rides are only confirmed when both parties agree after viewing profiles.</p>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500 text-white rounded-lg">
                                    <ShieldCheck size={20} />
                                </div>
                                <span className="font-bold text-slate-900 dark:text-slate-200">Professional Circles</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">No Aadhaar needed. We verify via work emails and community standing.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:w-1/2 w-full">
                <div className="bg-white dark:bg-slate-800 p-10 md:p-12 rounded-[3.5rem] border border-emerald-100 dark:border-slate-700 relative shadow-[0_32px_64px_-12px_rgba(16,185,129,0.1)] transition-transform hover:-translate-y-1 duration-500">
                    <div className="absolute -top-6 -right-6 bg-emerald-500 rounded-2xl p-4 shadow-xl rotate-6 hidden lg:block">
                        <Star className="text-white fill-current" size={32} />
                    </div>
                    
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <img 
                                src="https://ui-avatars.com/api/?name=Ramesh+K&background=10b981&color=fff" 
                                alt="User" 
                                className="w-20 h-20 rounded-[2rem] object-cover border-4 border-emerald-50 dark:border-slate-700 shadow-lg" 
                            />
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-2xl">Ramesh K.</h4>
                                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm tracking-wide uppercase">Senior Consultant • SIPCOT IT Park</p>
                            </div>
                        </div>
                        
                        <p className="text-xl text-slate-700 dark:text-slate-300 font-medium italic leading-relaxed">
                            "Navigating city traffic alone was draining. Sharing my ride with fellow engineers from my IT park gives an instant sense of trust without needing to upload private documents. It feels like carpooling with colleagues via HumSafar."
                        </p>

                        <div className="h-px bg-emerald-100 dark:border-slate-700 w-full"></div>
                        
                        <div className="flex flex-wrap justify-between items-center gap-4 text-xs font-black text-emerald-700/60 dark:text-emerald-400/60 uppercase tracking-widest">
                           <span className="flex items-center gap-2">
                             <ShieldCheck size={16} className="text-emerald-500" /> 
                             Corporate Circle Verified
                           </span>
                           <span className="bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full text-emerald-600 dark:text-emerald-400">
                             4.9 ★ (86 Trips)
                           </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSafety;