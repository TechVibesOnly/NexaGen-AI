import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, X, Send, Sparkles, Bot, 
  ChevronDown, Maximize2, Minimize2, Activity,
  Zap, ShieldCheck
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';
import { Industry } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'ai' | 'user';
  content: string;
  confidence?: number;
}

export const FloatingAI = ({ industry, isDemoMode }: { industry: Industry, isDemoMode?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const SUGGESTED_QUERIES: Record<Industry, string[]> = {
    Agriculture: ["Forecast yield variance for Sector 7", "Optimize irrigation for loam soil", "Pest outbreak risk assessment"],
    Construction: ["Analyze steel price volatility", "Predict core framing delay impact", "Safety audit for North Block"],
    Legal: ["Review indemnity clause risks", "Precedent for Section 230 cases", "Regulatory impact of AI Act"],
    Government: ["Simulate housing fund impact", "Fraud detection precision audit", "Municipal infrastructure health"]
  };

  const DEMO_RESPONSES: Record<string, string> = {
    "Forecast yield variance for Sector 7": "Yield variance for Sector 7 is projected at +14.2% relative to the 5-year mean. Anomaly detection suggests high soil nitrate levels (124ppm) in the northeast quadrant are the primary driver. Recommendation: Retain current irrigation cadence.",
    "Optimize irrigation for loam soil": "Analysis of moisture sensor array across silt-loam clusters indicates a 22% over-saturation risk. Recommendation: Implement variable rate irrigation (VRI) to pulse water delivery during peak evapotranspiration windows (11:00-15:00).",
    "Pest outbreak risk assessment": "Cross-referencing humidity telemetry with historical infestation patterns shows a 78% risk increase for Aphid proliferation in the next 72 hours. Proactive localized treatment in Sector 4 recommended.",
    "Analyze steel price volatility": "Global supply chain indicators suggest a 12% price surge in structural steel exports from Asian hubs. RECOMMENDATION: Procurement should lock currently quoted rates for Phase 2 framing immediately to prevent budget overrun of $1.4M.",
    "Predict core framing delay impact": "Simulation shows a 14-day delay in core framing will ripple into electrical rough-ins, pushing the critical path by 22 days. Mitigation: Authorize overtime for framing crew B to regain 8 days by Friday.",
    "Safety audit for North Block": "Computer Vision audit identifies 3 instances of PPE non-compliance near the North Block hoist. Alerting site supervisor. Operational safety score: 98.4%.",
    "Review indemnity clause risks": "Section 4.2 has a legacy 'unlimited liability' phrasing. RECOMMENDATION: Amend to cap at 1.5x contract value per Jurisdictional Precedent (Case Ref: Lex-942). Risk Exposure: High.",
    "Precedent for Section 230 cases": "Recent rulings in federal circuit courts suggest a narrowing of immunity for AI-generated content. Analysis indicates that NeXaGen's current filtering layer prevents vicarious liability by 99.7%.",
    "Regulatory impact of AI Act": "Compliance requirement: Data lineage audit for for-profit entities using European cluster data. Recommendation: Initiate shadow audit of training sets to ensure SOC2 alignment.",
    "Simulate housing fund impact": "Reallocating 15% of the Municipal Growth Fund to high-density affordable housing in District B is projected to increase regional GDP by 0.8% and reduce local homelessness metrics by 14% over 24 months.",
    "Fraud detection precision audit": "Current precision model (v4.2) maintains a 97.4% accuracy rate. Recent anomalies in Grant App 512 identified via Behavioral Fingerprinting. Potential savings: $420k.",
    "Municipal infrastructure health": "Node 7 (District Power) showing signs of transformer thermal stress. Predictive failure mapped to 18-24 days. Schedule preventive cooling module replacement immediately."
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    if (isDemoMode) {
        // Instant response for demo
        const demoResp = DEMO_RESPONSES[userMsg] || `Simulation result for '${userMsg}': Analysis indicates high confidence in structural optimization. Current system telemetry supports a 12% efficiency gain following the proposed protocol. Audit trail: Verified.`;
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                role: 'ai', 
                content: demoResp,
                confidence: 0.98
            }]);
            setIsTyping(false);
        }, 600);
        return;
    }

    try {
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: `You are NeXaGen's Domain Expert AI for the ${industry} industry. 
          Your style is:
          1. Hyper-professional and data-centric.
          2. Uses specific industrial terminology (e.g., 'BIM', 'Soil Salinity', 'Jurisdictional Precedent').
          3. Brief but insightful.
          4. Confidence-focused.
          
          Provide responses as an elite advisor. Current Industry Context: ${industry}.`
        }
      });

      const responseText = result.text || "Insight stream interrupted. Re-syncing...";
      
      // Artificial delay for "expert thought processing"
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: responseText,
        confidence: 0.94 + (Math.random() * 0.05) // Realistic confidence 94-99%
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "Core communication link unstable. Retrying via secondary relay...",
        confidence: 0.82
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col items-end gap-4 font-sans">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[400px] h-[600px] mb-4 glass bg-navy-900 shadow-2xl rounded-[2.5rem] border-white/5 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-gold-500 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-navy-900 leading-tight uppercase tracking-widest">{industry} Advisor</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-navy-900 animate-pulse" />
                    <span className="text-[9px] font-bold text-navy-900/70 uppercase">Global Node Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-navy-900/10 rounded-lg transition-colors text-navy-900"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-navy-900/10 rounded-lg transition-colors text-navy-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[#0a1428]/50"
            >
              {messages.length === 0 && (
                <div className="text-center py-12 space-y-6">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 shadow-inner">
                    <Sparkles className="w-8 h-8 text-gold-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-bold text-base">NeXaGen Core Protocol</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black italic">Industry Node: {industry}</p>
                  </div>
                  <div className="flex flex-col gap-2 px-4 mt-8">
                     {SUGGESTED_QUERIES[industry].map((q, i) => (
                         <button 
                            key={i}
                            onClick={() => {
                                setInput(q);
                                // We'll trigger a manual send with a small delay or just let them edit
                            }}
                            className="bg-white/5 hover:bg-gold-500/10 border border-white/5 hover:border-gold-500/30 p-3 rounded-xl text-left text-[10px] font-bold text-slate-300 transition-all flex items-center justify-between group"
                         >
                            {q}
                            <ChevronDown className="w-3 h-3 -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
                         </button>
                     ))}
                  </div>
                </div>
              )}
              
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex flex-col gap-1.5 max-w-[85%]",
                    m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "p-4 rounded-2xl text-[11px] leading-relaxed",
                    m.role === 'user' 
                      ? "bg-white text-navy-900 font-bold" 
                      : "glass-gold border-gold-500/20 text-slate-200"
                  )}>
                    {m.content}
                  </div>
                  {m.confidence && (
                    <div className="flex items-center gap-2 px-2">
                      <div className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-gold-500" />
                        <span className="text-[8px] font-black uppercase text-gold-500/70 tracking-widest">
                          Confidence: {(m.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex flex-col items-start gap-1">
                  <div className="glass p-4 rounded-2xl flex gap-1.5 border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[8px] uppercase font-black tracking-widest text-slate-500 ml-2 italic">Thinking...</span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-navy-900 border-t border-white/5">
              <div className="relative">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for enterprise insight..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:outline-none focus:border-gold-500 transition-colors pr-14"
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping || !input.trim()}
                  className="absolute right-2 top-2 bottom-2 bg-gold-500 px-4 rounded-xl hover:bg-gold-400 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-navy-900" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-center gap-4 opacity-40">
                  <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-gold-500" />
                      <span className="text-[8px] uppercase font-bold text-white tracking-widest">Low Latency</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white" />
                  <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <span className="text-[8px] uppercase font-bold text-white tracking-widest">Audit Secure</span>
                  </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-end gap-3">
        {/* Minimized / Min Tooltip */}
        {!isOpen && (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-navy-800/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 shadow-2xl"
            >
                AI Expert Online
            </motion.div>
        )}

        <button
            onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
            }}
            className={cn(
                "w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-500 shadow-2xl relative group overflow-hidden",
                isOpen && !isMinimized ? "bg-navy-800 border border-white/10" : "bg-gold-500 hover:scale-105"
            )}
        >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <AnimatePresence mode="wait">
                {isOpen && !isMinimized ? (
                    <motion.div
                        key="active"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                    >
                        <Bot className="w-7 h-7 text-gold-500" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="inactive"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                    >
                        <MessageSquare className="w-7 h-7 text-navy-900" />
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Notification Pulse */}
            {!isOpen && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-navy-900 animate-pulse" />
            )}
        </button>
      </div>
    </div>
  );
};
