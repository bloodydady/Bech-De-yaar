import React from 'react';
import { Heart, Coffee, Server, Globe, Shield, Sparkles } from 'lucide-react';

const Donate = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 mb-20">
            {/* Hero */}
            <div className="text-center mb-16 animate-fade-up">
                <div className="w-24 h-24 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
                    <Heart className="w-12 h-12 fill-pink-500" />
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-brand-navy mb-6 tracking-tighter">
                    Support <span className="text-brand-orange">BechDeYaar</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                    BechDeYaar is 100% free for students. Your donations help us keep the lights on, buy better servers, and grow the platform.
                </p>
            </div>

            {/* What Donations Fund */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-7 h-7" />
                    </div>
                    <h3 className="font-black text-brand-navy text-lg mb-2">Custom Domain</h3>
                    <p className="text-gray-500 text-sm font-medium">Help us get a .com domain so the platform looks professional and trustworthy.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center">
                    <div className="w-14 h-14 bg-orange-50 text-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Server className="w-7 h-7" />
                    </div>
                    <h3 className="font-black text-brand-navy text-lg mb-2">More Storage</h3>
                    <p className="text-gray-500 text-sm font-medium">Upgrade our servers so more students can upload listings, notes, and images.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center">
                    <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-7 h-7" />
                    </div>
                    <h3 className="font-black text-brand-navy text-lg mb-2">Keep it Free</h3>
                    <p className="text-gray-500 text-sm font-medium">Your support ensures we never charge students any commission for using BechDeYaar.</p>
                </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-brand-navy to-brand-orange p-8 text-center text-white">
                    <Sparkles className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                    <h2 className="text-3xl font-black mb-2">Scan & Donate</h2>
                    <p className="text-blue-100 font-medium">Every rupee counts. Even ₹10 helps us grow!</p>
                </div>

                <div className="p-10 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-3xl border-4 border-dashed border-brand-orange/30 shadow-inner mb-8">
                        <img
                            src="/donationqr.png"
                            alt="Donation QR Code - Scan to pay via UPI"
                            className="w-64 h-64 md:w-80 md:h-80 object-contain rounded-2xl"
                        />
                    </div>

                    <p className="text-gray-500 font-bold text-center mb-6">
                        Scan with any UPI app — Google Pay, PhonePe, Paytm, etc.
                    </p>

                    <div className="bg-orange-50 rounded-2xl p-6 text-center w-full max-w-md border border-orange-100">
                        <p className="text-brand-orange font-black text-lg mb-1">Thank You! 🙏</p>
                        <p className="text-gray-500 text-sm font-medium">
                            Your name will be added to our <strong>"Wall of Supporters"</strong> in a future update.
                        </p>
                    </div>
                </div>
            </div>

            {/* Built By */}
            <div className="mt-16 text-center">
                <div className="inline-flex items-center space-x-2 bg-gray-50 px-6 py-3 rounded-full border border-gray-100">
                    <Coffee className="w-5 h-5 text-brand-orange" />
                    <span className="text-sm font-bold text-gray-500">Built with ❤️ by <strong className="text-brand-navy">Deepak Singh</strong></span>
                </div>
            </div>
        </div>
    );
};

export default Donate;
