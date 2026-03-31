import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscribeToChats, subscribeToMessages, sendMessage as sendRealtimeMessage, markMessagesRead, getChatId } from '../firebase/realtimeDb';
import { getListingById, getUserById } from '../firebase/firestore';
import { formatDistanceToNow, format } from 'date-fns';
import { Send, Image as ImageIcon, ArrowLeft, UserCircle, MessageCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import emailjs from 'emailjs-com';

const Chat = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentChatInfo, setCurrentChatInfo] = useState(null);
    const [listingInfo, setListingInfo] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [loadingChats, setLoadingChats] = useState(true);
    // Cache for user data so we don't re-fetch every render
    const [usersCache, setUsersCache] = useState({});
    
    const messagesEndRef = useRef(null);
    const params = new URLSearchParams(window.location.search);
    const listingIdQuery = params.get('listing');

    // 1. Load active chats
    useEffect(() => {
        if (!currentUser) return;
        const unsubscribe = subscribeToChats(currentUser.uid, (userChats) => {
            setChats(userChats);
            setLoadingChats(false);
        });
        return () => unsubscribe && unsubscribe();
    }, [currentUser]);

    // 2. Fetch user info for each chat participant (with caching)
    useEffect(() => {
        if (!currentUser || chats.length === 0) return;
        
        const fetchUsers = async () => {
            const newCache = { ...usersCache };
            for (const chat of chats) {
                const otherId = chat.id.split('_').find(id => id !== currentUser.uid);
                if (otherId && !newCache[otherId]) {
                    try {
                        const userData = await getUserById(otherId);
                        if (userData) {
                            newCache[otherId] = userData;
                        }
                    } catch (err) {
                        console.error("Failed to fetch user:", otherId, err);
                    }
                }
            }
            setUsersCache(newCache);
        };
        
        fetchUsers();
    }, [chats, currentUser]);

    // 3. Load selected chat messages & metadata
    useEffect(() => {
        if (!currentUser || !chatId) return;
        
        const loadChatMeta = async () => {
            const otherIds = chatId.split('_').filter(id => id !== currentUser.uid);
            if(otherIds.length > 0) {
               const user = await getUserById(otherIds[0]);
               setOtherUser(user);
               // Also add to cache
               if (user) {
                   setUsersCache(prev => ({ ...prev, [otherIds[0]]: user }));
               }
            }
            
            if (listingIdQuery) {
                const listing = await getListingById(listingIdQuery);
                setListingInfo(listing);
            } else {
                const chatMeta = chats.find(c => c.id === chatId);
                if (chatMeta && chatMeta.listing_id) {
                    const listing = await getListingById(chatMeta.listing_id);
                    setListingInfo(listing);
                }
            }
        };

        loadChatMeta();
        
        const unsubscribe = subscribeToMessages(chatId, (msgs) => {
            setMessages(msgs);
            markMessagesRead(chatId, currentUser.uid);
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });
        
        return () => unsubscribe && unsubscribe();
    }, [chatId, currentUser, listingIdQuery, chats]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || !currentUser || !chatId) return;

        const msgtext = inputValue.trim();
        setInputValue('');

        const messageData = {
            sender_id: currentUser.uid,
            text: msgtext,
        };

        const listId = listingInfo?.id || listingIdQuery || null;
        await sendRealtimeMessage(chatId, messageData, listId);
        
        // --- NEW: Send Email Notification ---
        if (otherUser?.email) {
            const templateParams = {
                to_name: otherUser.name,
                to_email: otherUser.email,
                from_name: userProfile?.name || 'A student',
                message: msgtext,
                listing_title: listingInfo?.title || 'Unknown Item',
                chat_url: window.location.origin + `/chat/${chatId}`
            };

            emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                templateParams,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            ).then((response) => {
               console.log('Email sent successfully!', response.status, response.text);
            }).catch((err) => {
               console.error('Email failed to send...', err);
            });
        }
    };

    const isMobile = window.innerWidth < 768;

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            
            {/* Left Panel - Chat List */}
            <div className={`w-full md:w-1/3 flex flex-col border-r border-gray-100 ${isMobile && chatId ? 'hidden' : 'block'}`}>
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-xl font-black text-brand-navy">Messages</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {loadingChats ? (
                        <div className="p-8 flex justify-center"><LoadingSpinner /></div>
                    ) : chats.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 font-medium">No messages yet.</div>
                    ) : (
                        chats.map(chat => {
                            const otherId = chat.id.split('_').find(id => id !== currentUser.uid);
                            const isActive = chat.id === chatId;
                            const cachedUser = usersCache[otherId];
                            
                            return (
                                <Link 
                                    to={`/chat/${chat.id}`} 
                                    key={chat.id}
                                    className={`flex items-center p-4 border-b border-gray-50 hover:bg-gray-50 transition ${isActive ? 'bg-orange-50/50' : ''}`}
                                >   
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0 overflow-hidden bg-brand-navy/10">
                                       {cachedUser?.profile_photo_url ? (
                                           <img src={cachedUser.profile_photo_url} alt={cachedUser.name} className="w-full h-full object-cover" />
                                       ) : (
                                           <UserCircle className="w-8 h-8 text-brand-navy/40" />
                                       )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-gray-900 truncate">{cachedUser?.name || 'Loading...'}</h4>
                                            {chat.last_message_time && (
                                               <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                                 {format(new Date(chat.last_message_time), 'HH:mm')}
                                               </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">{chat.last_message}</p>
                                    </div>
                                </Link>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Right Panel - Chat Detail */}
            <div className={`w-full md:w-2/3 flex flex-col bg-gray-50/30 ${isMobile && !chatId ? 'hidden' : 'block'}`}>
                {chatId ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 bg-white border-b border-gray-100 flex items-center shadow-sm z-10">
                            {isMobile && (
                                <button onClick={() => navigate('/chat')} className="mr-3 p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                            )}
                            <div className="relative">
                                {otherUser?.profile_photo_url ? (
                                   <img src={otherUser.profile_photo_url} className="w-10 h-10 rounded-full object-cover mr-3" alt="user"/>
                                ) : (
                                   <UserCircle className="w-10 h-10 text-brand-navy/40 mr-3" />
                                )}
                                <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 leading-tight">{otherUser?.name || 'Loading...'}</h3>
                                <p className="text-xs font-semibold text-gray-500">{otherUser?.college_name}</p>
                            </div>
                        </div>

                        {/* Listing Preview Strip */}
                        {listingInfo && (
                            <div className="bg-orange-50 p-3 border-b border-orange-100 flex items-center justify-between z-10 shadow-sm cursor-pointer hover:bg-orange-100 transition" onClick={() => navigate(`/listing/${listingInfo.id}`)}>
                                <div className="flex items-center space-x-3">
                                   <div className="w-10 h-10 bg-white rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                                      {listingInfo.image_url_1 ? (
                                          <img src={listingInfo.image_url_1} alt="list" className="w-full h-full object-cover" />
                                      ) : <ImageIcon className="w-5 h-5 text-gray-300"/>}
                                   </div>
                                   <div>
                                       <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">{listingInfo.title}</p>
                                       <p className="text-brand-orange font-black text-sm">₹{listingInfo.price}</p>
                                   </div>
                                </div>
                                <span className="text-xs font-bold text-orange-600 bg-white px-2 py-1 rounded">View Ad</span>
                            </div>
                        )}

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => {
                                const isMe = msg.sender_id === currentUser.uid;
                                return (
                                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        {/* Show other user's avatar on their messages */}
                                        {!isMe && (
                                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mr-2 mt-1">
                                                {otherUser?.profile_photo_url ? (
                                                    <img src={otherUser.profile_photo_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <UserCircle className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                                            isMe 
                                              ? 'bg-brand-orange text-white rounded-br-sm shadow-sm' 
                                              : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm text-brand-navy'
                                        }`}>
                                            <p className={`font-semibold ${isMe ? 'font-normal' : ''}`}>{msg.text}</p>
                                            <span className={`text-[10px] flex justify-end mt-1 ${isMe ? 'text-orange-200' : 'text-gray-400'}`}>
                                                {msg.created_at ? format(new Date(msg.created_at), 'HH:mm') : 'now'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <form onSubmit={handleSend} className="flex items-center space-x-2">
                                <button type="button" className="p-3 text-gray-400 hover:text-brand-navy hover:bg-gray-50 rounded-full transition">
                                    <ImageIcon className="w-5 h-5" />
                                </button>
                                <input 
                                    type="text" 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange font-medium"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!inputValue.trim()}
                                    className="p-3 bg-brand-orange text-white rounded-full hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                >
                                    <Send className="w-5 h-5 ml-1" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-24 h-24 bg-blue-50 text-brand-navy rounded-full flex items-center justify-center mb-6">
                            <MessageCircle className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-black text-brand-navy mb-2">Your Messages</h2>
                        <p className="text-gray-500 max-w-sm">Select a conversation from the left or start a new chat from a listing.</p>
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default Chat;
