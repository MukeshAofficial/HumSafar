
import React, { useState, useEffect } from 'react';
import { Car, Menu, X, User, LogOut, ArrowLeft, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onDashboardClick: () => void;
  onLogoClick: () => void;
  isDashboard: boolean;
  isAuth: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  userName: string;
}

const Navbar: React.FC<NavbarProps> = ({ onDashboardClick, onLogoClick, isDashboard, isAuth, theme, toggleTheme, userName }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (isDashboard || isAuth) {
      onLogoClick(); 
      setTimeout(() => {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      e.preventDefault();
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1100] transition-all duration-500 border-b ${
        isScrolled || isDashboard || isAuth 
          ? 'bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-3' 
          : 'bg-white/10 dark:bg-slate-950/10 backdrop-blur-md border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onLogoClick}
        >
          <img src="/logo.jpeg" alt="HumSafar" className="w-10 h-10" />
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
            HumSafar
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {isAuth ? (
             <button 
              onClick={onLogoClick}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
             >
               <ArrowLeft size={18} />
               Back to Home
             </button>
          ) : !isDashboard ? (
            <>
              <a 
                href="#how-it-works" 
                onClick={(e) => handleNavClick(e, '#how-it-works')}
                className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
              >
                How it Works
              </a>
              <a 
                href="#why-us" 
                onClick={(e) => handleNavClick(e, '#why-us')}
                className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors"
              >
                Why Us?
              </a>
              <a href="#safety" onClick={(e) => handleNavClick(e, '#safety')} className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Safety</a>
              <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors">Contact</a>
            </>
          ) : (
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/50 dark:bg-emerald-900/30 backdrop-blur-md rounded-full border border-emerald-100/50 dark:border-emerald-800/50">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold">
                    {getInitials(userName)}
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 max-w-[120px] truncate">{userName}</span>
               </div>
               <button 
                onClick={onLogoClick}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                title="Logout"
               >
                 <LogOut size={20} />
               </button>
            </div>
          )}

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {!isDashboard && !isAuth && (
            <button 
              onClick={onDashboardClick}
              className="bg-slate-900/90 dark:bg-emerald-600 backdrop-blur-sm text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all hover:shadow-xl transform hover:-translate-y-0.5 border border-white/10"
            >
              Sign In / Join
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button 
              className="text-slate-700 dark:text-slate-300 p-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl border-t border-slate-100 dark:border-slate-800 p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-2">
          {isAuth ? (
            <button 
              onClick={() => { onLogoClick(); setMobileMenuOpen(false); }}
              className="w-full text-left p-2 font-bold text-slate-600 dark:text-slate-400"
            >
              Back to Home
            </button>
          ) : !isDashboard ? (
             <>
               <a 
                href="#how-it-works" 
                onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, '#how-it-works'); }}
                className="text-slate-600 dark:text-slate-400 font-bold p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-2xl transition-colors"
               >
                 How it Works
               </a>
               <a 
                href="#why-us" 
                onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, '#why-us'); }}
                className="text-slate-600 dark:text-slate-400 font-bold p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-2xl transition-colors"
               >
                 Why Us?
               </a>
               <a href="#safety" onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, '#safety'); }} className="text-slate-600 dark:text-slate-400 font-bold p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-2xl transition-colors">Safety</a>
               <a href="#contact" onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, '#contact'); }} className="text-slate-600 dark:text-slate-400 font-bold p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-2xl transition-colors">Contact</a>
               <button 
                onClick={() => { onDashboardClick(); setMobileMenuOpen(false); }}
                className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
               >
                 Sign In
               </button>
             </>
          ) : (
             <>
               <div className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
                    {getInitials(userName)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{userName}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Premium Commuter</div>
                  </div>
               </div>
               <button 
                onClick={() => { onLogoClick(); setMobileMenuOpen(false); }}
                className="w-full text-rose-600 font-bold py-4 text-left px-3 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-2xl transition-colors"
               >
                 Sign Out
               </button>
             </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
