import React, { useState, useEffect } from 'react';
import { getGlobalAds } from '../firebase/firestore';

const GlobalAdsBanner = () => {
    const [ads, setAds] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const globalAds = await getGlobalAds();
                if (globalAds && globalAds.length > 0) {
                    setAds(globalAds);
                }
            } catch (error) {
                console.error("Failed to load global ads", error);
            }
        };
        fetchAds();
    }, []);

    // Rotate ads if there are multiple, every 5 seconds
    useEffect(() => {
        if (ads.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % ads.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [ads.length]);

    if (ads.length === 0) return null;

    const currentAd = ads[currentIndex];

    return (
        <div className="w-full bg-[#1C2F5E] border-b border-[#F5A623] relative overflow-hidden group">
            <a href={currentAd.redirectUrl || '#'} target="_blank" rel="noopener noreferrer" className="block relative z-10 hover:opacity-90 transition">
                <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3 flex flex-col sm:flex-row items-center justify-center text-center space-y-2 sm:space-y-0 sm:space-x-4">
                    {currentAd.imageUrl && (
                        <span className="inline-block bg-white/20 rounded-md p-1 shadow-sm shrink-0">
                            <span className="text-xs uppercase font-black text-white px-2 py-0.5 rounded tracking-widest bg-brand-orange mr-2">Ad</span>
                            <img src={currentAd.imageUrl} alt="Advertisement" className="h-6 sm:h-8 inline-block object-contain" />
                        </span>
                    )}
                    <p className="text-white font-bold text-sm sm:text-base tracking-wide flex-1">
                        {currentAd.title}
                    </p>
                    <span className="hidden sm:inline-block text-brand-orange font-bold text-sm bg-white px-3 py-1 rounded-full shadow-sm hover:scale-105 transition-transform cursor-pointer">
                        Learn More →
                    </span>
                </div>
            </a>
            {/* Sliding loading bar for multiple ads */}
            {ads.length > 1 && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
                   <div className="h-full bg-brand-orange" style={{ animation: 'slideBar 5s linear infinite' }}></div>
                </div>
            )}
            <style jsx="true">{`
                @keyframes slideBar { from { width: 0%; } to { width: 100%; } }
            `}</style>
        </div>
    );
};

export default GlobalAdsBanner;
