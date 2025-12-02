import React from 'react';
import { BuildState, ComponentType } from '../types';
import { Fan, Cpu, Disc, Power, HardDrive, Zap, CircuitBoard } from 'lucide-react';

interface BuildVisualizerProps {
  buildState: BuildState;
}

const BuildVisualizer: React.FC<BuildVisualizerProps> = ({ buildState }) => {
  const hasPart = (type: ComponentType) => !!buildState.parts[type];
  
  // Helper to get part details if it exists
  const getPart = (type: ComponentType) => buildState.parts[type];

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-[#050505]">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black pointer-events-none" />
      
      {/* Header / Stats Bar - Bigger and Clearer */}
      <div className="absolute top-0 left-0 right-0 p-8 z-20 flex justify-between items-start pointer-events-none">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3 drop-shadow-2xl">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_#22c55e]"></span>
            System Architect
          </h2>
          <p className="text-zinc-400 text-sm font-bold font-mono mt-2 ml-6 tracking-widest opacity-80">
             MODE: {buildState.usage.toUpperCase()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-2xl tracking-tight">
             ₹{(buildState.totalCost / 1000).toFixed(1)}k
          </div>
          <p className="text-zinc-500 text-xs font-bold font-mono mt-1 tracking-widest">ESTIMATED TOTAL</p>
        </div>
      </div>

      {/* Main Case Container - Responsive & Large */}
      <div className="flex-1 w-full h-full flex items-center justify-center p-8 mt-12">
        
        {/* The PC Case Chassis - Scaled Up */}
        <div className="relative w-full max-w-[600px] aspect-[0.7] border-[6px] border-zinc-800 rounded-[3rem] bg-black shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden ring-1 ring-zinc-700/50">
            
            {/* Glass Side Panel Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-10 pointer-events-none rounded-[2.5rem]" />
            
            {/* Top Fans Area */}
            <div className="h-[12%] border-b border-zinc-800 flex justify-center items-center gap-10 bg-zinc-900/30">
                <Fan className="text-zinc-600 animate-spin-slow" size={48} strokeWidth={1.5} />
                <Fan className="text-zinc-600 animate-spin-slow" style={{animationDelay: '1s'}} size={48} strokeWidth={1.5} />
            </div>

            {/* Main Components Area */}
            <div className="flex-1 relative p-8">
                
                {/* Motherboard Backplate */}
                <div className={`absolute top-8 bottom-32 left-8 right-40 border-2 ${hasPart(ComponentType.MOBO) ? 'border-zinc-700 bg-zinc-900/80' : 'border-zinc-800 border-dashed bg-zinc-900/5'} rounded-xl transition-all duration-500`}>
                    
                    {hasPart(ComponentType.MOBO) && (
                        <>
                             {/* Circuit Lines */}
                             <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
                             
                             {/* CPU Socket */}
                             <div className={`absolute top-[20%] left-1/2 -translate-x-1/2 w-32 h-32 border-2 ${hasPart(ComponentType.CPU) ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)] bg-zinc-800' : 'border-zinc-700 border-dashed'} rounded-lg transition-all duration-500 flex items-center justify-center`}>
                                 {hasPart(ComponentType.CPU) ? (
                                     <div className="w-full h-full p-2 animate-scale-in relative">
                                         <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-600 rounded flex items-center justify-center relative overflow-hidden border border-zinc-500 z-10">
                                             <Cpu className="text-blue-400 relative z-10" size={48} />
                                         </div>
                                         {/* CPU Cooler Fan - Subtle Spin */}
                                         <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                              {/* Spinning Ring */}
                                             <div className="absolute w-[110%] h-[110%] border border-blue-400/20 border-dashed rounded-full animate-spin-slow"></div>
                                              {/* Spinning Fan Blades */}
                                             <Fan className="text-blue-400/10 w-full h-full p-2 animate-spin-slow" />
                                         </div>
                                     </div>
                                 ) : (
                                     <span className="text-xs text-zinc-600 font-mono font-bold">CPU</span>
                                 )}
                             </div>

                             {/* RAM Slots with Staggered Animation */}
                             <div className="absolute top-[20%] right-6 w-16 h-40 flex gap-2 justify-center">
                                 {[0, 1, 2, 3].map(i => (
                                     <div 
                                         key={i} 
                                         className={`relative w-3 h-full rounded-sm border transition-all duration-500 overflow-hidden ${
                                             hasPart(ComponentType.RAM) 
                                             ? 'border-purple-400/80 shadow-[0_0_15px_rgba(192,38,211,0.5)]' 
                                             : 'border-zinc-700 bg-zinc-800'
                                         }`}
                                     >
                                        {hasPart(ComponentType.RAM) && (
                                            <div 
                                                className="absolute inset-0 bg-gradient-to-t from-purple-900 via-fuchsia-400 to-purple-900 animate-pulse"
                                                style={{ 
                                                    animationDuration: '2s', 
                                                    animationDelay: `${i * 0.25}s`,
                                                    opacity: 0.8
                                                }}
                                            />
                                        )}
                                     </div>
                                 ))}
                                 {!hasPart(ComponentType.RAM) && <span className="absolute -bottom-6 text-[10px] text-zinc-600 font-mono font-bold">DIMM</span>}
                             </div>

                             {/* GPU Slot (PCIe) */}
                             <div className="absolute top-[65%] left-4 right-4 h-6 bg-zinc-800 rounded border border-zinc-700 flex items-center px-2 z-10">
                                 <div className="w-full h-1.5 bg-black rounded-full shadow-inner"></div>
                             </div>
                        </>
                    )}

                    {!hasPart(ComponentType.MOBO) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                             {/* Background Grid Pattern */}
                             <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                             
                             {/* Standoff markings (Visual screws) */}
                             {[
                                 'top-6 left-6', 'top-6 right-6', 
                                 'bottom-6 left-6', 'bottom-6 right-6', 
                                 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                             ].map((pos, i) => (
                                 <div key={i} className={`absolute w-2 h-2 rounded-full bg-yellow-900/40 ring-1 ring-yellow-700/30 ${pos}`}></div>
                             ))}

                             {/* Main Placeholder Label */}
                             <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 backdrop-blur-sm shadow-xl">
                                <CircuitBoard className="text-zinc-600 animate-pulse-slow" size={40} strokeWidth={1} />
                                <div className="text-center">
                                    <span className="block text-zinc-400 font-mono text-xs font-bold tracking-[0.2em] uppercase mb-1">Mainboard Area</span>
                                    <span className="block text-[10px] text-zinc-600 font-medium tracking-wide">SELECT MOTHERBOARD TO BEGIN</span>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Cable Visualization Layer (When PSU is connected) */}
                {hasPart(ComponentType.PSU) && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                        <defs>
                            <linearGradient id="cable-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#27272a" />
                                <stop offset="50%" stopColor="#3f3f46" />
                                <stop offset="100%" stopColor="#27272a" />
                            </linearGradient>
                            <filter id="cable-shadow">
                                <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.8"/>
                            </filter>
                        </defs>
                        
                        {/* 24-Pin ATX Cable (To Right Side of Mobo) */}
                        {hasPart(ComponentType.MOBO) && (
                            <g filter="url(#cable-shadow)" className="animate-scale-in">
                                <path 
                                    d="M 80% 80% C 80% 65%, 75% 60%, 72% 50%" 
                                    fill="none" 
                                    stroke="url(#cable-gradient)" 
                                    strokeWidth="10" 
                                    strokeLinecap="round"
                                />
                                {/* Sleeving texture */}
                                <path 
                                    d="M 80% 80% C 80% 65%, 75% 60%, 72% 50%" 
                                    fill="none" 
                                    stroke="black" 
                                    strokeWidth="10" 
                                    strokeDasharray="2 3"
                                    strokeOpacity="0.3"
                                />
                            </g>
                        )}

                        {/* CPU Power Cable (Top Left routing) */}
                        {hasPart(ComponentType.MOBO) && hasPart(ComponentType.CPU) && (
                            <g filter="url(#cable-shadow)" className="animate-scale-in">
                                <path 
                                    d="M 10% 5% Q 12% 12% 25% 20%" 
                                    fill="none" 
                                    stroke="url(#cable-gradient)" 
                                    strokeWidth="5" 
                                    strokeLinecap="round"
                                />
                                <path 
                                    d="M 10% 5% Q 12% 12% 25% 20%" 
                                    fill="none" 
                                    stroke="black" 
                                    strokeWidth="5" 
                                    strokeDasharray="1 2"
                                    strokeOpacity="0.3"
                                />
                            </g>
                        )}

                        {/* GPU Power Cable (From bottom to GPU) */}
                        {hasPart(ComponentType.GPU) && (
                            <g filter="url(#cable-shadow)" className="animate-scale-in">
                                <path 
                                    d="M 55% 82% Q 55% 75% 50% 65%" 
                                    fill="none" 
                                    stroke="url(#cable-gradient)" 
                                    strokeWidth="8" 
                                    strokeLinecap="round"
                                />
                                <path 
                                    d="M 55% 82% Q 55% 75% 50% 65%" 
                                    fill="none" 
                                    stroke="black" 
                                    strokeWidth="8" 
                                    strokeDasharray="2 2"
                                    strokeOpacity="0.3"
                                />
                            </g>
                        )}
                    </svg>
                )}

                {/* GPU (Graphics Card) - Updated styling */}
                <div className={`absolute top-[55%] left-10 right-16 h-28 ${hasPart(ComponentType.GPU) ? 'opacity-100' : 'opacity-0'} transition-all duration-700 z-20`}>
                    {hasPart(ComponentType.GPU) && (
                         <div className="relative w-full h-full animate-scale-in">
                             {/* Connector Tab (Visualizing connection to PCIe slot) */}
                             <div className="absolute -bottom-2 left-10 w-2/3 h-4 bg-yellow-600/60 rounded-b opacity-80 z-0"></div>

                             {/* Main GPU Body */}
                             <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-800 rounded-lg border border-zinc-700 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden group ring-1 ring-white/10 z-10">
                                 
                                 {/* Top decorative bar / branding */}
                                 <div className="h-6 bg-black/40 border-b border-zinc-700 flex items-center justify-between px-4">
                                     <div className="flex gap-1 items-center">
                                         <div className="w-12 h-1 bg-zinc-600 rounded-full"></div>
                                         <div className="w-2 h-1 bg-zinc-600 rounded-full"></div>
                                     </div>
                                     <div className="flex items-center gap-2">
                                        <Zap size={10} className="text-yellow-500 fill-yellow-500" />
                                        <span className="text-[10px] font-black text-zinc-500 tracking-[0.2em] group-hover:text-white transition-colors">GEFORCE RTX</span>
                                     </div>
                                 </div>

                                 {/* Fans Section with Heatsink Details */}
                                 <div className="flex-1 flex items-center justify-around px-2 relative bg-zinc-900">
                                     {/* Heatsink fins background pattern */}
                                     <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, #000 2px, #000 4px)'}}></div>

                                     {[0, 1, 2].map((i) => (
                                         <div key={i} className="relative w-16 h-16 bg-black rounded-full border border-zinc-800 flex items-center justify-center shadow-inner group-hover:border-zinc-600 transition-colors">
                                             <Fan className={`text-zinc-600 w-14 h-14 ${i === 1 ? 'animate-spin-reverse' : 'animate-spin-slow'}`} strokeWidth={1.5} />
                                             {/* Hub Sticker */}
                                             <div className="absolute w-5 h-5 bg-zinc-800 rounded-full border border-zinc-700 z-10 flex items-center justify-center">
                                                 <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full"></div>
                                             </div>
                                         </div>
                                     ))}
                                 </div>

                                 {/* RGB Strip */}
                                 <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-80 shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse-slow"></div>
                             </div>

                             {/* Heatpipes (Visual detail on top) */}
                             <div className="absolute -top-1 left-20 right-20 h-2 flex justify-center gap-2 opacity-50">
                                 <div className="w-full h-1 bg-amber-700 rounded-full"></div>
                                 <div className="w-3/4 h-1 bg-amber-700 rounded-full"></div>
                             </div>
                         </div>
                    )}
                </div>
                
                {/* Drive Cage / Storage Area (Revised) */}
                <div className="absolute top-24 right-8 w-24 flex flex-col gap-3 z-10">
                    {/* Drive Cage Frame */}
                    <div className="absolute -inset-2 border border-zinc-800/50 rounded-xl bg-zinc-900/10 pointer-events-none"></div>
                    <div className="text-[9px] text-zinc-600 font-mono font-bold text-center tracking-wider mb-1 relative z-10">DRIVE CAGE</div>
                    
                    {/* Slot 1: Primary Storage (Active if selected) */}
                    <div className={`relative h-14 w-full rounded-md border-2 transition-all duration-500 flex items-center justify-center overflow-hidden z-10 ${
                        hasPart(ComponentType.STORAGE)
                        ? 'bg-zinc-800 border-emerald-500/30 shadow-lg'
                        : 'bg-transparent border-zinc-800 border-dashed'
                    }`}>
                        {hasPart(ComponentType.STORAGE) ? (
                            <div className="w-full h-full relative group animate-scale-in">
                                {/* SSD Body */}
                                <div className="absolute inset-1 bg-zinc-900 rounded border border-zinc-700 flex flex-row items-center pl-2 gap-2">
                                     <div className="w-1 h-8 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                                     <div className="flex-1">
                                         <div className="h-1.5 w-10 bg-zinc-600 rounded-full mb-1.5"></div>
                                         <div className="h-1 w-6 bg-zinc-700 rounded-full"></div>
                                     </div>
                                     {/* SATA Connector visual */}
                                     <div className="h-6 w-1 bg-amber-600/80 rounded-l mr-1"></div>
                                </div>
                                {/* Activity LED */}
                                <div className="absolute top-2 right-3 w-1 h-1 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
                                <div className="absolute bottom-1 right-2 text-[8px] text-zinc-500 font-mono">SSD</div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center opacity-40">
                                <span className="text-[8px] text-zinc-500 font-mono uppercase">Bay 1</span>
                            </div>
                        )}
                    </div>

                    {/* Slot 2: Empty/Expansion */}
                    <div className="relative h-14 w-full rounded-md border-2 border-zinc-800 border-dashed flex items-center justify-center opacity-30 z-10">
                        <span className="text-[8px] text-zinc-600 font-mono uppercase">Bay 2</span>
                    </div>
                </div>

                {/* PSU Shroud (Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-zinc-900 border-t border-zinc-800 flex items-center pl-10 shadow-inner">
                     <div className={`w-40 h-20 border-2 ${hasPart(ComponentType.PSU) ? 'border-yellow-600/50 bg-gradient-to-r from-zinc-800 to-zinc-900' : 'border-zinc-800 border-dashed'} rounded-lg flex items-center justify-center transition-all duration-500`}>
                         {hasPart(ComponentType.PSU) ? (
                             <div className="flex items-center gap-3 animate-scale-in">
                                 <Power size={28} className="text-yellow-500" />
                                 <div className="flex flex-col">
                                     <span className="text-xs font-black text-zinc-300 tracking-wider">POWER</span>
                                     <span className="text-[8px] text-zinc-500">SUPPLY UNIT</span>
                                 </div>
                             </div>
                         ) : (
                             <span className="text-xs text-zinc-700 font-bold">PSU SLOT</span>
                         )}
                     </div>
                     {/* Cable Management Grommets */}
                     <div className="ml-auto mr-12 flex gap-3 opacity-50">
                         <div className="w-3 h-12 bg-black rounded-full border border-zinc-800"></div>
                         <div className="w-3 h-12 bg-black rounded-full border border-zinc-800"></div>
                     </div>
                </div>

                {/* RGB Strips (Decorative) - Brighter */}
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-40 blur-[2px]"></div>
                <div className="absolute top-0 bottom-0 right-0 w-1.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-40 blur-[2px]"></div>

            </div>
        </div>

        {/* Floating Particles / Dust Effect (Subtle) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
             {[...Array(8)].map((_, i) => (
                 <div key={i} className="absolute w-1 h-1 bg-blue-500/20 rounded-full animate-float" style={{
                     left: `${Math.random() * 100}%`,
                     top: `${Math.random() * 100}%`,
                     animationDelay: `${Math.random() * 5}s`,
                     animationDuration: `${5 + Math.random() * 5}s`
                 }} />
             ))}
        </div>

      </div>

      {/* Footer / Case Info */}
      <div className="p-4 border-t border-zinc-900 bg-black text-center z-20">
          <p className="text-zinc-600 text-xs font-mono uppercase tracking-[0.2em]">
              {buildState.parts[ComponentType.CASE]?.name || "CHASSIS UNINITIALIZED"}
          </p>
      </div>

    </div>
  );
};

export default BuildVisualizer;