import React from 'react';
import { ShoppingBag, Users, ShieldCheck, Heart, Zap, Coffee } from 'lucide-react';

const About = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
            {/* Hero Section */}
            <div className="text-center mb-24 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl -z-10 animate-blob"></div>
                <h1 className="text-5xl md:text-7xl font-black text-brand-navy mb-6 tracking-tighter">
                   Why Bech <span className="text-brand-orange">De</span> Yaar?
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                   We're on a mission to build India's smartest, safest, and most friendly marketplace for every student.
                </p>
            </div>

            {/* Our Story / Founder Note */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
                <div className="relative">
                    <div className="aspect-square bg-gray-100 rounded-[3rem] overflow-hidden rotate-3 hover:rotate-0 transition-all duration-500 shadow-2xl relative group border-8 border-white">
                        <img 
                            src="/deepak.png" 
                            alt="Deepak Singh" 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy/90 to-transparent p-10 text-white translate-y-4 group-hover:translate-y-0 transition-transform">
                            <h3 className="text-3xl font-black mb-1">Deepak Singh</h3>
                            <p className="text-brand-orange font-bold uppercase tracking-widest text-xs">Founder & Lead Developer</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-8 animate-fade-up">
                    <div className="inline-flex items-center space-x-2 bg-orange-50 text-brand-orange px-4 py-2 rounded-full text-sm font-bold">
                        <Heart className="w-4 h-4 fill-brand-orange" />
                        <span>Built with Passion</span>
                    </div>
                    <h2 className="text-4xl font-black text-brand-navy">Made for Every Student.</h2>
                    <p className="text-lg text-gray-600 leading-relaxed font-medium">
                        BechDeYaar was born out of a simple observation: students need a better way to trade. Whether you're in school selling old textbooks, in college selling a cycle, sharing notes for JEE/NEET prep, or renting a laptop for a project—the old ways were slow and full of strangers.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed font-medium">
                        I developed this platform to bridge that gap. Whether you're a school student, a college student, or preparing for competitive exams—every deal you make is with someone you can trust—a fellow student.
                    </p>
                </div>
            </div>

            {/* Pillars */}
            <div className="mb-32">
                <h2 className="text-3xl font-black text-brand-navy text-center mb-16 underline decoration-brand-orange decoration-4 underline-offset-8">Our Core Pillars</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { 
                            icon: <ShieldCheck className="w-8 h-8" />, 
                            title: "Zero Commission", 
                            text: "We believe in student-to-student support. We never charge a single rupee on your sales.",
                            color: "bg-green-50 text-green-600"
                        },
                        { 
                            icon: <Users className="w-8 h-8" />, 
                            title: "Verified Community", 
                            text: "Safety first. Only verified students get access to the marketplace—school, college, or prep.",
                            color: "bg-blue-50 text-blue-600"
                        },
                        { 
                            icon: <Zap className="w-8 h-8" />, 
                            title: "Instant Connection", 
                            text: "Real-time chat and notifications make sure deals close fast between students.",
                            color: "bg-orange-50 text-brand-orange"
                        }
                    ].map((pillar, i) => (
                        <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl hover:-translate-y-2 transition-all">
                            <div className={`w-14 h-14 ${pillar.color} rounded-2xl flex items-center justify-center mb-6`}>
                                {pillar.icon}
                            </div>
                            <h3 className="text-xl font-black text-brand-navy mb-3">{pillar.title}</h3>
                            <p className="text-gray-500 font-medium">{pillar.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="bg-brand-navy rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10">Join the Revolution.</h2>
                <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto opacity-80 font-medium relative z-10">
                   Stop posting on status and stories. Start listing on BechDeYaar and reach students across India instantly.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10">
                    <a href="/signup" className="w-full sm:w-auto bg-brand-orange text-white px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl">
                        Create Account
                    </a>
                    <a href="/browse" className="w-full sm:w-auto bg-white/10 glass px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20">
                        Explore Ads
                    </a>
                </div>
            </div>

            <div className="mt-20 text-center text-gray-400 flex flex-col items-center">
                <Coffee className="w-6 h-6 mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">Designed & Hand-crafted by Deepak Singh</p>
            </div>
        </div>
    );
};

export default About;
