
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, User, Bot, Loader2, ChevronDown, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  content: string;
}

const SYSTEM_INSTRUCTION = `You are HumSafar AI, the intelligent assistant for HumSafar, a premium ride-sharing platform for daily commuters in India (primarily Chennai). 
Your goal is to help users understand how the platform works, answer safety queries, explain the 'Women-Only' mode, fuel-sharing economics, and 'Trust Circles' (office/campus verification).
Be concise, professional, and friendly. Use Indian context where appropriate (e.g., mention IT Parks like DLF, OMR, SIPCOT if relevant). 
Do not hallucinate ride availability; instead, guide users to the "Find Ride" or "Offer Ride" sections.`;

const SUGGESTIONS = [
  "How does Women-Only mode work?",
  "What are Commute Credits?",
  "How do I verify my office?",
  "Is HumSafar safe?"
];

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hi! I'm your HumSafar Assistant. How can I help you improve your daily commute today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    // Hide suggestions once user starts chatting
    setShowSuggestions(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const response = await chat.sendMessageStream({ message: text });
      
      let fullContent = '';
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      for await (const chunk of response) {
        const textChunk = chunk.text;
        if (textChunk) {
          fullContent += textChunk;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = fullContent;
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I'm having a bit of trouble connecting right now. Please try again in a moment!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[2000] flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300 mb-4">
          {/* Header */}
          <div className="bg-emerald-600 p-6 flex items-center justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <Sparkles size={20} className="text-emerald-50" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest">HumSafar AI</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-tighter">Online & Ready</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 pb-2 space-y-4 no-scrollbar bg-slate-50/50 dark:bg-slate-950/50"
          >
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white' 
                    : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none shadow-sm'
                }`}>
                  {msg.content || (isTyping && i === messages.length - 1 ? <Loader2 size={16} className="animate-spin" /> : null)}
                  {!msg.content && i === messages.length - 1 && isTyping && <span className="cursor-blink" />}
                </div>
              </div>
            ))}
            {isTyping && messages[messages.length-1].role === 'user' && (
              <div className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-none">
                  <Loader2 size={16} className="animate-spin text-emerald-500" />
                </div>
              </div>
            )}
          </div>

          {/* Suggested Prompts with Close Option - Minimal Space */}
          {showSuggestions && messages.length < 2 && (
            <div className="px-3 py-1.5 bg-slate-50/80 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 relative group/suggestions">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Quick Questions</span>
                <button 
                  onClick={() => setShowSuggestions(false)}
                  className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title="Dismiss suggestions"
                >
                  <X size={10} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[9px] font-bold text-slate-500 dark:text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-all shadow-sm active:scale-95"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area - Minimal Padding to remove extra whitespace */}
          <div className="px-2 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative flex items-center"
            >
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask HumSafar AI..."
                className="w-full pl-4 pr-12 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-semibold text-slate-900 dark:text-white"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-1 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:grayscale"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto p-4 rounded-[1.5rem] shadow-2xl transition-all duration-500 flex items-center gap-3 active:scale-95 group ${
          isOpen 
            ? 'bg-slate-900 dark:bg-slate-800 text-white' 
            : 'bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-emerald-500/40 ring-4 ring-emerald-500/10'
        }`}
      >
        <div className="relative">
          {isOpen ? <ChevronDown size={24} /> : <MessageSquare size={24} />}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            </div>
          )}
        </div>
        {!isOpen && <span className="font-black text-xs uppercase tracking-widest pr-2 hidden md:inline">AI Support</span>}
      </button>

      {/* Background Ambient Glow (matches trigger) */}
      {!isOpen && (
        <div className="hidden dark:block absolute -bottom-12 -right-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none animate-pulse" />
      )}
    </div>
  );
};

export default AiAssistant;
