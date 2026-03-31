import React, { useRef } from 'react';

const CATEGORIES = [
  "All", "Electronics", "Books", "Furniture", "Cycles", 
  "Clothing", "Accessories", "Hostel Items", "Study Materials", 
  "Engineering Tools", "Notes", "Lab Equipment", "Calculators", "Other"
];

const CategoryPills = ({ activeCategory, onSelect }) => {
  const scrollContainerRef = useRef(null);

  // Optional: Add drag to scroll functionality
  const handleWheel = (e) => {
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="relative border-b border-gray-200 bg-white">
      <div 
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className="flex overflow-x-auto no-scrollbar py-4 px-4 sm:px-6 lg:px-8 space-x-3 snap-x max-w-7xl mx-auto"
      >
        {CATEGORIES.map(category => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={`snap-start flex-shrink-0 px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                isActive 
                  ? 'bg-brand-navy shadow-md text-white scale-105 transform cursor-default'
                  : 'bg-white border text-brand-navy hover:border-brand-orange hover:text-brand-orange hover:shadow-sm'
              } border-transparent`}
            >
              {category}
            </button>
          );
        })}
      </div>
      
      {/* Optional fade edges for scroll hint */}
      <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden"></div>
    </div>
  );
};

export default CategoryPills;
