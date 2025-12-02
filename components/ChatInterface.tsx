import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ChatInterfaceProps {
  onStartBuilder: (prompt: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onStartBuilder }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Gradient Spotlights for Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-3xl z-10 flex flex-col gap-10 animate-fade-in-up items-center">
        
        {/* Futuristic CPU Box Image */}
        <div className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 group transition-all duration-500 hover:shadow-blue-900/20 hover:border-zinc-700">
             <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30 mix-blend-overlay z-10 pointer-events-none" />
             <img 
                 src="https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2070&auto=format&fit=crop" 
                 alt="Futuristic CPU" 
                 className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8 z-20">
                 <div className="flex items-center gap-3 mb-2">
                     <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                     <span className="text-green-400 text-xs font-mono font-bold tracking-widest uppercase">System Online</span>
                 </div>
                 <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter drop-shadow-xl">
                     BUILD YOUR LEGACY
                 </h2>
             </div>
        </div>

        {/* Start Button Area (Replaces Input) */}
        <div className="w-full flex justify-center">
             <button 
                onClick={() => onStartBuilder("Start")}
                className="group relative flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-bold text-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] ring-4 ring-white/10"
              >
                <span>Start Building</span>
                <ArrowRight size={24} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
              </button>
        </div>

      </div>
    </div>
  );
};

export default ChatInterface;