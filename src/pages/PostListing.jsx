import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createListing, getAllUsers } from '../firebase/firestore';
import { uploadImage } from '../firebase/storage';
import ImageUpload from '../components/ImageUpload';
import toast from 'react-hot-toast';
import emailjs from 'emailjs-com';

const CATEGORIES = [
  "Electronics", "Books", "Furniture", "Cycles", 
  "Clothing", "Accessories", "Essential Items", "Study Materials", 
  "Engineering Tools", "Lab Equipment", "Calculators", "Other"
];

const PostListing = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('sell'); // sell, rent
  const [images, setImages] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
    condition: 'Used',
    is_negotiable: false,
    is_exit_sale: false,
    location: userProfile?.college_name || '',
    tags: [],
    // Rent specific
    security_deposit: ''
  });

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({...prev, tags: [...prev.tags, tagInput.trim()]}));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({...prev, tags: prev.tags.filter(t => t !== tagToRemove)}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return toast.error("Title and price are required");
    if (images.length === 0) return toast.error("Please upload at least one image");

    setLoading(true);
    try {
      toast.loading("Uploading images...", { id: "uploading" });
      
      const imageUrls = await Promise.all(
        images.map((img, idx) => uploadImage(img, `listings/${currentUser.uid}`))
      );

      toast.loading("Saving listing...", { id: "uploading" });

      const listingData = {
        user_id: currentUser.uid,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        condition: formData.condition,
        listing_type: activeTab,
        is_negotiable: formData.is_negotiable,
        is_exit_sale: formData.is_exit_sale,
        location: formData.location,
        college_name: userProfile.college_name,
        city: userProfile.city,
        tags: formData.tags,
        image_url_1: imageUrls[0] || null,
        image_url_2: imageUrls[1] || null,
        security_deposit: activeTab === 'rent' ? Number(formData.security_deposit) : 0,
      };

      const newId = await createListing(listingData);

      // --- NEW FEATURE: Send BCC Email to all active users ---
      try {
          const allUsers = await getAllUsers();
          // Filter out the person who posted the ad, and anyone without an email
          const recipientEmails = allUsers
              .filter(u => u.email && u.id !== currentUser.uid)
              .map(u => u.email);

          if (recipientEmails.length > 0) {
              const bccString = recipientEmails.join(',');

              // Call EmailJS using a single request to cover all users via BCC
              await emailjs.send(
                  import.meta.env.VITE_EMAILJS_SERVICE_ID,
                  import.meta.env.VITE_EMAILJS_NEW_LISTING_TEMPLATE_ID, 
                  {
                      poster_email: currentUser.email, // Option 1 support
                      bcc_emails: bccString,
                      listing_title: formData.title,
                      price: formData.price,
                      listing_url: `${window.location.origin}/listing/${newId}`
                  },
                  import.meta.env.VITE_EMAILJS_PUBLIC_KEY
              );
              console.log(`Sent broadcast email via BCC to ${recipientEmails.length} users.`);
          }
      } catch (emailErr) {
          console.error("Failed to send broadcast email", emailErr);
          // Do nothing to the user view, the ad still posted successfully
      }

      toast.dismiss("uploading");
      toast.success("Listing posted & Users Notified!");
      navigate(`/listing/${newId}`);

    } catch (error) {
      toast.dismiss("uploading");
      toast.error(error.message || "Failed to post listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
         <h1 className="text-3xl font-black text-brand-navy mb-8">Post a Listing</h1>

         {/* Type Tabs */}
         <div className="flex bg-gray-50 p-2 rounded-2xl mb-8 border border-gray-200">
            <button 
               onClick={() => setActiveTab('sell')}
               className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'sell' ? 'bg-white text-brand-navy shadow-sm border border-gray-100 scale-100' : 'text-gray-500 hover:text-gray-700'}`}
            >
               Sell an Item
            </button>
            <button 
               onClick={() => setActiveTab('rent')}
               className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'rent' ? 'bg-white text-brand-navy shadow-sm border border-gray-100 scale-100' : 'text-gray-500 hover:text-gray-700'}`}
            >
               Rent out Item
            </button>
            <button 
               onClick={() => navigate('/upload-notes')}
               className={`flex-1 py-3 text-sm font-bold rounded-xl text-brand-orange hover:bg-orange-50`}
            >
               Upload Notes &rarr;
            </button>
         </div>

         <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Images */}
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Upload Images (Max 2)</label>
               <ImageUpload images={images} setImages={setImages} maxImages={2} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                   <label className="block text-sm font-bold text-gray-700 mb-2">Ad Title *</label>
                   <input 
                     type="text" name="title" required maxLength={100}
                     value={formData.title} onChange={handleInputChange}
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange font-semibold"
                     placeholder={activeTab === 'sell' ? "e.g., iPhone 13 Pro 128GB" : "e.g., Scientific Calculator for rent"}
                   />
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">{activeTab === 'rent' ? 'Rent Price (per day) *' : 'Price *'} (₹)</label>
                   <input 
                     type="number" name="price" required min="0"
                     value={formData.price} onChange={handleInputChange}
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange font-bold text-lg text-brand-orange"
                     placeholder="0"
                   />
                </div>

                {activeTab === 'rent' && (
                   <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">Security Deposit (₹)</label>
                       <input 
                         type="number" name="security_deposit" min="0"
                         value={formData.security_deposit} onChange={handleInputChange}
                         className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange"
                         placeholder="Optional deposit"
                       />
                   </div>
                )}

                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                   <select 
                     name="category" value={formData.category} onChange={handleInputChange}
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange font-semibold appearance-none"
                   >
                     {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                   </select>
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Condition *</label>
                   <select 
                     name="condition" value={formData.condition} onChange={handleInputChange}
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange font-semibold appearance-none"
                   >
                     <option value="New">New (Unused)</option>
                     <option value="Used">Used</option>
                   </select>
                </div>
            </div>

            <div className="md:col-span-2">
               <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
               <textarea 
                 name="description" rows={5} maxLength={500}
                 value={formData.description} onChange={handleInputChange}
                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange resize-none"
                 placeholder="Include details like brand, age, condition, reason for selling..."
               />
            </div>

            {/* Checkboxes Area */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
               <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" name="is_negotiable" checked={formData.is_negotiable} onChange={handleInputChange} className="w-5 h-5 rounded text-brand-orange focus:ring-brand-orange cursor-pointer" />
                  <span className="font-bold text-gray-700 group-hover:text-brand-orange transition">Price is Negotiable</span>
               </label>
               
               <label className="flex items-center space-x-3 cursor-pointer group pt-4 border-t border-gray-200">
                  <input type="checkbox" name="is_exit_sale" checked={formData.is_exit_sale} onChange={handleInputChange} className="w-5 h-5 rounded text-red-500 focus:ring-red-500 cursor-pointer" />
                  <div>
                    <span className="font-bold text-red-600 block group-hover:text-red-700 transition">🔥 Student Clearance Sale</span>
                    <span className="text-xs text-gray-500">Enable this if you are graduating or leaving and need to sell urgently. Gives priority placement.</span>
                  </div>
               </label>
            </div>

            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Tags (Press Add)</label>
               <div className="flex space-x-2 mb-3">
                  <input 
                    type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange"
                    placeholder="e.g., Apple, M1"
                    onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleTagAdd(e); }}}
                  />
                  <button type="button" onClick={handleTagAdd} className="bg-brand-navy text-white px-4 rounded-xl font-bold hover:bg-blue-900 transition">Add</button>
               </div>
               <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                     <span key={tag} className="px-3 py-1 bg-white border border-gray-200 text-sm font-bold text-gray-600 rounded-full flex items-center">
                        #{tag} <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-red-400 hover:text-red-600 font-bold">&times;</button>
                     </span>
                  ))}
               </div>
            </div>

            <button 
               type="submit" 
               disabled={loading}
               className="w-full py-4 text-lg bg-brand-orange hover:bg-orange-600 font-black text-white rounded-xl transition shadow-xl disabled:opacity-70 mt-8"
            >
               {loading ? 'Posting...' : `Post ${activeTab === 'sell' ? 'Ad' : 'Item for Rent'} Now`}
            </button>

         </form>
      </div>
    </div>
  );
};

export default PostListing;
