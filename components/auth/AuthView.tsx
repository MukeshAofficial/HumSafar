
import React, { useState } from 'react';
import { 
  ArrowLeft, Lock, Mail, Eye, EyeOff, Loader2, 
  ArrowRight, ShieldCheck, Heart, AlertCircle, Chrome, Apple 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AuthViewProps {
  onBack: () => void;
  onSuccess: () => void;
}

type AuthMode = 'signin' | 'signup';

const AuthView: React.FC<AuthViewProps> = ({ onBack, onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            },
          },
        });

        if (error) throw error;

        // Initialize user profile in public table
        if (data.user) {
          const profilePayload = {
            id: data.user.id,
            name: formData.name,
            email: formData.email,
            role: 'rider',
            balance: 1000, // Sign up bonus
            commute_credits: 50,
            is_phone_verified: false,
            home: 'Not Set',
            work_loc: 'Not Set',
            bio: 'New Commuter',
            gender: 'prefer-not-to-say'
          };
          
          // Use upsert instead of insert to prevent race conditions or duplicates
          await supabase.from('profiles').upsert([profilePayload]);
        }
        
        onSuccess();
      } else {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <button 
              onClick={onBack}
              className="inline-flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-slate-900 dark:hover:text-slate-200 transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Back to Home
            </button>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              {mode === 'signin' ? 'Welcome Back' : 'Join HumSafar'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {mode === 'signin' 
                ? 'Sign in to access your daily commutes' 
                : 'Start sharing rides with verified neighbors'}
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800">
            
            {/* Mode Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-8">
              <button 
                onClick={() => { setMode('signin'); setErrorMsg(''); }}
                className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${mode === 'signin' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setMode('signup'); setErrorMsg(''); }}
                className={`flex-1 py-3 text-sm font-black rounded-xl transition-all ${mode === 'signup' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-200'}`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Arun Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Password</label>
                  {mode === 'signin' && (
                    <button type="button" className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline uppercase tracking-tighter">Forgot?</button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-semibold text-slate-900 dark:text-white"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                  <AlertCircle className="text-rose-500" size={20} />
                  <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{errorMsg}</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 group ${isLoading ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed shadow-none' : 'bg-slate-900 dark:bg-emerald-600 shadow-slate-200 dark:shadow-none hover:bg-emerald-600 dark:hover:bg-emerald-500'}`}
              >
                {isLoading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                </div>
                <span className="relative px-4 bg-white dark:bg-slate-900 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Or continue with</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3.5 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Chrome size={18} className="text-rose-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-3.5 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Apple size={18} fill="currentColor" className="dark:text-white" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Apple</span>
                </button>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-xs text-slate-400 dark:text-slate-500 font-medium px-4">
            By continuing, you agree to our <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">Terms of Service</a> and <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">Privacy Policy</a>.
          </p>

          <div className="mt-12 flex justify-center items-center gap-6">
             <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-wider">
               <ShieldCheck size={14} />
               Secure SSL
             </div>
             <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-wider">
               <Heart size={14} />
               Community Verified
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
