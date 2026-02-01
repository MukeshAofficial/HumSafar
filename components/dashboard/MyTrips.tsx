
import React, { useState, useEffect } from 'react';
import { 
  Clock, MapPin, Navigation, CheckCircle2, Loader2, AlertCircle, 
  ShieldCheck, Car, Bike, Zap, ArrowRight, User, Phone, LifeBuoy, X,
  Star, ThumbsUp, MessageSquare, Heart
} from 'lucide-react';
import { db, Trip, TripStatus } from '../../lib/db';

const STATUS_CONFIG: Record<TripStatus, { label: string, color: string, icon: React.ReactNode, progress: number }> = {
  'confirmed': { label: 'Confirmed', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50', icon: <CheckCircle2 size={16} />, progress: 20 },
  'arriving': { label: 'Arriving', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50', icon: <Clock size={16} />, progress: 40 },
  'at-pickup': { label: 'At Pickup', color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/50', icon: <MapPin size={16} />, progress: 60 },
  'in-transit': { label: 'In Transit', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50', icon: <Navigation size={16} />, progress: 85 },
  'completed': { label: 'Completed', color: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/50', icon: <ShieldCheck size={16} />, progress: 100 }
};

const NEXT_STATUS: Record<TripStatus, TripStatus | null> = {
  'confirmed': 'arriving',
  'arriving': 'at-pickup',
  'at-pickup': 'in-transit',
  'in-transit': 'completed',
  'completed': null
};

// Rider giving feedback to driver
const RIDER_TO_DRIVER_TAGS = [
  "Safe Driving", "Punctual", "Clean Vehicle", "Friendly", "Professional", "Smooth Ride"
];

// Driver giving feedback to rider
const DRIVER_TO_RIDER_TAGS = [
  "On Time", "Respectful", "Quiet", "Friendly", "Great Communicator", "Followed Rules"
];

const MyTrips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  
  // Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackTrip, setFeedbackTrip] = useState<Trip | null>(null);
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      const data = await db.getTrips();
      setTrips(data);
      setIsLoading(false);
    };
    fetchTrips();
  }, []);

  const handleUpdateStatus = async (tripId: string, currentStatus: TripStatus) => {
    const next = NEXT_STATUS[currentStatus];
    if (next) {
      const updated = await db.updateTripStatus(tripId, next);
      setTrips(updated);
      
      // If completed, open feedback modal
      if (next === 'completed') {
        const completedTrip = updated.find(t => t.id === tripId);
        if (completedTrip) {
          setFeedbackTrip(completedTrip);
          setShowFeedbackModal(true);
          setRating(0);
          setSelectedTags([]);
          setFeedbackSubmitted(false);
        }
      }
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const submitFeedback = async () => {
    if (rating === 0) return;
    setIsSubmittingFeedback(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmittingFeedback(false);
    setFeedbackSubmitted(true);
    // Auto-close after 2 seconds
    setTimeout(() => {
      setShowFeedbackModal(false);
      setFeedbackTrip(null);
    }, 2000);
  };

  const activeTrips = trips.filter(t => t.status !== 'completed');
  const pastTrips = trips.filter(t => t.status === 'completed');

  const displayedTrips = activeTab === 'active' ? activeTrips : pastTrips;

  // Determine tags based on role
  const currentFeedbackTags = feedbackTrip?.role === 'rider' ? RIDER_TO_DRIVER_TAGS : DRIVER_TO_RIDER_TAGS;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Feedback Modal Overlay */}
      {showFeedbackModal && feedbackTrip && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-10 text-center">
              {!feedbackSubmitted ? (
                <>
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <img src={feedbackTrip.partnerImg} className="w-full h-full rounded-[2rem] object-cover ring-4 ring-emerald-50 dark:ring-emerald-900/30 shadow-lg" />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl border-2 border-white dark:border-slate-900">
                      <Heart size={16} fill="currentColor" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Rate your {feedbackTrip.role === 'rider' ? 'Driver' : 'Neighbor'}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">How was your trip with {feedbackTrip.partnerName}?</p>
                  
                  {/* Star Rating */}
                  <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button 
                        key={s} 
                        onClick={() => setRating(s)}
                        className="transition-all transform hover:scale-125 focus:outline-none"
                      >
                        <Star 
                          size={40} 
                          className={s <= rating ? 'text-amber-400 fill-current' : 'text-slate-200 dark:text-slate-700'} 
                          strokeWidth={s <= rating ? 1 : 2}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Feedback Tags */}
                  <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {currentFeedbackTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                          selectedTags.includes(tag) 
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105' 
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-500'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={submitFeedback}
                      disabled={rating === 0 || isSubmittingFeedback}
                      className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-slate-200 dark:shadow-none hover:bg-emerald-600 dark:hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmittingFeedback ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Complete Feedback <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => setShowFeedbackModal(false)}
                      className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-300 py-2 transition-colors"
                    >
                      Skip for now
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-10 animate-in zoom-in-95 duration-300">
                  <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle2 size={56} strokeWidth={3} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Thank You!</h3>
                  <p className="text-slate-500 dark:text-slate-400 px-6">Your feedback helps keep the HumSafar community safe and friendly.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header Tabs */}
      <div className="flex bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit mx-auto md:mx-0 shadow-sm transition-colors">
        <button 
          onClick={() => setActiveTab('active')}
          className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'active' ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          Active Trips ({activeTrips.length})
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'past' ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
        >
          Trip History ({pastTrips.length})
        </button>
      </div>

      {isLoading ? (
         <div className="py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Loader2 className="animate-spin text-emerald-500 mb-4" size={32} />
            <p className="text-slate-400 dark:text-slate-500 font-bold tracking-tight uppercase text-xs">Loading trips...</p>
         </div>
      ) : displayedTrips.length === 0 ? (
         <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <AlertCircle className="mx-auto text-slate-200 dark:text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 dark:text-slate-400 font-bold">No {activeTab} trips found.</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Book a ride to see it here!</p>
         </div>
      ) : (
         <div className="grid gap-6">
            {displayedTrips.map(trip => {
               const config = STATUS_CONFIG[trip.status];
               return (
                  <div key={trip.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all hover:border-emerald-200 dark:hover:border-emerald-800">
                     
                     {/* Status Banner */}
                     <div className={`px-8 py-3 flex items-center justify-between border-b dark:border-slate-800 ${config.color}`}>
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                           {config.icon}
                           {config.label}
                        </div>
                        {trip.status === 'in-transit' && (
                           <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                              <span className="text-[10px] font-bold uppercase tracking-tighter">Live Progress</span>
                           </div>
                        )}
                     </div>

                     <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                           
                           {/* Trip Info */}
                           <div className="flex-1 space-y-6">
                              <div className="flex items-center gap-4">
                                 <div className="relative">
                                    <img src={trip.partnerImg} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50 dark:ring-slate-800" />
                                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg border-2 border-white dark:border-slate-800 shadow-sm">
                                       <ShieldCheck size={12} />
                                    </div>
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{trip.role === 'rider' ? 'Your Driver' : 'Your Neighbor'}</p>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">{trip.partnerName}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{trip.vehicleInfo} • {trip.vehicleType}</p>
                                 </div>
                              </div>

                              <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                 <div className="flex items-start gap-4">
                                    <MapPin className="text-emerald-500 dark:text-emerald-400 shrink-0 mt-1" size={18} />
                                    <div className="min-w-0">
                                       <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Route Details</p>
                                       <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{trip.route}</p>
                                       <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{trip.time} Departure</p>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Status Controls */}
                           <div className="w-full md:w-72 bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-colors">
                              <div className="space-y-4 mb-6">
                                 <div className="flex justify-between items-center">
                                    <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Trip Progress</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{config.progress}%</p>
                                 </div>
                                 <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                       className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out" 
                                       style={{ width: `${config.progress}%` }}
                                    />
                                 </div>
                              </div>

                              <div className="space-y-3">
                                 {trip.status !== 'completed' && (
                                    <button 
                                       onClick={() => handleUpdateStatus(trip.id, trip.status)}
                                       className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-600 dark:hover:bg-emerald-500 shadow-xl shadow-slate-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                                    >
                                       {NEXT_STATUS[trip.status] === 'completed' ? 'End Trip' : 'Update Status'}
                                       <ArrowRight size={18} />
                                    </button>
                                 )}
                                 <button className="w-full py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-widest rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-100 dark:hover:border-rose-900/30 transition-all flex items-center justify-center gap-2">
                                    <LifeBuoy size={16} /> SOS Emergency
                                 </button>
                              </div>
                           </div>
                        </div>

                        {/* Visual Status Line */}
                        <div className="mt-10 flex items-center gap-1">
                           {(['confirmed', 'arriving', 'at-pickup', 'in-transit', 'completed'] as TripStatus[]).map((s, idx, arr) => {
                              const isPast = arr.indexOf(trip.status) >= idx;
                              const isCurrent = trip.status === s;
                              return (
                                 <React.Fragment key={s}>
                                    <div className="flex flex-col items-center flex-1">
                                       <div className={`w-3 h-3 rounded-full mb-2 z-10 transition-colors ${isPast ? 'bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-900/30' : 'bg-slate-200 dark:bg-slate-700'}`} />
                                       <span className={`text-[8px] font-black uppercase tracking-tight text-center ${isPast ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'}`}>
                                          {s.replace('-', ' ')}
                                       </span>
                                    </div>
                                    {idx < arr.length - 1 && (
                                       <div className={`flex-1 h-0.5 -mt-6 transition-colors ${arr.indexOf(trip.status) > idx ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-slate-800'}`} />
                                    )}
                                 </React.Fragment>
                              );
                           })}
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
      )}

      {activeTab === 'active' && activeTrips.length > 0 && (
         <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30 flex items-start gap-4 animate-in slide-in-from-top-2">
            <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-xl text-amber-600 dark:text-amber-400">
               <Zap size={20} />
            </div>
            <div>
               <p className="text-sm font-bold text-amber-900 dark:text-amber-300">Prototype Note</p>
               <p className="text-xs text-amber-700 dark:text-amber-500 leading-relaxed mt-1">
                  In a real scenario, the status updates automatically based on GPS geofencing. Use the "Update Status" button above to simulate the ride progressing from pickup to destination.
               </p>
            </div>
         </div>
      )}
    </div>
  );
};

export default MyTrips;