import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import AIAutocomplete from '../components/AIAutocomplete';

const DEFAULT_AVATARS = [
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
];

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', college_name: '', city: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    
    setLoading(true);
    try {
       // Assign a random avatar on signup to save storage
       const randomAvatar = DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];

       const userData = {
         name: formData.name,
         phone: formData.phone,
         college_name: formData.college_name,
         city: formData.city,
         profile_photo_url: randomAvatar
       };

       await signup(formData.email, formData.password, userData);
       toast.success("Account created! Please verify your email.");
       navigate('/verify-email');
    } catch (error) {
       toast.error(error.message || "Failed to sign up");
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 px-4">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 max-w-lg w-full">
        <div className="text-center mb-10">
            <div className="w-20 h-20 bg-orange-50 text-brand-orange rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <UserPlus className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-black text-brand-navy">Join the Club!</h2>
            <p className="text-gray-500 mt-2 font-medium">Create your student account in 60 seconds</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input name="name" value={formData.name} onChange={handleInputChange} required type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:bg-white transition" placeholder="John Doe" />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                <input name="phone" value={formData.phone} onChange={handleInputChange} required type="tel" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:bg-white transition" placeholder="8303XXXXXX" />
             </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
             <input name="email" value={formData.email} onChange={handleInputChange} required type="email" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:bg-white transition" placeholder="student@college.edu" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">School / College Name</label>
                <AIAutocomplete 
                    type="college"
                    value={formData.college_name}
                    onChange={(val) => setFormData({...formData, college_name: val})}
                    placeholder="e.g. NIT Durgapur"
                    required
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">City / Area</label>
                <AIAutocomplete 
                    type="city"
                    value={formData.city}
                    onChange={(val) => setFormData({...formData, city: val})}
                    placeholder="e.g. Kanpur"
                    required
                />
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-50 pt-6">
             <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                <input name="password" value={formData.password} onChange={handleInputChange} required type={showPassword ? "text" : "password"} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:bg-white transition" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-12 text-gray-400 p-1">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
             </div>
             <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm</label>
                <input name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required type={showConfirm ? "text" : "password"} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange focus:bg-white transition" placeholder="••••••••" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-12 text-gray-400 p-1">
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
             </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full py-5 mt-4 bg-brand-orange hover:bg-orange-600 font-black text-white rounded-3xl transition shadow-xl shadow-orange-200 disabled:opacity-70 text-xl overflow-hidden hover:-translate-y-1 active:scale-95">
            {loading ? "Creating Account..." : "Create Free Account"}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500 font-medium">
           Already a member? <Link to="/login" className="text-brand-orange font-black hover:underline ml-1">Log In Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
