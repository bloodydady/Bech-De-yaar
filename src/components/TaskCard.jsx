import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ShoppingCart, BookOpen, Home, Laptop, Box, MapPin, Clock } from 'lucide-react';

const TaskCard = ({ task, currentUserId, onAccept }) => {
  const isPoster = currentUserId === task.posted_by;
  // A task is expired if it's currently open AND its expires_at is in the past.
  const isExpired = task.status === 'open' && new Date(task.expires_at) < new Date();
  
  // Category configuration
  const CATEGORY_CONFIG = {
    'Fetch & Deliver': { icon: ShoppingCart, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-l-orange-500' },
    'Academic': { icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-l-blue-500' },
    'Hostel': { icon: Home, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-l-purple-500' },
    'Digital': { icon: Laptop, color: 'text-green-500', bg: 'bg-green-50', border: 'border-l-green-500' },
    'Other': { icon: Box, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-l-gray-500' }
  };
  
  const config = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG['Other'];
  const Icon = config.icon;

  const getStatusBadge = () => {
    if (isExpired && task.status === 'open') {
        return <span className="px-2 py-1 bg-red-50 text-red-600 border border-red-200 text-[10px] font-black uppercase rounded-lg">Expired</span>;
    }
    switch (task.status) {
      case 'open':
        return <span className="px-2 py-1 bg-green-50 text-green-600 border border-green-200 text-[10px] font-black uppercase rounded-lg">Open</span>;
      case 'accepted':
        return <span className="px-2 py-1 bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-black uppercase rounded-lg">Accepted</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-black uppercase rounded-lg">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <Link to={`/lazy-tasks/${task.id}`} className={`block bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-5 border-l-4 ${config.border} relative flex flex-col h-full`}>
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-xl flex items-center space-x-2 ${config.bg}`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
          <span className={`text-[10px] font-black uppercase tracking-wider ${config.color}`}>{task.category}</span>
        </div>
        
        <div className="flex items-center space-x-2">
            {task.is_urgent && (
                <span className="flex items-center text-[10px] font-black uppercase text-red-500 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse mr-1.5"></span>
                    Urgent
                </span>
            )}
            {getStatusBadge()}
        </div>
      </div>

      <h3 className="font-black text-lg text-brand-navy mb-2 leading-tight line-clamp-2">{task.title}</h3>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{task.description}</p>

      <div className="space-y-2 mt-auto mb-4">
        <div className="flex items-center text-gray-500 text-sm font-medium">
          <MapPin className="w-4 h-4 mr-2 opacity-50 shrink-0" />
          <span className="truncate">{task.location}</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm font-medium">
          <Clock className="w-4 h-4 mr-2 opacity-50 shrink-0" />
          <span>{task.deadline || 'ASAP'}</span>
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-4 border-t border-gray-50 mb-4">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-navy/10 flex-shrink-0 flex justify-center items-center">
             {task.posted_by_avatar ? (
                 <img src={task.posted_by_avatar} alt="avatar" className="w-full h-full object-cover" />
             ) : (
                 <span className="font-bold text-brand-navy text-xs">{task.posted_by_name?.charAt(0) || 'U'}</span>
             )}
          </div>
          <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">{task.posted_by_name || 'Student'}</p>
              <p className="text-[10px] text-gray-400 capitalize truncate">{task.posted_by_college || task.college}</p>
          </div>
          <p className="text-[10px] text-gray-400 whitespace-nowrap">
              {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
          </p>
      </div>

      <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between border border-gray-100">
          <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Earn</p>
              <p className="font-black text-brand-success text-xl leading-none">₹{task.task_fee}</p>
          </div>
          <div className="text-right">
              {task.item_cost > 0 && <p className="text-[10px] font-bold text-gray-500 leading-tight mb-1">Item Cost <br className="hidden sm:block"/>₹{task.item_cost} given upfront</p>}
              {isPoster ? (
                  <span className="inline-block px-4 py-1.5 bg-brand-navy text-white text-xs font-bold rounded-lg opacity-50">Your Task</span>
              ) : task.status !== 'open' ? (
                  <span className="inline-block px-4 py-1.5 bg-gray-200 text-gray-500 text-xs font-bold rounded-lg">Taken</span>
              ) : isExpired ? (
                  <span className="inline-block px-4 py-1.5 bg-gray-200 text-gray-500 text-xs font-bold rounded-lg cursor-not-allowed">Expired</span>
              ) : (
                  <button 
                    onClick={(e) => { e.preventDefault(); if(onAccept) onAccept(task); else window.location.href=`/lazy-tasks/${task.id}`; }}
                    className="px-4 py-1.5 bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold rounded-lg shadow-sm transition"
                  >
                      Accept Task
                  </button>
              )}
          </div>
      </div>
    </Link>
  );
};

export default TaskCard;
