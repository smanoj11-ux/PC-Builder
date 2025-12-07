import React from 'react';
import { BuildState, ComponentType } from '../types';
import { Fan, Cpu, Power, Zap, CircuitBoard } from 'lucide-react';

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
                         <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                             {/* Background Grid Pattern */}
                             <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                             
                             {/* Standoff markings (Visual screws) */}
                             {[
                                 'top-6 left-6', 'top-6 right-6', 
                                 'bottom-6 left-6', 'bottom-6 right-6', 
                                 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                             ].map((pos, i) => (
                                 <div key={i} className={`absolute w-3 h-3 rounded-full bg-yellow-600/30 border border-yellow-600/50 ${pos}`}>
                                     <div className="absolute inset-0.5 bg-yellow-600/50 rounded-full animate-pulse"></div>
                                 </div>
                             ))}

                             {/* Main Placeholder Label - Enhanced */}
                             <div className="relative group cursor-default">
                                {/* Glowing backdrop */}
                                <div className="absolute -inset-4 bg-blue-500/10 rounded-2xl blur-xl animate-pulse-slow group-hover:bg-blue-500/20 transition-all"></div>
                                
                                <div className="relative flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-dashed border-zinc-600 bg-zinc-900/90 backdrop-blur-md shadow-2xl transition-all group-hover:border-blue-500/50 group-hover:scale-105">
                                    
                                    {/* Corner Accents */}
                                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-zinc-500 rounded-tl group-hover:border-blue-400 transition-colors"></div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-zinc-500 rounded-tr group-hover:border-blue-400 transition-colors"></div>
                                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-zinc-500 rounded-bl group-hover:border-blue-400 transition-colors"></div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-zinc-500 rounded-br group-hover:border-blue-400 transition-colors"></div>

                                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 shadow-inner group-hover:border-blue-500/30 group-hover:bg-zinc-800/80 transition-all">
                                        <CircuitBoard className="text-zinc-500 group-hover:text-blue-400 transition-colors" size={32} strokeWidth={1.5} />
                                    </div>
                                    
                                    <div className="text-center">
                                        <span className="block text-zinc-300 font-mono text-sm font-bold tracking-[0.2em] uppercase mb-2 group-hover:text-white transition-colors">Motherboard Needed</span>
                                        <span className="block text-[10px] text-zinc-500 font-medium tracking-wide bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700/50 group-hover:border-blue-500/30 group-hover:text-blue-200 transition-colors">
                                            CORE COMPONENT MISSING
                                        </span>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Cable Visualization Layer (When PSU is connected) */}
                {hasPart(ComponentType.PSU) && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
                        <defs>
                            <linearGradient id="cable-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#27272a" />
                                <stop offset="40%" stopColor="#52525b" />
                                <stop offset="60%" stopColor="#27272a" />
                                <stop offset="100%" stopColor="#18181b" />
                            </linearGradient>
                            <filter id="cable-shadow">
                                <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.7"/>
                            </filter>
                             <pattern id="cable-braid" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                                <line x1="0" y1="0" x2="0" y2="4" stroke="#000" strokeWidth="2" opacity="0.3" />
                            </pattern>
                        </defs>
                        
                        {/* Background Grommets (Where cables emerge) */}
                        <g opacity="0.6">
                            {/* ATX Grommet */}
                            <ellipse cx="85%" cy="50%" rx="2%" ry="8%" fill="#0a0a0a" stroke="#222" strokeWidth="1" />
                            {/* GPU Power Grommet (Bottom) */}
                            <ellipse cx="50%" cy="85%" rx="6%" ry="2%" fill="#0a0a0a" stroke="#222" strokeWidth="1" />
                            {/* CPU Power Grommet (Top Left) */}
                            <ellipse cx="15%" cy="5%" rx="4%" ry="2%" fill="#0a0a0a" stroke="#222" strokeWidth="1" />
                        </g>

                        {/* 24-Pin ATX Cable (Thick Main Power) */}
                        {hasPart(ComponentType.MOBO) && (
                            <g filter="url(#cable-shadow)" className="animate-scale-in">
                                {/* Connector Head on Mobo */}
                                <rect x="71%" y="42%" width="3%" height="15%" fill="#111" stroke="#333" rx="1" />
                                
                                {/* Main Bundle curving from Grommet (85%,50%) to Mobo (72%, 50%) */}
                                <path 
                                    d="M 85% 50% C 80% 50%, 78% 50%, 74% 50%" 
                                    fill="none" 
                                    stroke="url(#cable-gradient)" 
                                    strokeWidth="24" 
                                    strokeLinecap="butt"
                                />
                                {/* Braiding Texture */}
                                 <path 
                                    d="M 85% 50% C 80% 50%, 78% 50%, 74% 50%" 
                                    fill="none" 
                                    stroke="url(#cable-braid)" 
                                    strokeWidth="24" 
                                    strokeLinecap="butt"
                                    opacity="0.6"
                                />
                                {/* Cable Combs for tidy look */}
                                <rect x="78%" y="45%" width="1.5%" height="10%" rx="1" fill="#111" />
                            </g>
                        )}

                        {/* CPU Power Cable (EPS 8-pin x 2) */}
                        {hasPart(ComponentType.MOBO) && hasPart(ComponentType.CPU) && (
                            <g filter="url(#cable-shadow)" className="animate-scale-in">
                                 {/* Connector on Mobo Top Left */}
                                 <rect x="18%" y="15%" width="6%" height="4%" fill="#111" rx="1" />

                                 {/* Cable 1: From Top Grommet (15%, 5%) to Connector (20%, 15%) */}
                                <path 
                                    d="M 15% 5% Q 15% 12% 19% 15%" 
                                    fill="none" 
                                    stroke="url(#cable-gradient)" 
                                    strokeWidth="8" 
                                    strokeLinecap="round"
                                />
                                <path 
                                    d="M 15% 5% Q 15% 12% 19% 15%" 
                                    fill="none" 
                                    stroke="url(#cable-braid)" 
                                    strokeWidth="8" 
                                    strokeLinecap="round"
                                    opacity="0.5"
                                />
                                 {/* Cable 2: Slightly offset */}
                                 <path 
                                    d="M 17% 5% Q 17% 12% 22% 15%" 
                                    fill="none" 
                                    stroke="url(#cable-gradient)" 
                                    strokeWidth="8" 
                                    strokeLinecap="round"
                                />
                            </g>
                        )}

                        {/* GPU Power Cables (PCIe 8-pin x 3) */}
                        {hasPart(ComponentType.GPU) && (
                            <g filter="url(#cable-shadow)" className="animate-scale-in">
                                 {/* Cables rising from PSU Shroud Grommet (50%, 85%) to GPU side (55%, 65%) */}
                                 
                                 {/* Strand 1 */}
                                <path 
                                    d="M 48% 85% C 48% 75%, 45% 70%, 55% 65%" 
                                    fill="none" 
                                    stroke="url(#cable-gradient)" 
                                    strokeWidth="6" 
                                    strokeLinecap="round"
                                />
                                 {/* Strand 2 */}
                                 <path 
                                    d="M 50% 85% C 50% 75%, 50% 70%, 58% 65%" 
                                    fill="none" 
                                    stroke="url(#cable-gradient)" 
                                    strokeWidth="6" 
                                    strokeLinecap="round"
                                />
                                {/* Strand 3 */}
                                <path 
                                    d="M 52% 85% C 52% 75%, 55% 70%, 61% 65%" 
                                    fill="none" 
                                    stroke="url(#cable-gradient)" 
                                    strokeWidth="6" 
                                    strokeLinecap="round"
                                />
                                
                                {/* Connector Heads at GPU end */}
                                <rect x="54%" y="63%" width="2%" height="4%" fill="#111" transform="rotate(-10 54 63)" />
                                <rect x="57%" y="63%" width="2%" height="4%" fill="#111" transform="rotate(-10 57 63)" />
                                <rect x="60%" y="63%" width="2%" height="4%" fill="#111" transform="rotate(-10 60 63)" />

                                {/* Comb keeping them together */}
                                 <path d="M 48% 75% L 54% 75%" stroke="#18181b" strokeWidth="8" strokeLinecap="round" transform="rotate(-5)" />
                            </g>
                        )}
                        
                        {/* SATA Power (To Storage) */}
                        {hasPart(ComponentType.STORAGE) && (
                             <g filter="url(#cable-shadow)" className="animate-scale-in">
                                {/* From ATX Grommet area down to Storage Cage (Top Right) */}
                                <path 
                                    d="M 85% 50% C 90% 50%, 92% 35%, 88% 25%" 
                                    fill="none" 
                                    stroke="url(#cable-gradient)" 
                                    strokeWidth="10" 
                                    strokeLinecap="round"
                                />
                                 {/* SATA Connector Head */}
                                <rect x="85%" y="22%" width="8" height="12" rx="1" fill="#111" />
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