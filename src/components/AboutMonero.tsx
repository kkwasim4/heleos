import React from 'react';
import { motion } from 'motion/react';
import { X, Shield, Lock, Cpu, Globe, Zap, Database, ExternalLink, ArrowRight, History, Info, Layers } from 'lucide-react';

interface AboutMoneroProps {
  onClose: () => void;
}

export default function AboutMonero({ onClose }: AboutMoneroProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-muted border border-border rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-bottom border-border flex items-center justify-between sticky top-0 bg-muted z-10">
          <div className="flex items-center gap-4">
            <img 
              src="https://gold-raw-gecko-403.mypinata.cloud/ipfs/bafkreibovdg2r6r24vrbckgvgnmr4u2p4wdxfx3oh7qutcvls4ivuh3svq" 
              alt="Monero Logo" 
              className="h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">About Monero</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">The Private Digital Currency</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-muted-foreground hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12">
          {/* History Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <History size={18} className="text-orange-500" />
              <h2 className="text-lg font-bold text-white tracking-tight">A Brief History</h2>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-4 font-medium">
              <p>
                Monero was launched in April 2014. It was a fair, pre-announced launch of the CryptoNote reference code. 
                There was no premine or instamine, and no portion of the block reward goes to development. 
                The founder, <span className="text-orange-500/80">thankful_for_today</span>, proposed some controversial changes that the community disagreed with. 
                A fallout ensued, and the Monero Core Team forked the project with the community following this new Core Team. 
                This Core Team has provided oversight since.
              </p>
              <p>
                Monero has made several large improvements since launch. The blockchain was migrated to a different database structure 
                to provide greater efficiency and flexibility, minimum ring signature sizes were set so that all transactions were private by mandate, 
                and RingCT was implemented to hide the transaction amounts. 
                Monero continues to develop with goals of privacy and security first, ease of use and efficiency second.
              </p>
            </div>
          </section>

          {/* Values Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Layers size={18} className="text-orange-500" />
              <h2 className="text-lg font-bold text-white tracking-tight">Monero Values</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-black/20 rounded-xl border border-border/50 space-y-3">
                <Shield size={20} className="text-blue-400" />
                <h3 className="font-bold text-white text-sm">Security</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Users must be able to trust Monero with their transactions, without risk of error or attack. 
                  Miners provide this security, rewarded for their critical role.
                </p>
              </div>
              
              <div className="p-5 bg-black/20 rounded-xl border border-border/50 space-y-3">
                <Lock size={20} className="text-green-400" />
                <h3 className="font-bold text-white text-sm">Privacy</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Monero takes privacy seriously. It protects users fundamentally, accessible to all, 
                  ensuring financial freedom without external pressure.
                </p>
              </div>

              <div className="p-5 bg-black/20 rounded-xl border border-border/50 space-y-3">
                <Globe size={20} className="text-purple-400" />
                <h3 className="font-bold text-white text-sm">Decentralization</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Committed to high decentralization. Its ASIC-resistant PoW ensures fair distribution 
                  and open global collaboration.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Info */}
          <section className="space-y-6 bg-black/10 p-6 rounded-xl border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <Cpu size={18} className="text-orange-500" />
              <h2 className="text-lg font-bold text-white tracking-tight">Technical Info</h2>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500/70">Proof of Work</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Uses <span className="text-white font-mono">RandomX</span>: an ASIC-resistant and CPU-friendly algorithm 
                    designed to keep mining decentralized and unfeasible for specialized hardware.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500/70">Emission Curve</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Infinite emission for block rewards. Main curve completed in May 2022, 
                    followed by <span className="text-white font-mono">Tail Emission</span> (0.6 XMR per block).
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500/70">Blocks</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    New block every <span className="text-white font-mono">~2 minutes</span>. 
                    Dynamic block size with no hard limit, ensuring scalability and fee efficiency.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500/70">Privacy Technologies</h4>
                  <ul className="grid grid-cols-2 gap-y-1 text-[10px] font-mono text-white">
                    <li className="flex items-center gap-2"><ArrowRight size={10} className="text-orange-500" /> RingCT</li>
                    <li className="flex items-center gap-2"><ArrowRight size={10} className="text-orange-500" /> Stealth Addresses</li>
                    <li className="flex items-center gap-2"><ArrowRight size={10} className="text-orange-500" /> Ring Signatures</li>
                    <li className="flex items-center gap-2"><ArrowRight size={10} className="text-orange-500" /> Tor/I2P</li>
                    <li className="flex items-center gap-2"><ArrowRight size={10} className="text-orange-500" /> Dandelion++</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/40 border-t border-border flex justify-center items-center gap-4">
        </div>
      </div>
    </motion.div>
  );
}
