import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const AVATARS = [
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Felix',
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Milo',
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Tigger',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Willow',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Oscar',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Sasha',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Jasper',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Cleo',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Samson',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Boots',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Pumpkin',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
];

const EditProfile = () => {
    const { currentUser, userProfile, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(userProfile?.profile_photo_url || '');

    const [formData, setFormData] = useState({
        name: userProfile?.name || currentUser?.displayName || '',
        phone: userProfile?.phone || '',
        college_name: userProfile?.college_name || '',
        city: userProfile?.city || ''
    });

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile({
                name: formData.name,
                phone: formData.phone,
                college_name: formData.college_name,
                city: formData.city,
                profile_photo_url: selectedAvatar
            });
            
            toast.success("Profile updated!");
            navigate(`/profile/${currentUser.uid}`);
        } catch (error) {
            toast.error(error.message || "Failed to edit profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full px-4 mb-20">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100">
                <h1 className="text-3xl font-black text-brand-navy mb-8">Edit Profile</h1>
                
                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Avatar Selector */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-6 uppercase tracking-widest flex items-center">
                            Choose Your Avatar <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">No upload needed</span>
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
                            {AVATARS.map((avatar, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setSelectedAvatar(avatar)}
                                    className={`relative group rounded-2xl overflow-hidden transition-all duration-300 border-4 ${
                                        selectedAvatar === avatar ? 'border-brand-orange scale-110 shadow-lg' : 'border-transparent hover:border-gray-200'
                                    }`}
                                >
                                    <img src={avatar} alt={`Avatar ${idx}`} className="w-full h-full object-cover p-1 bg-gray-50" />
                                    {selectedAvatar === avatar && (
                                        <div className="absolute top-1 right-1 bg-brand-orange text-white rounded-full p-0.5 shadow-sm">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:bg-white transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email (Static)</label>
                            <input disabled value={currentUser?.email || ''} className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-gray-400 cursor-not-allowed font-semibold text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:bg-white transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">School / College Name</label>
                            <input name="college_name" value={formData.college_name} onChange={handleChange} required className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:bg-white transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">City / Area</label>
                            <input name="city" value={formData.city} onChange={handleChange} required className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:bg-white transition" />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-5 text-xl bg-brand-orange hover:bg-orange-600 font-black text-white rounded-[1.5rem] transition shadow-[0_10px_30px_rgba(245,166,35,0.3)] hover:-translate-y-1 active:scale-[0.98]">
                        {loading ? 'Updating Profile...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
