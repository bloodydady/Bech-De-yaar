import React from 'react';
import { ShieldCheck, UserCheck, MapPin, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

const SafetyGuidelines = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 animate-fade-up">
                <ShieldCheck className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-5xl font-black text-brand-navy mb-4">Safety Guidelines</h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">Your safety is our #1 priority. BechDeYaar is designed for students, but follow these rules for a worry-free experience.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 animate-fade-up [animation-delay:200ms]">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col space-y-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-brand-navy">Meet on Campus</h3>
                    <p className="text-gray-500 font-medium">Always meet in public campus locations like the Library, Student Activity Center, or near your hostel gate during daylight hours.</p>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col space-y-4">
                    <div className="w-12 h-12 bg-orange-50 text-brand-orange rounded-2xl flex items-center justify-center">
                        <Eye className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-brand-navy">Inspect the Item</h3>
                    <p className="text-gray-500 font-medium">Never pay in advance. Inspect the item thoroughly—check for functionality, condition, and any damage before making a payment.</p>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col space-y-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-brand-navy">Verified ID</h3>
                    <p className="text-gray-500 font-medium">BechDeYaar is strictly for students, but it's always okay to ask for their college ID card or room number if you have any doubts.</p>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col space-y-4">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-brand-navy">Report Suspicious Activity</h3>
                    <p className="text-gray-500 font-medium">If a deal sounds too good to be true or a user behavior is suspicious, report them immediately using our app or contact support.</p>
                </div>
            </div>

            <div className="bg-brand-navy rounded-[3rem] p-10 md:p-16 text-white text-center shadow-2xl relative overflow-hidden animate-fade-up [animation-delay:400ms]">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <ShieldCheck className="w-64 h-64 text-green-400 rotate-12" />
                </div>
                <h3 className="text-3xl font-black mb-6 relative z-10">Safe Trading Checklist</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left relative z-10 max-w-3xl mx-auto">
                    {[
                        "Verify student ID and details.",
                        "Inspect item in daylight.",
                        "Meet at a public campus spot.",
                        "Prefer digital payments like UPI.",
                        "Never share personal auth codes.",
                        "Keep conversations in-app."
                    ].map((item, i) => (
                        <div key={i} className="flex items-center space-x-3 bg-white/10 glass px-6 py-4 rounded-2xl border border-white/10">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="font-bold text-blue-100 tracking-tight">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SafetyGuidelines;
