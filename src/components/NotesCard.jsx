import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Download } from 'lucide-react';

const NotesCard = ({ note, showActions, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col cursor-pointer cursor-pointer relative"
      onClick={() => navigate(`/notes/${note.id}`)}
    >
      <div className="flex items-start mb-4">
        <div className="p-3 bg-red-50 rounded-xl mr-4 flex-shrink-0 border border-red-100">
           <FileText className="w-8 h-8 text-red-500" />
        </div>
        <div>
           <h3 className="font-bold text-gray-900 leading-tight mb-1 line-clamp-2">{note.title}</h3>
           <div className="flex flex-wrap gap-1">
             <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded tracking-wider">{note.subject}</span>
             <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded tracking-wider">{note.course}</span>
           </div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
         <div>
            <span className={`font-black text-lg ${note.price === 0 ? 'text-brand-success' : 'text-brand-orange'}`}>
               {note.price === 0 ? 'Free' : `₹${note.price}`}
            </span>
         </div>
         <div className="flex items-center text-gray-400 text-sm">
            <Download className="w-4 h-4 mr-1" />
            <span className="font-medium text-xs">{note.download_count || 0}</span>
         </div>
      </div>
      
      {showActions && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between space-x-2" onClick={(e) => e.stopPropagation()}>
             <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(note.id); }}
                className="w-full px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded transition"
             >
                Delete
             </button>
          </div>
      )}
    </div>
  );
};

export default NotesCard;
