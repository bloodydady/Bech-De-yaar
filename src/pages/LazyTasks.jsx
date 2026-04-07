import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLazyTasks } from '../firebase/firestore';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Zap, Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LazyTasks = () => {
    const { currentUser, userProfile } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('All');
    const [cityFilter, setCityFilter] = useState('');
    const [deadlineFilter, setDeadlineFilter] = useState('All');

    const CATEGORIES = ['All', 'Fetch & Deliver', 'Academic', 'Hostel', 'Digital', 'Other'];
    const DEADLINES = ['All', 'ASAP', '30 mins', '1 hour', 'Today'];

    useEffect(() => {
        // Pre-fill filter with user's city if available
        if (userProfile?.city) {
            setCityFilter(userProfile.city);
        }
    }, [userProfile]);

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                // Fetch up to 100 recent open tasks to allow client-side filtering
                const snap = await getLazyTasks({ status: 'open' }, 100);
                
                // Filter out expired tasks (2 hours)
                const now = new Date();
                const validTasks = snap.filter(t => new Date(t.expires_at) > now);
                setTasks(validTasks);
                
            } catch (error) {
                console.error("Failed to fetch tasks", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    // Apply Client-Side Filters
    const filteredTasks = tasks.filter(t => {
        if (filterCategory !== 'All' && t.category !== filterCategory) return false;
        if (deadlineFilter !== 'All' && t.deadline !== deadlineFilter) return false;
        if (cityFilter.trim() !== '') {
            if (!t.city.toLowerCase().includes(cityFilter.toLowerCase().trim())) return false;
        }
        return true;
    });

    return (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 mb-20">
            {/* Hero Section */}
            <div className="bg-brand-navy rounded-[2.5rem] p-8 sm:p-14 text-white mb-10 overflow-hidden relative shadow-2xl mt-4">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none transform -rotate-12 translate-x-12 -translate-y-12">
                   <Zap className="w-64 h-64 text-brand-orange fill-brand-orange" />
                </div>
                <div className="relative z-10 max-w-3xl">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-brand-orange/20 text-brand-orange font-black text-xs uppercase tracking-widest mb-6 border border-brand-orange/30">
                        Peer-to-Peer Campus Delivery
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight leading-tight">Too Lazy? <br/><span className="text-brand-orange">Pay Someone! 💸</span></h1>
                    <p className="text-blue-100/80 text-lg sm:text-xl mb-10 font-medium max-w-xl leading-relaxed">
                        Need something from the canteen? Too lazy to return a library book? Post a task, a nearby student will do it, and you pay them cash on delivery.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Link to="/lazy-tasks/post" className="w-full sm:w-auto px-8 py-4 bg-brand-orange hover:bg-orange-600 text-white font-black text-lg rounded-2xl transition shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center">
                            <Zap className="w-5 h-5 mr-2 fill-current" /> Post a Task
                        </Link>
                        <a href="#browse" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-lg rounded-2xl transition flex items-center justify-center">
                            Browse Tasks
                        </a>
                    </div>
                </div>
            </div>

            <div id="browse" className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                
                {/* Filters Header */}
                <div className="flex items-center mb-6 border-b border-gray-100 pb-6">
                    <SlidersHorizontal className="w-6 h-6 text-brand-navy mr-3" />
                    <h2 className="text-2xl font-black text-brand-navy">Explore Open Tasks</h2>
                </div>

                <div className="flex flex-col xl:flex-row gap-6 mb-8">
                    {/* Categories */}
                    <div className="flex-1 overflow-x-auto pb-2 scrollbar-none">
                        <div className="flex space-x-2">
                            {CATEGORIES.map(cat => (
                                <button
                                   key={cat}
                                   onClick={() => setFilterCategory(cat)}
                                   className={`px-5 py-2.5 rounded-xl font-bold text-sm transition whitespace-nowrap border-2 ${filterCategory === cat ? 'bg-brand-navy text-white border-brand-navy shadow-md' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
                                >
                                   {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Search & Location */}
                    <div className="flex items-center space-x-3 w-full xl:w-auto">
                        <div className="relative flex-1 xl:w-64">
                            <input 
                                type="text"
                                placeholder="City or Campus..."
                                value={cityFilter}
                                onChange={(e) => setCityFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:ring-2 focus:ring-brand-orange text-sm"
                            />
                            <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                        </div>
                        <div className="relative flex-1 xl:w-48 hidden sm:block">
                            <select 
                                value={deadlineFilter}
                                onChange={(e) => setDeadlineFilter(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl font-semibold focus:ring-2 focus:ring-brand-orange text-sm appearance-none cursor-pointer"
                            >
                                {DEADLINES.map(d => <option key={d} value={d}>Deadline: {d}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Task Grid */}
                {loading ? (
                    <div className="py-20"><LoadingSpinner size="lg" /></div>
                ) : filteredTasks.length === 0 ? (
                    <EmptyState 
                        icon="🦥" 
                        heading="No tasks currently open" 
                        subtext={cityFilter ? `No active tasks found in ${cityFilter}. Be the first to post one!` : "No open tasks matched your filters."}
                        defaultLink="/lazy-tasks/post"
                        actionLabel="Post a Task"
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTasks.map(task => (
                            <TaskCard 
                                key={task.id} 
                                task={task} 
                                currentUserId={currentUser?.uid} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LazyTasks;
