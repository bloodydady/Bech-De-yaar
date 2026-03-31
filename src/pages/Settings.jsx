import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCircle, Settings as SettingsIcon, ShieldClose, Lock, LogOut, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
    const { currentUser, userProfile, logout, resetPassword } = useAuth();
    const navigate = useNavigate();

    const handlePasswordReset = async () => {
        if (!currentUser?.email) return;
        try {
            await resetPassword(currentUser.email);
            toast.success("Password reset email sent to your inbox");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to log out?")) {
            await logout();
            navigate('/', { replace: true });
        }
    };

    const Toggle = ({ label }) => (
        <label className="flex items-center justify-between cursor-pointer py-3 border-b border-gray-100 last:border-0">
            <span className="font-bold text-gray-700">{label}</span>
            <div className="relative">
                <input type="checkbox" className="sr-only" defaultChecked />
                <div className="block bg-brand-orange w-10 h-6 rounded-full shadow-inner"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4 shadow"></div>
            </div>
        </label>
    );

    return (
        <div className="max-w-3xl mx-auto w-full px-4">
            <h1 className="text-3xl font-black text-brand-navy mb-8 flex items-center">
                <SettingsIcon className="w-8 h-8 mr-3 opacity-80" /> Settings
            </h1>

            {/* Profile Section */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center space-x-6">
                    {userProfile?.profile_photo_url ? (
                        <img src={userProfile.profile_photo_url} alt="Profile" className="w-20 h-20 rounded-full object-cover border border-gray-200" />
                    ) : (
                        <UserCircle className="w-20 h-20 text-gray-300" />
                    )}
                    <div>
                        <h2 className="text-xl font-black text-gray-900">{userProfile?.name || 'User'}</h2>
                        <p className="text-gray-500 font-bold mb-3">{userProfile?.college_name}</p>
                        <Link to="/profile/edit" className="text-sm font-bold text-brand-orange bg-orange-50 px-4 py-2 rounded-lg hover:bg-orange-100 transition">Edit Profile</Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Account & Privacy */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-black text-brand-navy mb-4 flex items-center"><Lock className="w-5 h-5 mr-2 opacity-70" /> Account Security</h3>
                        <div className="space-y-4">
                            <button onClick={handlePasswordReset} className="w-full text-left font-bold text-gray-700 pb-3 border-b border-gray-100 hover:text-brand-orange transition">
                                Send Password Reset Link
                            </button>
                            <div className="pb-3 border-b border-gray-100">
                                <span className="block font-bold text-gray-700 mb-1">Registered Phone</span>
                                <span className="text-sm text-gray-500">{userProfile?.phone || 'Not provided'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-black text-brand-navy mb-4 flex items-center"><ShieldClose className="w-5 h-5 mr-2 opacity-70" /> Privacy Options</h3>
                        <div className="space-y-4 text-gray-700 font-bold">
                            <Link to="/settings/blocked" className="block w-full text-left pb-3 border-b border-gray-100 hover:text-brand-orange transition flex justify-between items-center">
                                <span>Blocked Users</span>
                                <span className="text-gray-400 bg-gray-100 px-2 py-0.5 rounded text-xs">Manage</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Notifications & Danger */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-black text-brand-navy mb-4 flex items-center"><Bell className="w-5 h-5 mr-2 opacity-70" /> Notifications</h3>
                        <div className="space-y-2">
                            <Toggle label="New Messages" />
                            <Toggle label="New Offers" />
                            <Toggle label="Item Sold Updates" />
                            <Toggle label="Nearby Exit Sales" />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-100">
                        <h3 className="text-lg font-black text-red-500 mb-4">Danger Zone</h3>
                        <button onClick={handleLogout} className="w-full py-4 bg-gray-50 hover:bg-red-50 text-red-600 font-black rounded-xl transition flex items-center justify-center space-x-2 border border-red-100">
                            <LogOut className="w-5 h-5" />
                            <span>Log Out of App</span>
                        </button>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Settings;
