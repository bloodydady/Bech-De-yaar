import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getListings } from '../firebase/firestore';
import ListingCard from '../components/ListingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Filter, X } from 'lucide-react';

const CATEGORIES = [
  "All", "Electronics", "Books", "Furniture", "Cycles", 
  "Clothing", "Accessories", "Hostel Items", "Study Materials", 
  "Engineering Tools", "Notes", "Lab Equipment", "Calculators", "Other"
];

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Filter State
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'All',
    type: searchParams.get('type') || 'All',
    condition: searchParams.get('condition') || 'All',
    college: searchParams.get('college') || '',
    query: searchParams.get('q') || '',
    minPrice: searchParams.get('minPrice') || 0,
    maxPrice: searchParams.get('maxPrice') || 50000,
  });

  const fetchListingsData = async (isLoadMore = false) => {
    isLoadMore ? setLoading(false) : setLoading(true);
    try {
      const qFilters = {};
      if (filters.category !== 'All') qFilters.category = filters.category;
      if (filters.type !== 'All') qFilters.type = filters.type;
      if (filters.condition !== 'All') qFilters.condition = filters.condition;

      const res = await getListings(qFilters, 50, isLoadMore ? lastDoc : null);
      
      // Client side filtering for text, price, and college mapping
      let filtered = res.data;
      if (filters.query) {
         filtered = filtered.filter(l => l.title.toLowerCase().includes(filters.query.toLowerCase()));
      }
      if (filters.college) {
         filtered = filtered.filter(l => l.college_name.toLowerCase().includes(filters.college.toLowerCase()));
      }
      filtered = filtered.filter(l => l.price >= filters.minPrice && l.price <= filters.maxPrice);

      setListings(prev => isLoadMore ? [...prev, ...filtered] : filtered);
      setLastDoc(res.lastDoc);
      
      // If we got fewer docs than limit, probably no more, though simple pagination isn't perfect with client filtering
      setHasMore(res.data.length === 50);
    } catch (error) {
      console.error("Failed to fetch listings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Sync URL params to state
    setFilters(prev => ({
        ...prev,
        category: searchParams.get('category') || 'All',
        query: searchParams.get('q') || '',
        type: searchParams.get('type') || 'All',
    }));
  }, [searchParams]);

  useEffect(() => {
    // Debounce fetch when filters change
    const timer = setTimeout(() => {
        fetchListingsData(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleApplyFilters = () => {
    setShowFilters(false);
    setSearchParams({
        category: filters.category,
        type: filters.type,
        q: filters.query,
        college: filters.college
    });
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'All', type: 'All', condition: 'All',
      college: '', query: '', minPrice: 0, maxPrice: 50000
    });
    setSearchParams({});
    setShowFilters(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto w-full relative">
      
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-4">
         <span className="font-bold text-brand-navy">Filters & Sorting</span>
         <button onClick={() => setShowFilters(true)} className="flex items-center space-x-2 text-brand-orange font-bold px-4 py-2 bg-orange-50 rounded-lg">
            <Filter className="w-4 h-4" /> <span>Filters</span>
         </button>
      </div>

      {/* Sidebar Filters */}
      <div className={`md:w-64 flex-shrink-0 ${showFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden md:block'}`}>
        <div className="flex justify-between items-start md:hidden mb-6">
           <h2 className="text-2xl font-black text-brand-navy">Filters</h2>
           <button onClick={() => setShowFilters(false)} className="p-2 bg-gray-100 rounded-full"><X className="w-5 h-5"/></button>
        </div>

        <div className="space-y-8 sticky top-24">
           {/* Search Input Filter */}
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Search Text</label>
              <input type="text" value={filters.query} onChange={e => setFilters({...filters, query: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Search..." />
           </div>

           <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Category</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                 {CATEGORIES.map(cat => (
                    <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                       <input 
                         type="radio" 
                         name="category" 
                         checked={filters.category === cat}
                         onChange={() => setFilters({...filters, category: cat})}
                         className="w-4 h-4 text-brand-orange focus:ring-brand-orange"
                       />
                       <span className={`text-sm group-hover:text-brand-orange transition ${filters.category === cat ? 'font-bold text-brand-navy' : 'text-gray-600'}`}>{cat}</span>
                    </label>
                 ))}
              </div>
           </div>

           <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Price Range</h3>
              <div className="flex space-x-4 items-center mb-2">
                 <input type="number" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: Number(e.target.value)})} className="w-full p-2 text-sm bg-gray-50 border rounded-lg" placeholder="Min" />
                 <span className="text-gray-400">-</span>
                 <input type="number" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: Number(e.target.value)})} className="w-full p-2 text-sm bg-gray-50 border rounded-lg" placeholder="Max" />
              </div>
           </div>

           <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Listing Type</h3>
              <div className="flex flex-wrap gap-2">
                 {['All', 'Buy', 'Rent'].map(type => (
                    <button 
                       key={type}
                       onClick={() => setFilters({...filters, type: type === 'Buy' ? 'sell' : type.toLowerCase()})}
                       className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filters.type === (type === 'Buy' ? 'sell' : type.toLowerCase()) ? 'bg-brand-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                       {type}
                    </button>
                 ))}
              </div>
           </div>

           <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Condition</h3>
              <div className="flex flex-wrap gap-2">
                 {['All', 'New', 'Used'].map(cond => (
                    <button 
                       key={cond}
                       onClick={() => setFilters({...filters, condition: cond})}
                       className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filters.condition === cond ? 'bg-brand-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                       {cond}
                    </button>
                 ))}
              </div>
           </div>

           <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">College Name</label>
              <input type="text" value={filters.college} onChange={e => setFilters({...filters, college: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl" placeholder="E.g. NIT Durgapur" />
           </div>

           <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3 pb-8 md:pb-0">
              <button onClick={handleApplyFilters} className="w-full py-3 bg-brand-orange text-white font-bold rounded-xl md:hidden">Apply Filters</button>
              <button onClick={handleResetFilters} className="w-full py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition">Reset All Filters</button>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
         <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-black text-brand-navy">
               {filters.query ? `Results for "${filters.query}"` : 'Browse Listings'}
            </h1>
            <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{listings.length} Results</span>
         </div>

         {/* Active Filters Row */}
         {(filters.category !== 'All' || filters.type !== 'All' || filters.condition !== 'All' || filters.college) && (
            <div className="flex flex-wrap gap-2 mb-6">
                {filters.category !== 'All' && <span className="bg-orange-50 text-brand-orange border border-orange-100 px-3 py-1 rounded-full text-sm font-bold flex items-center">{filters.category} <button onClick={() => setFilters({...filters, category: 'All'})} className="ml-2"><X className="w-3 h-3"/></button></span>}
                {filters.type !== 'All' && <span className="bg-orange-50 text-brand-orange border border-orange-100 px-3 py-1 rounded-full text-sm font-bold flex items-center">{filters.type} <button onClick={() => setFilters({...filters, type: 'All'})} className="ml-2"><X className="w-3 h-3"/></button></span>}
                {filters.condition !== 'All' && <span className="bg-orange-50 text-brand-orange border border-orange-100 px-3 py-1 rounded-full text-sm font-bold flex items-center">{filters.condition} <button onClick={() => setFilters({...filters, condition: 'All'})} className="ml-2"><X className="w-3 h-3"/></button></span>}
                {filters.college && <span className="bg-orange-50 text-brand-orange border border-orange-100 px-3 py-1 rounded-full text-sm font-bold flex items-center">{filters.college} <button onClick={() => setFilters({...filters, college: ''})} className="ml-2"><X className="w-3 h-3"/></button></span>}
            </div>
         )}

         {loading ? (
             <div className="py-20"><LoadingSpinner size="lg" /></div>
         ) : listings.length === 0 ? (
             <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <EmptyState 
                   icon="🧐" 
                   heading="No listings found" 
                   subtext="Try adjusting your filters or search terms to find what you're looking for." 
                   actionLabel="Clear Filters"
                   actionFn={handleResetFilters}
                />
             </div>
         ) : (
             <>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {listings.map(listing => (
                         <ListingCard key={listing.id} listing={listing} />
                     ))}
                 </div>
                 
                 {hasMore && listings.length >= 50 && (
                     <div className="mt-12 text-center">
                         <button 
                            onClick={() => fetchListingsData(true)}
                            className="px-8 py-3 bg-white border-2 border-brand-navy text-brand-navy font-bold rounded-xl hover:bg-brand-navy hover:text-white transition shadow-sm"
                         >
                            Load More
                         </button>
                     </div>
                 )}
             </>
         )}
      </div>

    </div>
  );
};

export default Browse;
