import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getListings, deleteListing, updateListing } from '../firebase/firestore';
import ListingCard from '../components/ListingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const MyListings = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active'); // active, sold, rented
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyListings = async () => {
      setLoading(true);
      try {
        const res = await getListings({ userId: currentUser.uid }, 50);
        setListings(res.data);
      } catch (error) {
        console.error("Fetch errors", error);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchMyListings();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing permanently?")) {
      try {
        await deleteListing(id);
        setListings(prev => prev.filter(l => l.id !== id));
        toast.success("Listing deleted");
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/listing/${id}/edit`);
  };

  const filteredListings = listings.filter(l => 
     activeTab === 'sold' ? l.status === 'sold' : 
     activeTab === 'rented' ? l.status === 'rented' : 
     l.status === 'active'
  );

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
      <h1 className="text-3xl font-black text-brand-navy mb-8">My Listings</h1>
      
      {/* Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-1.5 rounded-xl mb-8 border border-gray-200 w-full max-w-sm">
         {['active', 'sold', 'rented'].map(tab => (
            <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`flex-1 capitalize py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${
                 activeTab === tab ? 'bg-white text-brand-navy shadow-sm' : 'text-gray-500 hover:text-gray-900 transparent'
               }`}
            >
               {tab}
            </button>
         ))}
      </div>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : filteredListings.length === 0 ? (
        <EmptyState 
           icon="🛒" 
           heading={`No ${activeTab} listings`} 
           subtext="You haven't posted any items yet, or none match this status."
           actionLabel="Post a New Ad"
           defaultLink="/post"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredListings.map(listing => (
            <ListingCard 
               key={listing.id} 
               listing={listing} 
               showActions={true}
               onEdit={handleEdit}
               onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
