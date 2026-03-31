import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Eye, Clock, Image as ImageIcon } from 'lucide-react';

const ListingCard = ({ listing, showActions, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-brand-card rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col overflow-hidden relative cursor-pointer"
         onClick={() => navigate(`/listing/${listing.id}`)}>
      
      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col space-y-2 z-10 w-[calc(100%-24px)] pointer-events-none">
        <div className="flex justify-between items-start w-full">
            <span className={`px-2 py-1 text-xs font-bold rounded shadow-sm text-white ${listing.condition === 'New' ? 'bg-brand-success' : 'bg-amber-500'}`}>
            {listing.condition}
            </span>
            <div className="flex flex-col space-y-2 items-end">
                {listing.is_exit_sale && (
                <span className="px-2 py-1 text-xs font-bold rounded shadow-sm bg-brand-error text-white animate-pulse">
                    🔥 Exit Sale
                </span>
                )}
                {listing.listing_type === 'rent' && (
                <span className="px-2 py-1 text-xs font-bold rounded shadow-sm bg-blue-500 text-white">
                    Rent
                </span>
                )}
            </div>
        </div>
      </div>

      {/* Image Area */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden flex items-center justify-center">
        {listing.image_url_1 ? (
          <img 
            src={listing.image_url_1} 
            alt={listing.title} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
             <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
             <span className="text-xs">No Image</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-900 line-clamp-2 leading-snug">{listing.title}</h3>
        </div>
        
        <div className="mb-2 mt-auto text-brand-orange font-black text-xl">
            {listing.price === 0 ? 'Free' : `₹${listing.price.toLocaleString()}`}
            {listing.listing_type === 'rent' && <span className="text-sm font-normal text-gray-500"> /day</span>}
        </div>
        
        <div className="space-y-1.5 text-xs text-gray-500 mb-3 border-t border-gray-100 pt-3">
            <div className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                <span className="truncate">{listing.college_name}{listing.city ? `, ${listing.city}` : ''}</span>
            </div>
            <div className="flex justify-between items-center text-gray-400 truncate">
                <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    <span>{formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center ml-2 border-l border-gray-200 pl-2">
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    <span>{listing.views || 0}</span>
                </div>
            </div>
        </div>

        {showActions && (
          <div className="mt-2 pt-3 border-t border-gray-100 flex justify-between space-x-2" onClick={(e) => e.stopPropagation()}>
             <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(listing.id); }}
                className="flex-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded transition"
             >
                Edit
             </button>
             <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(listing.id); }}
                className="flex-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded transition"
             >
                Delete
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
