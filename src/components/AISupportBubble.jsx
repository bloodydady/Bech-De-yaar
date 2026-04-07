import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

const AISupportBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState([
    { role: 'assistant', content: "Hello! 👋 I'm your BechDeYaar Assistant. How can I help you today? You can ask me about selling items, safety tips, or how to upload your notes!" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!msg.trim() || loading) return;

    const userMsg = msg.trim();
    setMsg('');
    setChat(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const fetchWithRetry = async (models) => {
        for (const model of models) {
            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": window.location.origin,
                        "X-Title": "BechDeYaar AI Support"
                    },
                    body: JSON.stringify({
                        "model": model,
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are the official AI assistant for BechDeYaar, India's smartest student campus marketplace. Help students with buying, selling, and renting items and sharing study notes. Use a friendly, student-focused, and helpful Indian tone. Mention that BechDeYaar allows trading within campuses like IITs, NITs, and local colleges with zero commission."
                            },
                            ...chat.slice(-6).map(c => ({ role: c.role, content: c.content })),
                            { "role": "user", "content": userMsg }
                        ]
                    })
                });

                if (response.ok) return await response.json();
            } catch (err) {
                console.warn(`Model ${model} failed, trying next...`);
            }
        }
        throw new Error("All models failed");
    };

    try {
      const data = await fetchWithRetry([
        "google/gemma-3-27b-it:free",
        "meta-llama/llama-3.3-70b-instruct:free",
        "qwen/qwen3-next-80b-a3b-instruct:free"
      ]);
      const aiResponse = data.choices[0].message.content;
      setChat(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      setChat(prev => [...prev, { role: 'assistant', content: "Oops! I'm temporarily offline. Please try again in 1 minute!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-nunito group">
      {/* Tooltip on Hover */}
      {!isOpen && (
        <div className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-brand-navy text-white text-sm font-bold rounded-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity flex items-center pointer-events-none">
          <Sparkles className="w-4 h-4 mr-2 text-brand-orange animate-pulse" /> Need help? Ask AI!
        </div>
      )}

      {/* Main Bubble Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'bg-white text-brand-navy' : 'bg-brand-orange text-white overflow-hidden'}`}
      >
        {isOpen ? <X className="w-8 h-8" /> : (
            <div className="relative w-full h-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 relative z-10" />
                <div className="absolute inset-0 bg-white/20 animate-ping rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[550px] bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-slide-up">
            
            {/* Header */}
            <div className="bg-brand-navy text-white p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                        <Bot className="w-7 h-7 text-brand-orange" />
                    </div>
                    <div>
                        <h3 className="font-black text-lg leading-tight">Campus Bot</h3>
                        <p className="text-brand-orange/80 text-xs font-bold uppercase tracking-widest flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span> Online Helper
                        </p>
                    </div>
                </div>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 flex flex-col scroll-smooth">
                {chat.map((c, i) => (
                    <div key={i} className={`flex ${c.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`max-w-[85%] px-5 py-3 rounded-2xl shadow-sm border text-sm font-medium leading-relaxed ${
                            c.role === 'user' 
                            ? 'bg-brand-orange text-white border-brand-orange rounded-br-none' 
                            : 'bg-white text-gray-700 border-gray-100 rounded-bl-none'
                        }`}>
                            {c.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="bg-white border-gray-100 text-gray-400 px-5 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
                            <span className="text-xs font-bold uppercase tracking-wider">AI is thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex items-center space-x-2">
                <input 
                    type="text" 
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Ask something..."
                    className="flex-1 bg-gray-100 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-brand-orange transition-all placeholder:text-gray-400 font-medium"
                />
                <button 
                    disabled={!msg.trim() || loading}
                    className="bg-brand-navy p-3 text-white rounded-2xl hover:bg-brand-orange transition-all shadow-lg active:scale-95 disabled:opacity-30"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
      )}
    </div>
  );
};

export default AISupportBubble;
