import React from 'react';
import { motion } from 'motion/react';
import { Wheat, HardHat, Scale, Landmark, ChevronRight } from 'lucide-react';
import { INDUSTRIES, Industry } from '../constants';
import { cn } from '../lib/utils';

export const ProductTeaser = ({ onSelect }: { onSelect: (industry: Industry) => void }) => {
  return (
    <section className="py-32 bg-navy-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-sm uppercase font-bold tracking-[0.3em] text-gold-500 mb-4 text-center">Vertical Precision</h2>
          <p className="text-4xl md:text-5xl font-bold text-white mb-6">Systems Built for Specificity.</p>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Generic AI fails when applied to specialized domains. NeXaGen products are trained on proprietary industrial datasets to deliver unparalleled accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INDUSTRIES.map((ind, i) => {
            const Icon = { Wheat, HardHat, Scale, Landmark }[ind.icon as any] || Wheat;
            return (
              <motion.div 
                key={ind.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => onSelect(ind.title)}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="glass p-10 rounded-3xl border-white/5 h-full transition-all duration-500 group-hover:-translate-y-2 group-hover:border-gold-500/30">
                  <div className="w-16 h-16 rounded-2xl bg-navy-900 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-gold-500 transition-colors duration-500">
                    <Icon className="w-8 h-8 text-gold-500 group-hover:text-navy-900 transition-colors duration-500" />
                  </div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-white">{ind.name}</h3>
                    <div className="text-xs uppercase font-bold tracking-widest text-gold-500/50">{ind.title}</div>
                  </div>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    {ind.products[0].description}
                  </p>
                  <div className="flex items-center gap-2 text-gold-500 font-bold group/btn">
                    Launch Dashboard <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
