import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Zap, Menu, Command, PanelLeft, Info } from 'lucide-react';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import AboutMonero from './components/AboutMonero';
import AboutMonerai from './components/AboutMonerai';
import MiningMonero from './components/MiningMonero';
import UpgradePlan from './components/UpgradePlan';
import Settings from './components/Settings';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { Message, ChatThread } from './types';
import { getGeminiResponse } from './lib/gemini';

const normalizePrompt = (text: string) => {
  // Hide exact length by padding to nearest 256 byte block
  const blockSize = 256;
  const targetLen = Math.ceil(text.length / blockSize) * blockSize;
  return text.padEnd(targetLen, '\u200B'); // Zero-width space for invisible padding
};

export default function App() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showAboutMonerai, setShowAboutMonerai] = useState(false);
  const [showMining, setShowMining] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [accentColor, setAccentColor] = useState('#f97316');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [temperature, setTemperature] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [sessionId] = useState(() => {
    try {
      return crypto.randomUUID().slice(0, 8);
    } catch (e) {
      return Math.random().toString(36).substring(2, 10);
    }
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch backend usage
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await fetch("/api/usage");
        const data = await res.json();
        setUsageCount(data.count || 0);
        setIsUnlimited(!!data.isUnlimited);
      } catch (e) {
        console.error("Usage fetch failed", e);
      }
    };
    fetchUsage();
    // Poll every 5 minutes to catch 24h resets
    const interval = setInterval(fetchUsage, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('monero_ai_threads');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setThreads(parsed);
        if (parsed.length > 0) {
          setActiveThreadId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('monero_ai_threads', JSON.stringify(threads));
  }, [threads]);

  const activeThread = threads.find(t => t.id === activeThreadId);

  const handleNewChat = () => {
    const newThread: ChatThread = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now()
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
  };

  const handleClearHistory = () => {
    setThreads([]);
    setActiveThreadId('');
    localStorage.removeItem('monero_ai_threads');
  };

  const handleDeleteThread = (id: string) => {
    setThreads(prev => {
      const filtered = prev.filter(t => t.id !== id);
      if (activeThreadId === id && filtered.length > 0) {
        setActiveThreadId(filtered[0].id);
      } else if (filtered.length === 0) {
        setActiveThreadId('');
      }
      return filtered;
    });
  };

  const handleSendMessage = async (content: string, image?: { data: string, mimeType: string }) => {
    // Check usage before sending
    if (!isUnlimited) {
      try {
        const res = await fetch("/api/usage");
        const data = await res.json();
        if (data.isUnlimited) {
          setIsUnlimited(true);
        } else if (data.count >= 15) {
          setShowUpgrade(true);
          return;
        }
      } catch (e) {
        // Network error, allow sending but count might be stale
      }
    }

    let currentThreadId = activeThreadId;
    
    // Create new thread if none active
    if (!currentThreadId) {
      const newThread: ChatThread = {
        id: crypto.randomUUID(),
        title: content.slice(0, 30) || 'Image Analysis',
        messages: [],
        updatedAt: Date.now()
      };
      setThreads(prev => [newThread, ...prev]);
      setActiveThreadId(newThread.id);
      currentThreadId = newThread.id;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      images: image ? [{ url: `data:${image.mimeType};base64,${image.data}`, base64: image.data }] : undefined,
      timestamp: Date.now()
    };

    // Update messages for the current thread
    setThreads(prev => prev.map(t => {
      if (t.id === currentThreadId) {
        return {
          ...t,
          messages: [...t.messages, userMessage],
          updatedAt: Date.now(),
          title: t.messages.length === 0 ? (content.slice(0, 30) || 'Image Analysis') : t.title
        };
      }
      return t;
    }));

    setIsLoading(true);

    try {
      const thread = threads.find(t => t.id === currentThreadId) || { messages: [] };
      const history = [...thread.messages, userMessage].map(m => ({
        role: m.role === 'user' ? 'user' as const : 'model' as const,
        parts: [
          { text: m.content },
          ...(m.images?.map(img => ({
            inlineData: {
              data: img.base64 || '',
              mimeType: 'image/jpeg' // Default
            }
          })) || [])
        ]
      }));

      // Apply normalization and padding to obfuscate metadata
      const normalizedContent = normalizePrompt(content);
      
      // Increment usage count before processing
      try {
        const incRes = await fetch("/api/usage/increment", { method: "POST" });
        const incData = await incRes.json();
        if (incRes.status === 403) {
          setIsLoading(false);
          setShowUpgrade(true);
          return;
        }
        setUsageCount(incData.count);
        setIsUnlimited(!!incData.isUnlimited);
      } catch (e) {
        console.error("Usage count update failed", e);
      }

      const stream = await getGeminiResponse(normalizedContent, history.slice(0, -1) as any, image, temperature);
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: Date.now()
      };

      // Add placeholder assistant message
      setThreads(prev => prev.map(t => {
        if (t.id === currentThreadId) {
          return { ...t, messages: [...t.messages, assistantMessage] };
        }
        return t;
      }));

      let fullContent = '';
      for await (const chunk of stream) {
        const text = chunk.text || '';
        fullContent += text;
        
        setThreads(prev => prev.map(t => {
          if (t.id === currentThreadId) {
            const lastMsgIdx = t.messages.length - 1;
            const updatedMessages = [...t.messages];
            updatedMessages[lastMsgIdx] = { ...updatedMessages[lastMsgIdx], content: fullContent };
            return { ...t, messages: updatedMessages };
          }
          return t;
        }));
      }

    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Error: Failed to connect to Gemini API. Please check your network or API key configuration.",
        timestamp: Date.now()
      };
      setThreads(prev => prev.map(t => {
        if (t.id === currentThreadId) {
          return { ...t, messages: [...t.messages, errorMessage] };
        }
        return t;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [threads, isLoading]);

  const fontSizeMap = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className={`flex h-screen w-full bg-black text-foreground overflow-hidden ${fontSizeMap[fontSize]}`} style={{ '--color-accent': accentColor } as React.CSSProperties}>
        <Sidebar 
          threads={threads} 
          activeThreadId={activeThreadId}
          sessionId={sessionId}
          usageCount={usageCount}
          isUnlimited={isUnlimited}
          onNewChat={handleNewChat}
        onSelectThread={setActiveThreadId}
        onDeleteThread={handleDeleteThread}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onUpgrade={() => setShowUpgrade(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      <main className="flex-1 flex flex-col relative h-full min-w-0">
        {/* Toggle Button for Left Sidebar when closed */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-20 p-2 bg-muted/80 backdrop-blur-md border border-border rounded-lg text-white hover:bg-muted transition-all shadow-xl"
            title="Open Sidebar"
          >
            <PanelLeft size={20} />
          </button>
        )}

        {/* Toggle Button for Right Sidebar when closed */}
        {!isRightSidebarOpen && (
          <button 
            onClick={() => setIsRightSidebarOpen(true)}
            className="absolute top-4 right-4 z-20 p-1 text-orange-500 hover:text-orange-400 transition-all"
            title="Open Info Panel"
          >
            <Info size={16} />
          </button>
        )}

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col"
        >
          {!activeThread || activeThread.messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto w-full">
              <div className="mb-10 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-gray-500 text-sm max-w-3xl mx-auto leading-relaxed font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>
                    A decentralized, privacy-focused intelligence system inspired by Monero, developed by the what@happens_tomorrow team, designed to deliver fast and technically oriented responses with a focus on clarity and relevance.
                  </p>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-full"
              >
                <ChatInput onSend={handleSendMessage} disabled={isLoading} />
              </motion.div>
            </div>
          ) : (
            <>
              <div className="flex-1 w-full py-4">
                {activeThread.messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {isLoading && (
                  <div className="w-full px-4 md:px-8 py-8 flex justify-center">
                    <div className="w-full max-w-[800px] bg-transparent flex gap-1 items-center h-8">
                      <div className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Input Area at bottom when active */}
              <div className="bg-gradient-to-t from-black via-black to-transparent pt-10 sticky bottom-0">
                <ChatInput onSend={handleSendMessage} disabled={isLoading} />
              </div>
            </>
          )}
        </div>
      </main>

      <RightSidebar 
        isOpen={isRightSidebarOpen}
        onToggle={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
        onOpenAbout={() => setShowAbout(true)}
        onOpenAboutMonerai={() => setShowAboutMonerai(true)}
        onOpenMining={() => setShowMining(true)}
      />

      <AnimatePresence>
        {showAbout && (
          <AboutMonero onClose={() => setShowAbout(false)} />
        )}
        {showAboutMonerai && (
          <AboutMonerai onClose={() => setShowAboutMonerai(false)} />
        )}
        {showMining && (
          <MiningMonero onClose={() => setShowMining(false)} />
        )}
        {showUpgrade && (
          <UpgradePlan onClose={() => setShowUpgrade(false)} />
        )}
        {showSettings && (
          <Settings 
            onClose={() => setShowSettings(false)} 
            onClearHistory={handleClearHistory}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            fontSize={fontSize}
            setFontSize={setFontSize}
            temperature={temperature}
            setTemperature={setTemperature}
            showRightSidebar={isRightSidebarOpen}
            setShowRightSidebar={setIsRightSidebarOpen}
            isUnlimited={isUnlimited}
            onVerifyCode={async (code) => {
              try {
                const res = await fetch("/api/usage/verify-code", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ code })
                });
                const data = await res.json();
                if (data.success) {
                  setIsUnlimited(true);
                  return true;
                }
                return false;
              } catch (e) {
                return false;
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
