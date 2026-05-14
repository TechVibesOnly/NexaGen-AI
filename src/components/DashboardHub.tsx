import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Clock, HelpCircle, Send, Sparkles, MessageSquare, 
  Settings, User, Bell, ChevronLeft, Bot, ShieldCheck
} from 'lucide-react';
import { INDUSTRIES, Industry, Product } from '../constants';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";
import { CropMindDashboard } from './dashboards/CropMindDashboard';
import { BuildIQDashboard } from './dashboards/BuildIQDashboard';
import { LexCoreDashboard } from './dashboards/LexCoreDashboard';
import { GovPulseDashboard } from './dashboards/GovPulseDashboard';
import { FloatingAI } from './FloatingAI';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

import { useEffect } from 'react';

export const DashboardHub = ({ initialIndustry, onBack }: { initialIndustry: Industry; onBack: () => void }) => {
  const [activeIndustry, setActiveIndustry] = useState<Industry>(initialIndustry);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  
  const currentIndustryData = INDUSTRIES.find(i => i.title === activeIndustry)!;
  const product = currentIndustryData.products[0];

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) setServerStatus('online');
        else setServerStatus('offline');
      } catch (err) {
        setServerStatus('offline');
      }
    };
    checkHealth();
  }, []);

  const handleIndustryChange = (newIndustry: Industry) => {
    setIsInitializing(true);
    setTimeout(() => {
      setActiveIndustry(newIndustry);
      setIsInitializing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col pt-24 pb-12 overflow-x-hidden">
      <div className="max-w-[1700px] mx-auto w-full px-6 flex flex-col flex-grow">
        
        {/* Hub Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12 border-b border-white/5 pb-12">
          <div className="flex items-start gap-8">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="w-14 h-14 rounded-2xl glass flex items-center justify-center transition-all group shadow-2xl border-white/10"
            >
              <ChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-white group-hover:-translate-x-1 transition-all" />
            </motion.button>
            <div>
              <div className="flex items-center gap-6 mb-3">
                <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight italic">
                  Neural<span className="text-gold-500 font-black">X</span> {product.name}
                </h1>
                <div className="glass px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-gold-500 tracking-[0.25em] shadow-[0_0_30px_rgba(212,175,55,0.1)] border-gold-500/20">
                  Vertical Intelligence Core
                </div>
              </div>
              <p className="text-slate-500 text-lg max-w-xl font-medium tracking-tight leading-relaxed">{product.tagline}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="flex items-center gap-5 glass px-6 py-3.5 rounded-3xl border-white/5 bg-navy-900/60 shadow-2xl">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase text-slate-600 tracking-[0.3em] leading-none mb-1.5 italic">Simulation Protocol</span>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-colors duration-700",
                  isDemoMode ? "text-gold-500" : "text-emerald-400"
                )}>
                  {isDemoMode ? "Predictive Engine" : "Live Telemetry"}
                </span>
              </div>
              <button 
                onClick={() => setIsDemoMode(!isDemoMode)}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-all duration-500 p-1 bg-navy-950/80 border",
                  isDemoMode ? "border-gold-500/30" : "border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                )}
              >
                <motion.div 
                  animate={{ x: isDemoMode ? 24 : 0 }}
                  className={cn(
                    "w-4 h-4 rounded-full shadow-2xl",
                    isDemoMode ? "bg-gold-500 shadow-gold-500/50" : "bg-emerald-500 shadow-emerald-500/50"
                  )}
                />
              </button>
            </div>

            <div className="flex items-center gap-1.5 p-2 glass rounded-3xl overflow-x-auto no-scrollbar shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-navy-900/40">
            {INDUSTRIES.map((ind) => (
              <motion.button
                key={ind.title}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleIndustryChange(ind.title)}
                className={cn(
                  "px-6 py-2.5 rounded-2xl text-[10px] font-black transition-all duration-500 whitespace-nowrap tracking-[0.2em] uppercase",
                  activeIndustry === ind.title 
                    ? "bg-white text-navy-950 shadow-2xl scale-105" 
                    : "text-slate-500 hover:text-white"
                )}
              >
                {ind.title}
              </motion.button>
            ))}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <AnimatePresence mode="wait">
          {!isInitializing ? (
            <motion.div
                key={activeIndustry}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="flex-grow flex flex-col"
            >
                {activeIndustry === 'Agriculture' ? (
                <CropMindDashboard isDemoMode={isDemoMode} />
                ) : activeIndustry === 'Construction' ? (
                <BuildIQDashboard isDemoMode={isDemoMode} />
                ) : activeIndustry === 'Legal' ? (
                <LexCoreDashboard isDemoMode={isDemoMode} />
                ) : activeIndustry === 'Government' ? (
                <GovPulseDashboard isDemoMode={isDemoMode} />
                ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Protocol error: Selection invalid.</p>
                </div>
                )}
            </motion.div>
          ) : (
            <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow flex flex-col items-center justify-center space-y-8"
            >
                <div className="relative w-40 h-40">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-r-2 border-gold-500/20 rounded-full"
                    />
                    <div className="absolute inset-4 flex items-center justify-center">
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="bg-gold-500 w-4 h-4 rounded-full shadow-[0_0_20px_#D4AF37]"
                        />
                    </div>
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-bold text-white tracking-widest uppercase mb-2 italic">Neural Switching</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Synchronizing Industrial Node...</p>
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-12 flex items-center justify-between border-t border-white/5 opacity-60">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full animate-pulse",
                        serverStatus === 'online' ? 'bg-emerald-500' : serverStatus === 'checking' ? 'bg-gold-500' : 'bg-rose-500'
                    )} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Backend Gateway: {serverStatus.toUpperCase()}
                    </span>
                </div>
                <div className="h-4 w-[1px] bg-white/10" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Neural Bridge: v2.4.0-Final
                </span>
            </div>
            
            <div className="flex items-center gap-4">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">AES-256 Air-Gapped Encryption</span>
            </div>
        </div>

        <DemoOverlay 
          isOpen={isDemoOpen} 
          onClose={() => setIsDemoOpen(false)} 
          industry={activeIndustry}
        />

        <FloatingAI industry={activeIndustry} isDemoMode={isDemoMode} />
      </div>
    </div>
  );
};

const getMockData = (industry: Industry) => {
    const bases: Record<Industry, number> = { Agriculture: 400, Construction: 600, Legal: 800, Government: 300 };
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(name => ({
        name,
        value: bases[industry] + Math.random() * 200
    }));
};

const getMockDistribution = (industry: Industry) => {
    const labels: Record<Industry, string[]> = {
        Agriculture: ['Soil', 'Water', 'Yield', 'Pest'],
        Construction: ['Labor', 'Materials', 'Safety', 'Schedule'],
        Legal: ['Discovery', 'Review', 'Drafting', 'Filing'],
        Government: ['Logistics', 'Public', 'Policy', 'Budget']
    };
    return labels[industry].map(name => ({
        name,
        value: 20 + Math.random() * 80
    }));
};

const DemoOverlay = ({ isOpen, onClose, industry }: { isOpen: boolean; onClose: () => void; industry: Industry }) => {
    const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const result = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: userMsg,
                config: {
                    systemInstruction: `You are NeXaGen AI's specialized concierge for the ${industry} vertical. 
                    Your goal is to provide data-driven, executive-level insights about this industry. 
                    Be professional, precise, and authoritative. Use industrial terminology. 
                    Keep responses focused on how AI optimizes operations in ${industry}.`
                }
            });
            setMessages(prev => [...prev, { role: 'ai', content: result.text || 'Process interrupted. Please retry.' }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to NeXaGen Core. System is initializing." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-navy-900/90 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-navy-800 rounded-3xl border border-gold-500/20 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        <div className="p-6 bg-gold-500 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-navy-900">
                                <Bot className="w-6 h-6" />
                                <span className="font-black uppercase tracking-widest text-sm">Industrial Intelligence Demo</span>
                            </div>
                            <button onClick={onClose} className="text-navy-900 hover:rotate-90 transition-transform">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center py-12">
                                    <Sparkles className="w-12 h-12 text-gold-500/20 mx-auto mb-4" />
                                    <p className="text-slate-500 text-sm">Initialized system for {industry}. Ask me about yield optimization, risk mitigation, or resource allocation.</p>
                                </div>
                            )}
                            {messages.map((m, i) => (
                                <div key={i} className={cn(
                                    "flex",
                                    m.role === 'user' ? "justify-end" : "justify-start"
                                )}>
                                    <div className={cn(
                                        "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                                        m.role === 'user' ? "bg-white/10 text-white" : "glass border-gold-500/20 text-slate-200"
                                    )}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="glass p-4 rounded-2xl animate-pulse flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-gold-500 animate-bounce" />
                                        <div className="w-2 h-2 rounded-full bg-gold-500 animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-2 h-2 rounded-full bg-gold-500 animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-navy-900/50 border-t border-white/5">
                            <div className="relative">
                                <input 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={`Query ${industry} Intelligence...`}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-gold-500 transition-colors pr-16"
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={isLoading}
                                    className="absolute right-2 top-2 bottom-2 bg-gold-500 hover:bg-gold-400 px-4 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4 text-navy-900" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

function X({ size }: { size: number }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size} height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
    );
}
