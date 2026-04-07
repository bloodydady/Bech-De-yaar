import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, School, MapPin } from 'lucide-react';

const AIAutocomplete = ({ 
  type = 'college', // 'college' or 'city'
  value, 
  onChange, 
  placeholder,
  required = false,
  className = ""
}) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "BechDeYaar Smart Inputs"
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3.3-70b-instruct:free",
          "messages": [
            {
              "role": "system",
              "content": `Given a search term for a ${type} in India (especially UP), return a clean JSON array of exactly 5 names. No other text.`
            },
            { "role": "user", "content": searchTerm }
          ]
        })
      });

      if (!response.ok) {
        throw new Error("AI Service temporary unavailable");
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Attempt to parse JSON array cautiously
      try {
        const cleaned = content.replace(/```json|```/g, '').trim();
        const results = JSON.parse(cleaned);
        if (Array.isArray(results)) {
            setSuggestions(results);
            setShowDropdown(true);
        }
      } catch (parseErr) {
        console.error("AI Parse Error:", parseErr, content);
      }
    } catch (error) {
      console.error("AI Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query === value) return; // Don't fetch if it matches the current set value

    const timer = setTimeout(() => {
      fetchSuggestions(query);
    }, 800); // 800ms debounce to save API calls
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item) => {
    setQuery(item);
    onChange(item);
    setShowDropdown(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
              setQuery(e.target.value);
              onChange(e.target.value); // Sync state immediately
          }}
          required={required}
          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:bg-white transition font-medium pr-12"
          placeholder={placeholder || `Type ${type}...`}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
           {loading ? <Loader2 className="w-5 h-5 animate-spin text-brand-orange" /> : 
             type === 'college' ? <School className="w-5 h-5 opacity-40 shrink-0" /> : <MapPin className="w-5 h-5 opacity-40 shrink-0" />}
        </div>
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-fade-in py-2">
           <div className="px-4 py-2 bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-brand-orange border-b border-gray-100 mb-1 flex items-center">
             <span className="w-1.5 h-1.5 bg-brand-orange rounded-full mr-2 animate-pulse"></span> AI Suggestions
           </div>
           {suggestions.map((item, i) => (
             <button
                key={i}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-5 py-3 text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors flex items-center group"
             >
                {type === 'college' ? <School className="w-4 h-4 mr-3 opacity-20 group-hover:opacity-100 transition-opacity" /> : <MapPin className="w-4 h-4 mr-3 opacity-20 group-hover:opacity-100 transition-opacity" />}
                <span className="flex-1 truncate">{item}</span>
             </button>
           ))}
        </div>
      )}
    </div>
  );
};

export default AIAutocomplete;
