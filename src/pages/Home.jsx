import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getListings, getNotes, getLazyTasks } from '../firebase/firestore';
import ListingCard from '../components/ListingCard';
import NotesCard from '../components/NotesCard';
import TaskCard from '../components/TaskCard';
import CategoryPills from '../components/CategoryPills';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [collegeListings, setCollegeListings] = useState([]);
  const [nearbyListings, setNearbyListings] = useState([]);
  const [cheapDeals, setCheapDeals] = useState([]);
  const [notes, setNotes] = useState([]);
  const [exitSales, setExitSales] = useState([]);
  const [lazyTasks, setLazyTasks] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        // Fetch College Listings
        const collegeRes = await getListings({ category: activeCategory !== "All" ? activeCategory : undefined }, 100);
        let filteredCollege = collegeRes.data;
        
        if (userProfile?.college_name) {
             filteredCollege = filteredCollege.filter(l => l.college_name?.toLowerCase() === userProfile.college_name?.toLowerCase());
        }

        // Filter by category if strict
        if (activeCategory !== "All") {
             filteredCollege = filteredCollege.filter(l => l.category === activeCategory);
        }

        setCollegeListings(filteredCollege);

        // Only fetch independent queries if "All" is selected to avoid complex index requirements for this demo
        if (activeCategory === "All") {
          // Nearby
          if (userProfile?.city) {
             const nearbyRes = await getListings({}, 100);
             setNearbyListings(nearbyRes.data.filter(l => l.city?.toLowerCase() === userProfile.city?.toLowerCase() && l.college_name?.toLowerCase() !== userProfile.college_name?.toLowerCase()));
          } else {
             setNearbyListings([]); // Hide nearby section if not logged in
          }

          // Cheap Deals
          const cheapRes = await getListings({}, 100);
          setCheapDeals(cheapRes.data.filter(l => l.price <= 500 && l.price > 0));

          // Notes
          const notesRes = await getNotes({}, 10);
          setNotes(notesRes.data);

          // Exit Sales
          const exitRes = await getListings({ is_exit_sale: true }, 100);
          let exitSalesFiltered = exitRes.data;
          if (userProfile?.city) {
              exitSalesFiltered = exitSalesFiltered.filter(l => l.city?.toLowerCase() === userProfile.city?.toLowerCase());
          }
          setExitSales(exitSalesFiltered.slice(0, 6));

          // Lazy Tasks
          try {
              const lazyRes = await getLazyTasks({ status: 'open' }, 20);
              const now = new Date();
              let validLazy = lazyRes.filter(t => new Date(t.expires_at) > now);
              if (userProfile?.city) {
                  validLazy = validLazy.filter(t => t.city?.toLowerCase() === userProfile.city?.toLowerCase());
              }
              setLazyTasks(validLazy.slice(0, 4));
          } catch(err) {
              console.error("Failed fetching lazy tasks", err);
          }
        }

      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, [userProfile, activeCategory]);

  const ScrollSection = ({ title, items, renderItem, seeAllLink, titleHighlight }) => {
    if (!items || items.length === 0) return null;
    return (
      <section className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <h2 className={`text-2xl font-black ${titleHighlight || 'text-brand-navy'}`}>{title}</h2>
          {seeAllLink && (
             <Link to={seeAllLink} className="text-sm font-bold text-gray-400 hover:text-brand-orange transition">See All &rarr;</Link>
          )}
        </div>
        <div className="flex overflow-x-auto no-scrollbar space-x-6 pb-6 pt-2 snap-x px-2 -mx-2">
          {items.map((item, i) => (
             <div key={item.id} className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start">
                {renderItem(item)}
             </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
       <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-8 sticky top-16 z-30">
          <CategoryPills activeCategory={activeCategory} onSelect={setActiveCategory} />
       </div>

       {loading ? (
          <div className="py-20"><LoadingSpinner size="lg" /></div>
       ) : (
          <div className="py-4">
             {/* Dynamic Sections Based on Active Category */}
             {activeCategory !== "All" ? (
                 <ScrollSection 
                    title={`${activeCategory} items at ${userProfile?.college_name || 'All Campuses'}`} 
                    items={collegeListings} 
                    renderItem={l => <ListingCard listing={l} />} 
                 />
             ) : (
                 <>
                    <ScrollSection 
                        title={`From ${userProfile?.college_name || 'All Campuses'}`} 
                        items={collegeListings} 
                        seeAllLink={`/browse?college=${encodeURIComponent(userProfile?.college_name || '')}`}
                        renderItem={l => <ListingCard listing={l} />} 
                    />

                    <ScrollSection 
                        title="⚡ Lazy Tasks Near You" 
                        items={lazyTasks} 
                        seeAllLink="/lazy-tasks"
                        titleHighlight="text-brand-orange"
                        renderItem={t => <TaskCard task={t} />} 
                    />

                    {exitSales.length > 0 && (
                        <div className="bg-red-50 rounded-3xl p-6 sm:p-10 mb-12 border border-red-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 blur-sm pointer-events-none text-9xl">🔥</div>
                            <h2 className="text-2xl sm:text-3xl font-black text-red-600 mb-8 relative z-10">🔥 Student Clearance Sales</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                                {exitSales.map(l => <ListingCard key={l.id} listing={l} />)}
                            </div>
                        </div>
                    )}

                    <ScrollSection 
                        title="Cheap Deals under ₹500" 
                        items={cheapDeals} 
                        seeAllLink="/browse?maxPrice=500"
                        renderItem={l => <ListingCard listing={l} />} 
                    />

                    <ScrollSection 
                        title="Study Notes" 
                        items={notes} 
                        seeAllLink="/notes"
                        renderItem={n => <NotesCard note={n} />} 
                    />

                    <ScrollSection 
                        title="Nearby Students" 
                        items={nearbyListings} 
                        renderItem={l => <ListingCard listing={l} />} 
                    />
                 </>
             )}
          </div>
       )}
    </div>
  );
};

export default Home;
