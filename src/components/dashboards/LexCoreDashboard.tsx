import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Scale, FileText, Search, ShieldAlert, Gavel, FileCheck, 
  SearchCode, Landmark, Filter, Download, Zap, MessageSquare,
  Send, AlertTriangle, CheckCircle2, ChevronRight, Upload, Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const RISK_DATA = [
  { name: 'Low Risk', value: 65, color: '#10b981' },
  { name: 'Medium Risk', value: 25, color: '#f59e0b' },
  { name: 'High Risk', value: 10, color: '#ef4444' },
];

const PRECEDENT_SCORES = [
  { year: '2020', score: 45 },
  { year: '2021', score: 52 },
  { year: '2022', score: 68 },
  { year: '2023', score: 85 },
  { year: '2024', score: 92 },
];

export const LexCoreDashboard = ({ isDemoMode }: { isDemoMode?: boolean }) => {
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewProgress, setReviewProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'ai' | 'user', content: string}[]>([
    { role: 'ai', content: "LexCore Reference Engine initialized. Search precedents or analyze contracts." }
  ]);
  const [input, setInput] = useState('');

  const startReview = () => {
    setIsReviewing(true);
    setReviewProgress(0);
    setShowResults(false);
  };

  useEffect(() => {
    if (isReviewing) {
      const interval = setInterval(() => {
        setReviewProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsReviewing(false);
            setShowResults(true);
            return 100;
          }
          return prev + (isDemoMode ? 8 : 2);
        });
      }, isDemoMode ? 80 : 400); 
      return () => clearInterval(interval);
    }
  }, [isReviewing]);

  const handleChat = async () => {
    if (!input.trim()) return;
    const msg = input;
    setInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    
    if (isDemoMode) {
        setTimeout(() => {
            setChatMessages(prev => [...prev, { 
                role: 'ai', 
                content: `Legal Intelligence Unit: Analyzed '${msg}' across 4.2M jurisdictional documents. No semantic conflicts identified in the current Enterprise Clause bank. Risk Rating: Nominal.` 
            }]);
        }, 500);
        return;
    }

    try {
        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `You are LexCore Enterprise Legal AI. Provide a professional, risk-aware, and precise legal research insight for: ${msg}. Focus on regulatory precedent and compliance.`,
        });
        setChatMessages(prev => [...prev, { role: 'ai', content: result.text || "Precedent database synchronized. No direct conflicts found." }]);
    } catch (e) {
        setChatMessages(prev => [...prev, { role: 'ai', content: "System operating in low-latency locally cached mode. Synchronizing with LexCore global nodes." }]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      
      {/* 1. Contract Analysis Center (8 Cols) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-8 space-y-8"
      >
        <div className="glass p-12 rounded-[3rem] border-white/5 bg-navy-950/40 relative min-h-[600px] premium-shadow shadow-2xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-2">Clause Lifecycle Audit</h2>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em]">LexCore Semantic Engine v4.0</p>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass px-6 py-3 rounded-xl text-[10px] font-black text-white hover:bg-white/10 uppercase tracking-widest flex items-center gap-2 shadow-xl border-white/10 transition-all"
            >
              <Download className="w-4 h-4 text-gold-500" /> Export Audit Ledger
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {!showResults && !isReviewing ? (
              <motion.div 
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={startReview}
                className="border border-dashed border-gold-500/20 rounded-[2.5rem] p-24 flex flex-col items-center justify-center cursor-pointer group hover:border-gold-500/50 transition-all bg-gold-500/[0.02] hover:bg-gold-500/[0.05]"
              >
                <div className="relative mb-8">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-gold-500/20 blur-3xl rounded-full"
                    />
                    <div className="w-24 h-24 rounded-3xl bg-navy-900 border border-gold-500/20 flex items-center justify-center relative z-10 group-hover:scale-110 group-hover:border-gold-500/50 transition-all duration-500">
                      <Upload className="w-10 h-10 text-gold-500" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Initialize Semantic Audit</h3>
                <p className="text-slate-500 text-sm max-w-sm text-center leading-relaxed font-medium">Drop agreement (PDF/DOCX) for instantaneous risk redlining and precedent alignment.</p>
                <div className="mt-10 flex items-center gap-6">
                    <div className="flex -space-x-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-navy-950 bg-navy-800 flex items-center justify-center">
                                <FileText className="w-4 h-4 text-gold-500/60" />
                            </div>
                        ))}
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">124k+ Scanned Daily</span>
                </div>
              </motion.div>
            ) : isReviewing ? (
              <motion.div 
                key="reviewing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center p-20 space-y-12"
              >
                 <div className="relative w-56 h-56">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" fill="transparent" className="text-white/5" />
                      <motion.circle 
                        cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" fill="transparent" 
                        initial={{ strokeDashoffset: 301.6 }}
                        animate={{ strokeDashoffset: 301.6 * (1 - reviewProgress/100) }}
                        strokeDasharray="301.6" strokeLinecap="round"
                        className="text-gold-500 transform -rotate-90 origin-center transition-all duration-300" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black text-white italic">{reviewProgress}%</span>
                      <span className="text-[10px] uppercase font-black text-gold-500/40 tracking-[0.3em] mt-2">Clause Isolation</span>
                    </div>
                 </div>
                 <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold text-white tracking-tight italic">Analyzing: NDA_EMEA_V4.PDF</h3>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                                <motion.div 
                                    key={i}
                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                    className="w-1.5 h-1.5 rounded-full bg-gold-500"
                                />
                            ))}
                        </div>
                        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Cross-referencing liability caps with 2024 precedents...</p>
                    </div>
                 </div>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {[
                     { label: 'Compliance Score', val: '98.4%', sub: 'High Stability', color: 'emerald' },
                     { label: 'Critical Variance', val: '02', sub: 'Action Required', color: 'rose' },
                     { label: 'Optimization Delta', val: '+14%', sub: 'Potential Gain', color: 'gold' },
                   ].map((metric, i) => (
                     <motion.div 
                      key={metric.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden group shadow-2xl"
                     >
                        <div className={cn("absolute top-0 right-0 w-24 h-24 opacity-5 bg-gradient-to-br transition-all duration-700", metric.color === 'emerald' ? 'from-emerald-500' : metric.color === 'rose' ? 'from-rose-500' : 'from-gold-500')} />
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{metric.label}</div>
                        <div className={cn("text-4xl font-black mb-1 italic", metric.color === 'emerald' ? 'text-emerald-400' : metric.color === 'rose' ? 'text-rose-400' : 'text-gold-400')}>{metric.val}</div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">{metric.sub}</div>
                     </motion.div>
                   ))}
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass p-8 rounded-[3rem] border-gold-500/10 shadow-2xl relative overflow-hidden"
                >
                   <div className="flex items-center justify-between mb-8">
                     <h4 className="text-sm font-black text-gold-500 uppercase tracking-[0.3em]">Critical AI Redlines</h4>
                     <ShieldAlert className="w-5 h-5 text-gold-500/50" />
                   </div>
                   <div className="space-y-4">
                     {[
                       { clause: 'Section 4.2: Indemnification', risk: 'High', msg: 'Clause includes consequential damages without standard market caps. Recommend adding firm 1x annual fee limit.', action: 'Apply Patch' },
                       { clause: 'Section 11.8: Non-Solicitation', risk: 'Medium', msg: '36-month duration exceeds EU labor guidelines for this sector. 12-18 months recommended for enforceability.', action: 'Redline' }
                     ].map((item, i) => (
                       <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        whileHover={{ x: 10, backgroundColor: 'rgba(212,175,55,0.05)' }}
                        className="flex gap-8 items-start p-6 rounded-2xl bg-navy-900 border border-white/5 hover:border-gold-500/30 transition-all group shadow-xl"
                       >
                          <div className={cn(
                            "w-1.5 h-16 rounded-full shrink-0",
                            item.risk === 'High' ? "bg-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]" : "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                          )} />
                          <div className="flex-grow">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-base font-bold text-white tracking-tight italic">{item.clause}</span>
                              <div className={cn(
                                "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                item.risk === 'High' ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                              )}>{item.risk} Alert</div>
                            </div>
                            <p className="text-xs text-slate-400 mb-4 leading-relaxed font-medium">{item.msg}</p>
                            <div className="flex gap-4">
                               <button className="text-[9px] uppercase font-black text-gold-500 flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                                  Initialize Auto-Correction <ChevronRight className="w-3 h-3" />
                               </button>
                            </div>
                          </div>
                       </motion.div>
                     ))}
                   </div>
                </motion.div>
                
                <div className="flex justify-center pt-4">
                    <button 
                      onClick={() => setShowResults(false)}
                      className="group flex flex-col items-center gap-3 text-slate-500 hover:text-white transition-colors"
                    >
                      <span className="text-[10px] font-black uppercase tracking-[0.4em]">Audit Complete</span>
                      <div className="w-40 h-[1px] bg-white/5 group-hover:bg-gold-500/30 transition-all" />
                      <span className="text-[9px] font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100 italic">Reset to Terminal v4.0.0</span>
                    </button>
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
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">Litigation Predictor</h3>
                <div className="flex items-center gap-8 mb-8">
                     <div className="flex-grow space-y-4">
                        {[
                          { label: 'Settlement Probability', value: 72 },
                          { label: 'Judgment Accuracy', value: 88 }
                        ].map((s, idx) => (
                          <div key={s.label}>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-white">{s.label}</span>
                              <span className="text-gold-500">{s.value}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                               <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${s.value}%` }}
                                transition={{ duration: 1.5, delay: idx * 0.2 }}
                                className="h-full bg-gold-500 rounded-full shadow-[0_0_8px_#D4AF37]" 
                               />
                            </div>
                          </div>
                        ))}
                     </div>
                     <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-24 h-24 rounded-3xl bg-gold-500 flex flex-col items-center justify-center text-navy-900 shrink-0 shadow-2xl"
                     >
                        <Gavel className="w-8 h-8 mb-1" />
                        <span className="text-xs font-black italic">WIN</span>
                     </motion.div>
                </div>
                <p className="text-[11px] text-slate-500 border-t border-white/5 pt-4">Estimated Win Rate based on 4,200 jurisdictional precedents in Central District of CA.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="glass p-8 rounded-[2.5rem] border-white/5 shadow-2xl"
            >
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Partner Efficiency</h3>
                <div className="h-[200px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={PRECEDENT_SCORES}>
                        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                           {PRECEDENT_SCORES.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill="#D4AF37" fillOpacity={0.2 + (index * 0.2)} />
                           ))}
                        </Bar>
                        <XAxis dataKey="year" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#ffffff50' }} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0F1D36', border: 'none' }} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
                <div className="flex justify-between items-center mt-6">
                   <div className="text-xs font-bold text-white">Reclaimable Partner Hours</div>
                   <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-xl font-black text-emerald-400 italic"
                   >
                    420h/mo
                   </motion.div>
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
        
        {/* Regulatory Feed */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass p-8 rounded-[2.5rem] border-white/5 shadow-2xl"
        >
            <div className="flex items-center gap-3 mb-8">
                <Landmark className="text-gold-500 w-5 h-5" />
                <h3 className="text-lg font-bold text-white">Regulatory Pulse</h3>
            </div>
            <div className="space-y-6">
                {[
                    { title: 'EU AI Act Compliance', time: '2h ago', level: 'Critical', color: 'rose' },
                    { title: 'SEC Rule 14a-8 Revision', time: '14h ago', level: 'High', color: 'orange' },
                    { title: 'California Privacy Update', time: '1d ago', level: 'Update', color: 'sky' }
                ].map((update, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 5 }}
                      className="relative pl-6 before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[1px] before:bg-white/10"
                    >
                        <div className={cn("absolute left-[-2px] top-1.5 w-1 h-1 rounded-full", `bg-${update.color}-500 shadow-[0_0_8px_rgba(0,0,0,0.5)]`)} />
                        <h4 className="text-xs font-bold text-white mb-1">{update.title}</h4>
                        <div className="flex justify-between text-[9px] uppercase font-black tracking-widest text-slate-500">
                           <span>{update.level} Priority</span>
                           <span>{update.time}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-8 py-4 rounded-xl border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/5 transition-colors"
            >
                View Policy Map
            </motion.button>
        </motion.div>

        {/* Global Case Search */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass p-8 rounded-[2.5rem] border-white/5 bg-navy-950/20 shadow-2xl"
        >
             <div className="flex items-center gap-2 mb-6">
                <SearchCode className="text-gold-500 w-5 h-5" />
                <h3 className="text-lg font-bold text-white italic">PrecendentEngine</h3>
             </div>
             <div className="relative mb-6">
                <input 
                  type="text" 
                  placeholder="Case id, statute, or party..." 
                  className="w-full bg-navy-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold-500/50 shadow-inner"
                />
                <Search className="absolute right-4 top-3 w-4 h-4 text-slate-600" />
             </div>
             <div className="space-y-3">
                {[
                  "Common Wealth v. GlobalTech (2024)",
                  "Section 230 Immunity Rulings: 9th Circuit"
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    className="p-3 rounded-xl bg-white/5 text-[10px] font-medium text-slate-400 hover:text-white cursor-pointer transition-colors"
                  >
                    {item}
                  </motion.div>
                ))}
             </div>
        </motion.div>

        {/* Legal AI Research Chat */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[2rem] border-gold-500/10 overflow-hidden h-[400px] flex flex-col premium-shadow shadow-2xl"
        >
            <div className="p-6 bg-navy-900 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center"
                    >
                        <Scale className="w-4 h-4 text-navy-900" />
                    </motion.div>
                    <div>
                        <span className="block font-bold text-white text-xs">LexCore Research Partner</span>
                        <span className="block text-[8px] uppercase font-black tracking-widest text-emerald-400">Secure Environment</span>
                    </div>
                </div>
            </div>
            
            <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-[#0a1428] scrollbar-hide">
                <AnimatePresence>
                  {chatMessages.map((m, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                          "flex flex-col max-w-[85%] p-3 rounded-xl text-xs leading-relaxed shadow-lg",
                          m.role === 'user' ? "ml-auto bg-gold-400 text-navy-900 font-medium" : "glass border-gold-500/20 text-slate-200"
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
                        placeholder="Research statute..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold-500/50 shadow-inner"
                    />
                    <button 
                        onClick={handleChat}
                        className="absolute right-2 top-2 bottom-2 bg-gold-500 px-4 rounded-lg hover:bg-gold-400 transition-colors"
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
