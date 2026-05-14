import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BarChart3, Database, Shield } from 'lucide-react';
import { INDUSTRIES } from '../constants';

export const Hero = ({ onNavigate }: { onNavigate: (nav: string) => void }) => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1000px] pointer-events-none opacity-30">
        <img 
          src="https://picsum.photos/seed/navy_grid/1920/1080?blur=10" 
          alt="" 
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-navy-900/60" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 glass-gold px-3 py-1.5 rounded-full mb-8">
            <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-gold-300">Vertical AI for the Real World</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.05]">
            AI That Speaks <br />
            <span className="text-gradient">Farmer. Builder. Lawyer. Gov.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
            The backbone of civilization runs on iron, dirt, and precedent. 
            Generic Silicon Valley AI fails here. NeXaGen is the first enterprise platform 
            built specifically for the physical and regulatory world.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold px-8 py-5 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 text-lg"
            >
              Explore the Platform <ArrowRight className="w-5 h-5" />
            </button>
            <button className="glass hover:bg-white/10 text-white font-bold px-8 py-5 rounded-xl transition-all flex items-center gap-3 text-lg border border-white/20">
              Watch Vision Film
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24">
          {[
            { label: 'Trusted by', value: '42 Fortune 500s', icon: <Shield className="w-4 h-4 text-gold-500" /> },
            { label: 'Total Managed Assets', value: '$840 Billion', icon: <Database className="w-4 h-4 text-gold-500" /> },
            { label: 'Efficiency Gain', value: '42.4% Avg.', icon: <BarChart3 className="w-4 h-4 text-gold-500" /> },
            { label: 'Active Countries', value: '18 Systems', icon: <Globe className="w-4 h-4 text-gold-500" /> }
          ].map((stat, i) => (
            <motion.div 
               key={stat.label}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 + (i * 0.1) }}
               className="glass p-6 rounded-2xl border-white/5"
            >
              <div className="flex items-center gap-2 mb-2">
                {stat.icon}
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

function Globe({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20"/><path d="M2 12h20"/>
    </svg>
  );
}
