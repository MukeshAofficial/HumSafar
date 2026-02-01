
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import MapPreview from './components/MapPreview';
import Benefits from './components/Benefits';
import TrustSafety from './components/TrustSafety';
import Footer from './components/Footer';
import Dashboard from './components/dashboard/Dashboard';
import AuthView from './components/auth/AuthView';
import PricingModal from './components/modals/PricingModal';
import AboutModal from './components/modals/AboutModal';
import AiAssistant from './components/AiAssistant';
import { db, UserProfile } from './lib/db';
import { supabase } from './lib/supabase';

type Tab = 'overview' | 'find-ride' | 'create-ride' | 'nearby-requests' | 'my-trips' | 'profile';
type Theme = 'light' | 'dark';
type ModalType = 'pricing' | 'about' | null;

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [pendingTab, setPendingTab] = useState<Tab | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('humsafar-theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('humsafar-theme', theme);
  }, [theme]);

  // Initial user fetch & Auth State Listener
  useEffect(() => {
    // Check initial user
    db.getUser().then((u) => {
      setUser(u);
      if (u && u.id !== 'guest') {
        // Only redirect to dashboard if explicitly logged in
        // For guest/landing logic, we stay on landing unless navigating
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        const freshUser = await db.getUser();
        setUser(freshUser);
        setView('dashboard');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setView('landing');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleStartAuth = (initialTab?: Tab) => {
    // If we are already logged in (and not a guest), go to dashboard
    if (user && user.id !== 'guest') {
      if (initialTab) setPendingTab(initialTab);
      setView('dashboard');
      return;
    }
    
    if (initialTab) setPendingTab(initialTab);
    setView('auth');
  };

  const handleLoginSuccess = async () => {
    const freshUser = await db.getUser();
    setUser(freshUser);
    setView('dashboard');
  };

  const handleExit = async () => {
    if (view === 'dashboard') {
      await supabase.auth.signOut();
    }
    setView('landing');
    setPendingTab(null);
    setActiveModal(null);
  };

  const handleProfileUpdate = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-emerald-200 dark:selection:bg-emerald-800 overflow-x-hidden transition-colors duration-300">
      <Navbar 
        onDashboardClick={() => handleStartAuth()} 
        onLogoClick={() => setView('landing')}
        isDashboard={view === 'dashboard'} 
        isAuth={view === 'auth'}
        theme={theme}
        toggleTheme={toggleTheme}
        userName={user?.name || 'Guest'}
      />
      
      <main className="w-full">
        {view === 'landing' ? (
          <div className="flex flex-col w-full">
            <Hero onGetStarted={handleStartAuth} />
            <HowItWorks />
            <MapPreview />
            <Benefits />
            <TrustSafety />
            <Footer 
              onGetStarted={handleStartAuth} 
              onAboutClick={() => setActiveModal('about')}
              onPricingClick={() => setActiveModal('pricing')}
              onLogoClick={() => setView('landing')}
            />
          </div>
        ) : view === 'auth' ? (
          <AuthView onBack={() => setView('landing')} onSuccess={handleLoginSuccess} />
        ) : (
          <Dashboard initialTab={pendingTab || undefined} onUserUpdate={handleProfileUpdate} />
        )}
      </main>

      {/* Floating AI Assistant - Generally Available */}
      <AiAssistant />

      {/* Info Modals */}
      {activeModal === 'pricing' && <PricingModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'about' && <AboutModal onClose={() => setActiveModal(null)} />}
    </div>
  );
};

export default App;
