import React from 'react';

const LoadingSpinner = ({ fullPage = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-24 h-24',
  };

  const spinner = (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
      {/* Outer pulsing ping effect */}
      <div className="absolute inset-2 bg-brand-orange/20 rounded-full animate-ping opacity-75"></div>
      
      {/* Subtle outer dashed spinning ring for a technical feel */}
      <div className="absolute -inset-2 border-[3px] border-dashed border-brand-orange/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
      
      {/* The Logo itself */}
      <div className="relative w-full h-full p-2 bg-white rounded-full shadow-lg flex items-center justify-center">
        <img 
          src="/logo.png" 
          alt="Loading..." 
          className="w-full h-full object-contain animate-[pulse_1.5s_ease-in-out_infinite]"
        />
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-8">
        {spinner}
        <div className="text-brand-navy font-black tracking-widest uppercase text-sm animate-pulse">
          Loading <span className="text-brand-orange">Yaar...</span>
        </div>
      </div>
    );
  }

  return <div className="flex justify-center my-8">{spinner}</div>;
};

export default LoadingSpinner;
