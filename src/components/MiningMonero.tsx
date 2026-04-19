import React from 'react';
import { motion } from 'motion/react';
import { X, Cpu, HardDrive, Pickaxe, Zap, ExternalLink, ArrowRight, Shield, Database, Github, Terminal } from 'lucide-react';

interface MiningMoneroProps {
  onClose: () => void;
}

export default function MiningMonero({ onClose }: MiningMoneroProps) {
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
              src="https://gold-raw-gecko-403.mypinata.cloud/ipfs/bafkreihl4ycbe7vzfhhsogohc4csyooomdvw6ahucatzybro7dqazzzene" 
              alt="Mining Logo" 
              className="h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Mining Monero</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Secure the Network, Earn Reward</p>
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
          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Monero is a cryptocurrency that relies on proof-of-work mining to achieve distributed consensus. 
              Below you'll find some information and resources on how to begin mining. 
              The Monero Project does not endorse any particular pool, software, or hardware, 
              and the content below is provided for informational purposes only.
            </p>
          </section>

          {/* Proof of Work */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-orange-500" />
              <h2 className="text-lg font-bold text-white tracking-tight">Proof of Work</h2>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-4 font-medium">
              <p>
                One of Monero's philosophies is to maintain egalitarian mining, so that everyone can have the possibility to mine. 
                To achieve this, Monero uses a particular algorithm ideated and developed by members of the Monero community: <span className="text-white font-mono">RandomX</span>. 
                This PoW algorithm is ASIC resistant, which means it's impossible to build specialized hardware to mine Monero. 
                Miners must use consumer-grade hardware and compete fairly.
              </p>
              <p>
                Monero can be mined by both CPUs and GPUs, but the former is much more efficient.
              </p>
            </div>
          </section>

          {/* Solo or Pool */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Database size={18} className="text-orange-500" />
              <h2 className="text-lg font-bold text-white tracking-tight">Solo or Pool mining</h2>
            </div>
            
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed font-medium">
              <p>
                Miners can decide if they prefer to solo mine or to mine in a pool. Each method has its benefits and drawbacks, 
                but the Monero Project encourages individuals to solo mine using the Monero software (GUI and CLI). 
                Mining using <span className="text-orange-500/80">P2Pool</span> is also encouraged.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-5 bg-black/20 rounded-xl border border-border/50 space-y-3">
                  <h3 className="font-bold text-white text-sm">Solo Mining</h3>
                  <ul className="text-xs space-y-2">
                    <li className="flex gap-2"><ArrowRight size={12} className="text-orange-500 shrink-0 mt-0.5" /> Makes the network more secure than if mining in a pool</li>
                    <li className="flex gap-2"><ArrowRight size={12} className="text-orange-500 shrink-0 mt-0.5" /> You can mine using your Monero wallet. No need for additional software</li>
                    <li className="flex gap-2"><ArrowRight size={12} className="text-orange-500 shrink-0 mt-0.5" /> Payouts can be irregular (the 'lottery' effect)</li>
                  </ul>
                </div>
                
                <div className="p-5 bg-black/20 rounded-xl border border-border/50 space-y-3">
                  <h3 className="font-bold text-white text-sm">Pool Mining</h3>
                  <ul className="text-xs space-y-2">
                    <li className="flex gap-2"><ArrowRight size={12} className="text-orange-500 shrink-0 mt-0.5" /> Frequent payouts based on participation</li>
                    <li className="flex gap-2"><ArrowRight size={12} className="text-orange-500 shrink-0 mt-0.5" /> Requires paying a fee to the pool operator</li>
                    <li className="flex gap-2"><ArrowRight size={12} className="text-orange-500 shrink-0 mt-0.5" /> Centralization risks if one pool grows too large</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* P2Pool Section */}
          <section className="space-y-6 bg-orange-500/5 p-6 rounded-xl border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} className="text-orange-500" />
              <h2 className="text-lg font-bold text-white tracking-tight">P2Pool: The best of both worlds</h2>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-4 font-medium">
              <p>
                P2Pool is a clever new way of mining Monero, which allows miners to receive the frequent payouts offered by pools 
                without needing to trust a centralized pool. It is a Peer-To-Peer mining pool that gives miners full control over their Monero node.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 pt-2">
                <div className="space-y-1">
                  <span className="text-[10px] text-orange-500/70 uppercase font-bold tracking-widest">Fee</span>
                  <p className="text-white text-xs font-mono font-bold">0%</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-orange-500/70 uppercase font-bold tracking-widest">Min Payout</span>
                  <p className="text-white text-xs font-mono font-bold">&lt; 0.0004 XMR</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-orange-500/70 uppercase font-bold tracking-widest">Trust</span>
                  <p className="text-white text-xs font-bold">100% Trustless</p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[10px] text-white bg-white/5 px-2 py-1 rounded">
                  <ArrowRight size={10} className="text-orange-500" /> Decentralized
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white bg-white/5 px-2 py-1 rounded">
                  <ArrowRight size={10} className="text-orange-500" /> Permissionless
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white bg-white/5 px-2 py-1 rounded">
                  <ArrowRight size={10} className="text-orange-500" /> PPLNS Payouts
                </div>
              </div>
            </div>
          </section>

          {/* Hardware & Software */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2 text-white">
                <HardDrive size={18} className="text-orange-500" />
                <h3 className="font-bold">Hardware</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Monero can be mined on both CPUs and GPUs, but the latter is much less efficient. 
                Check <span className="text-white">xmrig benchmarks</span> to see how your hardware performs.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2 text-white">
                <Terminal size={18} className="text-orange-500" />
                <h3 className="font-bold">Software</h3>
              </div>
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Options include the GUI/CLI wallets (Solo), or dedicated software like:
                </p>
                <div className="flex flex-wrap gap-2">
                  <a 
                    href="https://github.com/xmrig/xmrig" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] font-mono bg-black px-2 py-1 rounded border border-border text-white hover:bg-white/5 hover:border-orange-500/50 transition-colors group"
                  >
                    XMRig <ExternalLink size={10} className="text-muted-foreground group-hover:text-orange-500" />
                  </a>
                  <a 
                    href="https://github.com/cryptonote-social/csminer" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] font-mono bg-black px-2 py-1 rounded border border-border text-white hover:bg-white/5 hover:border-orange-500/50 transition-colors group"
                  >
                    CSminer <ExternalLink size={10} className="text-muted-foreground group-hover:text-orange-500" />
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/40 border-t border-border flex justify-center items-center">
        </div>
      </div>
    </motion.div>
  );
}
