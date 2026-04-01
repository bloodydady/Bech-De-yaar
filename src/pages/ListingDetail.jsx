import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, MessageCircle, DollarSign, Share2, AlertTriangle, ShieldCheck, UserCircle, Phone, Send, Star } from 'lucide-react';
import { getListingById, getUserById, updateListing, getComments, createComment, getRatings, createRating, createNotification, updateUser } from '../firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { getChatId } from '../firebase/realtimeDb';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  
  // Rating States
  const [ratings, setRatings] = useState([]);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingText, setRatingText] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const data = await getListingById(id);
        if (data) {
          setListing(data);
          const sellerData = await getUserById(data.user_id);
          setSeller(sellerData);
          
          // Increment views
          if (!currentUser || currentUser.uid !== data.user_id) {
             await updateListing(id, { views: (data.views || 0) + 1 });
          }
        }
        // Fetch comments
        const cmts = await getComments(id);
        // Fetch user info for each comment
        const cmtsWithUser = await Promise.all(cmts.map(async (c) => {
            const u = await getUserById(c.user_id);
            return { ...c, user: u };
        }));
        setComments(cmtsWithUser);

        // Fetch Seller Ratings
        const f_ratings = await getRatings(data.user_id);
        const ratingsWithUser = await Promise.all(f_ratings.map(async (r) => {
            const u = await getUserById(r.reviewer_id);
            return { ...r, user: u };
        }));
        setRatings(ratingsWithUser);
      } catch (error) {
        console.error("Fetch listing error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, currentUser]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;
    setCommentLoading(true);
    try {
      await createComment({
        listing_id: id,
        user_id: currentUser.uid,
        text: commentText.trim()
      });
      const cmts = await getComments(id);
      const cmtsWithUser = await Promise.all(cmts.map(async (c) => {
        const u = await getUserById(c.user_id);
        return { ...c, user: u };
      }));
      setComments(cmtsWithUser);
      setCommentText('');
      toast.success('Comment posted!');
    } catch (err) {
      toast.error('Failed to post comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const images = [];
  if (listing?.image_url_1) images.push(listing.image_url_1);
  if (listing?.image_url_2) images.push(listing.image_url_2);

  const handlePostRating = async (e) => {
    e.preventDefault();
    if (!currentUser || !seller) return;
    setRatingLoading(true);
    try {
      await createRating({
        reviewed_user_id: seller.id,
        reviewer_id: currentUser.uid,
        rating: ratingValue,
        comment: ratingText.trim(),
        listing_title: listing.title
      });
      
      // Update local ratings list
      const f_ratings = await getRatings(seller.id);
      const r_withU = await Promise.all(f_ratings.map(async (r) => {
          const u = await getUserById(r.reviewer_id);
          return { ...r, user: u };
      }));
      setRatings(r_withU);
      
      // Recalculate average for the seller
      const sum = f_ratings.reduce((acc, r) => acc + r.rating, 0);
      const navg = sum / f_ratings.length;
      await updateUser(seller.id, { rating_avg: navg, reviews_count: f_ratings.length });
      
      // Notify seller
      await createNotification({
         recipient_id: seller.id,
         type: 'rating',
         title: 'New Rating Received! ★',
         message: `${currentUser.displayName || 'A student'} gave you ${ratingValue} stars for "${listing.title}"`,
         link: `/profile/${seller.id}`
      });

      setRatingText('');
      toast.success('Rating submitted!');
    } catch (err) {
      toast.error('Failed to submit rating');
    } finally {
      setRatingLoading(false);
    }
  };

  const handleShare = () => {
     const url = window.location.href;
     navigator.clipboard.writeText(url);
     toast.success("Link copied to clipboard!");
  };

  const handleChat = () => {
     if (!currentUser) return navigate('/login');
     const chatId = getChatId(currentUser.uid, seller.id);
     navigate(`/chat/${chatId}?listing=${listing.id}`);
  };

  const handleMakeOffer = (e) => {
    e.preventDefault();
    if (!currentUser) return navigate('/login');
    if (!offerAmount || isNaN(offerAmount)) return toast.error("Please enter a valid amount");
    
    const chatId = getChatId(currentUser.uid, seller.id);
    const message = encodeURIComponent(`Hi ${seller.name}, I'm interested in "${listing.title}". Would you accept ₹${offerAmount}?`);
    
    setIsOfferModalOpen(false);
    navigate(`/chat/${chatId}?listing=${listing.id}&msg=${message}`);
  };

  if (loading) return <div className="py-32"><LoadingSpinner size="lg" /></div>;
  if (!listing) return <EmptyState icon="😕" heading="Listing Not Found" subtext="This listing may have been removed." defaultLink="/browse" actionLabel="Go to Browse" />;

  const isOwner = currentUser?.uid === listing.user_id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <SEO 
        title={listing.title} 
        description={`${listing.title} in ${listing.category} for ₹${listing.price}. ${listing.description.substring(0, 100)}...`} 
        image={images[0]} 
        type="product"
      />
      
      {/* JSON-LD Structured Data for Google Search */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": listing.title,
          "image": images,
          "description": listing.description,
          "brand": {
            "@type": "Brand",
            "name": "Bech De Yaar"
          },
          "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "INR",
            "price": listing.price,
            "availability": listing.status === 'active' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": listing.condition === 'New' ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition"
          }
        })}
      </script>
       
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6 font-medium">
         <Link to="/home" className="hover:text-brand-orange transition">Home</Link>
         <span className="mx-2">/</span>
         <Link to={`/browse?category=${listing.category}`} className="hover:text-brand-orange transition">{listing.category}</Link>
         <span className="mx-2">/</span>
         <span className="text-gray-900 truncate max-w-[200px]">{listing.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
         
         {/* Left Column - Details */}
         <div className="w-full lg:w-3/5 space-y-6">
            
            {/* Image Gallery */}
            <div className="bg-white rounded-3xl p-3 border border-gray-100 shadow-sm relative">
                {listing.status === 'sold' && (
                   <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-10 flex justify-center transform -rotate-12">
                      <span className="border-4 border-red-500 text-red-500 font-black text-5xl md:text-6xl px-8 py-2 rounded-xl bg-white/90 backdrop-blur-sm uppercase tracking-widest">SOLD</span>
                   </div>
                )}
                
                <div className={`aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden relative flex items-center justify-center ${listing.status === 'sold' ? 'opacity-50 grayscale' : ''}`}>
                    {images.length > 0 ? (
                       <img src={images[activeImage]} alt={listing.title} className="w-full h-full object-contain" />
                    ) : (
                       <span className="text-gray-400">No images provided</span>
                    )}
                </div>
                
                {images.length > 1 && (
                    <div className="flex space-x-3 mt-3 px-1">
                       {images.map((img, idx) => (
                           <button 
                             key={idx} 
                             onClick={() => setActiveImage(idx)}
                             className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-brand-orange ring-2 ring-orange-200' : 'border-transparent opacity-60 hover:opacity-100'}`}
                           >
                             <img src={img} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
                           </button>
                       ))}
                    </div>
                )}
            </div>

            {/* Core Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                   <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight flex-1 min-w-0">{listing.title}</h1>
                   <div className="flex flex-col items-end flex-shrink-0">
                      <span className="text-4xl font-black text-brand-orange">
                         {listing.price === 0 ? 'Free' : `₹${listing.price.toLocaleString()}`}
                         {listing.listing_type === 'rent' && <span className="text-lg font-bold text-gray-500"> /day</span>}
                      </span>
                      {listing.is_negotiable && (
                         <span className="text-sm font-bold text-brand-success bg-green-50 px-2 py-1 rounded mt-1">Negotiable</span>
                      )}
                   </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-8">
                   <span className="px-4 py-1.5 bg-gray-100 text-gray-700 font-bold text-sm rounded-full">{listing.category}</span>
                   <span className={`px-4 py-1.5 font-bold text-sm rounded-full ${listing.condition === 'New' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{listing.condition}</span>
                   {listing.is_exit_sale && <span className="px-4 py-1.5 bg-red-100 text-red-700 font-bold text-sm rounded-full border border-red-200 shadow-sm">🔥 Student Clearance Sale</span>}
                   {listing.listing_type === 'rent' && <span className="px-4 py-1.5 bg-blue-100 text-blue-700 font-bold text-sm rounded-full">Rent</span>}
                </div>

                <div className="space-y-6">
                   <div>
                      <h3 className="text-lg font-black text-brand-navy mb-3">Description</h3>
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed pb-4 border-b border-gray-100">{listing.description}</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div className="flex flex-col">
                         <span className="text-gray-400 font-bold mb-1">Posted</span>
                         <span className="text-gray-900 font-semibold">{formatDistanceToNow(new Date(listing.created_at))} ago</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-gray-400 font-bold mb-1">Location</span>
                         <span className="text-gray-900 font-semibold flex items-center"><MapPin className="w-4 h-4 mr-1 text-brand-orange"/> {listing.location || 'Campus area'}</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-gray-400 font-bold mb-1">Views</span>
                         <span className="text-gray-900 font-semibold">{listing.views}</span>
                      </div>
                      {listing.listing_type === 'rent' && listing.security_deposit > 0 && (
                         <div className="flex flex-col">
                            <span className="text-gray-400 font-bold mb-1">Security Deposit</span>
                            <span className="text-gray-900 font-semibold text-brand-success">₹{listing.security_deposit}</span>
                         </div>
                      )}
                   </div>
                   
                   {/* Tags */}
                   {listing.tags && listing.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4">
                         {listing.tags.map((tag, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold">#{tag}</span>
                         ))}
                      </div>
                   )}
                </div>
            </div>

         </div>

         {/* Right Column - Seller & Actions */}
         <div className="w-full lg:w-2/5 space-y-6">
            
            {!isOwner ? (
                <>
                {/* Seller Card */}
                {seller && (
                   <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                      <div className="flex items-center space-x-4 mb-6">
                         {seller.profile_photo_url ? (
                            <img src={seller.profile_photo_url} alt={seller.name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-orange p-1" />
                         ) : (
                            <UserCircle className="w-16 h-16 text-gray-300" />
                         )}
                         <div>
                            <h3 className="text-xl font-black text-gray-900">{seller.name}</h3>
                            <p className="text-sm font-bold text-gray-500 flex items-center mt-1">
                               <ShieldCheck className="w-4 h-4 text-brand-success mr-1" /> Verified Student
                            </p>
                         </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-3">
                         <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 font-bold">Institution</span>
                            <span className="font-bold text-brand-navy">{seller.college_name}</span>
                         </div>
                         <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 font-bold">Member since</span>
                            <span className="font-bold text-gray-900">{new Date(seller.created_at).getFullYear()}</span>
                         </div>
                         <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 font-bold">Seller Rating</span>
                            <span className="font-black text-brand-orange">★ {seller.rating_avg > 0 ? seller.rating_avg.toFixed(1) : 'New'} <span className="text-gray-400 text-xs ml-1">({seller.reviews_count})</span></span>
                         </div>
                      </div>
                      
                      <Link to={`/profile/${seller.id}`} className="block w-full py-3 bg-white border-2 border-brand-navy text-brand-navy font-bold rounded-xl hover:bg-brand-navy hover:text-white transition shadow-sm text-center">
                         View Seller Profile
                      </Link>
                   </div>
                )}

                {/* Actions */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
                   <button 
                     onClick={handleChat}
                     disabled={listing.status !== 'active'}
                     className="w-full py-4 flex items-center justify-center space-x-2 bg-brand-navy hover:bg-blue-900 font-bold text-white rounded-xl transition shadow-lg disabled:opacity-50"
                   >
                      <MessageCircle className="w-5 h-5" />
                      <span>Chat with Seller</span>
                   </button>
                   
                   {listing.is_negotiable && (
                      <button 
                         onClick={() => setIsOfferModalOpen(true)}
                         disabled={listing.status !== 'active'}
                         className="w-full py-4 flex items-center justify-center space-x-2 bg-brand-orange hover:bg-orange-600 font-bold text-white rounded-xl transition shadow-lg disabled:opacity-50"
                      >
                         <DollarSign className="w-5 h-5" />
                         <span>Make an Offer</span>
                      </button>
                   )}
                </div>
                </>
            ) : (
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
                   <h3 className="font-black text-brand-navy mb-4 text-xl">Manage Listing</h3>
                   <Link to={`/listing/${id}/edit`} className="w-full py-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 border border-gray-200 font-bold text-gray-700 rounded-xl transition">
                      Edit Listing Details
                   </Link>
                   {listing.status === 'active' && (
                       <button onClick={async () => {
                             await updateListing(id, { status: 'sold' });
                             setListing({...listing, status: 'sold'});
                             toast.success("Marked as Sold!");
                          }}
                          className="w-full py-4 flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-xl transition"
                       >
                          Mark as Sold
                       </button>
                   )}
                </div>
            )}

            {/* Share & Report */}
            <div className="flex items-center justify-between px-2">
                <button onClick={handleShare} className="flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-brand-navy transition">
                   <Share2 className="w-4 h-4" /> <span>Share Listing</span>
                </button>
                <button className="flex items-center space-x-2 text-sm font-bold text-gray-400 hover:text-red-500 transition">
                   <AlertTriangle className="w-4 h-4" /> <span>Report</span>
                </button>
            </div>
         </div>

      </div>

      {/* Comments Section */}
      <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <h3 className="text-2xl font-black text-brand-navy mb-6">Comments ({comments.length})</h3>

        {currentUser && (
          <form onSubmit={handlePostComment} className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><UserCircle className="w-6 h-6 text-gray-300" /></div>
              )}
            </div>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange font-medium"
            />
            <button
              type="submit"
              disabled={commentLoading || !commentText.trim()}
              className="p-3 bg-brand-orange text-white rounded-full hover:bg-orange-600 transition disabled:opacity-50 shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        )}

        {comments.length === 0 ? (
          <p className="text-center text-gray-400 py-8 font-medium">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          <div className="space-y-6">
            {comments.map((c) => (
              <div key={c.id} className="flex space-x-4">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                  {c.user?.profile_photo_url ? (
                    <img src={c.user.profile_photo_url} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><UserCircle className="w-6 h-6 text-gray-300" /></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline space-x-2 mb-1">
                    <span className="font-bold text-gray-900">{c.user?.name || 'Student'}</span>
                    <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span>
                  </div>
                  <p className="text-gray-600 font-medium">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ratings & Reviews Section */}
      <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-12">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-brand-navy">Seller Ratings ({ratings.length})</h3>
            {ratings.length > 0 && (
                <div className="flex items-center bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
                    <Star className="w-5 h-5 text-brand-orange fill-brand-orange mr-2" />
                    <span className="text-xl font-black text-brand-orange">
                        {(ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)}
                    </span>
                </div>
            )}
         </div>

         {!isOwner && currentUser && (
             <div className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100">
                <h4 className="font-black text-brand-navy mb-4">Rate your experience with this seller</h4>
                <form onSubmit={handlePostRating}>
                    <div className="flex items-center space-x-3 mb-4">
                        {[1,2,3,4,5].map(v => (
                            <button 
                                key={v} 
                                type="button"
                                onClick={() => setRatingValue(v)}
                                className={`p-2 rounded-lg transition-all ${ratingValue >= v ? 'text-brand-orange scale-110' : 'text-gray-300'}`}
                            >
                                <Star className={`w-8 h-8 ${ratingValue >= v ? 'fill-brand-orange' : ''}`} />
                            </button>
                        ))}
                    </div>
                    <textarea 
                        value={ratingText}
                        onChange={(e) => setRatingText(e.target.value)}
                        placeholder="Was the item as described? Tell others about your experience..."
                        className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange mb-4 min-h-[100px]"
                    />
                    <button 
                        type="submit"
                        disabled={ratingLoading}
                        className="bg-brand-navy text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-900 transition shadow-lg disabled:opacity-50"
                    >
                        Submit Review
                    </button>
                </form>
             </div>
         )}

         {ratings.length === 0 ? (
           <p className="text-center text-gray-400 py-8 font-medium">No ratings yet for this seller.</p>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {ratings.map((r) => (
               <div key={r.id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                            {r.user?.profile_photo_url ? (
                                <img src={r.user.profile_photo_url} className="w-full h-full object-cover" alt="" />
                            ) : <UserCircle className="w-full h-full text-gray-300 p-1" />}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">{r.user?.name || 'Student'}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{r.listing_title}</p>
                        </div>
                     </div>
                     <div className="flex items-center text-brand-orange">
                        <Star className="w-3 h-3 fill-brand-orange mr-1" />
                        <span className="text-sm font-black">{r.rating}</span>
                     </div>
                  </div>
                  <p className="text-gray-600 text-sm font-medium line-clamp-3 italic">"{r.comment}"</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold">{formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}</p>
               </div>
             ))}
           </div>
         )}
      </div>

      {/* Make an Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-brand-navy mb-2 text-center">Make an Offer</h3>
            <p className="text-gray-500 text-center mb-6 text-sm">Propose a price for <span className="font-bold text-gray-800">{listing.title}</span></p>
            
            <form onSubmit={handleMakeOffer} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Your Price (₹)</label>
                <input 
                  type="number" 
                  autoFocus
                  placeholder={listing.price}
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-2xl font-black text-brand-navy focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-brand-orange transition"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsOfferModalOpen(false)}
                  className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-brand-orange text-white font-black rounded-2xl hover:bg-orange-600 transition shadow-lg shadow-orange-500/30"
                >
                  Send Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetail;
