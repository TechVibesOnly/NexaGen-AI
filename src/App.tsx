/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar, Footer } from './components/Navigation';
import { Hero } from './components/Hero';
import { TrustBar, StatsRow, ProblemSection, Philosophy, FinalCTA } from './components/LandingSections';
import { ProductTeaser } from './components/ProductTeaser';
import { DashboardHub } from './components/DashboardHub';
import { Industry } from './constants';

type AppState = 'landing' | 'dashboard' | 'about' | 'industries';

export default function App() {
  const [view, setView] = useState<AppState>('landing');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>('Agriculture');

  const handleNavigateToDashboard = (industry: Industry = 'Agriculture') => {
    setSelectedIndustry(industry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView('dashboard');
  };

  const handleGoHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView('landing');
  };

  return (
    <div className="relative min-h-screen text-slate-200 selection:bg-gold-500/30 selection:text-gold-300 overflow-x-hidden">
      <Navbar />
      
      <main className="relative">
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Hero onNavigate={() => handleNavigateToDashboard('Agriculture')} />
              <TrustBar />
              <StatsRow />
              <ProblemSection />
              <Philosophy />
              
              {/* Trust Section / Stats / Details */}
              <div className="max-w-7xl mx-auto px-6 mb-32">
                <div className="glass p-12 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Built for the Physical World.</h2>
                      <p className="text-slate-400 leading-relaxed mb-8 text-lg">
                        Our systems aren't just software wrappers. They are purpose-built models trained on 
                        terabytes of proprietary industrial data, calibrated for real-world precision.
                      </p>
                      <div className="flex gap-4">
                        <div className="glass-gold px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gold-400">Low Latency</div>
                        <div className="glass px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400">SOC2 Certified</div>
                        <div className="glass px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400">Private VPC</div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="aspect-video glass rounded-2xl border-white/10 overflow-hidden relative">
                         <img 
                          src="https://picsum.photos/seed/industrial_8/800/450" 
                          alt="Industrial AI Visualization"
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-navy-900/40 pointer-events-none" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full glass flex items-center justify-center animate-pulse shadow-2xl">
                             <div className="w-4 h-4 bg-gold-500 rounded-full" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute -bottom-6 -right-6 glass p-6 rounded-2xl shadow-2xl">
                        <div className="text-3xl font-bold text-gold-500 tracking-tighter">+42.4%</div>
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Efficiency Delta</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ProductTeaser onSelect={handleNavigateToDashboard} />
              <FinalCTA />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <DashboardHub initialIndustry={selectedIndustry} onBack={handleGoHome} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      
      {/* Background Decorative Gradient */}
      <div className="fixed top-0 left-0 w-full h-[500px] pointer-events-none -z-10">
        <div className="absolute top-[-100px] left-[-10%] w-[60%] h-[120%] bg-gold-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-[-100px] right-[-10%] w-[50%] h-[120%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}

