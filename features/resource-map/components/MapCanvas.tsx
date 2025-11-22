
import React from 'react';
import { MapProperty, MapStaff } from '../../../types';

interface MapCanvasProps {
  properties: MapProperty[];
  staffList: MapStaff[];
}

export const MapCanvas: React.FC<MapCanvasProps> = ({ properties, staffList }) => {
  
  // Mock projection logic: Map lat/lng to % positions
  // Center roughly at 28.30, -81.55
  // Range +/- 0.03
  const centerLat = 28.30;
  const centerLng = -81.55;
  const zoomFactor = 0.035; 

  const getPosition = (lat: number, lng: number) => {
      const x = ((lng - (centerLng - zoomFactor)) / (zoomFactor * 2)) * 100;
      // Latitude y-axis is inverted (top is higher lat)
      const y = 100 - ((lat - (centerLat - zoomFactor)) / (zoomFactor * 2)) * 100;
      return { left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%` };
  };

  return (
    <div className="flex-1 relative bg-[#E5F0F1] overflow-hidden select-none cursor-grab active:cursor-grabbing">
        {/* Mock Map Background - Grid/Roads Simulation */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
            backgroundSize: '100px 100px'
        }}></div>
        
        {/* Water Features Simulation */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
        
        {/* Road Simulation (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 stroke-slate-400 fill-none" strokeWidth="2">
            <path d="M0 50 Q 200 200, 400 100 T 800 300 T 1200 200" />
            <path d="M300 0 Q 350 300, 600 600 T 800 900" />
            <path d="M800 0 L 200 800" />
        </svg>

        {/* Place Names */}
        <div className="absolute top-10 left-1/3 text-slate-500 font-bold uppercase tracking-widest text-xs opacity-60">CITRUS RIDGE</div>
        <div className="absolute top-20 left-1/2 text-slate-500 font-bold uppercase tracking-widest text-xs opacity-60">Four Corners</div>
        <div className="absolute bottom-40 right-20 text-slate-500 font-bold uppercase tracking-widest text-xs opacity-60">Celebration</div>

        {/* Markers Container */}
        <div className="absolute inset-0">
            
            {/* Property Markers */}
            {properties.map(prop => {
                const pos = getPosition(prop.coordinates.lat, prop.coordinates.lng);
                return (
                    <div 
                        key={prop.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer hover:z-50"
                        style={pos}
                    >
                        <div className="relative">
                            {/* Cluster Badge Mock */}
                            {/* <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center z-10 border border-white">1</div> */}
                            
                            <div className="w-10 h-10 bg-slate-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white transition-transform group-hover:scale-110">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                            </div>
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white px-2 py-1 rounded shadow-md text-xs font-bold text-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {prop.title}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Staff Markers */}
            {staffList.map(staff => {
                const pos = getPosition(staff.coordinates.lat, staff.coordinates.lng);
                return (
                    <div 
                        key={staff.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer hover:z-50 z-20"
                        style={pos}
                    >
                        <div className="relative">
                            <div className={`w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold transition-transform group-hover:scale-110 ${staff.avatarColor}`}>
                                {staff.initials}
                            </div>
                            {/* Status Dot */}
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${staff.isWorking ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white px-2 py-1 rounded shadow-md text-xs font-bold text-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {staff.name}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="w-9 h-9 bg-white rounded shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            </button>
            <button className="w-9 h-9 bg-white rounded shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
        </div>

        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
             <button className="w-9 h-9 bg-white rounded shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
             <button className="w-9 h-9 bg-white rounded shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
            </button>
        </div>

        {/* Attribution Mock */}
        <div className="absolute bottom-1 right-20 text-[10px] text-slate-500 bg-white/50 px-1 rounded pointer-events-none">
            Map data ©2025 Google
        </div>
        <div className="absolute bottom-1 left-2 text-[14px] font-bold text-slate-400 pointer-events-none">Google</div>
    </div>
  );
};
