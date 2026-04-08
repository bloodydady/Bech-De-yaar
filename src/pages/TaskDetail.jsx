import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLazyTaskById, updateLazyTask, createNotification, deleteLazyTask } from '../firebase/firestore';
import { getChatId } from '../firebase/realtimeDb';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Clock, School, Building2, CheckCircle2, ShieldAlert, Share2, Star, UserCircle, Trash2, MessageSquare } from 'lucide-react';

const TaskDetail = () => {
    const { id } = useParams();
    const { currentUser, userProfile } = useAuth();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const data = await getLazyTaskById(id);
                if (!data) {
                    toast.error("Task not found");
                    return navigate('/lazy-tasks');
                }
                setTask(data);
            } catch (error) {
                console.error("Error fetching task detail", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id, navigate]);

    if (loading) return <div className="py-20"><LoadingSpinner size="lg" /></div>;
    if (!task) return null;

    const isPoster = currentUser?.uid === task.posted_by;
    const isEarner = currentUser?.uid === task.accepted_by;
    const isAdmin = currentUser?.email === 'monsteroflove1234@gmail.com';
    const isExpired = task.status === 'open' && new Date(task.expires_at) < new Date();

    const handleAcceptTask = async () => {
        if (!currentUser) return navigate('/login');
        if (isPoster) return toast.error("You cannot accept your own task!");
        if (isExpired) return toast.error("This task has expired.");

        setActionLoading(true);
        try {
            await updateLazyTask(id, {
                status: 'accepted',
                accepted_by: currentUser.uid,
                accepted_by_name: userProfile?.name || 'Student',
                accepted_at: new Date().toISOString()
            });

            await createNotification({
                recipient_id: task.posted_by,
                sender_id: currentUser.uid,
                type: 'task_accepted',
                title: 'Task Accepted! 🎉',
                message: `${userProfile?.name || 'Someone'} accepted your task: "${task.title}". Check your accepted tasks for details!`,
                link: `/lazy-tasks/${id}`
            });

            setTask(prev => ({ 
                ...prev, 
                status: 'accepted', 
                accepted_by: currentUser.uid, 
                accepted_by_name: userProfile?.name || 'Student' 
            }));
            toast.success(`Task accepted! Go complete it and earn ₹${task.task_fee}! 💪`);
        } catch (error) {
            console.error("Error accepting task:", error);
            toast.error("Failed to accept task");
        } finally {
            setActionLoading(false);
        }
    };

    const handleMarkComplete = async () => {
        setActionLoading(true);
        try {
            await updateLazyTask(id, {
                status: 'completed',
                completed_at: new Date().toISOString()
            });

            await createNotification({
                recipient_id: task.accepted_by,
                sender_id: currentUser.uid,
                type: 'task_completed',
                title: 'Task Completed! 💸',
                message: `${userProfile?.name || 'The poster'} marked the task "${task.title}" as complete. Make sure you collected your cash!`,
                link: `/lazy-tasks/${id}`
            });

            setTask(prev => ({ ...prev, status: 'completed' }));
            toast.success(`Task completed! Don't forget to pay ₹${task.total_amount} cash! 💵`);
            
            // In a real app we might redirect to a rating prompt here
        } catch (error) {
            console.error("Error completing task:", error);
            toast.error("Failed to complete task");
        } finally {
            setActionLoading(false);
        }
    };

    const handleAdminDelete = async () => {
        if (!window.confirm("ADMIN ACTION: Delete this task permanently?")) return;
        try {
            await deleteLazyTask(id);
            toast.success("Task deleted by admin.");
            navigate('/lazy-tasks');
        } catch (error) {
            toast.error("Failed to delete.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 mb-20">
            <div className="flex flex-col lg:flex-row gap-8 mt-6">
                
                {/* Left Column - Main Details */}
                <div className="flex-1 space-y-8">
                    
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative">
                        <div className="flex items-center space-x-3 mb-6">
                            <span className="px-3 py-1 bg-brand-navy text-white text-xs font-black uppercase rounded-lg tracking-wider">
                                {task.category}
                            </span>
                            {task.is_urgent && (
                                <span className="flex items-center text-xs font-black uppercase text-red-500 bg-red-50 px-3 py-1 rounded-lg border border-red-100">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>Urgent
                                </span>
                            )}
                            {isExpired && task.status === 'open' && (
                                <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 text-xs font-black uppercase rounded-lg tracking-wider">
                                    Expired
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-black text-brand-navy leading-tight mb-4">{task.title}</h1>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium mb-8 whitespace-pre-wrap">{task.description}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-xl mr-4 flex-shrink-0"><MapPin className="w-5 h-5 text-brand-orange" /></div>
                                <div><p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Location</p><p className="font-bold text-brand-navy truncate">{task.location}</p></div>
                            </div>
                            <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-xl mr-4 flex-shrink-0"><Clock className="w-5 h-5 text-brand-orange" /></div>
                                <div><p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Deadline</p><p className="font-bold text-brand-navy">{task.deadline}</p></div>
                            </div>
                            <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-xl mr-4 flex-shrink-0"><School className="w-5 h-5 text-brand-orange" /></div>
                                <div><p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">College</p><p className="font-bold text-brand-navy truncate">{task.college}</p></div>
                            </div>
                            <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-xl mr-4 flex-shrink-0"><Building2 className="w-5 h-5 text-brand-orange" /></div>
                                <div><p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">City</p><p className="font-bold text-brand-navy truncate">{task.city}</p></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-black text-brand-navy mb-6">💰 Payment Breakdown</h2>
                        
                        <div className="flex justify-between items-center py-4 border-b border-gray-100">
                            <span className="font-bold text-gray-500 text-lg">Item Cost</span>
                            <span className="font-bold text-gray-900 text-xl">₹{task.item_cost || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-b border-gray-100">
                            <span className="font-bold text-gray-500 text-lg flex items-center">Task Fee <span className="bg-green-100 text-green-700 text-[10px] uppercase ml-2 px-2 py-0.5 rounded-full">(Earner gets this)</span></span>
                            <span className="font-black text-brand-success text-3xl">₹{task.task_fee}</span>
                        </div>
                        <div className="flex justify-between items-center py-6 bg-orange-50/50 -mx-8 px-8 mt-4">
                            <span className="font-black text-brand-navy text-xl">Total Poster Pays</span>
                            <span className="font-black text-brand-orange text-3xl">₹{task.total_amount}</span>
                        </div>
                        <p className="text-center font-bold text-gray-500 mt-6 flex justify-center items-center">
                            <ShieldAlert className="w-4 h-4 mr-2" /> All payments must be made in CASH on completion.
                        </p>
                    </div>

                </div>

                {/* Right Column - Actions & Status */}
                <div className="w-full lg:w-96 space-y-6 flex-shrink-0">
                    
                    {/* Poster Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-gray-100 border-4 border-white shadow-xl">
                            {task.posted_by_avatar ? (
                                <img src={task.posted_by_avatar} alt="poster" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-brand-navy text-white text-3xl font-bold">
                                    {task.posted_by_name?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>
                        <h3 className="font-black text-xl text-brand-navy">{task.posted_by_name}</h3>
                        <p className="text-gray-500 font-bold mb-4">{task.posted_by_college}</p>
                        <p className="text-xs text-gray-400 font-medium">Task posted {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}</p>
                    </div>

                    {/* Action Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-orange/30 shadow-orange-100/50 relative overflow-hidden">
                        
                        {task.status === 'open' && !isPoster && !isExpired && (
                            <>
                                <h3 className="font-black text-2xl text-brand-navy mb-4">Want this task?</h3>
                                <p className="text-gray-600 mb-6 font-medium text-sm leading-relaxed">
                                    You will earn <strong className="text-brand-success">₹{task.task_fee}</strong> in cash upon delivery. 
                                    {task.item_cost > 0 && ` The original item cost of ₹${task.item_cost} will be given to you upfront.`}
                                </p>
                                <button 
                                    onClick={handleAcceptTask}
                                    disabled={actionLoading}
                                    className="w-full py-4 bg-brand-success hover:bg-green-600 text-white font-black text-lg rounded-xl transition shadow-lg shadow-green-200 disabled:opacity-50 flex justify-center items-center"
                                >
                                    {actionLoading ? "Accepting..." : "Accept This Task"}
                                </button>
                            </>
                        )}

                        {task.status === 'open' && isExpired && (
                            <div className="text-center py-4">
                               <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <Clock className="w-8 h-8" />
                               </div>
                               <h3 className="font-black text-xl text-gray-800 mb-2">Task Expired</h3>
                               <p className="text-gray-500 text-sm font-medium">This task was posted over 2 hours ago and automatically expired.</p>
                               {isPoster && (
                                   <button onClick={() => navigate('/lazy-tasks/post')} className="mt-4 px-6 py-2 bg-brand-navy text-white rounded-xl font-bold text-sm w-full">Post Again</button>
                               )}
                            </div>
                        )}

                        {task.status === 'open' && isPoster && !isExpired && (
                            <div className="text-center">
                                <div className="w-12 h-12 bg-orange-100 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
                                    <div className="w-3 h-3 bg-brand-orange rounded-full animate-ping"></div>
                                </div>
                                <h3 className="font-black text-xl text-brand-navy mb-2">Waiting...</h3>
                                <p className="text-gray-500 mb-6 font-medium text-sm">Waiting for someone nearby to accept your task.</p>
                                <div className="flex flex-col gap-3">
                                    <Link to={`/lazy-tasks/${id}/edit`} className="w-full py-3 bg-white border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white font-bold rounded-xl transition">
                                        Edit Task
                                    </Link>
                                    <button 
                                        onClick={() => { if(window.confirm("Delete this task?")) deleteLazyTask(id).then(()=>navigate('/lazy-tasks')) }}
                                        className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition"
                                    >
                                        Delete Task
                                    </button>
                                </div>
                            </div>
                        )}

                        {task.status === 'accepted' && (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-100 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <h3 className="font-black text-2xl text-brand-navy mb-2">In Progress</h3>
                                
                                {isPoster ? (
                                    <>
                                        <p className="text-gray-600 mb-6 text-sm font-medium"><strong>{task.accepted_by_name}</strong> is currently completing this task. Mark it as completed once they arrive.</p>
                                        <div className="flex flex-col gap-3">
                                            <Link 
                                                to={`/chat/${getChatId(currentUser.uid, task.accepted_by)}`} 
                                                className="w-full py-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl transition flex justify-center items-center"
                                            >
                                                <MessageSquare className="w-5 h-5 mr-2" /> Chat with Earner
                                            </Link>
                                            <button 
                                                onClick={handleMarkComplete}
                                                disabled={actionLoading}
                                                className="w-full py-4 bg-brand-success hover:bg-green-600 text-white font-black rounded-xl transition shadow-lg shadow-green-200 flex justify-center items-center"
                                            >
                                                {actionLoading ? "Completing..." : "Mark as Completed ✅"}
                                            </button>
                                        </div>
                                    </>
                                ) : isEarner ? (
                                    <>
                                        <p className="text-gray-600 mb-6 text-sm font-medium">You accepted this task! Go complete it and collect <strong>₹{task.task_fee}</strong> in cash from the poster.</p>
                                        <div className="p-3 bg-gray-50 rounded-xl mb-4 border border-gray-200">
                                            <p className="text-xs text-gray-500 uppercase font-bold text-left mb-1">Deliver to:</p>
                                            <p className="font-bold text-gray-900 text-left">{task.location}</p>
                                        </div>
                                        <Link 
                                            to={`/chat/${getChatId(currentUser.uid, task.posted_by)}`} 
                                            className="w-full py-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl transition flex justify-center items-center"
                                        >
                                            <MessageSquare className="w-5 h-5 mr-2" /> Message Poster
                                        </Link>
                                    </>
                                ) : (
                                    <p className="text-gray-500 font-medium">This task has already been taken by someone else.</p>
                                )}
                            </div>
                        )}

                        {task.status === 'completed' && (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-green-100 text-brand-success rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h3 className="font-black text-2xl text-brand-navy mb-2">Task Completed ✅</h3>
                                <p className="text-gray-500 font-medium text-sm">This task was successfully completed.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }} className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 hover:text-brand-navy font-bold rounded-xl transition flex items-center justify-center shadow-sm">
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </button>
                    </div>

                    {isAdmin && (
                        <div className="mt-8 border-t border-red-100 pt-4">
                            <button onClick={handleAdminDelete} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] flex items-center justify-center">
                                <Trash2 className="w-4 h-4 mr-2" /> Delete (Admin)
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;
