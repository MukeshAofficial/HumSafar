
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from 'react-leaflet';
import { Calendar, Clock, Users, MapPin, CheckCircle2, ChevronRight, ChevronLeft, Loader2, IndianRupee, ShieldCheck, Heart, Shield, Info } from 'lucide-react';
import L from 'leaflet';
import { db } from '../../lib/db';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RideCreatorProps {
  onComplete: () => void;
}

const MapEvents = ({ onSelect }: { onSelect: (latlng: [number, number]) => void }) => {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const MapUpdater = ({ start, end }: { start: [number, number] | null, end: [number, number] | null }) => {
    const map = useMap();
    useEffect(() => {
        if (start && end) {
            const bounds = L.latLngBounds([start, end]);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [start, end, map]);
    return null;
};

const RideCreator: React.FC<RideCreatorProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Location State
  const [startLoc, setStartLoc] = useState<[number, number] | null>(null);
  const [endLoc, setEndLoc] = useState<[number, number] | null>(null);
  const [startLocName, setStartLocName] = useState('');
  const [endLocName, setEndLocName] = useState('');
  
  const [isSettingStart, setIsSettingStart] = useState(true);

  const [details, setDetails] = useState({
    time: '08:30',
    seats: '3',
    cost: '80',
    recurring: true,
    isWomenOnly: false,
    days: ['mon', 'tue', 'wed', 'thu', 'fri']
  });

  const handleMapClick = (latlng: [number, number]) => {
    if (isSettingStart) {
      setStartLoc(latlng);
      // Auto-switch to destination setting for convenience
      if (!endLoc) setIsSettingStart(false);
    } else {
      setEndLoc(latlng);
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      const startName = startLocName.trim() || (startLoc ? `${startLoc[0].toFixed(3)}, ${startLoc[1].toFixed(3)}` : 'Start');
      const endName = endLocName.trim() || (endLoc ? `${endLoc[0].toFixed(3)}, ${endLoc[1].toFixed(3)}` : 'End');

      await db.createRide({
        route: `${startName} → ${endName}`,
        time: details.time,
        cost: parseFloat(details.cost),
        seatsTotal: parseInt(details.seats),
        seatsLeft: parseInt(details.seats),
        isWomenOnly: details.isWomenOnly
      });
      onComplete();
    } catch (e) {
      alert('Failed to save ride');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDay = (day: string) => {
    setDetails(prev => ({
      ...prev,
      days: prev.days.includes(day) 
        ? prev.days.filter(d => d !== day) 
        : [...prev.days, day]
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* Header / Stepper */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 dark:text-white">Create a New Ride</h2>
            <div className="flex gap-2">
                {[1, 2, 3].map(s => (
                    <div key={s} className={`w-8 h-1.5 rounded-full transition-all ${step >= s ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                ))}
            </div>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Location Input Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Start Location */}
                <div 
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative group ${isSettingStart ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                  onClick={() => setIsSettingStart(true)}
                >
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isSettingStart ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    From Location
                  </label>
                  <input 
                    type="text"
                    value={startLocName}
                    onChange={(e) => setStartLocName(e.target.value)}
                    placeholder="E.g., Adyar Signal"
                    className="w-full bg-transparent border-b border-slate-300 dark:border-slate-600 pb-2 mb-3 font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 placeholder:font-normal placeholder:text-slate-400 transition-colors"
                  />
                  <div className="flex items-center justify-between text-xs">
                     <span className={`font-medium ${startLoc ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                        {startLoc ? `${startLoc[0].toFixed(4)}, ${startLoc[1].toFixed(4)}` : "Click map to set pin"}
                     </span>
                     {startLoc && <CheckCircle2 size={14} className="text-emerald-500" />}
                  </div>
                </div>

                {/* Destination Location */}
                <div 
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative group ${!isSettingStart ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                  onClick={() => setIsSettingStart(false)}
                >
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${!isSettingStart ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    To Location
                  </label>
                  <input 
                    type="text"
                    value={endLocName}
                    onChange={(e) => setEndLocName(e.target.value)}
                    placeholder="E.g., DLF IT Park"
                    className="w-full bg-transparent border-b border-slate-300 dark:border-slate-600 pb-2 mb-3 font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 placeholder:font-normal placeholder:text-slate-400 transition-colors"
                  />
                  <div className="flex items-center justify-between text-xs">
                     <span className={`font-medium ${endLoc ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                        {endLoc ? `${endLoc[0].toFixed(4)}, ${endLoc[1].toFixed(4)}` : "Click map to set pin"}
                     </span>
                     {endLoc && <CheckCircle2 size={14} className="text-emerald-500" />}
                  </div>
                </div>
              </div>

              <div className="h-[400px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative z-0">
                 <MapContainer center={[13.0827, 80.2707]} zoom={12} className="h-full w-full">
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <MapEvents onSelect={handleMapClick} />
                    <MapUpdater start={startLoc} end={endLoc} />
                    {startLoc && <Marker position={startLoc} />}
                    {endLoc && <Marker position={endLoc} />}
                    {startLoc && endLoc && <Polyline positions={[startLoc, endLoc]} pathOptions={{ color: '#10b981', weight: 4, dashArray: '8, 8' }} />}
                 </MapContainer>
                 {/* Map Hint Overlay */}
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 z-[400] text-xs font-bold text-slate-600 dark:text-slate-300 pointer-events-none">
                    Click to set {isSettingStart ? "Start Point" : "Destination"}
                 </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  disabled={!startLoc || !endLoc}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                >
                  Continue to Details <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 max-w-2xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2"><Clock size={16} /> Departure Time</label>
                    <input 
                      type="time" 
                      value={details.time}
                      onChange={e => setDetails({...details, time: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2"><Users size={16} /> Available Seats</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map(n => (
                            <button 
                              key={n}
                              onClick={() => setDetails({...details, seats: n.toString()})}
                              className={`flex-1 py-4 rounded-2xl font-bold transition-all border-2 ${details.seats === n.toString() ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-emerald-200 dark:hover:border-emerald-500'}`}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Safety & Community Options */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Shield className="text-purple-600 dark:text-purple-400" size={18} />
                        <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Safety & Community</h3>
                    </div>
                    <div 
                      onClick={() => setDetails({...details, isWomenOnly: !details.isWomenOnly})}
                      className={`p-6 rounded-3xl border-2 transition-all cursor-pointer ${details.isWomenOnly ? 'bg-purple-50/80 dark:bg-purple-900/20 border-purple-500 ring-4 ring-purple-500/10' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-500'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${details.isWomenOnly ? 'bg-purple-600 text-white' : 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400'}`}>
                                    <Heart size={24} fill={details.isWomenOnly ? 'currentColor' : 'none'} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest">Women-Only Mode</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Filter this ride to be visible ONLY to female neighbors.</p>
                                </div>
                            </div>
                            <div className={`w-14 h-8 rounded-full transition-all relative ${details.isWomenOnly ? 'bg-purple-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all ${details.isWomenOnly ? 'left-7' : 'left-1'}`} />
                            </div>
                        </div>
                    </div>
                    {/* Explanation Text */}
                    <div className="flex items-start gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <Info size={16} className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                            Women-Only HumSafars are an opt-in safety feature inspired by women-only public transport options in India.
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-2"><IndianRupee size={16} /> Fuel Share (₹)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <span className="text-slate-400 dark:text-slate-500 font-bold">₹</span>
                        </div>
                        <input 
                          type="number" 
                          step="5"
                          value={details.cost}
                          onChange={e => setDetails({...details, cost: e.target.value})}
                          className="w-full pl-8 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500" 
                        />
                    </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-4 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white transition-colors">
                    <ChevronLeft size={20} /> Back
                  </button>
                  <button onClick={() => setStep(3)} className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20">
                    Preview Ride <ChevronRight size={20} />
                  </button>
                </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-md mx-auto space-y-8 py-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-4">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Ready to post?</h3>
                    <p className="text-slate-500 dark:text-slate-400">Review your commute details before sharing.</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 space-y-4 relative overflow-hidden">
                    <div className="flex items-start gap-3">
                        <MapPin className="text-emerald-500 dark:text-emerald-400 mt-1 shrink-0" size={18} />
                        <div>
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Route</p>
                            <div className="flex flex-col gap-1 mt-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                                    {startLocName || (startLoc ? `${startLoc[0].toFixed(3)}, ${startLoc[1].toFixed(3)}` : 'Start')}
                                </p>
                                <div className="ml-1 pl-1 border-l-2 border-dotted border-slate-300 h-3"></div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    {endLocName || (endLoc ? `${endLoc[0].toFixed(3)}, ${endLoc[1].toFixed(3)}` : 'End')}
                                </p>
                            </div>
                        </div>
                    </div>
                    {details.isWomenOnly && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-xl w-fit text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-100 dark:shadow-none">
                            <Heart size={12} fill="currentColor" /> Women-Only Mode
                        </div>
                    )}
                    <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
                        <div>
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Time</p>
                            <p className="font-bold text-slate-900 dark:text-white">{details.time}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Seats</p>
                            <p className="font-bold text-slate-900 dark:text-white">{details.seats}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Share</p>
                            <p className="font-bold text-emerald-600 dark:text-emerald-400">₹{details.cost}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handlePublish}
                        disabled={isSubmitting}
                        className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 dark:shadow-none flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Publishing...
                            </>
                        ) : 'Publish HumSafar'}
                    </button>
                    <button onClick={() => setStep(2)} className="w-full py-4 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white transition-all">
                        Edit Details
                    </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideCreator;
