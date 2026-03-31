import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createNote } from '../firebase/firestore';
import { uploadPDF } from '../firebase/storage';
import { UploadCloud, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadNotes = () => {
    const { currentUser, userProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    
    const [formData, setFormData] = useState({
       title: '',
       subject: '',
       course: '',
       description: '',
       price: '0',
       isFree: true
    });

    const handleInputChange = (e) => {
       setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleFile = (e) => {
        const selected = e.target.files[0];
        if(!selected) return;
        
        if(selected.type !== 'application/pdf') {
            return toast.error('Only PDF files are allowed');
        }
        if(selected.size > 5 * 1024 * 1024) {
             return toast.error('Maximum 5MB limit exceeded');
        }
        setFile(selected);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!file) return toast.error("Please select a PDF file");
        
        setLoading(true);
        try {
            toast.loading("Uploading PDF...", { id: "pdf-upload" });
            const pdfUrl = await uploadPDF(file, `notes/${currentUser.uid}`);
            
            toast.loading("Saving details...", { id: "pdf-upload" });
            
            const noteData = {
                user_id: currentUser.uid,
                title: formData.title,
                subject: formData.subject,
                course: formData.course,
                description: formData.description,
                price: formData.isFree ? 0 : Number(formData.price),
                file_url: pdfUrl,
                college_name: userProfile.college_name,
            };

            const noteId = await createNote(noteData);
            toast.dismiss("pdf-upload");
            toast.success("Notes uploaded successfully!");
            navigate(`/notes/${noteId}`);

        } catch (error) {
           toast.dismiss("pdf-upload");
           toast.error("Upload failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h1 className="text-3xl font-black text-brand-navy mb-8">Upload Study Notes</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                   
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
                            <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange" placeholder="e.g. Complete Engineering Mathematics Notes" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Subject *</label>
                            <input type="text" name="subject" required value={formData.subject} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange" placeholder="e.g. Mathematics" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Course/Branch *</label>
                            <input type="text" name="course" required value={formData.course} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange" placeholder="e.g. Computer Science (1st Year)" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea name="description" rows={3} value={formData.description} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange resize-none" placeholder="What's included in these notes? Topics covered?" />
                    </div>

                    {/* File Upload */}
                    <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">PDF File *</label>
                         <div className="border-2 border-dashed border-gray-300 hover:border-brand-orange bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer relative transition-colors">
                             <input type="file" accept="application/pdf" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                             {file ? (
                                <>
                                  <FileText className="w-12 h-12 text-red-500 mb-2" />
                                  <p className="font-bold text-gray-900">{file.name}</p>
                                  <p className="text-sm font-bold text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                  <p className="text-sm text-brand-orange mt-2 font-bold hover:underline">Click to change file</p>
                                </>
                             ) : (
                                <>
                                  <UploadCloud className="w-12 h-12 text-gray-400 mb-2" />
                                  <p className="font-bold text-gray-900">Click or drag PDF file here</p>
                                  <p className="text-sm font-bold text-gray-500 mt-1">Max file size 5MB</p>
                                </>
                             )}
                         </div>
                    </div>

                    {/* Price Setup */}
                    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                        <label className="flex items-center space-x-3 cursor-pointer mb-4">
                            <input type="checkbox" checked={formData.isFree} onChange={(e) => setFormData({...formData, isFree: e.target.checked})} className="w-5 h-5 rounded text-brand-orange focus:ring-brand-orange" />
                            <span className="font-bold text-gray-800">Make these notes free to download</span>
                        </label>
                        
                        {!formData.isFree && (
                            <div className="pt-4 border-t border-orange-200/50">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-bold text-gray-700">Set Price (₹)</label>
                                    <span className="font-black text-brand-orange text-xl">₹{formData.price}</span>
                                </div>
                                <input 
                                   type="range" 
                                   name="price"
                                   min="10" 
                                   max="100" 
                                   step="5"
                                   value={formData.price} 
                                   onChange={handleInputChange} 
                                   className="w-full accent-brand-orange cursor-grab" 
                                />
                                <div className="flex justify-between text-xs font-bold text-gray-400 mt-2">
                                    <span>₹10</span>
                                    <span>₹100</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                       type="submit" 
                       disabled={loading}
                       className="w-full py-4 text-lg bg-brand-orange hover:bg-orange-600 font-black text-white rounded-xl transition shadow-xl disabled:opacity-70 mt-8"
                    >
                       {loading ? 'Uploading...' : 'Publish Notes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadNotes;
