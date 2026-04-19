import React from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Brain, Cpu, Shield, Zap, Info, MessageSquare, Terminal, Activity } from 'lucide-react';

interface AboutMoneraiProps {
  onClose: () => void;
}

export default function AboutMonerai({ onClose }: AboutMoneraiProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl"
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-muted border border-border rounded-2xl overflow-hidden flex flex-col shadow-2xl relative">
        {/* Background glow effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-muted/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <img 
              src="https://gold-raw-gecko-403.mypinata.cloud/ipfs/bafkreihw45rlz6sbf3iacaxayvatzthnlcyenbbefuy6ife5bpf7vn4ale" 
              alt="MonerAi Logo" 
              className="h-8 w-8 object-contain"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                About Moner<span className="text-orange-500">Ai</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Uncensored Decentralized Intelligence</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-muted-foreground hover:text-white transition-colors border border-transparent hover:border-border"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12">
          {/* Mission Section */}
          <section className="space-y-6">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6 tracking-tight leading-tight">
                Experimental <span className="text-orange-500">Decentralized Intelligence</span>
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed font-medium">
                <p>
                  MonerAi is an experimental, decentralized intelligence initiative developed by the <span className="text-white font-bold">what@happens_tomorrow</span> team. It is inspired by the principles and values commonly associated with the Monero (XMR) ecosystem, particularly around privacy, open research, and user autonomy.
                </p>
                <p>
                  The project aims to explore new approaches to information discovery, technical research, and decentralized knowledge systems. It is designed for users who are interested in topics such as cryptography, privacy-preserving technologies, decentralized finance, and emerging digital infrastructure.
                </p>
                <p>
                  Unlike traditional centralized systems, MonerAi explores more open and flexible information access models. However, it operates with awareness of real-world constraints, including safety, ethical considerations, and applicable legal frameworks.
                </p>
                <p>
                  MonerAi is developed independently by the what@happens_tomorrow team, a group of contributors focused on experimental systems, privacy-oriented technologies, and decentralized architectures.
                </p>
                <p>
                  Privacy is an important design consideration. The system aims to minimize unnecessary data retention and reduce exposure of user interactions wherever possible, depending on implementation and environment.
                </p>
                <p>
                  MonerAi is intended for builders, researchers, and individuals interested in open systems, digital sovereignty, and privacy-focused technology exploration.
                </p>
              </div>
            </div>
          </section>

          {/* MRA Token Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-orange-500" />
              <h2 className="text-lg font-bold text-white tracking-tight">MRA Token Ecosystem</h2>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-orange-500/10 to-transparent rounded-2xl border border-orange-500/20">
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="shrink-0 p-2 bg-black/40 rounded-full border border-orange-500/30 overflow-hidden">
                    <img 
                      src="https://gold-raw-gecko-403.mypinata.cloud/ipfs/bafkreihw45rlz6sbf3iacaxayvatzthnlcyenbbefuy6ife5bpf7vn4ale" 
                      alt="MRA Logo" 
                      className="h-6 w-6 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="text-xl font-black text-white leading-none">$MRA Token</h3>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed font-medium">
                    <p>
                      MonerAi is a decentralized, privacy-oriented AI designed for minimal filtering and high-signal output — built for speed, precision, and uncompromised technical depth.
                    </p>
                    <p>
                      MRA is the utility token powering the MonerAi ecosystem, bridging high-performance AI systems with the decentralized ethos of Monero.
                    </p>
                    <p>
                      MRA unlocks priority execution, advanced technical capabilities, and a more flexible query layer — enabling a faster, deeper, and less restricted AI interaction environment.
                    </p>
                    <p>
                      Built on the Ethereum ERC-20 standard, MRA leverages a mature and highly liquid infrastructure for accessibility, composability, and seamless integration across the broader decentralized ecosystem — while aligning its long-term value with privacy-focused principles.
                    </p>
                    <p>
                      All contributions and ecosystem revenue are directed toward strengthening privacy-aligned infrastructure, including ongoing efforts to deepen Monero liquidity over time.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <div className="p-3 bg-black/20 rounded-lg border border-border/50 text-center">
                      <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Ticker</p>
                      <p className="text-xs font-black text-white">$MRA</p>
                    </div>
                     <div className="p-3 bg-black/20 rounded-lg border border-border/50 text-center">
                      <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Network</p>
                      <p className="text-xs font-black text-white">ERC-20 / Ethereum</p>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg border border-border/50 text-center">
                      <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Total Supply</p>
                      <p className="text-xs font-black text-white">2,100,000</p>
                    </div>
                    <div className="p-3 bg-black/20 rounded-lg border border-border/50 text-center">
                      <p className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Feature</p>
                      <p className="text-xs font-black text-white">AI Utility</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          {/* Features Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-2 mb-2">
              <Terminal size={18} className="text-orange-500" />
              <h2 className="text-lg font-bold text-white tracking-tight">Core Features</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-orange-500/70" />
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Real-time Stats</h4>
                </div>
                <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
                  Direct integration with Monero RPC nodes to provide accurate network data, height, 
                  difficulty, and hashrate information instantly.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-orange-500/70" />
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Smart Analysis</h4>
                </div>
                <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
                  Explain technical Monero documentation, help with wallet setup, or analyze 
                  mining profitability through intuitive natural language.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Cpu size={14} className="text-orange-500/70" />
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Open Source Spirit</h4>
                </div>
                <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
                  Built for the community. MonerAi evolves through community feedback and contributions, 
                  staying true to the cypherpunk ethos.
                </p>
              </div>
            </div>
          </section>

          {/* Project Positioning Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} className="text-orange-500" />
              <h2 className="text-lg font-bold text-white tracking-tight">Project Positioning (English)</h2>
            </div>
            
            <div className="p-8 bg-black/20 rounded-2xl border border-border/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Info size={120} className="text-white" />
              </div>
              <div className="relative z-10 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  Developed by the <span className="text-white font-bold">what@happens_tomorrow</span> team, MonerAi is an independent initiative focused on exploring open and privacy-oriented approaches to cryptographic and decentralized knowledge systems.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  MonerAi is guided by principles inspired by the Monero (XMR) philosophy, including privacy by design, decentralization, and resistance to unnecessary centralized control in information systems.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  The project is built for research-oriented use cases, particularly in areas such as cryptography, privacy-preserving infrastructure, and decentralized financial ecosystems.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  Where applicable, MonerAi integrates structured and verifiable data sources, including public market information streams and blockchain-related interfaces, to support more accurate and transparent analysis of live or near-real-time metrics. However, all outputs should be understood as system-assisted interpretations rather than absolute guarantees of correctness.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  MonerAi is intended as an experimental and evolving system for builders, researchers, and communities interested in decentralized technologies, digital privacy, and open information exploration.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4 border-t border-border/20">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-full border border-orange-500/20">
                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Version: 1.0.0</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-black/20 flex justify-center items-center">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
            Developed by <span className="text-white font-bold tracking-tighter">what@happens_tomorrow</span> — Inspired and Pure XMR
          </p>
        </div>
      </div>
    </motion.div>
  );
}
