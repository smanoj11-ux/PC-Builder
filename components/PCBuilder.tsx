import React, { useState, useEffect, useMemo } from 'react';
import { ComponentType, BuildState, PCPart } from '../types';
import { getRecommendations } from '../services/geminiService';
import { ChevronRight, Check, ShoppingCart, RefreshCcw, ArrowLeft, Loader2, Sparkles, ChevronDown, Server, ExternalLink, Search, ArrowUpDown } from 'lucide-react';
import BuildVisualizer from './BuildVisualizer';

const STEPS = [
  { type: 'Intro', title: 'Start Build', description: 'Define your needs' },
  { type: ComponentType.CPU, title: 'Processor', description: 'The brain of your PC' },
  { type: ComponentType.MOBO, title: 'Motherboard', description: 'Connects everything' },
  { type: ComponentType.RAM, title: 'Memory', description: 'Multitasking power' },
  { type: ComponentType.GPU, title: 'Graphics', description: 'Gaming & Rendering' },
  { type: ComponentType.STORAGE, title: 'Storage', description: 'Space for files' },
  { type: ComponentType.PSU, title: 'Power', description: 'Energy supply' },
  { type: ComponentType.CASE, title: 'Cabinet', description: 'Housing' },
  { type: 'Summary', title: 'Complete', description: 'Review your build' },
];

