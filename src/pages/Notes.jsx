import React, { useState, useEffect } from 'react';
import { getNotes } from '../firebase/firestore';
import NotesCard from '../components/NotesCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Search } from 'lucide-react';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // All, Free, Paid
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await getNotes({}, 50);
        setNotes(res.data);
      } catch (error) {
        console.error("Notes error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(n => {
     let match = true;
     if (filter === 'Free') match = n.price === 0;
     if (filter === 'Paid') match = n.price > 0;
     
     if (match && searchQuery) {
        const query = searchQuery.toLowerCase();
        match = n.title.toLowerCase().includes(query) || 
                n.subject.toLowerCase().includes(query) ||
                n.course.toLowerCase().includes(query);
     }
     return match;
  });

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
       
       {/* Header & Hero */}
       <div className="bg-brand-navy rounded-3xl p-8 sm:p-12 text-white mb-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-10 blur-sm pointer-events-none text-9xl">📚</div>
          <div className="relative z-10 max-w-2xl">
             <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">Study Notes Marketplace</h1>
             <p className="text-blue-100 text-lg sm:text-xl mb-8">Share, download and unlock premium study notes strictly by top college students.</p>
          </div>
       </div>

       {/* Filters */}
       <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          
          <div className="flex space-x-2 bg-gray-50 p-1 rounded-xl border border-gray-200 w-full md:w-auto">
             {['All', 'Free', 'Paid'].map(tab => (
                <button
                   key={tab}
                   onClick={() => setFilter(tab)}
                   className={`flex-1 md:px-8 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${
                     filter === tab ? 'bg-white text-brand-navy shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-900 transparent'
                   }`}
                >
                   {tab}
                </button>
             ))}
          </div>
          
          <div className="w-full md:w-96 relative">
             <input 
               type="text"
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange text-sm font-semibold text-gray-700"
               placeholder="Search subjects, topics, courses..."
             />
             <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5"/>
          </div>
       </div>

       {/* Grid Content */}
       {loading ? (
          <LoadingSpinner size="lg" />
       ) : filteredNotes.length === 0 ? (
          <EmptyState 
             icon="📄" 
             heading="No notes found" 
             subtext="Be the first to upload study notes for your course!"
             defaultLink="/upload-notes"
             actionLabel="Upload Notes"
          />
       ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {filteredNotes.map(note => (
                <NotesCard key={note.id} note={note} />
             ))}
          </div>
       )}

    </div>
  );
};

export default Notes;
