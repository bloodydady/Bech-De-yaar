import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getListings, deleteListing, getAllUsers, createGlobalAd, deleteGlobalAd, getGlobalAds, banUser, unbanUser } from '../firebase/firestore';
import { ShieldAlert, Trash2, Megaphone, Users, Search, ShoppingBag, Ban, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ListingCard from '../components/ListingCard';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
   const { currentUser } = useAuth();
   const navigate = useNavigate();
   
   const [activeTab, setActiveTab] = useState('listings'); // listings, users, ads
   const [listings, setListings] = useState([]);
   const [users, setUsers] = useState([]);
   const [globalAds, setGlobalAds] = useState([]);
   const [loading, setLoading] = useState(true);
   
   const [adForm, setAdForm] = useState({ title: '', imageUrl: '', redirectUrl: '' });
   
   // Security Check
   useEffect(() => {
       if (!currentUser || currentUser.email !== 'monsteroflove1234@gmail.com') {
           navigate('/home', { replace: true });
       }
   }, [currentUser, navigate]);

   useEffect(() => {
       const loadData = async () => {
           setLoading(true);
           try {
               if (activeTab === 'listings') {
                   const res = await getListings({}, 100);
                   setListings(res.data || []);
               } else if (activeTab === 'users') {
                   const usersList = await getAllUsers();
                   setUsers(usersList || []);
               } else if (activeTab === 'ads') {
                   const adsList = await getGlobalAds();
                   setGlobalAds(adsList || []);
               }
           } catch (error) {
               console.error("Admin error", error);
               toast.error("Failed to fetch admin data.");
           } finally {
               setLoading(false);
           }
       };
       if (currentUser?.email === 'monsteroflove1234@gmail.com') loadData();
   }, [activeTab, currentUser]);

   const handleDeleteListing = async (id) => {
       if (window.confirm("Admin: Permanently delete this listing?")) {
           try {
               await deleteListing(id);
               setListings(prev => prev.filter(l => l.id !== id));
               toast.success("Listing obliterated.");
           } catch (error) {
               toast.error("Failed to delete.");
           }
       }
   };

   const handleCreateAd = async (e) => {
       e.preventDefault();
       try {
           const id = await createGlobalAd(adForm);
           toast.success("Global Banners Ad Created!");
           setGlobalAds(prev => [{id, ...adForm, created_at: new Date().toISOString() }, ...prev]);
           setAdForm({ title: '', imageUrl: '', redirectUrl: '' });
       } catch (error) {
           toast.error("Failed to create ad.");
       }
   };

   const handleDeleteAd = async (id) => {
       if (window.confirm("Delete this banner?")) {
           try {
               await deleteGlobalAd(id);
               setGlobalAds(prev => prev.filter(ad => ad.id !== id));
               toast.success("Ad Deleted");
           } catch (error) {
               toast.error("Failed to delete ad");
           }
       }
   }

   if (currentUser?.email !== 'monsteroflove1234@gmail.com') {
       return <div className="text-center py-20 font-bold text-red-500">Access Denied</div>;
   }

   return (
       <div className="max-w-7xl mx-auto w-full px-4 mb-20">
           
           <div className="bg-red-50 border border-red-200 rounded-3xl p-8 mb-8 flex flex-col sm:flex-row justify-between items-center sm:items-start text-red-800">
               <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <ShieldAlert className="w-8 h-8 text-white" />
                  </div>
                  <div>
                      <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
                      <p className="font-bold opacity-80 mt-1">Superuser: {currentUser.email}</p>
                  </div>
               </div>
           </div>

           <div className="flex space-x-4 mb-8 border-b border-gray-200 pb-2">
               <button onClick={() => setActiveTab('listings')} className={`px-6 py-3 font-bold rounded-lg transition-colors ${activeTab === 'listings' ? 'bg-brand-navy text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
                   <span className="flex items-center"><ShoppingBag className="w-4 h-4 mr-2" /> All Listings</span>
               </button>
               <button onClick={() => setActiveTab('users')} className={`px-6 py-3 font-bold rounded-lg transition-colors ${activeTab === 'users' ? 'bg-brand-navy text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
                   <span className="flex items-center"><Users className="w-4 h-4 mr-2" /> All Users</span>
               </button>
               <button onClick={() => setActiveTab('ads')} className={`px-6 py-3 font-bold rounded-lg transition-colors ${activeTab === 'ads' ? 'bg-brand-orange text-white shadow-md' : 'text-gray-500 hover:bg-orange-50 hover:text-brand-orange'}`}>
                   <span className="flex items-center"><Megaphone className="w-4 h-4 mr-2" /> Platform Ads</span>
               </button>
           </div>

           {loading ? (
               <LoadingSpinner size="lg" />
           ) : activeTab === 'listings' ? (
               <div>
                   <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
                       <h3 className="font-bold text-gray-700">Total System Listings: {listings.length}</h3>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                       {listings.map(l => (
                           <div key={l.id} className="relative group">
                               <div className="absolute top-2 right-2 z-20">
                                   <button onClick={() => handleDeleteListing(l.id)} className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:scale-110 transition">
                                       <Trash2 className="w-4 h-4" />
                                   </button>
                               </div>
                               <ListingCard listing={l} showActions={false} />
                           </div>
                       ))}
                   </div>
               </div>
           ) : activeTab === 'users' ? (
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                   <table className="w-full text-left">
                       <thead className="bg-gray-50 text-gray-500 font-bold text-sm uppercase">
                           <tr>
                               <th className="px-6 py-4">User</th>
                               <th className="px-6 py-4">Email / Phone</th>
                               <th className="px-6 py-4">Institution</th>
                               <th className="px-6 py-4">Joined</th>
                               <th className="px-6 py-4">Action</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                            {users.map(u => (
                                <tr key={u.id} className={`hover:bg-gray-50 transition ${u.is_banned ? 'bg-red-50/50' : ''}`}>
                                    <td className="px-6 py-4 font-bold text-gray-900 flex items-center space-x-2">
                                        <span>{u.name}</span>
                                        {u.is_banned && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black uppercase">Banned</span>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{u.email} <br/> {u.phone || 'No phone'}</td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">{u.college_name}</td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        {u.is_banned ? (
                                            <button onClick={async () => {
                                                await unbanUser(u.id);
                                                setUsers(prev => prev.map(x => x.id === u.id ? {...x, is_banned: false} : x));
                                                toast.success(`${u.name} has been unbanned`);
                                            }} className="flex items-center space-x-1 text-green-600 font-bold hover:bg-green-50 px-3 py-1.5 rounded-lg text-sm transition">
                                                <CheckCircle className="w-4 h-4" /> <span>Unban</span>
                                            </button>
                                        ) : (
                                            <button onClick={async () => {
                                                if (!window.confirm(`Ban ${u.name}? They will not be able to access the platform.`)) return;
                                                await banUser(u.id);
                                                setUsers(prev => prev.map(x => x.id === u.id ? {...x, is_banned: true} : x));
                                                toast.success(`${u.name} has been banned`);
                                            }} className="flex items-center space-x-1 text-red-500 font-bold hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm transition">
                                                <Ban className="w-4 h-4" /> <span>Ban</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                       </tbody>
                   </table>
               </div>
           ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-white border border-gray-100 shadow-sm p-6 sm:p-8 rounded-3xl">
                       <h2 className="text-2xl font-black text-brand-navy mb-6">Create Global Platform Ad</h2>
                       <form onSubmit={handleCreateAd} className="space-y-6">
                           <div>
                               <label className="block text-sm font-bold text-gray-700 mb-2">Ad Headline</label>
                               <input type="text" required value={adForm.title} onChange={e => setAdForm({...adForm, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange" placeholder="e.g. 50% Off Exam Prep Books" />
                           </div>
                           <div>
                               <label className="block text-sm font-bold text-gray-700 mb-2">Banner Image URL</label>
                               <input type="url" required value={adForm.imageUrl} onChange={e => setAdForm({...adForm, imageUrl: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange" placeholder="https://imgur.com/your-ad.png" />
                           </div>
                           <div>
                               <label className="block text-sm font-bold text-gray-700 mb-2">Redirect Destination URL</label>
                               <input type="url" required value={adForm.redirectUrl} onChange={e => setAdForm({...adForm, redirectUrl: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange" placeholder="https://sponsor-site.com" />
                           </div>
                           <button type="submit" className="w-full py-4 bg-brand-orange text-white font-black rounded-xl hover:bg-orange-600 transition shadow-lg flex justify-center items-center">
                               <Megaphone className="w-5 h-5 mr-2" /> Launch Advertisement
                           </button>
                       </form>
                   </div>
                   
                   <div className="bg-white border border-gray-100 shadow-sm p-6 sm:p-8 rounded-3xl">
                       <h2 className="text-2xl font-black text-brand-navy mb-6">Active Ads</h2>
                       {globalAds.length === 0 ? (
                           <p className="text-gray-500 font-bold text-center py-10">No active ads right now.</p>
                       ) : (
                           <div className="space-y-4">
                               {globalAds.map(ad => (
                                   <div key={ad.id} className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                       <div className="flex-1 min-w-0 pr-4">
                                           <div className="flex items-center space-x-3 mb-1">
                                               {ad.imageUrl && <img src={ad.imageUrl} alt="ad banner" className="h-8 w-8 object-contain bg-white rounded border" />}
                                               <h4 className="font-bold text-gray-900 truncate">{ad.title}</h4>
                                           </div>
                                           <p className="text-xs text-blue-500 truncate">{ad.redirectUrl}</p>
                                       </div>
                                       <button onClick={() => handleDeleteAd(ad.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0">
                                            <Trash2 className="w-5 h-5" />
                                       </button>
                                   </div>
                               ))}
                           </div>
                       )}
                   </div>
               </div>
           )}
       </div>
   );
};

export default AdminDashboard;
