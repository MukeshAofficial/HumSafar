
import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Clock, Star, Car, Filter, Loader2, AlertCircle, Send, X, 
  Info, IndianRupee, CheckCircle2, Phone, ShieldCheck, Landmark, Smartphone, 
  GraduationCap, Building2, Home, Users, Zap, Bike, LifeBuoy, MessageSquare, 
  Check, XCircle, ArrowRight, ChevronRight, Shield, Heart, Sparkles, User, ChevronLeft,
  Building
} from 'lucide-react';
import { db, Ride, CircleType, VehicleType, UserProfile } from '../../lib/db';

interface RiderViewProps {
  userBalance: number;
  onRideBooked: () => void;
}

const isPeakHour = (timeStr: string) => {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return false;
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  const isMorningPeak = hours >= 8 && (hours < 10 || (hours === 10 && minutes === 0));
  const isEveningPeak = hours >= 17 && (hours < 20 || (hours === 20 && minutes === 0));
  
  return isMorningPeak || isEveningPeak;
};

const CircleBadge = ({ type, name }: { type: CircleType, name: string }) => {
    const config = {
        college: { icon: <GraduationCap size={10} />, color: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/50', label: 'Same College' },
        'it-park': { icon: <Building2 size={10} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50', label: 'IT Park Peer' },
        office: { icon: <Building2 size={10} />, color: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50', label: 'Office Corridor' },
        neighbor: { icon: <Home size={10} />, color: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50', label: 'Verified Neighbor' }
    };
    const style = config[type] || config.neighbor;
    return (
        <span className={`${style.color} border text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-tighter whitespace-nowrap flex items-center gap-1.5 shadow-sm`}>
            {style.icon}
            {name}
        </span>
    );
};

const PeakBadge = () => (
    <span className="bg-amber-500 text-white text-[8px] px-2 py-1 rounded-full font-black uppercase tracking-tighter flex items-center gap-1 shadow-lg shadow-amber-200 animate-pulse">
        <Zap size={8} fill="currentColor" />
        Peak Hour
    </span>
);

const VehicleBadge = ({ type }: { type: VehicleType }) => {
    const config = {
        bike: { icon: <Bike size={12} />, label: 'Bike', color: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/50' },
        auto: { icon: <Zap size={12} />, label: 'Auto', color: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-500 dark:border-yellow-800/50' },
        car: { icon: <Car size={12} />, label: 'Car', color: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' }
    };
    const style = config[type];
    return (
        <span className={`${style.color} border text-[10px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5`}>
            {style.icon}
            {style.label}
        </span>
    );
};

const PREDEFINED_QUESTIONS = [
  "Can I carry a small laptop bag?",
  "Is it okay if I'm 2 mins late?",
  "Will there be other colleagues?",
  "Is the back seat available?",
  "Can we avoid heavy traffic routes?"
];

type BookingStep = 'summary' | 'inquiry' | 'final_confirm' | 'simulating' | 'outcome';

const RiderView: React.FC<RiderViewProps> = ({ userBalance, onRideBooked }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVehicleFilter, setActiveVehicleFilter] = useState<VehicleType | 'all'>('all');
  const [showWomenOnlyOnly, setShowWomenOnlyOnly] = useState(false);
  const [showSameVicinityOnly, setShowSameVicinityOnly] = useState(false);
  const [selectedRideForBooking, setSelectedRideForBooking] = useState<Ride | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [useCredits, setUseCredits] = useState(false);
  
  // Multi-step state
  const [currentStep, setCurrentStep] = useState<BookingStep>('summary');
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<'success' | 'failure' | null>(null);

  useEffect(() => {
    const fetchUserAndRides = async () => {
      const [u, r] = await Promise.all([db.getUser(), db.getRides()]);
      setUser(u);
      setRides(r);
      setFilteredRides(r);
      setIsLoading(false);
    };
    fetchUserAndRides();
  }, []);

  const isVicinityMatch = (ride: Ride, profile: UserProfile | null) => {
    if (!profile || !profile.workplace) return false;
    const userVicinity = profile.workplace.toLowerCase();
    const rideVicinity = ride.circleName.toLowerCase();
    // Check if workplace name is in circle name or vice versa (e.g. "DLF IT Park" in "DLF IT Park, Chennai")
    return userVicinity.includes(rideVicinity) || rideVicinity.includes(userVicinity);
  };

  useEffect(() => {
    let result = rides;
    
    // Vehicle Filter
    if (activeVehicleFilter !== 'all') {
        result = result.filter(r => r.vehicleType === activeVehicleFilter);
    }
    
    // Women-Only Mode filtering
    if (showWomenOnlyOnly) {
        result = result.filter(r => r.driverGender === 'female');
    }

    // Vicinity Preference Logic
    if (showSameVicinityOnly) {
        const vicinityMatches = result.filter(r => isVicinityMatch(r, user));
        // Fallback: If matches exist, show only them. If not, show all (but UI can indicate this)
        if (vicinityMatches.length > 0) {
            result = vicinityMatches;
        }
    }

    setFilteredRides(result);
  }, [activeVehicleFilter, showWomenOnlyOnly, showSameVicinityOnly, rides, user]);

  const handleJoinClick = (ride: Ride) => {
    setSelectedRideForBooking(ride);
    setCurrentStep('summary');
    setSelectedQuestion(null);
    setBookingResult(null);
    setUseCredits(false);
  };

  const nextStep = () => {
    setCurrentStep(prev => {
      if (prev === 'summary') return 'inquiry';
      if (prev === 'inquiry') return 'final_confirm';
      return prev;
    });
  };

  const prevStep = () => {
    setCurrentStep(prev => {
      if (prev === 'inquiry') return 'summary';
      if (prev === 'final_confirm') return 'inquiry';
      return prev;
    });
  };

  const startSimulation = async () => {
    if (!selectedRideForBooking || !user) return;

    let costToPay = selectedRideForBooking.cost;
    if (useCredits) {
        costToPay = Math.max(0, costToPay - user.commuteCredits);
    }

    if (user.balance < costToPay) {
      alert("Insufficient balance! Please add credits to your wallet.");
      return;
    }

    setCurrentStep('simulating');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const isAccepted = Math.random() > 0.15;
    
    if (isAccepted) {
      const success = await db.bookRide(selectedRideForBooking.id, useCredits).catch(err => {
        console.error(err);
        return false;
      });
      
      if (success) {
        setBookingResult('success');
      } else {
        setBookingResult('failure');
      }
    } else {
      setBookingResult('failure');
    }
    
    setCurrentStep('outcome');
  };

  const closeBooking = () => {
    if (bookingResult === 'success') {
      setShowSuccessToast(true);
      onRideBooked();
      setTimeout(() => setShowSuccessToast(false), 4000);
    }
    setSelectedRideForBooking(null);
    setCurrentStep('summary');
  };

  const vehicleFilters = [
    { id: 'all', label: 'All Rides', icon: <Filter size={16} /> },
    { id: 'bike', label: 'Bikes', icon: <Bike size={16} /> },
    { id: 'auto', label: 'Autos', icon: <Zap size={16} /> },
    { id: 'car', label: 'Cars', icon: <Car size={16} /> },
  ];

  const vicinityMatchCount = rides.filter(r => isVicinityMatch(r, user)).length;

  return (
    <div className={`space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 relative transition-all`}>
      
      {showSuccessToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[3000] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="bg-slate-900 dark:bg-slate-800 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-500/30 ring-4 ring-slate-900/10 dark:ring-emerald-500/10">
            <div className="bg-emerald-500 p-1.5 rounded-full">
              <Check size={20} className="text-white" strokeWidth={3} />
            </div>
            <div>
                <p className="font-bold text-sm">Ride Confirmed!</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest">Neighbor notified • Seat reserved</p>
            </div>
            <button onClick={() => setShowSuccessToast(false)} className="ml-4 text-slate-500 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {selectedRideForBooking && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="relative p-8">
              {currentStep !== 'simulating' && (
                <button 
                  type="button"
                  onClick={() => setSelectedRideForBooking(null)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors z-[10]"
                >
                  <X size={20} />
                </button>
              )}

              <div className="flex items-center justify-center gap-1 mb-8">
                {['summary', 'inquiry', 'final_confirm'].map((s, idx) => (
                    <div key={s} className={`w-10 h-1.5 rounded-full transition-all duration-300 ${['summary', 'inquiry', 'final_confirm'].indexOf(currentStep) >= idx ? (showWomenOnlyOnly ? 'bg-purple-500' : 'bg-emerald-500') : 'bg-slate-200 dark:bg-slate-800'}`} />
                ))}
              </div>

              {currentStep === 'summary' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Ride Summary</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Review your neighbor match details</p>
                  </div>

                  <div className={`bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 mb-8 space-y-6 ${showWomenOnlyOnly ? 'bg-purple-50/30 dark:bg-purple-900/10' : ''}`}>
                     <div className="flex items-center gap-4">
                        <img src={selectedRideForBooking.driverImg} className="w-14 h-14 rounded-2xl object-cover shadow-sm ring-2 ring-white dark:ring-slate-700" alt="Driver" />
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">{selectedRideForBooking.driverName}</h4>
                            <div className="flex flex-wrap gap-2">
                                <CircleBadge type={selectedRideForBooking.circleType} name={selectedRideForBooking.circleName} />
                                {selectedRideForBooking.driverGender === 'female' && (
                                    <span className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800 text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-tighter whitespace-nowrap flex items-center gap-1.5 shadow-sm">
                                        <Heart size={10} /> Verified Female Driver
                                    </span>
                                )}
                            </div>
                        </div>
                     </div>

                     <div className="space-y-4 pt-4 border-t border-slate-200/60 dark:border-slate-700">
                        <div className="flex items-start gap-3">
                           <MapPin className={`${showWomenOnlyOnly ? 'text-purple-500 dark:text-purple-400' : 'text-emerald-500 dark:text-emerald-400'} shrink-0`} size={18} />
                           <div>
                              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Route</p>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{selectedRideForBooking.route}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <Clock className={`${showWomenOnlyOnly ? 'text-purple-500 dark:text-purple-400' : 'text-emerald-500 dark:text-emerald-400'} shrink-0`} size={18} />
                           <div>
                              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Departure</p>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Today, {selectedRideForBooking.time}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <button 
                    type="button"
                    onClick={nextStep}
                    className={`w-full py-4 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 ${showWomenOnlyOnly ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 dark:shadow-none'}`}
                  >
                    Select Inquiries & Continue <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {currentStep === 'inquiry' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Quick Inquiries</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Optional: Message your neighbor</p>
                  </div>

                  <div className="space-y-2 mb-8 max-h-[240px] overflow-y-auto no-scrollbar pr-1">
                    {PREDEFINED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setSelectedQuestion(selectedQuestion === q ? null : q)}
                        className={`w-full p-4 rounded-2xl text-left text-sm font-bold transition-all border ${
                          selectedQuestion === q 
                            ? (showWomenOnlyOnly ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-500 text-purple-700 dark:text-purple-300' : 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-300')
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={prevStep} className="flex-1 py-4 text-slate-400 dark:text-slate-500 font-black flex items-center justify-center gap-2 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <ChevronLeft size={20} /> Back
                    </button>
                    <button 
                      type="button"
                      onClick={nextStep}
                      className={`flex-[2] py-4 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 ${showWomenOnlyOnly ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                      Review & Confirm <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 'final_confirm' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Confirm Request</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Final check before sending</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-6 text-white">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Ride Share Cost</span>
                            <span className="text-2xl font-black text-white">₹{selectedRideForBooking.cost.toFixed(0)}</span>
                        </div>
                        
                        {user && user.commuteCredits > 0 && (
                            <div 
                                onClick={() => setUseCredits(!useCredits)}
                                className={`mt-4 p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${useCredits ? 'bg-emerald-500/20 border-emerald-500' : 'bg-white/5 border-white/10 hover:border-emerald-500/50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Sparkles size={18} className="text-emerald-400" />
                                    <div>
                                        <p className="text-xs font-bold text-white">Use Commute Credits</p>
                                        <p className="text-[10px] text-slate-400">Available: ₹{user.commuteCredits.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className={`w-10 h-6 rounded-full transition-all relative ${useCredits ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${useCredits ? 'left-5' : 'left-1'}`} />
                                </div>
                            </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Net Payable</span>
                            <span className="text-3xl font-black text-emerald-400">
                                ₹{Math.max(0, selectedRideForBooking.cost - (useCredits ? (user?.commuteCredits || 0) : 0)).toFixed(0)}
                            </span>
                        </div>
                    </div>

                    {selectedQuestion && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-2">
                           <MessageSquare size={12} /> Inquiry Included
                        </p>
                        <p className="text-sm italic text-slate-600 dark:text-slate-300">"{selectedQuestion}"</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={prevStep} className="flex-1 py-4 text-slate-400 dark:text-slate-500 font-black flex items-center justify-center gap-2 transition-colors hover:text-slate-900 dark:hover:text-white">
                      <ChevronLeft size={20} /> Back
                    </button>
                    <button 
                      type="button"
                      onClick={startSimulation}
                      className={`flex-[2] py-4 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 ${showWomenOnlyOnly ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'}`}
                    >
                      Send Request <Send size={20} />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 'simulating' && (
                <div className="py-12 flex flex-col items-center justify-center animate-in fade-in duration-300">
                  <div className={`relative w-32 h-32 mb-8 flex items-center justify-center`}>
                     <div className={`absolute inset-0 rounded-[2.5rem] animate-ping opacity-20 ${showWomenOnlyOnly ? 'bg-purple-500' : 'bg-emerald-500'}`} />
                     <div className={`w-full h-full rounded-[2.5rem] flex items-center justify-center shadow-2xl ${showWomenOnlyOnly ? 'bg-purple-600 text-white' : 'bg-emerald-600 text-white'}`}>
                        <Loader2 size={48} className="animate-spin" />
                     </div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Requesting Ride...</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-center">Waiting for {selectedRideForBooking.driverName} to respond</p>
                </div>
              )}

              {currentStep === 'outcome' && (
                <div className="py-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                   <div className={`w-28 h-28 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl ${bookingResult === 'success' ? (showWomenOnlyOnly ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400') : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                      {bookingResult === 'success' ? <Check size={64} strokeWidth={3} /> : <X size={64} strokeWidth={3} />}
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                      {bookingResult === 'success' ? 'You\'re In!' : 'Request Declined'}
                   </h3>
                   <p className="text-slate-500 dark:text-slate-400 mb-10 px-6">
                      {bookingResult === 'success' 
                        ? `Great news! ${selectedRideForBooking.driverName} has accepted your request. Check "My Trips" for the live location.` 
                        : "Sorry, this neighbor couldn't accommodate the ride right now. Try another verified neighbor going your way!"}
                   </p>
                   <button 
                    type="button"
                    onClick={closeBooking}
                    className={`w-full py-4 font-black rounded-2xl transition-all shadow-xl ${bookingResult === 'success' ? (showWomenOnlyOnly ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-500/20' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20') : 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700'}`}
                   >
                     {bookingResult === 'success' ? 'View My Trips' : 'Try Another Neighbor'}
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Mode Selector */}
      <div className="bg-white dark:bg-slate-900 p-1.5 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center gap-2">
          <button 
            type="button"
            onClick={() => setShowWomenOnlyOnly(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-sm transition-all ${!showWomenOnlyOnly ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Users size={20} />
            Regular Mode
          </button>
          <button 
              type="button"
              onClick={() => setShowWomenOnlyOnly(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-sm transition-all ${showWomenOnlyOnly ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-purple-600/60 dark:text-purple-400/60 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30'}`}
          >
              <Heart size={20} fill={showWomenOnlyOnly ? 'currentColor' : 'none'} />
              Women-Only Mode
          </button>
      </div>

      {showWomenOnlyOnly && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-800 rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl shadow-purple-200 dark:shadow-none relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck size={160} />
            </div>
            <div className="relative z-10 max-w-lg">
                <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/30">
                    <Sparkles size={14} className="text-amber-300" />
                    Verified Safe Space Active
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-3">Safe & Shared.</h2>
                <p className="text-purple-100 font-medium leading-relaxed">
                    Connecting female neighbors for a more comfortable, professional commute.
                </p>
            </div>
          </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Filter Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-2 rounded-[1.75rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex overflow-x-auto gap-2 no-scrollbar px-2 py-1 flex-1">
            {vehicleFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveVehicleFilter(f.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all border ${
                  activeVehicleFilter === f.id
                    ? (showWomenOnlyOnly ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 dark:border-emerald-600 shadow-md')
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/20'
                }`}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>

          <div className="px-2 border-l border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowSameVicinityOnly(!showSameVicinityOnly)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all border ${
                  showSameVicinityOnly
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500'
                }`}
              >
                <Building size={16} />
                Same Vicinity Preference
                {showSameVicinityOnly && vicinityMatchCount > 0 && (
                    <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-md text-[10px]">{vicinityMatchCount}</span>
                )}
              </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
              <input 
                type="text" 
                placeholder="Search destination or IT Park name..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-semibold text-slate-900 dark:text-white"
              />
          </div>
          <button type="button" className={`w-full md:w-auto px-10 py-4 text-white font-bold rounded-2xl transition-all shadow-md dark:shadow-none ${showWomenOnlyOnly ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
              Search
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
            <h3 className={`font-black uppercase tracking-widest text-xs ${showWomenOnlyOnly ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {showWomenOnlyOnly ? 'Safe-Matched Female Neighbors' : 'All Recommended Matches'}
            </h3>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-tighter">{filteredRides.length} available neighbors</span>
        </div>

        {showSameVicinityOnly && vicinityMatchCount === 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                <Info size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <p className="text-xs font-bold text-blue-700 dark:text-blue-300">
                    No matches found for "{user?.workplace || 'your workplace'}". Showing all nearby rides instead.
                </p>
            </div>
        )}

        {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
               <Loader2 className={`animate-spin ${showWomenOnlyOnly ? 'text-purple-500 dark:text-purple-400' : 'text-emerald-500 dark:text-emerald-400'}`} size={32} />
               <p className="text-slate-400 dark:text-slate-500 font-bold tracking-tight uppercase text-xs">Matching with neighbors...</p>
            </div>
        ) : filteredRides.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
               <AlertCircle className="mx-auto text-slate-200 dark:text-slate-700 mb-4" size={48} />
               <p className="text-slate-500 dark:text-slate-400 mb-2 font-medium">No matches found for this filter.</p>
               <button type="button" onClick={() => { setShowWomenOnlyOnly(false); setShowSameVicinityOnly(false); }} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                 Show all rides instead
               </button>
            </div>
        ) : (
            <div className="grid gap-4">
                {filteredRides.map(ride => {
                  const hasVicinityMatch = isVicinityMatch(ride, user);
                  return (
                    <div key={ride.id} className={`bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border shadow-sm transition-all hover:shadow-xl hover:shadow-emerald-500/5 dark:hover:shadow-none ${ride.seatsLeft > 0 ? (showWomenOnlyOnly ? 'hover:border-purple-200 dark:hover:border-purple-800' : 'hover:border-emerald-200 dark:hover:border-emerald-800') : 'opacity-75 grayscale-[0.5]'} ${hasVicinityMatch && showSameVicinityOnly ? 'ring-2 ring-blue-500/30 border-blue-200 dark:border-blue-800' : 'border-slate-200 dark:border-slate-800'}`}>
                       <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex items-center gap-4">
                              <div className="relative shrink-0">
                                  <img src={ride.driverImg} alt={ride.driverName} className={`w-16 h-16 rounded-[1.75rem] object-cover border-2 border-white dark:border-slate-700 shadow-sm ring-4 ${showWomenOnlyOnly ? 'ring-purple-50 dark:ring-purple-900/30' : 'ring-slate-50 dark:ring-slate-800/50'}`} />
                                  <div className={`absolute -bottom-1 -right-1 rounded-full p-1.5 shadow-md border-2 border-white dark:border-slate-700 ${showWomenOnlyOnly ? 'bg-purple-500' : 'bg-emerald-500'}`}>
                                      <ShieldCheck size={10} className="text-white" />
                                  </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                  <div className="flex flex-col items-start gap-1 mb-1">
                                      <h4 className="font-bold text-slate-900 dark:text-white truncate w-full">{ride.driverName}</h4>
                                      <div className="flex flex-wrap gap-1.5 items-center">
                                          <CircleBadge type={ride.circleType} name={ride.circleName} />
                                          {hasVicinityMatch && (
                                              <span className="bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50 border text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-tighter whitespace-nowrap flex items-center gap-1.5 shadow-sm">
                                                  <Building size={10} /> Same Vicinity
                                              </span>
                                          )}
                                          <VehicleBadge type={ride.vehicleType} />
                                          {isPeakHour(ride.time) && <PeakBadge />}
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-1 text-amber-500 text-sm">
                                          <Star size={14} fill="currentColor" />
                                          <span className="font-bold">{ride.driverRating}</span>
                                      </div>
                                      {ride.driverGender === 'female' && (
                                          <div className="flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">
                                              <Heart size={10} fill="currentColor" /> Verified Woman Driver
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>

                          <div className="flex-1 space-y-3 pt-2">
                              <div className="flex items-start gap-3">
                                  <MapPin className={`${showWomenOnlyOnly ? 'text-purple-500 dark:text-purple-400' : 'text-emerald-500 dark:text-emerald-400'} mt-1 shrink-0`} size={18} />
                                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-1">{ride.route}</p>
                              </div>
                              <div className="flex flex-wrap gap-x-6 gap-y-2">
                                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                                      <Clock size={16} className="text-slate-400 dark:text-slate-500" />
                                      <span className="font-semibold">{ride.time} Departure</span>
                                  </div>
                              </div>
                          </div>

                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-6 min-w-[140px]">
                              <div className="text-right">
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Fuel Share</p>
                                  <p className={`text-2xl font-black ${showWomenOnlyOnly ? 'text-purple-600 dark:text-purple-400' : 'text-emerald-600 dark:text-emerald-400'}`}>₹{ride.cost.toFixed(0)}</p>
                              </div>
                              <button 
                                type="button"
                                onClick={() => handleJoinClick(ride)}
                                disabled={ride.seatsLeft <= 0}
                                className={`px-6 py-3 text-white text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2 min-w-[120px] ${ride.seatsLeft <= 0 ? 'bg-slate-200 dark:bg-slate-800 cursor-not-allowed text-slate-500 dark:text-slate-600' : (showWomenOnlyOnly ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/10' : 'bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 shadow-slate-200 dark:shadow-none')} transition-all`}
                              >
                                  {ride.seatsLeft <= 0 ? 'Full' : 'Request Join'}
                              </button>
                          </div>
                       </div>
                    </div>
                  );
                })}
              </div>
        )}
      </div>

    </div>
  );
};

export default RiderView;
