import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate form submission
        setTimeout(() => {
            toast.success("Message sent! We will get back to you soon.");
            setFormData({ name: '', email: '', subject: '', message: '' });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-black text-brand-navy mb-4">Contact Us</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">Have questions or need help? Reach out to the BechDeYaar support team.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Contact Info Cards */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-orange-50 text-brand-orange rounded-2xl flex items-center justify-center mb-6">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Email Us</h3>
                        <p className="text-gray-500 text-sm mb-4">Our support team is available 24/7 via email.</p>
                        <a href="mailto:monsterproduction21@gmail.com" className="text-brand-orange font-bold hover:underline">monsterproduction21@gmail.com</a>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                            <Phone className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Call Us</h3>
                        <p className="text-gray-500 text-sm mb-4">Monday - Friday, 9am to 6pm IST.</p>
                        <a href="tel:+918303858857" className="text-blue-600 font-bold hover:underline">+91 8303858857</a>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Developed By</h3>
                        <p className="text-gray-500 text-sm mb-1">Deepak Singh</p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Lead Developer</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100">
                    <h2 className="text-2xl font-black text-brand-navy mb-8">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange" 
                                    placeholder="John Doe" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange" 
                                    placeholder="john@example.com" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                            <input 
                                type="text" 
                                required
                                value={formData.subject}
                                onChange={e => setFormData({...formData, subject: e.target.value})}
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange" 
                                placeholder="How can we help?" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                            <textarea 
                                rows="5" 
                                required
                                value={formData.message}
                                onChange={e => setFormData({...formData, message: e.target.value})}
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange" 
                                placeholder="Describe your issue or feedback..."
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 bg-brand-orange text-white font-black rounded-2xl shadow-lg hover:shadow-orange-200 hover:-translate-y-1 transition disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            {loading ? "Sending..." : "Send Message"}
                            {!loading && <Send className="w-5 h-5" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
