import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Quote, Trophy, Globe, Users, Building2, Landmark, Gavel, Tractor, Construction } from 'lucide-react';
import { cn } from '../lib/utils';

export const TrustBar = () => (
  <div className="py-12 border-y border-white/5 bg-navy-900/50 overflow-hidden relative">
    <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-slate-500 mb-6">Secured Partnerships with Global Industry Leaders</p>
    </div>
    <div className="flex gap-12 items-center justify-center animate-scroll opacity-40 grayscale group-hover:grayscale-0 transition-all">
       {/* Mock logos as stylized text/icons for clean look */}
       {[
           { name: 'DEERE & CO', icon: <Tractor className="w-5 h-5"/> },
           { name: 'BECHTEL', icon: <Building2 className="w-5 h-5"/> },
           { name: 'SLAUGHTER & MAY', icon: <Gavel className="w-5 h-5"/> },
           { name: 'US STAKEHOLDER', icon: <Landmark className="w-5 h-5"/> },
           { name: 'SKANSKA', icon: <Construction className="w-5 h-5"/> }
       ].map((logo, i) => (
           <div key={i} className="flex items-center gap-2 whitespace-nowrap">
               {logo.icon}
               <span className="text-xl font-black tracking-tighter text-white">{logo.name}</span>
           </div>
       ))}
    </div>
    
    <div className="max-w-4xl mx-auto px-6 mt-16 text-center">
        <Quote className="w-8 h-8 text-gold-500/20 mx-auto mb-4" />
        <p className="text-xl text-slate-300 italic font-medium leading-relaxed">
            "NeXaGen represents the most significant shift in industrial productivity since the mechanization era. 
            They aren't just selling AI; they are selling $847 Billion in reclaimed time."
        </p>
        <div className="mt-4 text-sm font-bold text-slate-500 uppercase tracking-widest">— Qualtrics Industrial AI Study 2026</div>
    </div>
  </div>
);

export const StatsRow = () => {
    const stats = [
        { label: 'Total Addressable Market', value: '$847B', sub: 'Non-Tech GDP' },
        { label: 'Digital Adoption Rate', value: '<12%', sub: 'Active Gap' },
        { label: 'Foundation Workforce', value: '500M+', sub: 'Global Scale' },
        { label: 'Cloud Deployment', value: 'Instant', sub: 'Zero-Infra' }
    ];

    return (
        <section className="py-24 relative">
             <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="glass p-8 rounded-3xl border-white/5 text-center relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gold-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <div className="relative z-10">
                            <div className="text-4xl font-black text-gold-500 mb-2 tracking-tighter">{stat.value}</div>
                            <div className="text-sm font-bold text-white mb-1">{stat.label}</div>
                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{stat.sub}</div>
                        </div>
                    </motion.div>
                ))}
             </div>
        </section>
    );
};

export const ProblemSection = () => (
    <section className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-sm uppercase font-bold tracking-[0.3em] text-gold-500 mb-6">The Crisis</h2>
                <h3 className="text-5xl font-bold text-white mb-8 leading-tight">The Missing Trillions.</h3>
                <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
                    <p>
                        While Silicon Valley optimized ad-clicks and social feeds, the backbone of civilization—the sectors that provide our food, our shelter, and our laws—was left behind.
                    </p>
                    <p className="text-white font-medium">
                        90% of global GDP is produced in "Complex Real-World Environments." Yet only 2% of AI investment reaches these frontlines.
                    </p>
                    <p>
                        NeXaGen exists to close this gap. We build for the mud, the steel, and the courtroom. Not the metaverse.
                    </p>
                </div>
            </motion.div>
            <div className="relative">
                <div className="aspect-square glass rounded-[3rem] p-1 border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/20 to-transparent z-10" />
                    <img 
                        src="https://picsum.photos/seed/industrial_complex/1000/1000" 
                        alt="Industrial Complexity" 
                        className="w-full h-full object-cover grayscale opacity-50"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="glass p-10 rounded-full animate-slow-spin flex items-center justify-center border-gold-500/30">
                            <Trophy className="w-12 h-12 text-gold-500" />
                        </div>
                    </div>
                </div>
                {/* Decorative floating labels */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    className="absolute -top-6 -left-6 glass-gold px-6 py-4 rounded-2xl z-30"
                >
                    <div className="text-xs font-bold text-gold-400">Inefficiency Cost</div>
                    <div className="text-2xl font-black text-white">$14.2 Trillion</div>
                </motion.div>
            </div>
        </div>
    </section>
);

export const Philosophy = () => (
    <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
                <h2 className="text-sm uppercase font-bold tracking-[0.3em] text-gold-500 mb-4">Founding Protocol</h2>
                <p className="text-4xl font-bold text-white mb-6">Vertical Integration. Zero Friction.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { 
                        title: 'Apple-Grade UI', 
                        desc: "Industrial software shouldn't feel like a spreadsheet. We prioritize cognitive ease for field operators.",
                        icon: <Users className="w-6 h-6" />
                    },
                    { 
                        title: 'Military Security', 
                        desc: "Air-gapped data protocols ensuring proprietary IP never leaves your organizational perimeter.",
                        icon: <ShieldCheck className="w-6 h-6" /> 
                    },
                    { 
                        title: 'Tesla-Speed Iteration', 
                        desc: "Our models learn from every jobsite, harvest, and legal brief across the network (anonymously).",
                        icon: <Globe className="w-6 h-6" />
                    }
                ].map((item, i) => (
                    <motion.div 
                        key={item.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="glass p-10 rounded-[2.5rem] border-white/5 hover:border-gold-500/20 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-gold-500 flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform">
                            <div className="text-navy-900">{item.icon}</div>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-4">{item.title}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}

export const FinalCTA = () => (
    <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
            <div className="glass p-16 md:p-24 rounded-[3rem] border-white/10 relative overflow-hidden text-center">
                 <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 via-transparent to-navy-900 pointer-events-none" />
                 <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter">The future of foundation is being written now.</h2>
                    <p className="text-xl text-slate-400 mb-12">
                        Deploy vertical-specific intelligence in weeks, not years. 
                        Join the waiting list for our next deployment cycle.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-10 py-5 rounded-2xl transition-all shadow-[0_0_40px_-5px_rgba(212,175,55,0.4)]">
                            Request Demo Access
                        </button>
                        <button className="glass hover:bg-white/10 text-white font-bold px-10 py-5 rounded-2xl transition-all">
                            Speak to an Advisor
                        </button>
                    </div>
                 </div>
            </div>
        </div>
    </section>
);
