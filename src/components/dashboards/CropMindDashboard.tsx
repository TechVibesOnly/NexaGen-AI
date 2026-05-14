import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { 
  Wheat, Droplets, Bug, AlertTriangle, MessageSquare, Send, Sparkles, 
  Map as MapIcon, ChevronRight, Thermometer, Wind, MousePointer2 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SOIL_DATA = [
  { subject: 'Nitrogen', A: 120, fullMark: 150 },
  { subject: 'Phosphorus', A: 98, fullMark: 150 },
  { subject: 'Potassium', A: 86, fullMark: 150 },
  { subject: 'Moisture', A: 99, fullMark: 150 },
  { subject: 'pH Level', A: 85, fullMark: 150 },
  { subject: 'Organic', A: 65, fullMark: 150 },
];

export const CropMindDashboard = ({ isDemoMode }: { isDemoMode?: boolean }) => {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'analytics' | 'satellite'>('analytics');
  const [waterSaved, setWaterSaved] = useState(12480);
  const [chatMessages, setChatMessages] = useState<{role: 'ai' | 'user', content: string}[]>([
    { role: 'ai', content: "Yield forecast for Sector 7-B updated. Optimal harvest window: Sept 12-15." }
  ]);
  const [input, setInput] = useState('');

  // Counter effect for water savings
  useEffect(() => {
    const timer = setInterval(() => {
      setWaterSaved(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleChat = async () => {
    if (!input.trim()) return;
    const msg = input;
    setInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    
    if (isDemoMode) {
        setTimeout(() => {
            setChatMessages(prev => [...prev, { 
                role: 'ai', 
                content: `Telemetry Analysis: Cross-referencing '${msg}' with multispectral imagery. Chlorophyll levels in Sector 1 indicate peak metabolic efficiency. Yield optimization: Verified.` 
            }]);
        }, 500);
        return;
    }

    try {
        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `You are CropMind AI. Answer this farmer's question precisely: ${msg}`,
        });
        setChatMessages(prev => [...prev, { role: 'ai', content: result.text || "Connection stable. Data retrieved." }]);
    } catch (e) {
        setChatMessages(prev => [...prev, { role: 'ai', content: "Offline buffer engaged. Syncing with regional node..." }]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      
      {/* 1. Field Map & Overview (8 Cols) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-8 space-y-8"
      >
        <motion.div 
          className="glass overflow-hidden rounded-[3rem] border-emerald-500/10 bg-emerald-950/20 relative h-[600px] premium-shadow shadow-2xl"
        >
          <div className="absolute top-8 left-8 z-20 flex flex-col gap-4">
            <div className="glass px-5 py-2.5 rounded-2xl flex items-center gap-3 border-white/5 backdrop-blur-3xl shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Field Telemetry v2.48</span>
            </div>
            
            <div className="flex bg-navy-900/80 p-1 rounded-2xl border border-white/5 backdrop-blur-xl shadow-2xl">
                <button 
                  onClick={() => setViewMode('analytics')}
                  className={cn("px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all", viewMode === 'analytics' ? "bg-white text-navy-950 shadow-xl" : "text-slate-400 hover:text-white")}
                >
                  Analytics
                </button>
                <button 
                  onClick={() => setViewMode('satellite')}
                  className={cn("px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all", viewMode === 'satellite' ? "bg-white text-navy-950 shadow-xl" : "text-slate-400 hover:text-white")}
                >
                  Satellite
                </button>
            </div>
          </div>

          <div className="absolute top-8 right-8 z-20">
             <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <MousePointer2 className="w-3 h-3" /> Select Sector
             </div>
          </div>

          {/* Simulated Map using SVG Polygons */}
          <div className="absolute inset-0 flex items-center justify-center p-12 transition-all duration-700">
            {viewMode === 'satellite' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 grayscale contrast-125 opacity-30 pointer-events-none"
              >
                <img 
                  src="https://picsum.photos/seed/agri_satellite/1200/800" 
                  className="w-full h-full object-cover" 
                  alt="Satellite View"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            )}
            <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow-[0_0_50px_rgba(16,185,129,0.1)] relative z-10">
              {[
                { id: 'S1', points: "100,100 350,150 320,400 80,350", health: 'optimal' },
                { id: 'S2', points: "360,150 650,100 720,350 330,410", health: 'warning' },
                { id: 'S3', points: "325,415 725,355 680,550 280,520", health: 'optimal' },
                { id: 'S4', points: "85,355 315,415 275,525 50,500", health: 'critical' }
              ].map((field, idx) => (
                <motion.polygon
                  key={field.id}
                  points={field.points}
                  initial={{ opacity: 0.4, scale: 0.95 }}
                  animate={{ opacity: activeField === field.id ? 1 : 0.6, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ 
                    opacity: 1, 
                    scale: 1.01,
                    strokeWidth: 2,
                  }}
                  onClick={() => setActiveField(field.id)}
                  className={cn(
                    "cursor-pointer transition-all duration-500",
                    field.health === 'optimal' ? "fill-emerald-500/20 stroke-emerald-500/40" : 
                    field.health === 'warning' ? "fill-amber-500/20 stroke-amber-500/40" : 
                    "fill-rose-500/20 stroke-rose-400/40",
                    activeField === field.id && "stroke-white fill-emerald-500/40 shadow-2xl"
                  )}
                />
              ))}
            </svg>
          </div>

          <AnimatePresence>
            {activeField && (
              <motion.div 
                initial={{ x: 40, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 40, opacity: 0, scale: 0.9 }}
                className="absolute top-24 right-8 w-72 glass p-8 rounded-[2.5rem] border-emerald-500/20 backdrop-blur-3xl shadow-2xl z-30"
              >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Bug className="text-emerald-400 w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold tracking-tight">Sector {activeField}</h4>
                        <div className="text-[9px] uppercase font-black text-emerald-400 tracking-widest">Active Analysis</div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    {[
                        { label: 'Soil Vitality', val: '94%', color: 'emerald' },
                        { label: 'Leaf Index', val: '4.2 NDVI', color: 'emerald' },
                        { label: 'Water stress', val: 'Minimal', color: 'emerald' },
                        { label: 'Pest risk', val: 'Low', color: 'emerald' }
                    ].map((row) => (
                        <div key={row.label} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-all">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{row.label}</span>
                            <span className={cn("text-xs font-black", `text-${row.color}-400`)}>{row.val}</span>
                        </div>
                    ))}
                </div>
                
                <button className="w-full mt-8 py-3 rounded-xl bg-emerald-500 text-navy-950 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                    Full Telemetry Audit
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end opacity-60">
             <div className="text-[8px] font-black text-white/50 uppercase tracking-[0.4em] transform -rotate-90 origin-left">Coordinate Grid System.34L.89K</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2. Yield Predictor */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-[2.5rem] border-white/5 bg-gradient-to-br from-emerald-900/10 to-transparent shadow-2xl"
            >
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Yield Predictor</h3>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-black">AI Accuracy: 94.2%</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                        <Sparkles className="text-gold-500 w-6 h-6" />
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                strokeDasharray="251.2" strokeDashoffset="50" strokeLinecap="round"
                                className="text-gold-500 transform -rotate-90 origin-center transition-all duration-1000" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-white">82%</span>
                            <span className="text-[8px] uppercase font-bold text-slate-500">Confidence</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-white italic">+22.4%</div>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-[150px]">Projected yield increase vs seasonal baseline for Sector 1-4.</p>
                    </div>
                </div>
            </motion.div>

            {/* 3. Soil Health Radar */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-[2.5rem] border-white/5 shadow-2xl"
            >
                <h3 className="text-sm uppercase font-bold tracking-[0.2em] text-slate-500 mb-6">Soil Biome Analysis</h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SOIL_DATA}>
                            <PolarGrid stroke="#ffffff10" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff50', fontSize: 10 }} />
                            <Radar name="Current" dataKey="A" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.4} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
      </motion.div>

      {/* 4. Sidebar Panels (4 Cols) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-4 space-y-6"
      >
        
        {/* Pest Warning */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass p-6 rounded-[2rem] border-rose-500/20 bg-rose-500/5 shadow-xl shadow-rose-500/5"
        >
           <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center animate-pulse">
                   <AlertTriangle className="text-white w-5 h-5" />
               </div>
               <div>
                   <h3 className="text-lg font-bold text-white">Pest Alert</h3>
                   <p className="text-[10px] text-rose-300 uppercase font-black tracking-widest">Early Detection Sector 4</p>
               </div>
           </div>
           <div className="space-y-3">
               <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                   <div className="flex justify-between items-center mb-1">
                       <span className="text-xs font-bold text-white">Fall Armyworm Risk</span>
                       <Bug className="text-rose-400 w-4 h-4" />
                   </div>
                   <div className="w-full bg-white/5 rounded-full h-1 mt-2">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "88%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-rose-500 h-full rounded-full" 
                       />
                   </div>
               </div>
               <button className="w-full py-3 rounded-xl bg-white/5 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                   Deploy Target Spraying
               </button>
           </div>
        </motion.div>

        {/* Irrigation Optimizer */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass p-8 rounded-[2.5rem] border-sky-500/20 bg-gradient-to-br from-sky-900/10 to-transparent relative overflow-hidden shadow-2xl"
        >
            <div className="flex items-center gap-3 mb-6">
                <Droplets className="text-sky-400 w-6 h-6" />
                <h3 className="text-xl font-bold text-white">Water Optimization</h3>
            </div>
            <div className="text-5xl font-black text-sky-300 tracking-tighter mb-2">{waterSaved.toLocaleString()}<span className="text-xl ml-1">L</span></div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">Saved this cycle (34% Reduction)</p>
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <motion.div 
                        key={i}
                        animate={{ height: [10, 30, 10] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                        className="w-1.5 rounded-full bg-sky-500/50"
                    />
                ))}
            </div>
        </motion.div>

        {/* SMS/WhatsApp Comm Hub */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[2rem] border-white/10 overflow-hidden h-[400px] flex flex-col shadow-2xl"
        >
            <div className="p-6 bg-emerald-500 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-navy-900" />
                    <span className="font-bold text-navy-900 text-sm">CropMind Satellite Concierge</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-navy-900 animate-pulse" />
                </div>
            </div>
            
            <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-navy-900/50 scrollbar-hide">
                <AnimatePresence>
                  {chatMessages.map((m, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "flex flex-col max-w-[80%] p-3 rounded-xl",
                          m.role === 'user' ? "ml-auto bg-emerald-500 text-navy-900" : "glass border-emerald-500/20 text-white"
                      )}>
                          <p className="text-xs leading-relaxed">{m.content}</p>
                      </motion.div>
                  ))}
                </AnimatePresence>
            </div>

            <div className="p-4 border-t border-white/5 bg-navy-900">
                <div className="relative">
                    <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                        placeholder="Ask CropMind AI..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button 
                        onClick={handleChat}
                        className="absolute right-2 top-2 bottom-2 bg-emerald-500 p-2 rounded-lg hover:scale-110 transition-transform"
                    >
                        <Send className="w-3 h-3 text-navy-900" />
                    </button>
                </div>
            </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
