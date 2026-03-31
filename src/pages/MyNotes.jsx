import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotes } from '../firebase/firestore'; // Note deletion mock or assume delete handler exists
import NotesCard from '../components/NotesCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const MyNotes = () => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyNotes = async () => {
      setLoading(true);
      try {
        const res = await getNotes({ userId: currentUser.uid }, 50);
        setNotes(res.data);
      } catch (error) {
        console.error("Fetch errors", error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchMyNotes();
  }, [currentUser]);

  const handleDelete = async (id) => {
    // Requires deleteNote in firestore.js, Mocking deletion from state:
    if (window.confirm("Are you sure you want to delete these notes?")) {
        setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
      <h1 className="text-3xl font-black text-brand-navy mb-8">My Uploaded Notes</h1>
      
      {loading ? (
        <LoadingSpinner size="lg" />
      ) : notes.length === 0 ? (
        <EmptyState 
           icon="📚" 
           heading={`No notes uploaded`} 
           subtext="Help your juniors by uploading your past semester notes."
           actionLabel="Upload Notes"
           defaultLink="/upload-notes"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {notes.map(note => (
            <NotesCard 
               key={note.id} 
               note={note} 
               showActions={true}
               onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNotes;
