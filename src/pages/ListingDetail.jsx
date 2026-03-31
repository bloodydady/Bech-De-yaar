import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, MessageCircle, DollarSign, Share2, AlertTriangle, ShieldCheck, UserCircle, Phone, Send } from 'lucide-react';
import { getListingById, getUserById, updateListing, getComments, createComment } from '../firebase/firestore';
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
    </div>
  );
};

export default ListingDetail;
