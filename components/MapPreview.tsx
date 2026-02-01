import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, useMap } from 'react-leaflet';
import { Navigation } from 'lucide-react';

// Mock data for a route in Chennai (simulated coordinates)
const driverRoute: [number, number][] = [
  [13.0067, 80.2206], // Guindy
  [13.0150, 80.2350],
  [13.0250, 80.2450],
  [13.0350, 80.2550],
  [13.0418, 80.2341], // T Nagar area
];

const riderPickup: [number, number] = [13.0150, 80.2350]; // Kotturpuram area
const riderDropoff: [number, number] = [13.0400, 80.2350];

const MapController = () => {
    const map = useMap();
    useEffect(() => {
        map.invalidateSize();
    }, [map]);
    return null;
}

const MapPreview: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="h-[500px] w-full bg-white dark:bg-slate-950 animate-pulse"></div>;

  return (
    <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900/50 overflow-hidden transition-colors duration-500">
      <div className="mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="lg:w-1/3 space-y-8">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-sm">
                <Navigation size={18} />
                <span>Smart Route Matching</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Shared commutes for busy Chennai professionals.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Our algorithm handles the heavy lifting of Chennai traffic navigation. 
              Find colleagues and neighbors on your exact route from OMR to Anna Salai.
            </p>
            
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="w-3 h-3 rounded-full bg-slate-900 dark:bg-white"></div>
                    <span className="text-slate-700 dark:text-slate-200 font-medium">Driver Route</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-900/50"></div>
                    <span className="text-slate-700 dark:text-slate-200 font-medium">Your Pickup Point</span>
                </div>
            </div>
          </div>

          {/* Map Visual */}
          <div className="lg:w-2/3 w-full h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 relative z-0">
            <MapContainer 
              center={[13.02, 80.24]} 
              zoom={13} 
              scrollWheelZoom={false} 
              className="h-full w-full bg-slate-200 dark:bg-slate-800"
              zoomControl={false}
            >
                <MapController />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              
              <Polyline 
                positions={driverRoute} 
                pathOptions={{ color: '#10b981', weight: 6, opacity: 0.8 }} 
              />
              
              <CircleMarker 
                center={riderPickup} 
                pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 1 }} 
                radius={8}
              >
                  <Tooltip permanent direction="right" offset={[10, 0]} className="font-bold text-emerald-700 bg-emerald-50 dark:bg-slate-800 dark:text-emerald-400 border-0 shadow-md">
                      Pickup (Kotturpuram)
                  </Tooltip>
              </CircleMarker>

               <CircleMarker 
                center={riderDropoff} 
                pathOptions={{ color: '#10b981', fillColor: '#fff', fillOpacity: 1, weight: 4 }} 
                radius={8}
              >
              </CircleMarker>

               <CircleMarker 
                center={[13.0150, 80.2350]} 
                pathOptions={{ color: '#1e293b', fillColor: '#1e293b', fillOpacity: 1 }} 
                radius={6}
              >
                   <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                      Sneha is nearby
                  </Tooltip>
              </CircleMarker>

            </MapContainer>

            {/* Floating Card Overlay */}
            <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-5 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-[400]">
                <div className="flex items-center gap-3 mb-3">
                    <img src="https://ui-avatars.com/api/?name=Sneha+R&background=10b981&color=fff" alt="Driver" className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-sm" />
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Sneha R.</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Hatchback • 4.9 ★</p>
                    </div>
                    <div className="ml-auto text-right">
                        <span className="block font-black text-emerald-600 dark:text-emerald-400">₹40</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Fuel Share</span>
                    </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-2/3 rounded-full"></div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">Arriving in 8 mins (Via Anna Salai)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapPreview;