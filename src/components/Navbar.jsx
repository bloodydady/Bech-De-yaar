import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Menu, Search, X, User, MessageSquare } from 'lucide-react';
import { subscribeToUnreadCount } from '../firebase/realtimeDb';
import { subscribeToNotifications } from '../firebase/firestore';

const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);
  const navigate = useNavigate();

  // Real-time Chat Unread Listener
  React.useEffect(() => {
    if (!currentUser) return;
    const unsubChats = subscribeToUnreadCount(currentUser.uid, (count) => {
        setUnreadCount(count);
    });
    
    const unsubNotifs = subscribeToNotifications(currentUser.uid, (data) => {
        const unread = data.filter(n => !n.read).length;
        setNotifCount(unread);
    });

    return () => {
        unsubChats && unsubChats();
        unsubNotifs && unsubNotifs();
    };
  }, [currentUser]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const NavLinks = ({ onClick }) => {
    const handleLinkClick = () => {
      if (onClick) onClick();
    };
    
    return (
      <>
        <Link to="/home" onClick={handleLinkClick} className="hover:text-brand-orange transition-colors">Home</Link>
        <Link to="/browse" onClick={handleLinkClick} className="hover:text-brand-orange transition-colors">Browse</Link>
        <Link to="/notes" onClick={handleLinkClick} className="hover:text-brand-orange transition-colors">Notes</Link>
        <Link to="/about" onClick={handleLinkClick} className="hover:text-brand-orange transition-colors">About</Link>
      </>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to={currentUser ? "/home" : "/"} className="flex-shrink-0 flex items-center">
            <img src="/logo.png" alt="BechDeYaar" className="h-12 md:h-14 w-auto object-contain" />
          </Link>

          {/* Search (Desktop) */}
          {currentUser && (
            <div className="hidden md:flex flex-1 mx-8">
              <form onSubmit={handleSearch} className="w-full max-w-lg relative">
                <input
                  type="text"
                  placeholder="Search items, notes, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </form>
            </div>
          )}

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-6 text-brand-navy font-semibold items-center">
              <NavLinks onClick={() => {}} />
              {currentUser?.email === 'monsteroflove1234@gmail.com' && (
                 <Link to="/admin" className="text-red-600 font-black bg-red-50 px-3 py-1 rounded-md animate-pulse ml-4 border border-red-200">Admin Panel</Link>
              )}
            </div>

             {currentUser ? (
               <div className="flex items-center space-x-4 ml-6 border-l pl-6 border-gray-200">
                  <Link to="/chat" className="text-gray-500 hover:text-brand-navy relative" title="Messages">
                    <MessageSquare className="w-6 h-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[10px] font-black text-white ring-2 ring-white shadow-sm">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  
                  <Link to="/notifications" className="text-gray-500 hover:text-brand-navy relative" title="Alerts">
                    <Bell className="w-6 h-6" />
                    {notifCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-white shadow-sm">
                        {notifCount > 9 ? '9+' : notifCount}
                      </span>
                    )}
                  </Link>

                  <div className="relative">
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2 focus:outline-none"
                    >
                      {userProfile?.profile_photo_url ? (
                        <img src={userProfile.profile_photo_url} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </button>

                    {isProfileOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">{userProfile?.name || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate">{userProfile?.college_name}</p>
                        </div>
                        <Link to={`/profile/${currentUser.uid}`} onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
                        <Link to="/my-listings" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Listings</Link>
                        <Link to="/my-notes" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Notes</Link>
                        <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                        <button 
                          onClick={() => { setIsProfileOpen(false); logout(); }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <Link to="/post" className="bg-brand-orange text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
                    + Post Ad
                  </Link>
                  <Link to="/donate" className="bg-pink-500 text-white px-3 py-2 rounded-lg font-bold hover:bg-pink-600 transition flex items-center text-sm shadow-sm" title="Support Us">
                    ❤️ Donate
                  </Link>
               </div>
            ) : (
               <div className="flex items-center space-x-4 border-l pl-6 border-gray-200">
                  <Link to="/donate" className="text-pink-500 font-bold hover:text-pink-600 transition text-sm flex items-center" title="Support Us">
                    ❤️ Donate
                  </Link>
                  <Link to="/login" className="text-brand-navy border border-brand-navy px-4 py-2 rounded-lg font-semibold hover:bg-brand-navy hover:text-white transition">
                    Login
                  </Link>
                  <Link to="/signup" className="bg-brand-orange text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
                    Sign Up
                  </Link>
               </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-brand-navy p-2">
               {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4 absolute w-full left-0 z-40 shadow-lg">
           {currentUser && (
              <form onSubmit={handleSearch} className="mb-4">
                 <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
                 />
              </form>
           )}
           <div className="flex flex-col space-y-4 mb-4 font-semibold text-brand-navy">
             <NavLinks onClick={() => setIsMenuOpen(false)} />
           </div>
           
           {currentUser ? (
              <div className="border-t border-gray-200 pt-4 flex flex-col space-y-3">
                 <Link 
                   to="/chat" 
                   onClick={() => { setIsMenuOpen(false); }} 
                   className="text-gray-700 font-bold flex items-center justify-between"
                 >
                    Chat & Messages 
                    {unreadCount > 0 && <span className="bg-brand-orange text-white px-2 py-0.5 rounded-full text-xs font-black">{unreadCount}</span>}
                 </Link>
                 <Link to={`/profile/${currentUser.uid}`} onClick={() => { setIsMenuOpen(false); }} className="text-gray-700">My Profile</Link>
                 <Link to="/my-listings" onClick={() => { setIsMenuOpen(false); }} className="text-gray-700">My Listings</Link>
                 <Link to="/my-notes" onClick={() => { setIsMenuOpen(false); }} className="text-gray-700">My Notes</Link>
                 <Link to="/post" onClick={() => { setIsMenuOpen(false); }} className="text-brand-orange font-bold">+ Post Ad</Link>
                 <Link to="/donate" onClick={() => { setIsMenuOpen(false); }} className="text-pink-500 font-bold flex items-center">❤️ Support / Donate</Link>
                 <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-left text-red-600">Logout</button>
              </div>
           ) : (
              <div className="border-t border-gray-200 pt-4 flex flex-col space-y-3">
                 <Link to="/login" onClick={() => { setIsMenuOpen(false); }} className="w-full text-center text-brand-navy border border-brand-navy px-4 py-2 rounded-lg font-semibold">Login</Link>
                 <Link to="/signup" onClick={() => { setIsMenuOpen(false); }} className="w-full text-center bg-brand-orange text-white px-4 py-2 rounded-lg font-semibold">Sign Up</Link>
              </div>
           )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
