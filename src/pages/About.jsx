import React from 'react';
import { ShoppingBag, Users, ShieldCheck, Heart, Zap, Coffee, Star, BookOpen, Bike, Laptop } from 'lucide-react';

const About = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">

            {/* JSON-LD for THIS PAGE — helps Google build the Knowledge Panel */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "AboutPage",
                "name": "About Bech De Yaar — India's Student Marketplace",
                "url": "https://bechdeyaar.vercel.app/about",
                "description": "Learn about Bech De Yaar, India's #1 student marketplace. Founded by Deepak Singh, a student entrepreneur, to help Indian students buy, sell and rent items like books, hostel items, cycles and gadgets with zero commission.",
                "mainEntity": {
                    "@type": "Person",
                    "name": "Deepak Singh",
                    "jobTitle": "Founder & Lead Developer",
                    "description": "Deepak Singh is the founder and lead developer of Bech De Yaar, India's #1 student-to-student marketplace. He built the platform to solve campus trading problems for Indian students.",
                    "url": "https://bechdeyaar.vercel.app/about",
                    "image": "https://bechdeyaar.vercel.app/deepak.png",
                    "worksFor": {
                        "@type": "Organization",
                        "name": "Bech De Yaar",
                        "url": "https://bechdeyaar.vercel.app"
                    },
                    "nationality": "Indian"
                }
            })}} />

            {/* Hero Section */}
            <div className="text-center mb-24 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl -z-10 animate-blob"></div>
                <div className="inline-flex items-center space-x-2 bg-orange-50 text-brand-orange px-4 py-2 rounded-full text-sm font-bold mb-6 border border-orange-100">
                    <Star className="w-4 h-4 fill-brand-orange" />
                    <span>India's #1 Student Marketplace</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-brand-navy mb-6 tracking-tighter">
                   Why Bech <span className="text-brand-orange">De</span> Yaar?
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                   We're on a mission to build India's smartest, safest, and most friendly marketplace for every student — school, college, or exam aspirant.
                </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
                {[
                    { value: '2k+', label: 'Active Listings' },
                    { value: '500+', label: 'Students Joined' },
                    { value: '₹0', label: 'Commission' },
                    { value: '50+', label: 'Colleges' },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-lg transition">
                        <div className="text-3xl font-black text-brand-orange">{s.value}</div>
                        <div className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-wider">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Our Story / Founder Note */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
                <div className="relative">
                    <div className="aspect-square bg-gray-100 rounded-[3rem] overflow-hidden rotate-3 hover:rotate-0 transition-all duration-500 shadow-2xl relative group border-8 border-white">
                        <img 
                            src="/deepak.png" 
                            alt="Deepak Singh - Founder of Bech De Yaar" 
                            title="Deepak Singh — Founder & CEO, Bech De Yaar"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy/90 to-transparent p-10 text-white translate-y-4 group-hover:translate-y-0 transition-transform">
                            <h2 className="text-3xl font-black mb-1">Deepak Singh</h2>
                            <p className="text-brand-orange font-bold uppercase tracking-widest text-xs">Founder & Lead Developer</p>
                            <p className="text-blue-200 text-sm mt-2 font-medium">Built Bech De Yaar for every Indian student</p>
                        </div>
                    </div>
                    {/* Floating badge */}
                    <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 text-center min-w-[140px]">
                        <span className="text-2xl">🏆</span>
                        <p className="font-black text-brand-navy text-sm mt-1">Student</p>
                        <p className="font-black text-brand-orange text-xs">Entrepreneur</p>
                    </div>
                </div>
                <div className="space-y-8 animate-fade-up">
                    <div className="inline-flex items-center space-x-2 bg-orange-50 text-brand-orange px-4 py-2 rounded-full text-sm font-bold">
                        <Heart className="w-4 h-4 fill-brand-orange" />
                        <span>Built with Passion</span>
                    </div>
                    <h2 className="text-4xl font-black text-brand-navy">Made by a Student,<br />Made for Every Student.</h2>
                    <p className="text-lg text-gray-600 leading-relaxed font-medium">
                        Bech De Yaar was born out of a simple observation by <strong>Deepak Singh</strong>: students need a better way to trade. Whether you're in school selling old textbooks, in college selling a cycle, sharing notes for JEE/NEET prep, or renting a laptop for a project — the old ways (WhatsApp groups, OLX) were slow, risky, and full of strangers.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed font-medium">
                        Deepak built this platform to bridge that gap. Whether you're a school student, a college student, or preparing for competitive exams — every deal you make is with someone you can trust — a fellow student.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {['Student Marketplace', 'Zero Commission', 'Lazy Tasks', 'Study Notes', 'Hostel Items'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm font-bold text-gray-600">#{tag.replace(/ /g,'')}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* What You Can Trade */}
            <div className="mb-32">
                <h2 className="text-3xl font-black text-brand-navy text-center mb-4">What Students Trade on BechDeYaar</h2>
                <p className="text-center text-gray-500 mb-12 font-medium">From books to bicycles — if students need it, it's here.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { icon: '📚', label: 'Used Books', desc: 'Buy & sell old textbooks, JEE/NEET books, novels' },
                        { icon: '💻', label: 'Laptops & Gadgets', desc: 'Second-hand laptops, calculators, tablets' },
                        { icon: '🚲', label: 'Cycles', desc: 'Buy or rent cycles on campus affordably' },
                        { icon: '🏠', label: 'Hostel Items', desc: 'Mattress, fans, buckets, furniture & more' },
                        { icon: '📝', label: 'Study Notes', desc: 'Download free student notes and PDFs' },
                        { icon: '⚡', label: 'Lazy Tasks', desc: 'Earn money doing small errands for students' },
                        { icon: '🧮', label: 'Calculators', desc: 'Casio, scientific calculators at student prices' },
                        { icon: '👕', label: 'Clothing', desc: 'College merchandise, uniforms, accessories' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center">
                            <span className="text-4xl block mb-3">{item.icon}</span>
                            <h3 className="font-black text-brand-navy text-sm">{item.label}</h3>
                            <p className="text-xs text-gray-500 mt-1 font-medium">{item.desc}</p>
                        </div>
                    ))}
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
                        Create Free Account
                    </a>
                    <a href="/browse" className="w-full sm:w-auto bg-white/10 glass px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20">
                        Explore Listings
                    </a>
                </div>
            </div>

            <div className="mt-20 text-center text-gray-400 flex flex-col items-center">
                <Coffee className="w-6 h-6 mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">Designed &amp; Hand-crafted by <span className="text-brand-orange">Deepak Singh</span> — Founder, Bech De Yaar</p>
                <p className="text-xs text-gray-300 mt-2">India's #1 Student Marketplace · Zero Commission · Buy Sell Rent</p>
            </div>
        </div>
    );
};

export default About;
