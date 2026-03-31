import React from 'react';
import { Mail, Phone, Shield, User } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 animate-fade-up">
            <h1 className="text-4xl font-black text-brand-navy mb-8">Privacy Policy</h1>
            <p className="text-gray-500 mb-12 font-medium">Last updated: March 31, 2026</p>

            <div className="space-y-12 text-gray-700 font-medium leading-relaxed">
                <section>
                    <h2 className="text-2xl font-black text-brand-navy mb-4 flex items-center">
                        <User className="w-6 h-6 mr-3 text-brand-orange" /> Information We Collect
                    </h2>
                    <p className="mb-4">We collect information that you provide directly to us when you create an account, post a listing, or communicate with other users. This includes:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-500">
                        <li>Your name, email address, and phone number.</li>
                        <li>College name and campus location.</li>
                        <li>Profile pictures and listing images.</li>
                        <li>Chat messages and transaction-related info.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-black text-brand-navy mb-4 flex items-center">
                        <Shield className="w-6 h-6 mr-3 text-brand-orange" /> How We Use Your Data
                    </h2>
                    <p className="mb-4">We use your information to facilitate your transactions and maintain a safe platform:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-500">
                        <li>To allow you to create and manage listings.</li>
                        <li>To verify your student status and keep the campus marketplace exclusive.</li>
                        <li>To suggest relevant items and deals around you.</li>
                        <li>To send notifications about messages, offers, and app updates.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-black text-brand-navy mb-4 flex items-center">
                        <Mail className="w-6 h-6 mr-3 text-brand-orange" /> Contact Us
                    </h2>
                    <p className="mb-6 font-medium">If you have any questions about this Privacy Policy, please contact us:</p>
                    <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100 flex flex-col space-y-3">
                        <p className="flex items-center text-brand-navy font-bold">
                            <Mail className="w-4 h-4 mr-2" /> monsterproduction21@gmail.com
                        </p>
                        <p className="flex items-center text-brand-navy font-bold">
                            <Phone className="w-4 h-4 mr-2" /> +91 8303858857
                        </p>
                    </div>
                </section>
            </div>
            
            <div className="mt-16 pt-8 border-t border-gray-100 text-sm text-gray-400 text-center">
                &copy; 2026 BechDeYaar. Developed by Deepak Singh.
            </div>
        </div>
    );
};

export default PrivacyPolicy;
