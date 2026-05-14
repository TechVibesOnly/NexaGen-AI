import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, Cell
} from 'recharts';
import { 
  HardHat, Construction, AlertCircle, Clock, DollarSign, 
  Layers, Users, Activity, Play, ShieldAlert, CheckCircle2,
  ChevronRight, Box, Camera, Send
} from 'lucide-react';
import { cn } from '../../lib/utils';

const MATERIAL_DATA = [
  { name: 'Steel', stock: 85, predicted: 95 },
  { name: 'Concrete', stock: 40, predicted: 60 },
  { name: 'Glass', stock: 65, predicted: 70 },
  { name: 'Lumber', stock: 30, predicted: 85 },
];

const SUBCONTRACTOR_SCORES = [
  { name: 'Apex Electrical', score: 94, status: 'On Track' },
  { name: 'Prime Plumbing', score: 78, status: 'Delayed' },
  { name: 'Foundation Co', score: 88, status: 'On Track' },
  { name: 'SteelWorks', score: 91, status: 'On Track' },
];

export const BuildIQDashboard = ({ isDemoMode }: { isDemoMode?: boolean }) => {
  const [activeCam, setActiveCam] = useState(1);
  const [detections, setDetections] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<{role: 'ai' | 'user', content: string}[]>([
    { role: 'ai', content: "Structural Phase 4 initialized. Monitoring steel procurement and CV safety feeds." }
  ]);
  const [input, setInput] = useState('');
  
  const handleChat = async () => {
    if (!input.trim()) return;
    const msg = input;
    setInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    
    if (isDemoMode) {
        setTimeout(() => {
            setChatMessages(prev => [...prev, { 
                role: 'ai', 
                content: `Site Intelligence Advisory: Processing '${msg}'... Bounding boxes verified for all personnel. Concrete curing telemetry indicates Sector 4 is ready for load testing. Safety matrix: Nominal.` 
            }]);
        }, 500);
        return;
    }
    
    // Simulate thinking if not in demo
    await new Promise(resolve => setTimeout(resolve, 1500));
    setChatMessages(prev => [...prev, { role: 'ai', content: "Standard protocol analysis complete. No critical deviations detected." }]);
  };

  // Simulation of CV detections
  useEffect(() => {
    const interval = setInterval(() => {
      const newDetections = [
        { id: 1, top: '20%', left: '30%', width: '120px', height: '180px', label: 'Person: Hardhat Detected', color: 'emerald' },
        { id: 2, top: '45%', left: '60%', width: '150px', height: '240px', label: 'ANOMALY: Restricted Area', color: 'rose' },
        { id: 3, top: '10%', left: '75%', width: '80px', height: '80px', label: 'Node: Structural Secure', color: 'sky' }
      ].filter(() => Math.random() > 0.3);
      setDetections(newDetections);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      
      {/* 1. Computer Vision Camera Feed (8 Cols) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-8 space-y-8"
      >
        <motion.div 
          className="glass overflow-hidden rounded-[3rem] border-orange-500/10 bg-navy-950/40 relative h-[600px] premium-shadow shadow-2xl"
        >
          <div className="absolute top-8 left-8 z-30 flex flex-col gap-4">
            <div className="glass px-5 py-2.5 rounded-2xl flex items-center gap-3 border-white/5 backdrop-blur-3xl shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.25em]">CV STREAM: 0{activeCam}_NORTH_V4</span>
            </div>
            
            <div className="flex bg-navy-900/80 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl shadow-2xl">
                {[1, 2, 3].map(i => (
                    <button 
                        key={i} 
                        onClick={() => setActiveCam(i)}
                        className={cn(
                            "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeCam === i ? "bg-white text-navy-950 shadow-xl" : "text-slate-500 hover:text-white"
                        )}
                    >
                        Cam 0{i}
                    </button>
                ))}
            </div>
          </div>
          
          <div className="absolute top-8 right-8 z-30">
            <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-navy-950/80">
                <Activity className="w-3 h-3 text-emerald-500" /> 16.4 FPS . LATENCY: 2ms
            </div>
          </div>

          <div className="absolute inset-0">
             <motion.img 
                key={activeCam}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.3, scale: 1 }}
                transition={{ duration: 1.5 }}
                src={`https://picsum.photos/seed/construction_${activeCam}/1200/800`} 
                className="w-full h-full object-cover grayscale contrast-125"
                alt="Construction Site Feed"
                referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-navy-950/20" />
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,10,20,0.4)_100%)]" />
          </div>

          {/* Bounding Boxes */}
          <AnimatePresence>
            {detections.map((det) => (
                <motion.div
                    key={det.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{ 
                        top: det.top, 
                        left: det.left, 
                        width: det.width, 
                        height: det.height 
                    }}
                    className={cn(
                        "absolute border-2 transition-all duration-700 z-20",
                        det.color === 'emerald' ? "border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : 
                        det.color === 'rose' ? "border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]" : 
                        "border-sky-500/50 shadow-[0_0_20px_rgba(14,165,233,0.2)]"
                    )}
                >
                    <div className={cn(
                        "absolute -top-6 left-0 px-2 py-1 flex items-center gap-2",
                        det.color === 'emerald' ? "bg-emerald-500" : det.color === 'rose' ? "bg-rose-500" : "bg-sky-500"
                    )}>
                        <motion.div 
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                          className="w-1.5 h-1.5 rounded-full bg-white" 
                        />
                        <span className="text-[8px] font-black uppercase text-white whitespace-nowrap tracking-widest">{det.label}</span>
                    </div>
                    {/* Corner accents */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />
                </motion.div>
            ))}
          </AnimatePresence>

          {/* HUD Accents */}
          <div className="absolute bottom-10 left-10 flex gap-12 font-mono text-[9px] text-white/30 tracking-[0.2em] z-10">
              <div className="flex flex-col gap-1">
                  <span>X_COORD: 42.842</span>
                  <span>Y_COORD: -11.024</span>
              </div>
              <div className="flex flex-col gap-1">
                  <span>FOV: 94.4 DEG</span>
                  <span>BITRATE: 4.2 MBPS</span>
              </div>
          </div>

          <div className="absolute inset-x-0 h-[2px] bg-sky-500/20 top-0 animate-[scan_6s_linear_infinite] pointer-events-none z-10" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-[2.5rem] border-white/5 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-white tracking-tight">Project Timeline</h3>
                    <span className="text-[10px] uppercase font-bold text-orange-500 tracking-widest">Phase 4: Structural</span>
                </div>
                <div className="space-y-6">
                    {[
                        { label: 'Foundation', progress: 100, status: 'Complete' },
                        { label: 'Core Framing', progress: 85, status: 'In Progress' },
                        { label: 'Electrical', progress: 40, status: 'Delayed' },
                        { label: 'HVAC rough-in', progress: 0, status: 'Pending' }
                    ].map((item, idx) => (
                        <div key={item.label} className="space-y-2">
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-white">{item.label}</span>
                                <span className={cn(item.progress === 100 ? "text-emerald-400" : "text-slate-400")}>{item.progress}%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.progress}%` }}
                                    transition={{ duration: 1.5, delay: idx * 0.2 }}
                                    className={cn(
                                        "h-full rounded-full",
                                        item.progress === 100 ? "bg-emerald-500 shadow-[0_0_8px_#10B981]" : "bg-orange-500 shadow-[0_0_8px_#F97316]"
                                    )}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group shadow-2xl"
            >
                <div className="absolute top-0 right-0 p-4">
                    <DollarSign className="w-12 h-12 text-white/5 group-hover:text-orange-500/10 transition-colors" />
                </div>
                <h3 className="text-sm uppercase font-bold tracking-[0.2em] text-slate-500 mb-8">Budget Risk Analysis</h3>
                <div className="flex items-center gap-8 mb-8">
                    <div className="relative">
                        <svg className="w-32 h-32" viewBox="0 0 100 100">
                           <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                           <motion.circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                initial={{ strokeDashoffset: 251.2 }}
                                animate={{ strokeDashoffset: 251.2 * (1 - 0.12) }}
                                strokeDasharray="251.2" strokeLinecap="round"
                                className="text-orange-500 transform -rotate-90 origin-center" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-white">12%</span>
                            <span className="text-[8px] uppercase font-bold text-slate-500">Overrun Probability</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-white italic">$42.8k</div>
                        <p className="text-xs text-slate-400 mt-2">Projected budget variance by end of Q3. Low risk.</p>
                    </div>
                </div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10"
                >
                    <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-3 h-3 text-orange-500" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest text-orange-400">Insight</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Steel price volatility is 8% lower than market average. Recommendation: Bulk purchase structural beams within 48h.</p>
                </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-[2.5rem] border-orange-500/10 overflow-hidden h-[400px] flex flex-col md:col-span-2 shadow-2xl"
            >
                <div className="p-6 bg-orange-500 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div 
                          whileHover={{ rotate: 180 }}
                          className="w-8 h-8 rounded-lg bg-navy-900 flex items-center justify-center"
                        >
                            <Construction className="w-4 h-4 text-orange-500" />
                        </motion.div>
                        <div>
                            <span className="block font-bold text-navy-900 text-xs">BuildIQ Site Advisor</span>
                            <span className="block text-[8px] uppercase font-black tracking-widest text-navy-900/60">Live BIM Stream</span>
                        </div>
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
                              "flex flex-col max-w-[80%] p-3 rounded-xl text-xs",
                              m.role === 'user' ? "ml-auto bg-orange-500 text-navy-900 font-bold shadow-lg" : "glass border-orange-500/20 text-white"
                          )}>
                              {m.content}
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
                            placeholder="Consult site intelligence..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500 shadow-inner"
                        />
                        <button 
                            onClick={handleChat}
                            className="absolute right-2 top-2 bottom-2 bg-orange-500 px-4 rounded-lg hover:scale-105 active:scale-95 transition-transform"
                        >
                            <Send className="w-3 h-3 text-navy-900" />
                        </button>
                    </div>
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
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass p-6 rounded-[2rem] border-white/5 bg-navy-950 flex flex-col items-center justify-center min-h-[250px] relative shadow-2xl"
        >
            <div className="absolute top-4 left-4 flex items-center gap-2">
                <Layers className="text-orange-500 w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">BIM Digital Twin</span>
            </div>
            
            <div className="relative w-32 h-40 mt-4 group">
                {[0, 1, 2, 3].map(i => (
                    <motion.div 
                        key={i}
                        animate={{ 
                            y: [0, -4, 0],
                            rotateX: [60, 60, 60],
                            rotateZ: [45, 45, 45],
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                        className="absolute inset-0 border-2 border-orange-500/20 glass-gold rounded-lg transform origin-bottom"
                        style={{ bottom: i * 30 }}
                    />
                ))}
            </div>
            
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-8">Structural Layer Active</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass p-8 rounded-[2.5rem] border-white/5 shadow-2xl"
        >
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-white">Materials Pipeline</h3>
                <Box className="w-4 h-4 text-orange-500" />
             </div>
             <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MATERIAL_DATA}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#ffffff50', fontSize: 10 }} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0F1D36', border: '1px solid #ffffff14' }} />
                        <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                          {MATERIAL_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.stock > 50 ? "#D4AF37" : "#F97316"} />
                          ))}
                        </Bar>
                        <Bar dataKey="predicted" fill="#D4AF37" fillOpacity={0.2} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
             <div className="flex justify-center gap-4 mt-4">
                 <div className="flex items-center gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-gold-500" />
                     <span className="text-[9px] uppercase font-bold text-slate-500">In Stock</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                     <div className="w-2 h-2 rounded-full bg-gold-500/20" />
                     <span className="text-[9px] uppercase font-bold text-slate-500">Forecasted</span>
                 </div>
             </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass p-8 rounded-[2.5rem] border-white/5 shadow-2xl"
        >
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Subcontractor Intel</h3>
            <div className="space-y-4">
                {SUBCONTRACTOR_SCORES.map((sub, idx) => (
                    <motion.div 
                      key={sub.name} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all cursor-pointer shadow-lg"
                    >
                        <div className="space-y-1">
                            <h4 className="text-xs font-bold text-white">{sub.name}</h4>
                            <div className={cn(
                                "text-[8px] font-black uppercase tracking-widest",
                                sub.status === 'On Track' ? "text-emerald-500" : "text-orange-500"
                            )}>{sub.status}</div>
                        </div>
                        <div className="text-right">
                             <div className="text-lg font-black text-white italic">{sub.score}%</div>
                             <div className="text-[8px] uppercase font-bold text-slate-500 tracking-widest">Perf. Score</div>
                        </div>
                    </motion.div>
                ))}
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 mt-6 p-4 rounded-xl glass hover:bg-white/10 transition-colors text-xs font-bold text-white uppercase tracking-widest"
            >
                Full Vendor Audit <ChevronRight className="w-4 h-4" />
            </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};
