import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ icon, heading, subtext, actionLabel, actionFn, defaultLink }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-6xl mb-4 text-gray-400">{icon || '📦'}</div>
      <h3 className="text-xl font-bold text-brand-navy mb-2">{heading}</h3>
      <p className="text-gray-500 mb-6 max-w-sm">{subtext}</p>
      
      {actionLabel && (actionFn ? (
        <button 
          onClick={actionFn}
          className="px-6 py-2 bg-brand-orange text-white rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          {actionLabel}
        </button>
      ) : defaultLink ? (
        <Link to={defaultLink} className="px-6 py-2 bg-brand-orange text-white rounded-lg font-semibold hover:bg-orange-600 transition">
          {actionLabel}
        </Link>
      ) : null)}
    </div>
  );
};

export default EmptyState;