const PCBuilder: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [buildState, setBuildState] = useState<BuildState>({
    budget: 'Medium (₹60k - ₹1L)',
    usage: 'Gaming & Streaming',
    parts: {},
    totalCost: 0
  });
  const [recommendations, setRecommendations] = useState<PCPart[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filter and Sort State
  const [filterQuery, setFilterQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('price-asc');

  const currentStep = STEPS[currentStepIndex];

  // Fetch recommendations when entering a component step
  useEffect(() => {
    const fetchParts = async () => {
      if (currentStep.type !== 'Intro' && currentStep.type !== 'Summary') {
        setLoading(true);
        setFilterQuery(''); // Reset filter when changing steps
        // Cast to ComponentType because we filtered out Intro/Summary in the if check
        const parts = await getRecommendations(currentStep.type as ComponentType, buildState);
        setRecommendations(parts);
        setLoading(false);
      }
    };
    fetchParts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex]);

  // Derived state for filtered and sorted parts
  const filteredAndSortedParts = useMemo(() => {
    return [...recommendations]
      .filter(part => part.name.toLowerCase().includes(filterQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [recommendations, filterQuery, sortBy]);

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
      if (currentStepIndex > 0) {
          setCurrentStepIndex(prev => prev - 1);
      }
  };

  const selectPart = (part: PCPart) => {
    setBuildState(prev => {
        const costDiff = part.price - (prev.parts[currentStep.type as ComponentType]?.price || 0);
        return {
            ...prev,
            parts: {
                ...prev.parts,
                [currentStep.type as ComponentType]: part
            },
            totalCost: prev.totalCost + costDiff
        }
    });
    handleNext();
  };

  return (
    <div className="h-screen bg-black text-zinc-100 flex flex-col lg:flex-row font-sans overflow-hidden">
      
      {/* LEFT PANEL: BIG VISUALIZER */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full bg-[#050505] flex flex-col justify-center shadow-2xl z-10 relative border-b lg:border-r border-zinc-800">
          <BuildVisualizer buildState={buildState} />
      </div>

      {/* RIGHT PANEL: WIZARD & CONTROLS */}
      <div className="flex-1 flex flex-col bg-zinc-950/50 backdrop-blur-sm relative h-[50vh] lg:h-full">
        
        {/* Progress Header */}
        <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
            <div className="flex items-center gap-4">
                {currentStepIndex > 0 && (
                    <button onClick={handleBack} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </button>
                )}
                <div>
                    <h1 className="text-lg font-bold text-white flex items-center gap-2">
                        {currentStep.title}
                        {loading && <Loader2 size={14} className="animate-spin text-blue-500" />}
                    </h1>
                    <p className="text-xs text-zinc-500">{currentStep.description}</p>
                </div>
            </div>
            <div className="text-right">
                <span className="text-xs font-mono text-blue-500 font-bold">STEP {currentStepIndex + 1}/{STEPS.length}</span>
                <div className="w-32 h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                    <div 
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
            
            {/* INTRO STEP */}
            {currentStep.type === 'Intro' && (
                <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">Let's build your dream PC.</h2>
                        <p className="text-zinc-400">Select your primary usage to optimize components.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                             onClick={() => setBuildState(p => ({...p, usage: "Gaming", budget: "Medium"}))}
                             className={`p-6 rounded-2xl border text-left transition-all ${buildState.usage === 'Gaming' ? 'bg-blue-900/10 border-blue-500 ring-1 ring-blue-500/50' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}
                        >
                            <span className="text-blue-400 mb-4 block"><Sparkles size={24} /></span>
                            <h3 className="font-bold text-lg mb-1">Gaming</h3>
                            <p className="text-sm text-zinc-500">High refresh rates, ray tracing, and streaming.</p>
                        </button>
                         <button 
                             onClick={() => setBuildState(p => ({...p, usage: "Workstation", budget: "High"}))}
                             className={`p-6 rounded-2xl border text-left transition-all ${buildState.usage === 'Workstation' ? 'bg-purple-900/10 border-purple-500 ring-1 ring-purple-500/50' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}
                        >
                            <span className="text-purple-400 mb-4 block"><Server size={24} /></span>
                            <h3 className="font-bold text-lg mb-1">Workstation</h3>
                            <p className="text-sm text-zinc-500">Video editing, 3D rendering, and heavy multitasking.</p>
                        </button>
                    </div>

                    <div className="mt-8">
                        <label className="block text-sm font-medium text-zinc-400 mb-3">Target Budget (INR)</label>
                        <div className="relative">
                            <select 
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-white appearance-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                value={buildState.budget}
                                onChange={(e) => setBuildState(p => ({...p, budget: e.target.value}))}
                            >
                                <option>Entry Level (₹30k - ₹50k)</option>
                                <option>Medium (₹60k - ₹1L)</option>
                                <option>High End (₹1.5L - ₹2.5L)</option>
                                <option>Enthusiast (₹3L+)</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={20} />
                        </div>
                    </div>

                    <button onClick={handleNext} className="w-full mt-8 bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 transform active:scale-95 shadow-lg shadow-white/10">
                        Start Building <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* SELECTION STEPS */}
            {currentStep.type !== 'Intro' && currentStep.type !== 'Summary' && (
                <div className="max-w-4xl mx-auto">
                    
                    {/* Filter and Sort Controls */}
                    {!loading && recommendations.length > 0 && (
                        <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in-up">
                            {/* Search Bar */}
                            <div className="relative flex-1 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search parts..."
                                    value={filterQuery}
                                    onChange={(e) => setFilterQuery(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:bg-zinc-900/80 transition-all"
                                />
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative min-w-[180px] group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                                    <ArrowUpDown size={16} />
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-10 py-3 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 focus:bg-zinc-900/80 appearance-none cursor-pointer transition-all"
                                >
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="name">Name: A - Z</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={14} />
                            </div>
                        </div>
                    )}

                    {loading ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 bg-zinc-900/30 rounded-2xl animate-pulse border border-zinc-800/50 flex flex-col p-6 gap-4">
                                    <div className="w-1/2 h-6 bg-zinc-800 rounded"></div>
                                    <div className="w-full flex-1 bg-zinc-800/50 rounded-xl"></div>
                                    <div className="w-1/3 h-8 bg-zinc-800 rounded"></div>
                                </div>
                            ))}
                         </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                            {filteredAndSortedParts.length > 0 ? (
                                filteredAndSortedParts.map((part) => (
                                    <div 
                                        key={part.id} 
                                        onClick={() => selectPart(part)}
                                        className="group relative bg-zinc-900/40 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900/60 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-lg text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-2">{part.name}</h3>
                                            <span className="shrink-0 bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-full text-sm font-mono text-zinc-300 group-hover:border-blue-500/30">
                                                ₹{part.price.toLocaleString('en-IN')}
                                            </span>
                                        </div>

                                        <div className="space-y-2 mb-6">
                                            {part.specs && Object.entries(part.specs).slice(0, 3).map(([key, val]) => (
                                                <div key={key} className="flex justify-between text-xs border-b border-zinc-800/50 pb-1.5">
                                                    <span className="text-zinc-500 uppercase font-medium tracking-wider">{key.replace('_', ' ')}</span>
                                                    <span className="text-zinc-300">{val}</span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
                                            <div className="flex items-center gap-2">
                                                {part.compatibilityNote ? (
                                                     <div className="text-[10px] text-green-400 flex items-center gap-1.5 bg-green-900/10 px-2 py-1 rounded border border-green-900/30">
                                                         <Check size={10} /> Compatible
                                                     </div>
                                                ) : <div></div>}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {/* Amazon Affiliate Link Button */}
                                                <a 
                                                    href={part.amazonLink} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-[#FF9900] hover:text-black transition-all hover:scale-110 shadow-lg"
                                                    title="View on Amazon"
                                                >
                                                    <ShoppingCart size={14} />
                                                </a>

                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                    <ChevronRight size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center text-zinc-500">
                                    <p>No parts found matching your search.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* SUMMARY STEP */}
            {currentStep.type === 'Summary' && (
                <div className="max-w-3xl mx-auto animate-fade-in-up pb-20">
                     <div className="bg-white text-black rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-1 tracking-tight">Build Manifest</h2>
                            <p className="text-gray-500 mb-8 font-mono text-sm uppercase">Reference: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                            
                            <div className="space-y-4 mb-8">
                                {(Object.entries(buildState.parts) as [string, PCPart][]).map(([type, part]) => (
                                    <div key={type} className="flex justify-between items-center border-b border-gray-200 pb-3 group">
                                        <div>
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{type}</div>
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium text-lg leading-tight">{part?.name}</div>
                                                <a 
                                                    href={part?.amazonLink}
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="opacity-0 group-hover:opacity-100 text-[#FF9900] hover:scale-110 transition-all"
                                                    title="Buy on Amazon"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="font-mono font-bold">₹{part?.price.toLocaleString('en-IN')}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-end pt-4 border-t-2 border-black">
                                <span className="font-bold text-gray-500">TOTAL ESTIMATE</span>
                                <span className="text-4xl font-bold tracking-tighter">₹{buildState.totalCost.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                     </div>

                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
                         <button onClick={() => window.open(`https://www.amazon.in/s?k=${encodeURIComponent((Object.values(buildState.parts) as PCPart[]).map(p => p?.name).join(' '))}`, '_blank')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                             <ShoppingCart size={20} /> Buy All on Amazon
                         </button>
                         <button onClick={() => window.location.reload()} className="flex-none bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all">
                             <RefreshCcw size={20} /> New Build
                         </button>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PCBuilder;