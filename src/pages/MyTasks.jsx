import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserLazyTasks } from '../firebase/firestore';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { LayoutDashboard, CheckCircle2 } from 'lucide-react';

const MyTasks = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    
    const [tasks, setTasks] = useState({ posted: [], accepted: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('posted'); // posted, accepted

    useEffect(() => {
        if (!currentUser) return navigate('/login');

        const fetchMyTasks = async () => {
            try {
                const data = await getUserLazyTasks(currentUser.uid);
                setTasks(data);
            } catch (err) {
                console.error("Failed to fetch my tasks", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyTasks();
    }, [currentUser, navigate]);

    if (loading) return <div className="py-20"><LoadingSpinner size="lg" /></div>;

    const displayedTasks = activeTab === 'posted' ? tasks.posted : tasks.accepted;

    return (
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 mb-20">
            <div className="flex items-center space-x-4 mt-8 mb-10">
                <div className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <LayoutDashboard className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-brand-navy">My Lazy Tasks</h1>
                    <p className="text-gray-500 font-medium">Manage tasks you've posted and tasks you're earning from.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mb-10">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-1">Tasks Posted</p>
                        <p className="text-3xl font-black text-brand-navy">{tasks.posted.length}</p>
                    </div>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-1">Tasks Completed (Earned)</p>
                        <p className="text-3xl font-black text-brand-success">{tasks.accepted.filter(t => t.status === 'completed').length}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-brand-success" />
                    </div>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-1">Total Earned</p>
                        <p className="text-3xl font-black text-brand-orange">
                           ₹{tasks.accepted.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.task_fee, 0)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-100">
                    <button 
                        onClick={() => setActiveTab('posted')}
                        className={`flex-1 py-5 font-black text-center transition-colors border-b-2 ${activeTab === 'posted' ? 'bg-orange-50/50 text-brand-orange border-brand-orange' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50 border-transparent'}`}
                    >
                        Tasks I Posted ({tasks.posted.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('accepted')}
                        className={`flex-1 py-5 font-black text-center transition-colors border-b-2 ${activeTab === 'accepted' ? 'bg-orange-50/50 text-brand-orange border-brand-orange' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50 border-transparent'}`}
                    >
                        Tasks I Accepted ({tasks.accepted.length})
                    </button>
                </div>

                <div className="p-6 sm:p-8 bg-gray-50/30">
                    {displayedTasks.length === 0 ? (
                        <div className="py-12">
                            <EmptyState 
                                icon={activeTab === 'posted' ? "✍️" : "🏃"}
                                heading={activeTab === 'posted' ? "You haven't posted any tasks yet" : "You haven't accepted any tasks yet"}
                                subtext={activeTab === 'posted' ? "Need something done? Post a task and pay someone else to do it!" : "Earn extra cash by helping students out with small tasks."}
                                defaultLink={activeTab === 'posted' ? "/lazy-tasks/post" : "/lazy-tasks"}
                                actionLabel={activeTab === 'posted' ? "Post a Task" : "Browse Open Tasks"}
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {displayedTasks.map(task => (
                                <TaskCard key={task.id} task={task} currentUserId={currentUser.uid} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyTasks;
