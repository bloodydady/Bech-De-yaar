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
                    
                    {/* PDF Preview Container */}
                    <div className="bg-white rounded-2xl w-full h-[600px] border border-gray-100 overflow-hidden relative group shadow-inner">
                        {note.file_url ? (
                            <iframe 
                                src={`https://docs.google.com/viewer?url=${encodeURIComponent(note.file_url)}&embedded=true`} 
                                className="w-full h-full border-none"
                                title="Document Preview"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <FileText className="w-16 h-16 mb-2 opacity-20" />
                                <p className="font-bold">No Preview Available</p>
                            </div>
                        )}

                        {/* Pay-to-Unlock Overlay for Paid Notes */}
                        {note.price > 0 && (
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[6px] flex flex-col items-center justify-center z-10 px-8 text-center p-6 border-4 border-white">
                                <div className="bg-white p-8 rounded-3xl shadow-2xl border border-orange-50 max-w-xs animate-in fade-in zoom-in duration-300">
                                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <ShoppingCart className="w-10 h-10 text-brand-orange" />
                                    </div>
                                    <h3 className="text-2xl font-black text-brand-navy mb-2">Content Locked</h3>
                                    <p className="text-gray-500 font-medium mb-6 text-sm">Purchase this document to view all {note.page_count || ''} pages and download the original file.</p>
                                    <button 
                                        onClick={handleDownload} 
                                        className="w-full bg-brand-orange text-white font-black py-4 rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all shadow-orange-500/30"
                                    >
                                        Unlock Complete Note
                                    </button>
                                </div>
                            </div>
                        )}
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
