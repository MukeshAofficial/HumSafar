
import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Car, User, Search, Map as MapIcon, Plus, Wallet, AlertCircle, 
    Zap, IndianRupee, Users, ShieldCheck, Landmark, Building2, GraduationCap, 
    Info, LifeBuoy, ChevronRight, Briefcase, Navigation, Clock, Sparkles
} from 'lucide-react';
import ProfileManager from './ProfileManager';
import RideCreator from './RideCreator';
import RiderView from './RiderView';
import NearbyRequests from './NearbyRequests';
import MyTrips from './MyTrips';
import { db, UserProfile, Trip } from '../../lib/db';

type Tab = 'overview' | 'find-ride' | 'create-ride' | 'nearby-requests' | 'my-trips' | 'profile';

interface DashboardProps {
  initialTab?: Tab;
  onUserUpdate?: (user: UserProfile) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ initialTab, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab || 'overview');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);

  useEffect(() => {
    const init = async () => {
      let userData = await db.getUser();
      if (initialTab === 'create-ride' && userData.role !== 'driver') {
        userData = await db.updateUser({ role: 'driver' });
      } else if (initialTab === 'find-ride' && userData.role !== 'rider') {
        userData = await db.updateUser({ role: 'rider' });
      }
      setUser(userData);
      const trips = await db.getTrips();
      const currentActive = trips.find(t => t.status !== 'completed');
      setActiveTrip(currentActive || null);
      setIsLoading(false);
    };
    init();
    const interval = setInterval(async () => {
        // Refresh user and trips to reflect reward updates
        const userData = await db.getUser();
        setUser(userData);
        const trips = await db.getTrips();
        const currentActive = trips.find(t => t.status !== 'completed');
        setActiveTrip(currentActive || null);
    }, 2000);
    return () => clearInterval(interval);
  }, [initialTab]);

  const handleRoleToggle = async (newRole: 'rider' | 'driver') => {
    if (!user) return;
    const updated = await db.updateUser({ role: newRole });
    setUser(updated);
    if (onUserUpdate) onUserUpdate(updated);
    if (newRole === 'rider' && (activeTab === 'create-ride' || activeTab === 'nearby-requests')) {
      setActiveTab('overview');
    }
    if (newRole === 'driver' && activeTab === 'find-ride') {
      setActiveTab('overview');
    }
  };

  const handleProfileSave = async (p: Partial<UserProfile>) => {
    const updated = await db.updateUser(p);
    setUser(updated);
    if (onUserUpdate) onUserUpdate(updated);
  };

  const allTabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'my-trips', label: 'My Trips', icon: <Briefcase size={20} /> },
    { id: 'find-ride', label: 'Find a Ride', icon: <Search size={20} />, roles: ['rider'] },
    { id: 'create-ride', label: 'Offer a Ride', icon: <Plus size={20} />, roles: ['driver'] },
    { id: 'nearby-requests', label: 'Nearby Leads', icon: <Zap size={20} />, roles: ['driver'] },
    { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
  ];

  const filteredTabs = allTabs.filter(tab => !tab.roles || tab.roles.includes(user?.role || 'rider'));

  if (isLoading || !user) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Connecting to database...</p>
      </div>
    );
  }

  const getStatusText = (status: string) => {
    switch(status) {
        case 'confirmed': return 'Booking Confirmed';
        case 'arriving': return 'Neighbor Arriving';
        case 'at-pickup': return 'Waiting at Pickup';
        case 'in-transit': return 'On the Way';
        default: return 'Active Trip';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <aside className="lg:w-64 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xl uppercase">
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white leading-none truncate">{user.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold tracking-tight">Verified {user.role}</p>
                  </div>
               </div>

               <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex mb-6">
                  <button 
                    onClick={() => handleRoleToggle('rider')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${user.role === 'rider' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
                  >
                    Rider
                  </button>
                  <button 
                    onClick={() => handleRoleToggle('driver')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${user.role === 'driver' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
                  >
                    Driver
                  </button>
               </div>

               <nav className="space-y-1">
                 {filteredTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        activeTab === tab.id 
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                 ))}
               </nav>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Wallet & Rewards</h4>
                  <Wallet size={16} className="text-emerald-500" />
               </div>
               
               <div className="space-y-4 mb-4">
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">₹{user.balance.toFixed(0)}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">Prepaid Wallet</p>
                  </div>
                  
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50 relative overflow-hidden group">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-black text-sm relative z-10">
                      <Sparkles size={14} fill="currentColor" />
                      ₹{user.commuteCredits.toFixed(2)}
                    </div>
                    <p className="text-[9px] text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-widest mt-0.5 relative z-10">Commute Credits</p>
                    <div className="mt-2 pt-2 border-t border-emerald-100/50 dark:border-emerald-800/50 flex items-center gap-1 text-[8px] font-bold text-emerald-600/60 uppercase">
                        <Info size={10} />
                        Auto-earned: 10% back
                    </div>
                  </div>
               </div>

               <button className="w-full py-2.5 bg-slate-900 dark:bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors shadow-lg shadow-slate-200 dark:shadow-none active:scale-[0.98]">
                  Top Up Wallet
               </button>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                
                {/* Active Trip Status Card */}
                {activeTrip && (
                  <div className="bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="bg-emerald-500 px-6 py-3 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                            <Navigation size={14} className="animate-pulse" />
                            {getStatusText(activeTrip.status)}
                        </div>
                        <div className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">LIVE</div>
                    </div>
                    <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                        <div className="flex items-center gap-4 flex-1">
                            <img src={activeTrip.partnerImg} className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-100 dark:border-emerald-900/30 shadow-sm" />
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{activeTrip.partnerName}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{activeTrip.vehicleInfo}</p>
                            </div>
                        </div>
                        <div className="flex-1 w-full md:w-auto">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Progress</span>
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    {activeTrip.status === 'confirmed' ? '20%' : 
                                     activeTrip.status === 'arriving' ? '40%' :
                                     activeTrip.status === 'at-pickup' ? '60%' : '85%'}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full bg-emerald-500 transition-all duration-1000 ${activeTrip.status === 'confirmed' ? 'w-[20%]' : activeTrip.status === 'arriving' ? 'w-[40%]' : activeTrip.status === 'at-pickup' ? 'w-[60%]' : 'w-[85%]'}`}></div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setActiveTab('my-trips')}
                            className="w-full md:w-auto px-6 py-3 bg-slate-900 dark:bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
                        >
                            Track Ride
                            <ChevronRight size={16} />
                        </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Rides Shared', value: '42', color: 'text-blue-600 dark:text-blue-400' },
                    { label: 'CO2 Saved', value: '156kg', color: 'text-emerald-600 dark:text-emerald-400' },
                    { label: 'Total Saved', value: `₹3,450`, color: 'text-amber-600 dark:text-amber-400' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                      <h4 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h4>
                    </div>
                  ))}
                </div>

                <div className={`p-6 rounded-3xl border transition-all ${user.emergencyContact?.name ? 'bg-white dark:bg-slate-900 border-emerald-100 dark:border-emerald-900/30' : 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30'}`}>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${user.emergencyContact?.name ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'}`}>
                            <LifeBuoy size={32} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                                {user.emergencyContact?.name ? `Safety Active: ${user.emergencyContact.name}` : 'Safety Alert: Missing Emergency Contact'}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {user.emergencyContact?.name 
                                    ? `During active trips, we'll notify ${user.emergencyContact.name.split(' ')[0]} if you trigger an SOS.` 
                                    : 'Please set a trusted contact in your profile for a safer community experience.'}
                            </p>
                        </div>
                        <button 
                            onClick={() => setActiveTab('profile')}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${user.emergencyContact?.name ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/50' : 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-200 dark:shadow-none'}`}
                        >
                            {user.emergencyContact?.name ? 'Update Contact' : 'Set Now'}
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 dark:text-white">Your Regular Commute</h3>
                            <button className="text-emerald-600 dark:text-emerald-400 text-sm font-bold hover:underline">Edit</button>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                                <MapIcon size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Home to Work</p>
                                <p className="font-bold text-slate-900 dark:text-white truncate">{user.home} → {user.work}</p>
                            </div>
                            </div>
                            <button 
                                onClick={() => setActiveTab(user.role === 'rider' ? 'find-ride' : 'create-ride')}
                                className="w-full py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition-all"
                            >
                                {user.role === 'rider' ? 'Find Next Ride' : 'Start Offering Ride'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <ShieldCheck size={18} className="text-emerald-500" />
                                Your Trusted Circles
                            </h3>
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><Plus size={18} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                                        <Building2 size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">DLF IT Park, Chennai</p>
                                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-tighter">Verified Office</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-200/50 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">ACTIVE</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic border-t border-slate-100 dark:border-slate-800 pt-3">
                                Circles enable trust matches between coworkers and neighbors.
                            </p>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'my-trips' && <MyTrips />}
            {activeTab === 'find-ride' && user.role === 'rider' && (
              <RiderView userBalance={user.balance} onRideBooked={async () => {
                const updatedUser = await db.getUser();
                setUser(updatedUser);
                if (onUserUpdate) onUserUpdate(updatedUser);
                setActiveTab('my-trips');
              }} />
            )}
            {activeTab === 'create-ride' && user.role === 'driver' && (
              <RideCreator onComplete={() => setActiveTab('my-trips')} />
            )}
            {activeTab === 'nearby-requests' && user.role === 'driver' && (
              <NearbyRequests onAccepted={() => setActiveTab('my-trips')} />
            )}
            {activeTab === 'profile' && (
              <ProfileManager 
                initialProfile={user} 
                onSave={handleProfileSave} 
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;