import { Plus, MessageSquare, Settings, Github, Search, Trash2, Cpu, Database, Coins, TrendingUp, TrendingDown, Clock, PanelLeftClose, PanelLeft, Menu, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ChatThread } from '../types';

interface SidebarProps {
  threads: ChatThread[];
  activeThreadId: string;
  sessionId: string;
  usageCount: number;
  isUnlimited: boolean;
  onNewChat: () => void;
  onSelectThread: (id: string) => void;
  onDeleteThread: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onUpgrade: () => void;
  onOpenSettings: () => void;
}

export default function Sidebar({ threads, activeThreadId, sessionId, usageCount, isUnlimited, onNewChat, onSelectThread, onDeleteThread, isOpen, onToggle, onUpgrade, onOpenSettings }: SidebarProps) {
  return (
    <>
      <div className={`z-40 bg-muted border-r border-border flex flex-col transition-all duration-300 ease-in-out fixed inset-y-0 left-0 md:relative ${isOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full w-0 md:translate-x-0'}`}>
        <div className={`p-4 pt-6 h-full flex flex-col min-w-[260px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="px-2 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://gold-raw-gecko-403.mypinata.cloud/ipfs/bafkreihw45rlz6sbf3iacaxayvatzthnlcyenbbefuy6ife5bpf7vn4ale" 
                alt="MonerAi Logo" 
                className="h-8 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="text-xl font-bold tracking-tight text-foreground">MonerAi</span>
            </div>
            <button 
              onClick={onToggle}
              className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground/10 hover:text-muted-foreground/40 transition-colors"
              title="Close Sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
          </div>
          <button 
            onClick={onNewChat}
            className="w-full flex items-center gap-2 bg-transparent hover:bg-muted border border-border text-foreground px-4 py-2.5 rounded-lg transition-all text-sm font-medium group mb-4 shrink-0"
          >
            <Plus size={18} className="text-accent group-hover:scale-110 transition-transform" />
            New Chat
          </button>

          <div className="flex-1 overflow-y-auto px-1 space-y-1">
            <div className="px-3 mb-3">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Recent</p>
            </div>
            {threads.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                No history yet
              </div>
            ) : (
              threads.sort((a, b) => b.updatedAt - a.updatedAt).map((thread) => (
                <div 
                  key={thread.id}
                  onClick={() => onSelectThread(thread.id)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all border-l-2 ${
                    activeThreadId === thread.id 
                      ? 'bg-[#1a1a1a] border-accent text-foreground' 
                      : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-sm truncate font-medium">{thread.title || 'Untitled Chat'}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteThread(thread.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

            <div className="mt-auto px-1">
              <div className="mb-4 p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center gap-3">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      className="text-white/5"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray={113.1}
                      strokeDashoffset={isUnlimited ? 0 : (113.1 - (113.1 * Math.min(usageCount, 15)) / 15)}
                      className={isUnlimited ? "text-green-500" : (usageCount >= 15 ? "text-red-500" : "text-orange-500")}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-[9px] font-black">{isUnlimited ? "∞" : usageCount}/15</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/90 uppercase tracking-widest leading-none">{isUnlimited ? "Developer Plan" : "Trial Free"}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex flex-col gap-0.5 mt-0">
              <button 
                onClick={onUpgrade}
                className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs text-orange-500/60 hover:text-orange-500 hover:bg-orange-500/5 transition-all group"
                title="Upgrade Plan"
              >
                <Zap size={14} className="group-hover:scale-110 transition-transform fill-current opacity-40 group-hover:opacity-100" />
                <span className="font-bold">Upgrade Plan</span>
              </button>
              <button 
                onClick={onOpenSettings}
                className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs text-white/[0.03] hover:text-white/20 transition-all group"
                title="Settings"
              >
                <Settings size={14} className="group-hover:rotate-90 transition-transform duration-500" />
                <span className="font-medium">Settings</span>
              </button>
            </div>
          </div>
        </div>
      
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (isOpen && window.innerWidth < 768) onToggle();
            }}
            className="fixed inset-0 z-30 md:hidden bg-black/50"
          />
        )}
      </AnimatePresence>
    </>
  );
}
