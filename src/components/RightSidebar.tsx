import { X, ExternalLink, Shield, Lock, EyeOff, Info, TrendingUp, Cpu, Database, ArrowRight, Pickaxe, Wallet, Copy, Check, BarChart3, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { MoneroStats } from '../MoneroRPC/moneroService';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

interface RightSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onOpenAbout: () => void;
  onOpenAboutMonerai: () => void;
  onOpenMining: () => void;
}

export default function RightSidebar({ isOpen, onToggle, onOpenAbout, onOpenAboutMonerai, onOpenMining }: RightSidebarProps) {
  const [stats, setStats] = useState<MoneroStats | null>(null);
  const [priceData, setPriceData] = useState<{ time: string, price: number }[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [copiedEth, setCopiedEth] = useState(false);
  const [copiedXmr, setCopiedXmr] = useState(false);
  const [showChart, setShowChart] = useState(false);
  
  const ethAddress = "0x05a15349219A2158d0B048C8Ff186c873E490D29";
  const xmrAddress = "82c9A9CRNf9EpQaW5tpoZJUWoQqbYB2AccqgW4dhLTnUN7ZSFQd6Ej5KhfTUaVrirtCEGnRp18Mpq5swoesDbsG4LuWVLHi";

  const handleCopyEth = () => {
    navigator.clipboard.writeText(ethAddress);
    setCopiedEth(true);
    setTimeout(() => setCopiedEth(false), 2000);
  };

  const handleCopyXmr = () => {
    navigator.clipboard.writeText(xmrAddress);
    setCopiedXmr(true);
    setTimeout(() => setCopiedXmr(false), 2000);
  };

  // Fetch RPC Stats
  useEffect(() => {
    if (!isOpen) return;

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/monero/stats");
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setStats(data);
      } catch (err) {
        console.error("RPC fetch failed", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // 30s update
    return () => clearInterval(interval);
  }, [isOpen]);

  // Fetch Price Data from local proxy
  useEffect(() => {
    if (!isOpen) return;

    const fetchPrice = async () => {
      try {
        const res = await fetch("/api/monero/price");
        const data = await res.json();
        
        setCurrentPrice(data.price);
        
        // Format sparkline data
        const formattedData = data.sparkline.map((price: number, idx: number) => ({
          time: idx.toString(),
          price: price
        }));
        setPriceData(formattedData);
      } catch (err) {
        console.error("Price fetch failed", err);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 60000); // 1m update
    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <>
      <div className={`z-40 bg-black border-l border-border flex flex-col transition-all duration-300 ease-in-out fixed inset-y-0 right-0 md:relative ${isOpen ? 'translate-x-0 w-[260px]' : 'translate-x-full w-0 md:translate-x-0'}`}>
        <div className={`p-4 pt-6 h-full flex flex-col min-w-[260px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Info size={14} className="text-accent" />
              </h2>
              <button 
                onClick={() => setShowChart(!showChart)}
                className={`p-1.5 rounded-md transition-all ${showChart ? 'bg-accent/20 text-accent' : 'hover:bg-white/5 text-muted-foreground'}`}
                title="XMR Market Chart"
              >
                <BarChart3 size={16} />
              </button>
            </div>
            <button 
              onClick={onToggle}
              className="p-1.5 hover:bg-white/5 rounded-md text-muted-foreground transition-colors"
              title="Close Panel"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pb-6 px-2">
            {/* Real-time price chart removed from here to float outside */}
            
            {/* Network Real-time Stats */}
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold flex items-center gap-2">
                <Activity size={10} className="text-accent" />
                Network Real-time
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-white/5 rounded-xl border border-border/30">
                  <p className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Remaining Block</p>
                  <p className="text-xs font-mono text-white">
                    {stats ? stats.blockRemaining.toLocaleString() : "---"}
                  </p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-border/30">
                  <p className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Block Weight</p>
                  <p className="text-xs font-mono text-white">
                    {stats ? `${(stats.blockWeight / 1024).toFixed(2)} KB` : "---"}
                  </p>
                </div>
              </div>

              {/* Mini Price Chart */}
              <div className="p-3 bg-white/5 rounded-xl border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] text-muted-foreground uppercase font-bold">XMR Price (USD)</p>
                  <p className="text-xs font-mono text-accent font-bold">
                    {currentPrice ? `$${currentPrice.toFixed(2)}` : "---"}
                  </p>
                </div>
                <div className="h-16 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceData}>
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="var(--color-accent)" 
                        strokeWidth={1.5} 
                        dot={false} 
                        animationDuration={1000}
                      />
                      <YAxis hide domain={['dataMin', 'dataMax']} />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-black/90 border border-border/50 p-1 rounded text-[8px] text-white">
                                {`$${Number(payload[0].value).toFixed(2)}`}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Knowledge Base</h3>
              <button 
                onClick={onOpenAbout}
                className="w-full flex items-center justify-between p-3 bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src="https://gold-raw-gecko-403.mypinata.cloud/ipfs/bafkreibovdg2r6r24vrbckgvgnmr4u2p4wdxfx3oh7qutcvls4ivuh3svq" 
                    alt="Monero Logo" 
                    className="h-5 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-bold text-white">Learn about Monero</span>
                </div>
                <ArrowRight size={14} className="text-accent group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div>
              <button 
                onClick={onOpenMining}
                className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-border/50 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src="https://gold-raw-gecko-403.mypinata.cloud/ipfs/bafkreihl4ycbe7vzfhhsogohc4csyooomdvw6ahucatzybro7dqazzzene" 
                    alt="Mining Logo" 
                    className="h-5 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-bold text-white">Mining Monero</span>
                </div>
                <ArrowRight size={14} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div>
              <button 
                onClick={onOpenAboutMonerai}
                className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-border/50 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src="https://gold-raw-gecko-403.mypinata.cloud/ipfs/bafkreihw45rlz6sbf3iacaxayvatzthnlcyenbbefuy6ife5bpf7vn4ale" 
                    alt="MonerAi Logo" 
                    className="h-5 w-5 object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-bold text-white">
                    About Moner<span className="text-accent">Ai</span>
                  </span>
                </div>
                <ArrowRight size={14} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="pt-4 border-t border-border/20">
              <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-3">Resources</h3>
              <a 
                href="https://www.getmonero.org/downloads/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-border/50 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Wallet size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
                  <span className="text-xs font-bold text-white">Get Xmr Wallet</span>
                </div>
                <ExternalLink size={14} className="text-muted-foreground group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Donation sections at bottom */}
          <div className="mt-auto px-2 pb-4 space-y-4">
            {/* Monero Donation */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <img 
                  src="https://gold-raw-gecko-403.mypinata.cloud/ipfs/bafkreihw45rlz6sbf3iacaxayvatzthnlcyenbbefuy6ife5bpf7vn4ale" 
                  alt="XMR Logo" 
                  className="h-3.5 w-3.5 object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] text-white font-black leading-none" style={{ fontFamily: '"Arial Black", Gadget, sans-serif' }}>
                  Monero Donation CA
                </span>
              </div>
              
              <button 
                onClick={handleCopyXmr}
                className="w-full flex items-center justify-between p-2 bg-muted hover:bg-white/5 border border-border/30 rounded-lg group transition-all"
                title="Copy XMR Address"
              >
                <span className="text-[9px] font-mono text-muted-foreground truncate mr-2">
                  82c9A9...WVLHi
                </span>
                <div className="p-1.5 rounded bg-white/10 group-hover:bg-white/20 transition-colors shrink-0">
                  {copiedXmr ? (
                    <Check size={12} className="text-green-500" />
                  ) : (
                    <Copy size={12} className="text-white" />
                  )}
                </div>
              </button>
            </div>

            {/* Ethereum Donation */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <img 
                  src="https://gold-raw-gecko-403.mypinata.cloud/ipfs/bafkreiabardmi3pfjklibbkjskeqko5qt3m6ed5ikhur23i3rwbik32qvm" 
                  alt="ETH Logo" 
                  className="h-3.5 w-3.5 object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] text-white font-black leading-none" style={{ fontFamily: '"Arial Black", Gadget, sans-serif' }}>
                  Ethereum CA donation
                </span>
              </div>
              
              <button 
                onClick={handleCopyEth}
                className="w-full flex items-center justify-between p-2 bg-muted hover:bg-white/5 border border-border/30 rounded-lg group transition-all"
                title="Copy ETH Address"
              >
                <span className="text-[9px] font-mono text-muted-foreground">
                  0x05a1...0D29
                </span>
                <div className="p-1.5 rounded bg-white/10 group-hover:bg-white/20 transition-colors">
                  {copiedEth ? (
                    <Check size={12} className="text-green-500" />
                  ) : (
                    <Copy size={12} className="text-white" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating TradingView Chart */}
      <AnimatePresence>
        {showChart && isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-20 bottom-20 md:inset-auto md:top-24 md:right-[280px] z-50 md:w-[80vw] md:max-w-[800px] md:h-[500px] bg-black/90 backdrop-blur-xl rounded-2xl border border-accent/30 shadow-2xl shadow-accent/10 overflow-hidden flex flex-col"
          >
            <div className="p-3 border-b border-border/50 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-accent" />
                <span className="text-[10px] uppercase tracking-widest text-white font-bold">XMR / USDT - Live Market</span>
              </div>
              <button 
                onClick={() => setShowChart(false)}
                className="p-1 hover:bg-white/10 rounded text-muted-foreground hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 w-full relative">
              <iframe 
                src="https://s.tradingview.com/widgetembed/?symbol=KRAKEN:XMRUSDT&interval=D&theme=dark&style=1&timezone=Etc%2FUTC"
                title="TradingView Chart"
                className="absolute inset-0 w-full h-full border-0"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
