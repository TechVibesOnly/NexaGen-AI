import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, Cpu, ShieldCheck, Zap, Globe, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { INDUSTRIES } from '../constants';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "py-4 glass-gold border-b border-gold-500/10" : "py-6 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-gold-500 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <Cpu className="text-navy-900 w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white">
            NeXa<span className="text-gold-500">Gen</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <div className="group relative">
            <button className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Products <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-64 glass p-4 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              {INDUSTRIES.map((ind) => (
                <a key={ind.name} href="#" className="block p-3 rounded-lg hover:bg-white/5 transition-colors group/item">
                  <span className="block text-sm font-semibold text-white group-hover/item:text-gold-400">{ind.name}</span>
                  <span className="block text-xs text-slate-400">{ind.title} Intelligence</span>
                </a>
              ))}
            </div>
          </div>
          <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Industries</a>
          <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</a>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
            Login
          </button>
          <button className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold px-5 py-2.5 rounded-lg transition-all active:scale-95 text-sm">
            Request Demo
          </button>
        </div>

        <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/10 mt-4 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-6">
              {INDUSTRIES.map((ind) => (
                <a key={ind.name} href="#" className="text-lg font-medium text-white">{ind.name}</a>
              ))}
              <hr className="border-white/10" />
              <button className="w-full bg-gold-500 text-navy-900 font-bold py-4 rounded-xl">Request Demo</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const Footer = () => (
  <footer className="bg-navy-900 border-t border-white/5 pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Cpu className="text-gold-500 w-8 h-8" />
          <span className="text-2xl font-bold tracking-tighter text-white">NeXaGen</span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
          Empowering the backbone industries of civilization with advanced, vertical-specific artificial intelligence.
        </p>
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold-500/20 cursor-pointer transition-colors">
            <Globe className="w-4 h-4 text-gold-500" />
          </div>
          {/* Add more icons as needed */}
        </div>
      </div>

      <div>
        <h4 className="text-white font-bold mb-6">Verticals</h4>
        <ul className="space-y-4">
          {INDUSTRIES.map(i => (
            <li key={i.title}><a href="#" className="text-slate-400 hover:text-gold-500 text-sm transition-colors">{i.name} ({i.title})</a></li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-white font-bold mb-6">Company</h4>
        <ul className="space-y-4">
          <li><a href="#" className="text-slate-400 hover:text-gold-500 text-sm transition-colors">About NeXaGen</a></li>
          <li><a href="#" className="text-slate-400 hover:text-gold-500 text-sm transition-colors">Careers</a></li>
          <li><a href="#" className="text-slate-400 hover:text-gold-500 text-sm transition-colors">Press & Media</a></li>
          <li><a href="#" className="text-slate-400 hover:text-gold-500 text-sm transition-colors">Contact</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-bold mb-6">Stay Ahead</h4>
        <p className="text-slate-400 text-sm mb-4">Subscribe to our vertical AI insights.</p>
        <div className="relative">
          <input 
            type="email" 
            placeholder="Work Email" 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
          />
          <button className="absolute right-2 top-2 bottom-2 bg-gold-500 p-2 rounded-md hover:bg-gold-400 transition-colors">
            <ArrowRight className="w-4 h-4 text-navy-900" />
          </button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-12 mb-8">
      <div className="p-4 rounded-xl glass border-gold-500/10 bg-gold-500/5 flex items-center justify-center gap-3 text-center">
        <ShieldCheck className="w-4 h-4 text-gold-500" />
        <p className="text-[10px] sm:text-xs font-bold text-gold-400 uppercase tracking-[0.1em]">
          This is a confidential demonstration build for NeXaGen AI. All data is synthetic. For hackathon / investor presentation use only.
        </p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 uppercase tracking-widest">
      <p>© 2026 NeXaGen AI Systems. Built for the Physical World.</p>
      <div className="flex gap-8">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Security (SOC2)</a>
      </div>
    </div>
  </footer>
);
