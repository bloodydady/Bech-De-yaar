import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserById, getRatings, createRating, deleteRating, updateUser, getListings } from '../firebase/firestore';
import { getChatId } from '../firebase/realtimeDb';
import LoadingSpinner from '../components/LoadingSpinner';
import ListingCard from '../components/ListingCard';
import { UserCircle, MapPin, Calendar, Star, ShieldCheck, MessageCircle, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const UserProfile = () => {
   const { userId } = useParams();
   const { currentUser, userProfile } = useAuth();
   const navigate = useNavigate();
   const [profile, setProfile] = useState(null);
   const [loading, setLoading] = useState(true);
   const [activeTab, setActiveTab] = useState('listings');
   const [reviews, setReviews] = useState([]);
   const [userListings, setUserListings] = useState([]);

   // Rating form
   const [ratingScore, setRatingScore] = useState(0);
   const [ratingHover, setRatingHover] = useState(0);
   const [ratingText, setRatingText] = useState('');
   const [ratingLoading, setRatingLoading] = useState(false);

   useEffect(() => {
     const fetchProfile = async () => {
         setLoading(true);
         try {
             const data = await getUserById(userId);
             setProfile(data);

             const ratings = await getRatings(userId);
             // fetch reviewer names
             const ratingsWithUser = await Promise.all(ratings.map(async (r) => {
                 const u = await getUserById(r.reviewer_id);
                 return { ...r, reviewer: u };
             }));
             setReviews(ratingsWithUser);

             const listingsRes = await getListings({ userId, status: 'active' }, 20);
             setUserListings(listingsRes.data || []);
         } catch (err) {
             console.error(err);
         }
         setLoading(false);
     };
     fetchProfile();
   }, [userId]);

   const isOwnProfile = currentUser?.uid === userId;
   const alreadyReviewed = reviews.some(r => r.reviewer_id === currentUser?.uid);

   const handleSubmitRating = async (e) => {
       e.preventDefault();
       if (!currentUser || ratingScore === 0) return;
       setRatingLoading(true);
       try {
           await createRating({
               reviewed_user_id: userId,
               reviewer_id: currentUser.uid,
               score: ratingScore,
               comment: ratingText.trim()
           });
           
           // Recalculate average
           const newCount = (profile.reviews_count || 0) + 1;
           const oldTotal = (profile.rating_avg || 0) * (profile.reviews_count || 0);
           const newAvg = (oldTotal + ratingScore) / newCount;
           await updateUser(userId, { rating_avg: parseFloat(newAvg.toFixed(2)), reviews_count: newCount });
           
           setProfile(prev => ({ ...prev, rating_avg: newAvg, reviews_count: newCount }));
           
           // Re-fetch reviews
           const ratings = await getRatings(userId);
           const ratingsWithUser = await Promise.all(ratings.map(async (r) => {
               const u = await getUserById(r.reviewer_id);
               return { ...r, reviewer: u };
           }));
           setReviews(ratingsWithUser);
           
           setRatingScore(0);
           setRatingText('');
           toast.success('Rating submitted!');
       } catch (err) {
           toast.error('Failed to submit rating');
       } finally {
           setRatingLoading(false);
       }
   };

   const handleChat = () => {
       if (!currentUser) return navigate('/login');
       const chatId = getChatId(currentUser.uid, userId);
       navigate(`/chat/${chatId}`);
   };

   const handleDeleteReview = async (ratingId) => {
       if(!window.confirm("Permanently delete this review?")) return;
       try {
           await deleteRating(ratingId);
           setReviews(prev => prev.filter(r => r.id !== ratingId));
           toast.success("Review deleted");
       } catch (err) {
           toast.error("Failed to delete review");
       }
   };

   if(loading) return <div className="py-20"><LoadingSpinner size="lg" /></div>;
   if(!profile) return <div className="text-center py-20 text-xl font-bold">User Not Found</div>;

   return (
      <div className="max-w-4xl mx-auto w-full px-4 mb-20">
         
         <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-8 relative">
            {/* Cover */}
            <div className="h-48 bg-gradient-to-r from-[#1C2F5E] via-[#2A437E] to-[#F5A623] relative overflow-hidden">
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8 relative -mt-16 sm:-mt-20">
               <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="flex gap-4 items-end">
                     {profile.profile_photo_url ? (
                        <img src={profile.profile_photo_url} alt="profile" className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-lg bg-white" />
                     ) : (
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                           <UserCircle className="w-20 h-20 text-gray-300" />
                        </div>
                     )}
                     <div className="mb-2">
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center">
                           {profile.name}
                           <ShieldCheck className="w-6 h-6 text-brand-success ml-2" />
                        </h1>
                        <p className="text-gray-500 font-bold flex items-center mt-1 text-sm sm:text-base">
                           <MapPin className="w-4 h-4 mr-1 text-brand-orange" /> {profile.college_name}
                        </p>
                     </div>
                  </div>

                  {isOwnProfile ? (
                     <Link to="/profile/edit" className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition sm:mb-2 text-center">
                        Edit Profile
                     </Link>
                  ) : (
                     <div className="flex space-x-3 sm:mb-2 text-center">
                        <button onClick={handleChat} className="flex-1 sm:flex-none px-6 py-2.5 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center space-x-2">
                           <MessageCircle className="w-4 h-4" /> <span>Chat</span>
                        </button>
                     </div>
                  )}
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 border-t border-gray-100 pt-6">
                  <div>
                     <span className="block text-gray-400 font-bold text-sm">Rating</span>
                     <span className="font-black text-xl text-brand-orange flex items-center">
                        <Star className="w-5 h-5 mr-1 fill-current" />
                        {profile.rating_avg > 0 ? profile.rating_avg.toFixed(1) : 'New'}
                     </span>
                  </div>
                  <div>
                     <span className="block text-gray-400 font-bold text-sm">Reviews</span>
                     <span className="font-black text-xl text-brand-navy">{profile.reviews_count || 0}</span>
                  </div>
                  <div>
                     <span className="block text-gray-400 font-bold text-sm">City</span>
                     <span className="font-black text-xl text-brand-navy truncate block">{profile.city || '-'}</span>
                  </div>
                  <div>
                     <span className="block text-gray-400 font-bold text-sm">Joined</span>
                     <span className="font-black text-xl text-brand-navy">{new Date(profile.created_at).getFullYear()}</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 min-h-[400px]">
            <div className="flex space-x-6 border-b border-gray-100 mb-6">
               <button onClick={()=>setActiveTab('listings')} className={`pb-3 font-bold text-lg transition-colors border-b-2 ${activeTab==='listings' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-400'}`}>Listings ({userListings.length})</button>
               <button onClick={()=>setActiveTab('reviews')} className={`pb-3 font-bold text-lg transition-colors border-b-2 ${activeTab==='reviews' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-400'}`}>Reviews ({reviews.length})</button>
            </div>
            
            {activeTab === 'listings' ? (
                userListings.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="font-bold text-xl mb-2">No active listings</p>
                        <p>This user hasn't posted anything recently.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {userListings.map(l => <ListingCard key={l.id} listing={l} />)}
                    </div>
                )
            ) : (
                <div className="space-y-8">
                    {/* Rate this user form */}
                    {currentUser && !isOwnProfile && !alreadyReviewed && (
                        <form onSubmit={handleSubmitRating} className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100">
                            <h4 className="font-black text-brand-navy text-lg mb-4">Rate {profile.name}</h4>
                            <div className="flex items-center space-x-1 mb-4">
                                {[1,2,3,4,5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRatingScore(star)}
                                        onMouseEnter={() => setRatingHover(star)}
                                        onMouseLeave={() => setRatingHover(0)}
                                        className="focus:outline-none transition-transform hover:scale-125"
                                    >
                                        <Star className={`w-8 h-8 ${(ratingHover || ratingScore) >= star ? 'text-brand-orange fill-brand-orange' : 'text-gray-300'}`} />
                                    </button>
                                ))}
                                <span className="ml-3 text-sm font-bold text-gray-500">
                                    {ratingScore > 0 ? ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][ratingScore] : 'Select rating'}
                                </span>
                            </div>
                            <textarea
                                value={ratingText}
                                onChange={(e) => setRatingText(e.target.value)}
                                placeholder="Share your experience with this seller..."
                                rows="3"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange mb-4 font-medium"
                            />
                            <button
                                type="submit"
                                disabled={ratingLoading || ratingScore === 0}
                                className="px-8 py-3 bg-brand-orange text-white font-bold rounded-xl hover:bg-orange-600 transition disabled:opacity-50 shadow-md"
                            >
                                {ratingLoading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}
                    {alreadyReviewed && !isOwnProfile && (
                        <div className="bg-green-50 text-green-700 font-bold p-4 rounded-xl text-center border border-green-100">✅ You've already reviewed this user</div>
                    )}

                    {/* Reviews list */}
                    {reviews.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <Star className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="font-bold text-xl mb-2">No reviews yet</p>
                            <p className="text-gray-400">Be the first to review this seller.</p>
                        </div>
                    ) : (
                        reviews.map(r => (
                            <div key={r.id} className="flex space-x-4 pb-6 border-b border-gray-50 last:border-0 relative">
                                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                                    {r.reviewer?.profile_photo_url ? (
                                        <img src={r.reviewer.profile_photo_url} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center"><UserCircle className="w-6 h-6 text-gray-300" /></div>
                                    )}
                                </div>
                                <div className="flex-1 pr-10">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-gray-900">{r.reviewer?.name || 'Student'}</span>
                                        <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}</span>
                                    </div>
                                    <div className="flex items-center space-x-0.5 mb-2">
                                        {[1,2,3,4,5].map(s => (
                                            <Star key={s} className={`w-4 h-4 ${s <= r.score ? 'text-brand-orange fill-brand-orange' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                    {r.comment && <p className="text-gray-600 font-medium">{r.comment}</p>}
                                </div>
                                {(currentUser?.uid === r.reviewer_id || currentUser?.email === 'monsteroflove1234@gmail.com') && (
                                    <button onClick={() => handleDeleteReview(r.id)} className="absolute top-0 right-0 text-red-400 hover:text-red-600 p-2 bg-red-50 rounded-lg transition hover:scale-110">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
         </div>

      </div>
   );
};

export default UserProfile;
