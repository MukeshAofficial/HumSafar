import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Navigation, CheckCircle2, Loader2, Zap, AlertCircle, ShieldCheck, Landmark } from 'lucide-react';
import { db, RideRequest } from '../../lib/db';

interface NearbyRequestsProps {
  onAccepted: () => void;
}

const isPeakHour = (timeStr: string) => {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return false;
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  // Morning: 8 AM - 10 AM (up to 10:00)
  const isMorningPeak = hours >= 8 && (hours < 10 || (hours === 10 && minutes === 0));
  // Evening: 5 PM - 8 PM (up to 20:00)
  const isEveningPeak = hours >= 17 && (hours < 20 || (hours === 20 && minutes === 0));
  
  return isMorningPeak || isEveningPeak;
};

const NearbyRequests: React.FC<NearbyRequestsProps> = ({ onAccepted }) => {
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAcceptingId, setIsAcceptingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      const data = await db.getRideRequests();
      setRequests(data);
      setIsLoading(false);
    };
    fetchRequests();
  }, []);

  const handleAccept = async (reqId: string) => {
    setIsAcceptingId(reqId);
    const success = await db.acceptRideRequest(reqId);
    if (success) {
      alert("Mutual confirmation sent! Ride will start once neighbor agrees to fuel share.");
      onAccepted();
    } else {
      alert("Could not accept request.");
    }
    setIsAcceptingId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-emerald-600 dark:bg-emerald-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl shadow-emerald-200 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Zap size={140} />
        </div>
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/30">
            <ShieldCheck size={14} /> Mutual Confirmation Mode
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nearby Commuter Leads</h2>
          <p className="text-emerald-100 dark:text-emerald-50 font-medium">
            Helping neighbors from your campus or IT park. High priority given to <strong>Peak Hour</strong> requests.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
            <p className="text-slate-400 dark:text-slate-500 font-bold tracking-tight uppercase text-xs">Scanning for neighbors...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-12">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertCircle className="text-slate-300 dark:text-slate-700" size={32} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold">No active leads in your area.</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Try updating your workplace location in Profile.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map((req) => (
              <div key={req.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md dark:hover:shadow-none hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img src={req.riderImg} alt={req.riderName} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-50 dark:border-slate-800 shadow-sm" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{req.riderName}</h4>
                      <div className="flex items-center gap-1.5 text-blue-500 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider">
                        <Navigation size={12} />
                        {req.distance}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase mt-1">
                          <Landmark size={10} /> Same IT Park Lead
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-slate-300 dark:text-slate-600 mt-1" size={18} />
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{req.route}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                          <Clock size={16} />
                          <span className="font-semibold">Leaving by {req.time}</span>
                        </div>
                        {isPeakHour(req.time) && (
                            <span className="bg-amber-500 text-white text-[8px] px-2 py-1 rounded-full font-black uppercase tracking-tighter flex items-center gap-1 shadow-sm">
                                <Zap size={8} fill="currentColor" />
                                Peak Hour Lead
                            </span>
                        )}
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex flex-col gap-2">
                    <button 
                      onClick={() => handleAccept(req.id)}
                      disabled={isAcceptingId === req.id}
                      className="w-full md:px-8 py-4 bg-slate-900 dark:bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
                    >
                      {isAcceptingId === req.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          Offer Ride
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase text-center tracking-widest">Mutual Accept Required</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyRequests;