import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, RefreshCw, LogOut, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
    const { currentUser, sendVerificationEmail, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        } else if (currentUser.emailVerified) {
            navigate('/home');
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleResend = async () => {
        if (cooldown > 0) return;
        setLoading(true);
        try {
            await sendVerificationEmail();
            toast.success("Verification email sent!");
            setCooldown(60); // 60 seconds cooldown
        } catch (error) {
            toast.error(error.message || "Failed to send email");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckVerification = () => {
        // Firebase auth user object needs to be reloaded to see current verification state
        currentUser.reload().then(() => {
            if (currentUser.emailVerified) {
                toast.success("Email verified!");
                navigate('/home');
            } else {
                toast.error("Email not verified yet. Please check your inbox Or Spam.");
            }
        });
    };

    return (
        <div className="max-w-md mx-auto w-full pt-12 pb-20 px-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
                <div className="w-20 h-20 bg-orange-50 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-10 h-10" />
                </div>

                <h1 className="text-3xl font-black text-brand-navy mb-4">Verify Your Email</h1>
                <p className="text-gray-500 mb-6 font-medium">
                    We've sent a verification link to <span className="text-brand-navy font-bold">{currentUser?.email}</span>.
                    Please click the link in the email to activate your account.
                </p>

                {/* Spam Warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 text-left">
                    <p className="text-amber-800 font-bold text-sm mb-2">⚠️ Can't find the email?</p>
                    <ul className="text-amber-700 text-xs space-y-1.5 font-medium list-disc list-inside">
                        <li>Check your <strong>Spam / Junk folder</strong> — it usually goes there</li>
                        <li>Search for emails from <strong>noreply@your-app.firebaseapp.com</strong></li>
                        <li>Mark it as "Not Spam" so future emails arrive in your inbox</li>
                        <li>If using Gmail, also check <strong>Promotions</strong> tab</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleCheckVerification}
                        className="w-full py-4 bg-brand-navy text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg flex items-center justify-center"
                    >
                        I've Verified My Email <ArrowRight className="ml-2 w-5 h-5" />
                    </button>

                    <button
                        onClick={handleResend}
                        disabled={loading || cooldown > 0}
                        className="w-full py-4 border-2 border-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition flex items-center justify-center disabled:opacity-50"
                    >
                        {loading ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : null}
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Verification Email"}
                    </button>

                    <button
                        onClick={logout}
                        className="w-full py-2 text-gray-400 font-bold hover:text-red-500 transition flex items-center justify-center text-sm"
                    >
                        <LogOut className="w-4 h-4 mr-2" /> Use a different email / Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
