import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter email");
    
    setLoading(true);
    try {
      await resetPassword(email);
      setIsSent(true);
      toast.success("Reset link sent to your email!");
    } catch (error) {
       toast.error(error.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-20">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 max-w-md w-full text-center">
        {!isSent ? (
            <>
                <KeyRound className="w-16 h-16 text-brand-navy mx-auto mb-4" />
                <h2 className="text-3xl font-black text-brand-navy mb-2">Reset Password</h2>
                <p className="text-gray-500 mb-8">Enter your email and we'll send you a link to reset your password.</p>

                <form onSubmit={handleReset} className="space-y-4">
                <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange text-center"
                    placeholder="student@college.edu"
                    required
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-brand-orange hover:bg-orange-600 font-bold text-white rounded-xl transition shadow-md disabled:opacity-70"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
                </form>
            </>
        ) : (
            <>
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
                <h2 className="text-3xl font-black text-brand-navy mb-2">Email Sent!</h2>
                <p className="text-gray-500 mb-8">Please check your inbox at <strong>{email}</strong> for password reset instructions.</p>
            </>
        )}

        <div className="mt-8 border-t border-gray-100 pt-6">
            <Link to="/login" className="text-brand-navy font-bold hover:underline flex items-center justify-center text-sm">
               <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
