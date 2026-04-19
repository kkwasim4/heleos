import React from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Clock, Globe } from 'lucide-react';

interface UpgradePlanProps {
  onClose: () => void;
}

export default function UpgradePlan({ onClose }: UpgradePlanProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-xl p-10 bg-muted/10 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-accent/20"
      >
        {/* Background Accent */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-muted-foreground hover:text-white transition-all transform hover:rotate-90 duration-300 z-10"
        >
          <X size={20} />
        </button>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mb-8">
            <Sparkles className="text-accent" size={32} />
          </div>

          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 leading-tight max-w-sm">
            System Evolution <span className="text-accent">In Progress</span>
          </h2>

          <div className="space-y-6 text-sm text-muted-foreground font-medium uppercase tracking-widest leading-relaxed">
            <p className="text-white/80">
              MonerAi is temporarily unavailable as we upgrade our system and introduce a new plan structure, currently in its trial phase.
            </p>
            
            <div className="flex items-center justify-center gap-3 py-4 border-y border-white/5">
              <Clock size={16} className="text-accent" />
              <p className="text-[10px] text-accent font-black">
                Your free trial will automatically reset after 24 hours.
              </p>
            </div>

            <p className="text-white/40 italic">
              We’ll be back soon — stay tuned.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="mt-10 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all"
          >
            Acknowledge Protocols
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
