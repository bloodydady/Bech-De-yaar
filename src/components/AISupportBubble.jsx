import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

const AISupportBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [botGender, setBotGender] = useState('female');
  const [chat, setChat] = useState([
    { role: 'assistant', content: `Hello! 👋 I'm Chatty Yaar. How can I help you today? You can ask me about selling items, safety tips, or we can just chat about anything!` }
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
                                "content": `You are Chatty Yaar, the official AI assistant for BechDeYaar (India's smartest student campus marketplace). You are a friendly, cool, and helpful ${botGender === "male" ? "Indian college boy" : "Indian college girl"}. Your gender is ${botGender}. Help students with buying, selling, renting items, OR just have a fun general conversation with them about any topic they want! Speak affectionately like a friend (yaar). Mention zero-commission campus trading if relevant.`
                            },
                            ...chat.slice(-6).map(c => ({ role: c.role, content: c.content })),
                            { "role": "user", "content": userMsg }
                        ]
                    })
                });

                const json = await response.json();
                if (response.ok && json.choices) {
                    return json;
                } else {
                    console.warn(`Model ${model} failed:`, json.error?.message || 'Unknown error');
                    if (json.error?.code === 401) {
                         throw new Error("Invalid API Key");
                    }
                }
            } catch (err) {
                if (err.message === "Invalid API Key") throw err;
                console.warn(`Attempt failed, trying next...`);
            }
        }
        throw new Error("OpenRouter servers are completely overloaded.");
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
      if (error.message === "Invalid API Key") {
        setChat(prev => [...prev, { role: 'assistant', content: "It looks like my API token is invalid or missing in Vercel. Please update it!" }]);
      } else {
        setChat(prev => [...prev, { role: 'assistant', content: "Oops! We are getting too many messages right now and our free servers are overloaded. Please try again in an hour! 😅" }]);
      }
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
            <div className="bg-brand-navy text-white p-5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                        {botGender === 'male' ? <span className="text-2xl">👨🏽</span> : <span className="text-2xl">👩🏽</span>}
                    </div>
                    <div>
                        <h3 className="font-black text-lg leading-tight">Chatty Yaar</h3>
                        <p className="text-brand-orange/80 text-xs font-bold uppercase tracking-widest flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span> Online Helper
                        </p>
                    </div>
                </div>

                {/* Gender Toggle */}
                <div className="flex bg-white/10 rounded-lg p-1 space-x-1">
                    <button 
                        onClick={() => setBotGender('male')}
                        className={`px-2 py-1 text-xs font-bold rounded-md transition ${botGender === 'male' ? 'bg-white text-brand-navy shadow-sm' : 'text-white/60 hover:bg-white/20'}`}
                    >
                        Boy
                    </button>
                    <button 
                        onClick={() => setBotGender('female')}
                        className={`px-2 py-1 text-xs font-bold rounded-md transition ${botGender === 'female' ? 'bg-white text-brand-navy shadow-sm' : 'text-white/60 hover:bg-white/20'}`}
                    >
                        Girl
                    </button>
                </div>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f8fafc] flex flex-col scroll-smooth">
                {chat.map((c, i) => (
                    <div key={i} className={`flex ${c.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`max-w-[85%] px-5 py-3 shadow-md text-[15px] font-medium leading-relaxed ${
                            c.role === 'user' 
                            ? 'bg-[#1C2F5E] text-white rounded-3xl rounded-br-sm' 
                            : 'bg-white text-gray-800 border border-gray-100 rounded-3xl rounded-bl-sm shadow-sm'
                        }`}>
                            {c.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start animate-fade-in">
                        <div className="bg-white border border-gray-100 text-gray-400 px-5 py-3 rounded-3xl rounded-bl-sm shadow-sm flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
                            <span className="text-xs font-bold uppercase tracking-wider">Yaar is typing...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex items-center space-x-3">
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
