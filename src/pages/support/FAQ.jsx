import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "Is BechDeYaar only for college students?",
    answer: "No! BechDeYaar is for ALL students—whether you're in school, college, or preparing for competitive exams like JEE, NEET, or UPSC. Anyone who is a student can join and start trading."
  },
  {
    question: "Do I have to pay any commission when I sell something?",
    answer: "Absolutely not. BechDeYaar is a free platform. We do not charge any commission on sales. All transactions happen directly between the buyer and seller on campus."
  },
  {
    question: "Can I rent my items instead of selling them?",
    answer: "Yes, you can list your items for 'Rent'. This is particularly useful for things like Lab Equipment, Cycles, or Engineering Tools that others might only need temporarily."
  },
  {
    question: "Where do we meet for the transaction?",
    answer: "We recommend meeting in public campus locations like the Library, Student Activity Center, or near your Hostel Gate during daylight hours for safety."
  },
  {
    question: "How do I share my study notes?",
    answer: "You can use the 'Upload Notes' feature to share PDF versions of your notes. You can choose to provide them for free or set a price."
  }
];

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <HelpCircle className="w-16 h-16 text-brand-orange mx-auto mb-4" />
                <h1 className="text-4xl font-black text-brand-navy mb-4">Frequently Asked Questions</h1>
                <p className="text-gray-500">Everything you need to know about India's smartest student marketplace.</p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div 
                        key={index} 
                        className={`bg-white rounded-2xl border ${activeIndex === index ? 'border-brand-orange shadow-md' : 'border-gray-100'} overflow-hidden transition-all`}
                    >
                        <button 
                            onClick={() => toggleAccordion(index)}
                            className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                        >
                            <span className={`text-lg font-bold ${activeIndex === index ? 'text-brand-orange' : 'text-brand-navy'}`}>
                                {faq.question}
                            </span>
                            {activeIndex === index ? <ChevronUp className="w-5 h-5 text-brand-orange" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        {activeIndex === index && (
                            <div className="px-6 pb-6 text-gray-500 leading-relaxed animate-fade-in font-medium">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-16 bg-brand-navy p-10 rounded-3xl text-white text-center shadow-xl">
               <h3 className="text-2xl font-black mb-4">Still have questions?</h3>
               <p className="text-blue-100 mb-8 max-w-md mx-auto">Can't find the answer you're looking for? Reach out to our support team and we'll help you out.</p>
               <a href="/support/contact" className="inline-block bg-brand-orange text-white font-black px-8 py-4 rounded-xl hover:scale-105 transition shadow-lg shadow-orange-500/20">
                  Contact Support
               </a>
            </div>
        </div>
    );
};

export default FAQ;
