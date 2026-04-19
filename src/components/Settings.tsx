import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Moon, Sun, Trash2, Shield, User, Zap, Cpu, Type, Palette, Layout, Hash } from 'lucide-react';

interface SettingsProps {
  onClose: () => void;
  onClearHistory: () => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  temperature: number;
  setTemperature: (temp: number) => void;
  showRightSidebar: boolean;
  setShowRightSidebar: (show: boolean) => void;
  isUnlimited: boolean;
  onVerifyCode: (code: string) => Promise<boolean>;
}

export default function Settings({ 
  onClose, 
  onClearHistory, 
  accentColor, 
  setAccentColor,
  fontSize,
  setFontSize,
  temperature,
  setTemperature,
  showRightSidebar,
  setShowRightSidebar,
  isUnlimited,
  onVerifyCode
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'intelligence' | 'privacy'>('general');
  const [isConfirmingWipe, setIsConfirmingWipe] = useState(false);
  const [wipeCountdown, setWipeCountdown] = useState(9);
  const [guixCode, setGuixCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isConfirmingWipe && wipeCountdown > 0) {
      timer = setInterval(() => {
        setWipeCountdown(prev => prev - 1);
      }, 1000);
    } else if (isConfirmingWipe && wipeCountdown === 0) {
      onClearHistory();
      onClose();
    }
    return () => clearInterval(timer);
  }, [isConfirmingWipe, wipeCountdown, onClearHistory, onClose]);

  const startWipeProcess = () => {
    setIsConfirmingWipe(true);
    setWipeCountdown(9);
  };

  const cancelWipe = () => {
    setIsConfirmingWipe(false);
    setWipeCountdown(9);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
    >
      <AnimatePresence mode="wait">
        {isConfirmingWipe ? (
          <motion.div 
            key="confirm-wipe"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm p-8 bg-red-950/20 border border-red-500/50 rounded-3xl text-center backdrop-blur-3xl shadow-2xl shadow-red-900/40"
          >
            <div className="mb-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-red-500 flex items-center justify-center mb-4 relative overflow-hidden">
                <span className="text-3xl font-black text-red-500">{wipeCountdown}</span>
                <motion.div 
                  initial={{ height: "100%" }}
                  animate={{ height: "0%" }}
                  transition={{ duration: 9, ease: "linear" }}
                  className="absolute bottom-0 left-0 right-0 bg-red-500/10"
                />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Self Destruct Initated</h3>
              <p className="text-xs text-red-400 mt-2 font-bold uppercase tracking-widest animate-pulse">Are you absolutely sure?</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  onClearHistory();
                  onClose();
                }}
                className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-[0.2em] rounded-xl hover:bg-red-500 transition-all shadow-lg shadow-red-900/40"
              >
                Yes, Purge Everything
              </button>
              <button 
                onClick={cancelWipe}
                className="w-full py-3 bg-white/5 text-muted-foreground hover:text-white font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all"
              >
                Abort Mission (No)
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="settings-main"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="relative w-full max-w-2xl bg-muted/20 border border-border rounded-3xl overflow-hidden flex flex-col md:flex-row h-[500px]"
          >
            {/* Sidebar */}
            <div className="w-full md:w-48 bg-muted/30 border-b md:border-b-0 md:border-r border-border p-4 flex flex-row md:flex-col gap-2">
              <button 
                onClick={() => setActiveTab('general')}
                className={`flex-1 md:flex-none flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'general' ? 'bg-accent text-white shadow-lg' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
              >
                <Cpu size={14} />
                <span>General</span>
              </button>
              <button 
                onClick={() => setActiveTab('intelligence')}
                className={`flex-1 md:flex-none flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'intelligence' ? 'bg-accent text-white shadow-lg' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
              >
                <Zap size={14} />
                <span>Brain</span>
              </button>
              <button 
                onClick={() => setActiveTab('privacy')}
                className={`flex-1 md:flex-none flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'privacy' ? 'bg-accent text-white shadow-lg' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
              >
                <Shield size={14} />
                <span>Privacy</span>
              </button>

              <button 
                onClick={onClose}
                className="md:hidden p-2 text-muted-foreground hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto relative">
              <button 
                onClick={onClose}
                className="hidden md:block absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full text-muted-foreground hover:text-white transition-all transform hover:rotate-90 duration-300"
              >
                <X size={20} />
              </button>

              {activeTab === 'general' && (
                <div className="space-y-8 h-full flex flex-col">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tighter">Interface Configuration</h3>
                    <div className="space-y-4">
                      {/* Accent Color */}
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                          <Palette size={16} className="text-accent" />
                          <p className="text-xs font-bold text-white uppercase tracking-widest">Accent Core Color</p>
                        </div>
                        <div className="flex gap-4">
                          {[
                            { name: 'Orange', color: '#f97316' },
                            { name: 'Blue', color: '#3b82f6' },
                            { name: 'Green', color: '#22c55e' },
                            { name: 'Dark Gray', color: '#444444' }
                          ].map((c) => (
                            <button
                              key={c.name}
                              onClick={() => setAccentColor(c.color)}
                              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${accentColor === c.color ? 'border-white scale-110' : 'border-transparent'}`}
                              style={{ backgroundColor: c.color }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Font Size */}
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                          <Type size={18} className="text-accent" />
                          <div>
                            <p className="text-xs font-bold text-white uppercase tracking-widest">Font Magnitude</p>
                            <p className="text-[10px] text-muted-foreground uppercase opacity-60">Global text scaling</p>
                          </div>
                        </div>
                        <div className="flex bg-black p-1 rounded-xl border border-white/5">
                          {(['small', 'medium', 'large'] as const).map((s) => (
                            <button 
                              key={s}
                              onClick={() => setFontSize(s)}
                              className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-widest transition-all ${fontSize === s ? 'bg-accent text-white shadow-lg' : 'text-muted-foreground hover:text-white'}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sidebar Toggle */}
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                          <Layout size={18} className="text-accent" />
                          <div>
                            <p className="text-xs font-bold text-white uppercase tracking-widest">Information Rail</p>
                            <p className="text-[10px] text-muted-foreground uppercase opacity-60">Toggle right side info panel</p>
                          </div>
                        </div>
                        <div className="flex bg-black p-1 rounded-xl border border-white/5">
                          <button 
                            onClick={() => setShowRightSidebar(true)}
                            className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-widest transition-all ${showRightSidebar ? 'bg-accent text-white shadow-lg' : 'text-muted-foreground hover:text-white'}`}
                          >
                            Show
                          </button>
                          <button 
                            onClick={() => setShowRightSidebar(false)}
                            className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-widest transition-all ${!showRightSidebar ? 'bg-accent text-white shadow-lg' : 'text-muted-foreground hover:text-white'}`}
                          >
                            Hide
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-8 border-t border-border">
                    <button 
                      onClick={startWipeProcess}
                      className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl transition-all uppercase tracking-widest text-[10px] font-extrabold shadow-lg shadow-red-900/20"
                    >
                      <Trash2 size={14} />
                      <span>Erase Everything About History</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'intelligence' && (
                <div className="space-y-8 h-full">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tighter">MonerAi Cloud Intelligence</h3>
                  
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-4">
                      <Hash size={20} className="text-accent" />
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest">Inference Temperature</h4>
                        <p className="text-[10px] text-muted-foreground uppercase opacity-60">Determines the randomness and personality of responses</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { label: 'Cold', value: 0.1, desc: 'Logical, surgical, precise. Best for code and technical data.' },
                        { label: 'Warm', value: 0.7, desc: 'Creative, helpful, balanced. Standard operational mode.' },
                        { label: 'Companion Service', value: 1.2, desc: 'Explorative, conversational, human-like responses.' }
                      ].map((t) => (
                        <button
                          key={t.label}
                          onClick={() => setTemperature(t.value)}
                          className={`text-left p-4 rounded-2xl border transition-all ${temperature === t.value ? 'bg-accent/10 border-accent/50 ring-1 ring-accent/20' : 'bg-black/40 border-white/5 hover:border-white/10'}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs font-bold uppercase tracking-widest ${temperature === t.value ? 'text-accent' : 'text-white'}`}>{t.label}</span>
                            <span className="text-[10px] font-mono opacity-40">{t.value}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground uppercase leading-relaxed">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tighter">Security Protocols</h3>
                  <div className="space-y-4">
                    <ProtocolItem 
                      title="Metadata Obfuscation" 
                      desc="Pads requests to constant block sizes to prevent traffic analysis."
                      active={true}
                    />
                    <ProtocolItem 
                      title="Session Ephemerality" 
                      desc="Wipes local state variables on hard browser refresh."
                      active={true}
                    />
                    <ProtocolItem 
                      title="Network Relay" 
                      desc="Tunnels inference through non-attributable proxy chains."
                      active={true}
                    />

                    {/* Secret GUIX CODE */}
                    <div className="pt-6 border-t border-border mt-6">
                      <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-3 opacity-40">Guix Verification</p>
                      <div className="flex gap-2">
                        <input 
                          type="password"
                          placeholder="GUIX CODE"
                          value={guixCode}
                          onChange={(e) => setGuixCode(e.target.value)}
                          disabled={isUnlimited || isVerifying}
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 transition-all"
                        />
                        <button 
                          onClick={async () => {
                            if (!guixCode || isUnlimited) return;
                            setIsVerifying(true);
                            const success = await onVerifyCode(guixCode);
                            setIsVerifying(false);
                            if (success) {
                              setVerifyStatus('success');
                              setGuixCode('');
                            } else {
                              setVerifyStatus('error');
                              setTimeout(() => setVerifyStatus('idle'), 2000);
                            }
                          }}
                          disabled={isUnlimited || isVerifying || !guixCode}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            isUnlimited 
                              ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                              : verifyStatus === 'error'
                              ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                              : 'bg-accent/10 text-accent border border-accent/30 hover:bg-accent hover:text-white'
                          }`}
                        >
                          {isUnlimited ? 'VERIFIED' : isVerifying ? '...' : verifyStatus === 'error' ? 'FAIL' : 'VERIFY'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProtocolItem({ title, desc, active }: { title: string, desc: string, active: boolean }) {
  return (
    <div className="flex items-start justify-between p-4 bg-muted/30 rounded-2xl border border-border">
      <div className="space-y-1 pr-4">
        <p className="text-xs font-bold text-white uppercase tracking-widest">{title}</p>
        <p className="text-[10px] text-muted-foreground leading-relaxed uppercase opacity-50">{desc}</p>
      </div>
      <div className={`shrink-0 w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-orange-600' : 'bg-muted'}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${active ? 'left-4.5' : 'left-0.5'}`}></div>
      </div>
    </div>
  );
}
