import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, User, HelpCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface ConciergeChatBotProps {
  appDarkMode?: boolean;
  onNavigateToExplore: (search?: string) => void;
}

const PRESET_PROMPTS = [
  { label: "Balayage in Indiranagar 💇‍♀️", prompt: "Suggest me a premier room for couture coloring and Balayage in Indiranagar" },
  { label: "Elite Beard Grooming 🧔", prompt: "Can you locate sandalwood Razor Beard sculpts for executive grooming?" },
  { label: "Japanese Head Spa 🌸", prompt: "I'd love to indulge in a traditional Japanese Head Spa coordinate" },
  { label: "Bridal Makeup near me 👰", prompt: "Suggest luxury salons specializing in Sabyasachi & HD Bridal Gold artistry" }
];

export default function ConciergeChatBot({ appDarkMode = false, onNavigateToExplore }: ConciergeChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "✦ Greetings, my dear patron. I am the GlamBlr Royal Concierge, your private AI styling and sanctuary advisor. Tell me your aesthetic desires, or search parameters, and let's map out your perfect luxury lounge coordinate today.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      // Map existing messages to clean Gemini chat history
      const chatHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: chatHistory
        })
      });

      if (!res.ok) {
        throw new Error('Network response not okay');
      }

      const data = await res.json();
      
      const modelMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'model',
        text: "✦ APOLOGIES, DEAR PATRON: My secure connection to the royal core was briefly interrupted by a digital cloud storm. Please check again in a moment, or continue browsing our hand-selected lounges.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans pointer-events-none">
      
      {/* Floating Concierge Action Trigger button */}
      <div className="pointer-events-auto flex justify-end">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl border cursor-pointer relative overflow-hidden transition-all duration-300 ${
            isOpen
              ? 'bg-neutral-900 border-neutral-800 text-amber-400 rotate-90'
              : 'bg-[#A07D1A] dark:bg-amber-400 border-[#D4AF37] dark:border-amber-300 text-white dark:text-neutral-900'
          }`}
          title="GlamBlr Royal AI Concierge"
        >
          {/* Subtle pulse ring */}
          <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-[#A07D1A]/10 dark:bg-amber-400/20 opacity-75"></span>
          
          {isOpen ? (
            <X className="w-6 h-6 stroke-[2]" />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <MessageSquare className="w-5.5 h-5.5 stroke-[2]" />
              <span className="text-[6.5px] uppercase tracking-wider font-extrabold mt-0.5 scale-90 leading-none">AI</span>
            </div>
          )}
        </motion.button>
      </div>

      {/* Floating Chat Sheet Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="absolute bottom-18 right-0 w-[92vw] sm:w-[380px] h-[520px] bg-white dark:bg-[#12121E] border border-[#E1DBCE] dark:border-indigo-950/65 rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden text-left"
          >
            {/* Header branding backdrop */}
            <div className="relative bg-[#FAF6F0] dark:bg-[#161625] border-b border-[#E1DBCE] dark:border-indigo-950/50 p-4 shrink-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-[#A07D1A]/5 to-transparent blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-[#12121E] border border-[#D4AF37]/50 flex items-center justify-center text-[#A07D1A] dark:text-amber-400 font-bold shadow-2xs">
                  <Sparkles className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-serif italic font-extrabold text-sm text-[#1E1A17] dark:text-white">
                      Royal AI Concierge
                    </h4>
                    <span className="px-1.5 py-0.5 bg-[#A07D1A]/10 text-[#A07D1A] dark:text-amber-400 text-[8px] font-mono font-extrabold uppercase rounded border border-[#D4AF37]/25 leading-none">
                      Gemini 3.5
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wide mt-0.5 uppercase font-bold">
                    🔮 ONLINE • COUTURE STYLE INTELLIGENT
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages flow log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-[#0E0E14]/70 scrollbar-thin">
              
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 max-w-[85%] ${
                    m.role === 'user' ? 'ml-auto flex-row-reverse text-right' : 'text-left'
                  }`}
                >
                  <div className={`w-6.5 h-6.5 rounded-full shrink-0 border flex items-center justify-center text-[10px] select-none shadow-3xs ${
                    m.role === 'user'
                      ? 'bg-[#A07D1A] text-white border-[#D4AF37]'
                      : 'bg-white dark:bg-indigo-950/40 text-[#A07D1A] dark:text-amber-400 border-[#E1DBCE] dark:border-indigo-950/45'
                  }`}>
                    {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </div>

                  <div className="space-y-0.5">
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed font-sans ${
                      m.role === 'user'
                        ? 'bg-[#A07D1A] text-white dark:bg-amber-400 dark:text-slate-900 rounded-tr-none'
                        : 'bg-white dark:bg-[#161625] border border-[#E1DBCE] dark:border-indigo-950/40 text-slate-800 dark:text-slate-200 rounded-tl-none project-markdown'
                    }`} style={{ whiteSpace: 'pre-wrap' }}>
                      {m.text}
                    </div>
                    <span className="text-[8.5px] font-mono text-slate-400 block px-1">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 max-w-[80%]">
                  <div className="w-6.5 h-6.5 rounded-full bg-white dark:bg-indigo-950/40 text-[#A07D1A] dark:text-amber-400 border border-[#E1DBCE] dark:border-indigo-950/45 flex items-center justify-center text-[10px]">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="p-3 bg-white dark:bg-[#161625] border border-[#E1DBCE]/60 dark:border-indigo-950/40 text-slate-400 dark:text-slate-500 rounded-2xl rounded-tl-none text-xs font-mono tracking-wide">
                    👑 Oracle of Gold meditating...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* In-chat quick presets carousel */}
            {messages.length === 1 && !isLoading && (
              <div className="p-3 bg-slate-50 dark:bg-[#12121E] border-t border-[#E1DBCE]/60 dark:border-indigo-950/30 overflow-x-auto space-y-1.5 shrink-0">
                <span className="text-[8.5px] font-mono text-slate-400 uppercase font-black tracking-widest block text-center">
                  ✦ LUXURY PATRON QUICK SEARCHMENUS
                </span>
                <div className="flex gap-1.5 pb-1">
                  {PRESET_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(p.prompt)}
                      className="px-2.5 py-1.5 bg-white dark:bg-[#161625] hover:border-[#A07D1A] dark:hover:border-amber-500 text-[10px] text-slate-800 dark:text-slate-300 font-medium rounded-lg border border-[#E1DBCE] dark:border-indigo-950/45 cursor-pointer whitespace-nowrap transition-all hover:shadow-3xs"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Input submission form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputVal);
              }}
              className="p-3 bg-white dark:bg-[#12121E] border-t border-[#E1DBCE] dark:border-indigo-950/50 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about Balayage, Spas, areas..."
                className="flex-1 bg-[#FAF7F2] dark:bg-neutral-900 border border-[#E1DBCE]/80 dark:border-[#1E1E2C] rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#A07D1A] dark:focus:border-amber-400 transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  inputVal.trim() && !isLoading
                    ? 'bg-[#A07D1A] hover:bg-[#805C06] dark:bg-amber-400 text-white dark:text-neutral-950 hover:scale-105 shadow-3xs'
                    : 'bg-slate-100 dark:bg-neutral-800 text-slate-300 dark:text-neutral-700 pointer-events-none'
                }`}
                disabled={!inputVal.trim() || isLoading}
              >
                <Send className="w-4 h-4 stroke-[2]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
