import React, { useState, useEffect } from 'react';
import { Bell, MessageCircle, DollarSign, Target, CheckCheck, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subscribeToNotifications, markNotificationRead } from '../firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Notifications = () => {
   const { currentUser } = useAuth();
   const [notifications, setNotifications] = useState([]);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   useEffect(() => {
     if (!currentUser) return;
     const unsubscribe = subscribeToNotifications(currentUser.uid, (data) => {
        setNotifications(data);
        setLoading(false);
     });
     return () => unsubscribe && unsubscribe();
   }, [currentUser]);

   const handleMarkAllRead = async () => {
      try {
        const unread = notifications.filter(n => !n.read);
        await Promise.all(unread.map(n => markNotificationRead(n.id)));
        toast.success("All caught up!");
      } catch (e) {
        toast.error("Failed to mark read");
      }
   };

   const handleNotifClick = async (notif) => {
      if(!notif.read) {
          await markNotificationRead(notif.id);
      }
      if(notif.chat_id) {
          navigate(`/chat/${notif.chat_id}`);
      } else if(notif.listing_id) {
          navigate(`/listing/${notif.listing_id}`);
      }
   };

   const iconMap = {
      message: <MessageCircle className="w-5 h-5 text-orange-500" />,
      sold: <Target className="w-5 h-5 text-green-500" />,
      offer: <DollarSign className="w-5 h-5 text-blue-500" />,
      nearby: <Bell className="w-5 h-5 text-purple-500" />,
   };
   
   const bgMap = {
      message: 'bg-orange-100',
      sold: 'bg-green-100',
      offer: 'bg-blue-100',
      nearby: 'bg-purple-100',
   };

   if (loading) return <div className="py-20"><LoadingSpinner size="lg" /></div>;

   return (
      <div className="max-w-3xl mx-auto w-full px-4 mb-20 pt-4">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
            <h1 className="text-3xl font-black text-brand-navy">Notifications</h1>
            {notifications.length > 0 && (
                <button 
                   onClick={handleMarkAllRead} 
                   className="flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-brand-navy transition bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full"
                >
                   <CheckCheck className="w-4 h-4" /> <span>Mark all read</span>
                </button>
            )}
         </div>

         {notifications.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm px-6">
               <div className="w-20 h-20 bg-blue-50 text-brand-navy rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🎉</div>
               <h3 className="text-2xl font-black text-brand-navy mb-2">You're all caught up!</h3>
               <p className="text-gray-500 max-w-xs mx-auto">When you receive offers, messages, or campus alerts, they'll appear here in real-time.</p>
            </div>
         ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden divide-y divide-gray-50">
               {notifications.map((notif) => (
                  <div 
                     key={notif.id} 
                     onClick={() => handleNotifClick(notif)}
                     className={`p-6 flex items-start space-x-4 cursor-pointer transition relative ${notif.read ? 'bg-white hover:bg-gray-50' : 'bg-orange-50/30 hover:bg-orange-50/50'}`}
                  >
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${bgMap[notif.type] || 'bg-gray-100'}`}>
                        {iconMap[notif.type] || <Bell className="w-5 h-5 text-gray-500" />}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                           <h4 className={`font-bold truncate pr-6 ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>{notif.title}</h4>
                           <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap ml-2">
                             {notif.created_at ? formatDistanceToNow(new Date(notif.created_at), { addSuffix: true }) : 'now'}
                           </span>
                        </div>
                        <p className={`text-sm line-clamp-2 ${notif.read ? 'text-gray-500 font-medium' : 'text-gray-700 font-semibold'}`}>{notif.subtext}</p>
                     </div>
                     {!notif.read && (
                        <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-brand-orange rounded-full shadow-lg shadow-brand-orange/30 border-2 border-white"></div>
                     )}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export default Notifications;
