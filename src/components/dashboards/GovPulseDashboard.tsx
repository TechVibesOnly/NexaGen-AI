import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, AreaChart, Area
} from 'recharts';
import { 
  BarChart3, Globe, Users, ShieldAlert, Activity, Landmark, 
  Map as MapIcon, Siren, MessageSquare, Send, Zap, Wind, 
  TrendingUp, Building2, ChevronRight, Share2, Search,
  ShieldCheck, AlertTriangle, Fingerprint, DollarSign, Wallet
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SENTIMENT_DATA = [
  { name: '08:00', value: 65 },
  { name: '10:00', value: 72 },
  { name: '12:00', value: 68 },
  { name: '14:00', value: 85 },
  { name: '16:00', value: 78 },
  { name: '18:00', value: 82 },
];

const BUDGET_DATA = [
  { name: 'Healthcare', value: 450, color: '#3b82f6' },
  { name: 'Infra', value: 380, color: '#94a3b8' },
  { name: 'Education', value: 310, color: '#3b82f6' },
  { name: 'Defense', value: 290, color: '#1e293b' },
];

export const GovPulseDashboard = ({ isDemoMode }: { isDemoMode?: boolean }) => {
  const [activeTab, setActiveTab] = useState<'map' | 'policy' | 'fraud'>('map');
  const [simulationValue, setSimulationValue] = useState(50);
  const [chatMessages, setChatMessages] = useState<{role: 'ai' | 'user' | 'system', content: string}[]>([
    { role: 'system', content: "Agency-wide secure bridge established. Monitoring Municipal Node 7." },
    { role: 'ai', content: "Sentiment spikes detected in North District regarding Public Transit Bill. Drafting response summary." }
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
                content: `Policy Simulation Insight: Directive '${msg}' cross-referenced with Department of Finance. Fiscal variance: <1.4%. Strategic Alignment: High. Recommended: Proceed to cabinet review.` 
            }]);
        }, 500);
        return;
    }

    try {
        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `You are GovPulse AI, a strategic policy advisor for government officials. Answer this query with high-level data-driven insights and multi-agency coordination logic: ${msg}.`,
        });
        setChatMessages(prev => [...prev, { role: 'ai', content: result.text || "Directives synchronized across departments." }]);
    } catch (e) {
        setChatMessages(prev => [...prev, { role: 'ai', content: "Policy simulation engine cooling down. Offline data cached." }]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      
      {/* 1. Command Center / Policy Hub (8 Cols) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-8 space-y-8"
      >
        <div className="glass overflow-hidden rounded-[3.5rem] border-blue-500/10 bg-navy-950/40 relative min-h-[600px] premium-shadow shadow-2xl">
          <div className="absolute top-10 left-10 z-30 flex flex-col gap-6">
             <div className="bg-navy-900/90 p-1.5 rounded-2xl border border-white/10 backdrop-blur-3xl shadow-2xl flex max-w-fit">
                {[
                  { id: 'map', label: 'Infra Map', icon: MapIcon },
                  { id: 'policy', label: 'Simulator', icon: Zap },
                  { id: 'fraud', label: 'Fraud AI', icon: ShieldAlert }
                ].map((tab) => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2",
                        activeTab === tab.id ? "bg-white text-navy-950 shadow-2xl scale-105" : "text-slate-500 hover:text-white"
                      )}
                    >
                      <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                    </button>
                ))}
             </div>
          </div>

          <div className="absolute top-10 right-10 z-30">
             <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass px-6 py-3 rounded-2xl flex items-center gap-4 border-emerald-500/20 bg-navy-950/80 shadow-2xl"
             >
                <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="absolute inset-0 bg-emerald-500/50 rounded-full animate-ping" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">FedRAMP AUTHORIZED</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Level 4: Impact (IL4)</span>
                </div>
             </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'map' ? (
               <motion.div 
                key="map"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="absolute inset-0 pt-32"
               >
                  <div className="relative w-full h-full p-12 flex items-center justify-center">
                      <div className="absolute inset-0 opacity-10 grayscale-[0.8] contrast-125 transition-opacity">
                         <img 
                           src="https://picsum.photos/seed/city_map/1200/800" 
                           className="w-full h-full object-cover" 
                           alt="City Map"
                           referrerPolicy="no-referrer"
                         />
                      </div>
                      
                      {/* Interactive Map Nodes */}
                      {[
                        { top: '40%', left: '30%', status: 'Normal', color: 'emerald' },
                        { top: '60%', left: '70%', status: 'Alert', color: 'rose' },
                        { top: '25%', left: '60%', status: 'Optimal', color: 'sky' }
                      ].map((node, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.2 }}
                          style={{ top: node.top, left: node.left }}
                          className="absolute group z-10"
                        >
                            <motion.div 
                                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                                transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                                className={cn("w-12 h-12 rounded-full absolute -inset-4 blur-xl opacity-20", `bg-${node.color}-500`)} 
                            />
                            <div className={cn("w-4 h-4 rounded-full border-2 border-white shadow-2xl relative z-20", `bg-${node.color}-500`)} />
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                <div className="glass px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-xl">
                                    Node_{i + 1} Status: {node.status}
                                </div>
                            </div>
                        </motion.div>
                      ))}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/20" />
                  </div>
                  <div className="absolute bottom-10 left-10 right-10 grid grid-cols-4 gap-6 px-10">
                      {[
                        { label: 'Citizen Alignment', val: '94.2%', color: 'emerald' },
                        { label: 'Response Latency', val: '0.8ms', color: 'emerald' },
                        { label: 'Asset Lifecycle', val: '98.1%', color: 'sky' },
                        { label: 'Crisis Level', val: 'NOMINAL', color: 'emerald' }
                      ].map((stat, idx) => (
                        <motion.div 
                          key={stat.label} 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + idx * 0.1 }}
                          className="glass p-6 rounded-[2rem] border-white/5 backdrop-blur-3xl shadow-2xl relative group overflow-hidden"
                        >
                           <div className="text-[9px] uppercase font-black text-slate-500 mb-2 tracking-[0.2em]">{stat.label}</div>
                           <div className={cn("text-2xl font-black italic tracking-tight", stat.color === 'emerald' ? 'text-emerald-400' : 'text-sky-400')}>{stat.val}</div>
                           <div className={cn("absolute bottom-0 left-0 h-1 transition-all duration-700 w-0 group-hover:w-full", stat.color === 'emerald' ? 'bg-emerald-500/30' : 'bg-sky-500/30')} />
                        </motion.div>
                      ))}
                  </div>
               </motion.div>
            ) : activeTab === 'policy' ? (
              <motion.div 
                key="policy"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="absolute inset-0 p-16 pt-32"
               >
                  <div className="max-w-3xl">
                    <h3 className="text-3xl font-display font-bold text-white mb-3 italic tracking-tight">Policy Simulation Model</h3>
                    <p className="text-slate-400 text-sm mb-16 max-w-lg font-medium leading-relaxed">Real-time fiscal and social forecasting. Adjust parameters to see cascading multi-agency effects.</p>
                    
                    <div className="space-y-16">
                       <div className="space-y-8">
                          <div className="flex justify-between items-end mb-4">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-1">Budget Allocation Directive</span>
                                <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Public Housing & Infra</span>
                             </div>
                             <span className="text-4xl font-display font-black text-blue-400 italic tracking-tighter">${simulationValue}B</span>
                          </div>
                          <div className="relative group px-1">
                             <input 
                                type="range" 
                                min="0" max="250" 
                                value={simulationValue} 
                                onChange={(e) => setSimulationValue(Number(e.target.value))}
                                className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500 shadow-inner group-hover:h-2 transition-all"
                             />
                             <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[8px] font-black text-slate-700 uppercase tracking-widest">
                                <span>$0.0 — MIN</span>
                                <span>$250B — MAX</span>
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                          {[
                            { label: 'GDP Growth Alpha', impact: `+${(simulationValue * 0.05).toFixed(1)}%`, color: 'emerald' },
                            { label: 'Net New Careers', impact: `+${(simulationValue * 4.2).toFixed(1)}k`, color: 'emerald' },
                            { label: 'Fiscal Variance', impact: `${(simulationValue * 0.01).toFixed(2)}%`, color: 'sky' }
                          ].map((i, idx) => (
                            <motion.div 
                              key={i.label} 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-8 rounded-[2.5rem] border border-white/5 bg-navy-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group"
                            >
                               <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                               <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{i.label}</div>
                               <div className={cn("text-3xl font-black italic tracking-tighter mb-1", idx === 2 ? 'text-sky-400' : 'text-emerald-400')}>{i.impact}</div>
                               <div className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Projected Q4_V4</div>
                            </motion.div>
                          ))}
                       </div>
                    </div>
                 </div>
              </motion.div>
            ) : (
              <motion.div 
                key="fraud"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                className="absolute inset-0 p-16 pt-32"
              >
                  <div className="max-w-5xl">
                       <div className="flex justify-between items-end mb-12">
                          <div>
                            <h3 className="text-3xl font-display font-bold text-white mb-3 tracking-tight italic">Forensic Integrity Shield</h3>
                            <div className="flex items-center gap-3">
                               <Fingerprint className="w-4 h-4 text-emerald-400" />
                               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">99.8% Detection Fidelity Verified</span>
                            </div>
                          </div>
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white text-navy-950 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl hover:bg-slate-100 transition-colors"
                          >
                            Execute Global Asset Audit
                          </motion.button>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-6">
                              {[
                                  { entity: 'Asset_ID: 8429-X (Regional)', risk: 'Anomaly: Ledger Recurrence', amount: '$1.24M', severity: 'Critical' },
                                  { entity: 'Grant_App_ID: 512-B (Munich)', risk: 'Anomaly: IP Address Masking', amount: '$420K', severity: 'Moderate' }
                              ].map((anomaly, i) => (
                                  <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 rounded-[2rem] glass border-rose-500/20 flex justify-between items-center group hover:bg-rose-500/[0.03] transition-all cursor-pointer shadow-xl"
                                  >
                                      <div>
                                          <div className="text-sm font-bold text-white mb-1 tracking-tight italic">{anomaly.entity}</div>
                                          <div className="flex items-center gap-3">
                                            <div className="text-[9px] text-rose-500 uppercase font-black tracking-widest">{anomaly.risk}</div>
                                            <div className="px-1.5 py-0.5 rounded bg-rose-500 text-[7px] font-black text-white uppercase">{anomaly.severity}</div>
                                          </div>
                                      </div>
                                      <div className="text-2xl font-black text-white tracking-tighter italic">{anomaly.amount}</div>
                                  </motion.div>
                              ))}
                          </div>
                          
                          <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="p-10 rounded-[3rem] bg-emerald-500/[0.03] border border-emerald-500/10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
                          >
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]" />
                              <div className="relative z-10">
                                  <motion.div 
                                      animate={{ scale: [1, 1.1, 1], rotateY: [0, 180, 360] }}
                                      transition={{ repeat: Infinity, duration: 6 }}
                                      className="w-20 h-20 rounded-3xl bg-navy-900 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8 shadow-2xl"
                                  >
                                      <ShieldCheck className="w-10 h-10 text-emerald-500" />
                                  </motion.div>
                                  <h4 className="text-2xl font-bold text-white mb-3 tracking-tight italic">Preventative Defense Map</h4>
                                  <p className="text-slate-500 text-xs font-medium max-w-xs mx-auto leading-relaxed uppercase tracking-widest px-4">Blocked $14.8M in high-velocity illicit transaction attempts YTD.</p>
                              </div>
                          </motion.div>
                       </div>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-[2.5rem] border-white/5 bg-gradient-to-br from-navy-900 to-transparent shadow-2xl"
            >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-white tracking-tight">Citizen Sentiment</h3>
                    <div className="flex gap-1">
                       <TrendingUp className="text-emerald-400 w-4 h-4" />
                       <span className="text-[10px] font-bold text-emerald-400 italic">UP 12%</span>
                    </div>
                </div>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={SENTIMENT_DATA}>
                            <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                            <Tooltip contentStyle={{ backgroundColor: '#0F1D36', border: 'none' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                   <span>Morning Pulse</span>
                   <span>Evening Outlook</span>
                </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-[2.5rem] border-sky-500/10 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-lg font-bold text-white tracking-tight">Procurement Optimizer</h3>
                   <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center"><Wallet className="text-sky-500 w-5 h-5" /></div>
                </div>
                <div className="space-y-4">
                    {[
                        { item: 'Cloud Infrastructure Integration', saving: '24%', status: 'Optimized' },
                        { item: 'Supply Chain Waste Reduction', saving: '18%', status: 'Active' },
                        { item: 'Operational Labor Allocation', saving: '32%', status: 'Calculated' }
                    ].map((p, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ x: 5, borderColor: 'rgba(14, 165, 233, 0.3)' }}
                          className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 group transition-all cursor-pointer shadow-lg"
                        >
                            <div>
                                <div className="text-xs font-bold text-white">{p.item}</div>
                                <div className="text-[8px] uppercase font-black tracking-widest text-emerald-400">{p.status}</div>
                            </div>
                            <div className="text-lg font-black text-sky-400 italic">-{p.saving}</div>
                        </motion.div>
                    ))}
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 py-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[9px] font-bold text-sky-400 uppercase tracking-widest hover:bg-sky-500 hover:text-navy-900 transition-all"
                >
                  Download Efficiency Ledger
                </motion.button>
            </motion.div>
        </div>
      </motion.div>

      {/* 4. Sidebar Panels (4 Cols) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-4 space-y-6"
      >
        
        {/* Coordination Bridge (Chat) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[3rem] border-blue-500/10 overflow-hidden h-[500px] flex flex-col premium-shadow shadow-2xl"
        >
            <div className="p-8 bg-blue-600 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                      className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center shadow-2xl"
                    >
                        <Globe className="w-5 h-5 text-blue-500" />
                    </motion.div>
                    <div>
                        <span className="block font-black text-navy-900 text-sm italic uppercase">GOVPULSE BRIDGE</span>
                        <span className="block text-[8px] uppercase font-black tracking-widest text-navy-900 opacity-70 italic">Agency Auth Level: 4</span>
                    </div>
                </div>
            </div>
            
            <div className="flex-grow p-6 space-y-6 overflow-y-auto bg-navy-950/80 scrollbar-hide">
                <AnimatePresence>
                  {chatMessages.map((m, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex flex-col gap-1",
                          m.role === 'user' ? "items-end" : "items-start"
                      )}>
                          {m.role === 'system' && <span className="text-[8px] uppercase font-black text-blue-400 tracking-[0.2em] mb-1">Secure Event Log</span>}
                          <div className={cn(
                              "max-w-[90%] p-4 rounded-2xl text-[11px] leading-relaxed shadow-lg",
                              m.role === 'user' ? "bg-white text-navy-900 font-bold" : 
                              m.role === 'system' ? "border border-blue-500/20 bg-blue-500/5 text-blue-400 font-black italic shadow-[0_0_15px_#3b82f633]" :
                              "glass border-white/5 text-slate-300"
                          )}>
                              {m.content}
                          </div>
                      </motion.div>
                  ))}
                </AnimatePresence>
            </div>

            <div className="p-6 border-t border-white/5 bg-navy-900/50">
                <div className="relative">
                    <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                        placeholder="Submit Directive..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:outline-none focus:border-blue-500 shadow-inner"
                    />
                    <button 
                        onClick={handleChat}
                        className="absolute right-2 top-2 bottom-2 bg-blue-600 px-5 rounded-xl hover:bg-blue-500 transition-colors shadow-lg active:scale-95"
                    >
                        <Send className="w-4 h-4 text-white" />
                    </button>
                </div>
            </div>
        </motion.div>

        {/* FedRAMP Compliance Badge */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="glass p-8 rounded-[3rem] border-emerald-500/10 bg-emerald-500/5 text-center shadow-2xl"
        >
             <motion.div 
              animate={{ rotateY: [0, 360] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="w-16 h-16 rounded-3xl bg-navy-900 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-xl"
             >
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
             </motion.div>
             <h3 className="text-xl font-bold text-white mb-2">FedRAMP Compliant</h3>
             <p className="text-xs text-slate-500 leading-relaxed max-w-[200px] mx-auto uppercase font-bold tracking-widest">Verified High Baseline Authorization for U.S. Federal Data.</p>
        </motion.div>

        {/* Infrastructure Asset Maintenance */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass p-8 rounded-[3rem] border-white/5 shadow-2xl"
        >
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">Asset Maintenance</h3>
             <div className="space-y-4">
                {[
                  { name: 'Water Grid Node 4', status: 'Maintenance Required', color: 'orange' },
                  { name: 'District B Power', status: 'Operational', color: 'emerald' },
                  { name: 'Transit Link 02', status: 'Predictive Alert', color: 'rose' }
                ].map((a, idx) => (
                  <motion.div 
                    key={a.name} 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-all cursor-pointer shadow-lg"
                  >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-white">{a.name}</div>
                        <div className={cn("text-[9px] uppercase font-black tracking-widest", `text-${a.color}-400`)}>{a.status}</div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-navy-900 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                         <Activity className={cn("w-4 h-4", `text-${a.color}-400`)} />
                      </div>
                  </motion.div>
                ))}
             </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
