import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Download, ShieldCheck, UserCircle, Star, ShoppingCart } from 'lucide-react';
import { getNoteById, getUserById, updateListing } from '../firebase/firestore'; // Using updateListing to increment counts hypothetically
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const NoteDetail = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    
    const [note, setNote] = useState(null);
    const [uploader, setUploader] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNoteData = async () => {
            setLoading(true);
            try {
                const data = await getNoteById(id);
                if (data) {
                    setNote(data);
                    const user = await getUserById(data.user_id);
                    setUploader(user);
                }
            } catch (error) {
                console.error("error fetching note detail", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNoteData();
    }, [id]);

    const handleDownload = () => {
        if (!currentUser) return toast.error("Please login to download files.");

        // NOTE: In production, trigger PDF download link from Storage URL
        if(note.file_url) {
           window.open(note.file_url, '_blank');
           toast.success("Download started!");
           // Hypothetical logic to update counts
        } else {
           toast.error("File URL is broken");
        }
    };

    if (loading) return <div className="py-20"><LoadingSpinner size="lg" /></div>;
    if (!note) return <EmptyState icon="📄" heading="Note not found" subtext="It may have been deleted" defaultLink="/notes" actionLabel="Back to notes" />;

    return (
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6">
           <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left View - PDF PREVIEW */}
              <div className="w-full lg:w-2/3">
                 <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col mb-8">
                    <div className="flex items-center space-x-3 text-sm font-bold mb-4">
                       <span className="px-3 py-1 bg-red-100 text-red-600 rounded-md">PDF</span>
                       <span className="text-gray-400">•</span>
                       <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md">{note.subject}</span>
                    </div>
                    
                    <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4">{note.title}</h1>
                    <p className="text-gray-600 mb-8 leading-relaxed whitespace-pre-line border-b border-gray-100 pb-8">{note.description}</p>
                    
                    {/* Simulated PDF container */}
                    <div className="bg-gray-100 rounded-2xl w-full h-[500px] border border-gray-200 overflow-hidden relative flex flex-col items-center justify-center">
                        {note.price > 0 ? (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center z-10 px-8 text-center">
                                <ShoppingCart className="w-16 h-16 text-brand-orange mb-4 opacity-80" />
                                <h3 className="text-2xl font-black text-brand-navy mb-2">Unlock Full Document</h3>
                                <p className="text-gray-600 font-medium mb-6">This document requires a payment of ₹{note.price} to view the full contents.</p>
                                <button onClick={handleDownload} className="bg-brand-orange text-white text-lg font-black px-8 py-4 rounded-xl shadow-xl hover:-translate-y-1 transition flex items-center shadow-orange-500/30">
                                   Buy Now for ₹{note.price}
                                </button>
                            </div>
                        ) : (
                             // Mock iframe for free preview
                             <div className="flex flex-col items-center text-gray-500">
                                <FileText className="w-20 h-20 mb-4 opacity-30 text-gray-400" />
                                <button onClick={handleDownload} className="bg-brand-navy hover:bg-blue-900 text-white font-bold px-6 py-3 rounded-xl transition flex items-center shadow-md">
                                  <Download className="w-5 h-5 mr-2" /> Download to View
                               </button>
                             </div>
                        )}
                        <iframe 
                           src={note.price === 0 && note.file_url ? `${note.file_url}#toolbar=0` : ''} 
                           className="absolute inset-0 w-full h-full border-none pointer-events-none opacity-20"
                           title="PDF Preview"
                        />
                    </div>
                 </div>
              </div>

              {/* Right View - Uploader Info */}
              <div className="w-full lg:w-1/3">
                 <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 sticky top-24">
                    
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                       <span className="font-bold text-gray-500">Price</span>
                       <span className={`text-3xl font-black ${note.price === 0 ? 'text-brand-success' : 'text-brand-orange'}`}>
                          {note.price === 0 ? 'Free' : `₹${note.price}`}
                       </span>
                    </div>
                    
                    <button 
                       onClick={handleDownload}
                       className="w-full py-4 text-center rounded-xl font-black text-white bg-brand-navy hover:bg-blue-900 transition flex items-center justify-center space-x-2"
                    >
                       <Download className="w-5 h-5" /> <span>{note.price === 0 ? 'Download Document' : `Pay ₹${note.price} to Download`}</span>
                    </button>

                    <div className="flex justify-between text-sm font-bold text-gray-500 px-2 py-4 border-y border-gray-100">
                       <span>Total Downloads</span>
                       <span className="text-gray-900">{note.download_count || 0}</span>
                    </div>

                    {uploader && (
                       <div className="pt-2">
                           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Uploaded By</span>
                           <Link to={`/profile/${uploader.id}`} className="flex items-center space-x-3 hover:bg-gray-50 p-2 -mx-2 rounded-xl transition">
                               {uploader.profile_photo_url ? (
                                   <img src={uploader.profile_photo_url} alt={uploader.name} className="w-12 h-12 rounded-full object-cover" />
                               ) : (
                                   <UserCircle className="w-12 h-12 text-gray-300" />
                               )}
                               <div>
                                   <h4 className="font-bold text-gray-900 flex items-center">{uploader.name} <ShieldCheck className="w-4 h-4 ml-1 text-brand-success"/></h4>
                                   <span className="text-xs font-bold text-gray-500">{uploader.college_name}</span>
                               </div>
                           </Link>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
    );
};

export default NoteDetail;
