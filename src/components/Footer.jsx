import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-navy text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-4 hover:scale-105 transition-transform">
              <img src="/logo.png" alt="BechDeYaar" className="h-16 md:h-20 w-auto object-contain brightness-0 invert opacity-90 drop-shadow-lg" />
            </Link>
            <p className="text-gray-300 text-sm mb-6 max-w-sm">
              Your Campus Marketplace. Buy, sell, rent items and share study notes exclusively with students from your college.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition"><Globe className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 inline-block">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/home" className="hover:text-brand-orange transition">Home</Link></li>
              <li><Link to="/browse" className="hover:text-brand-orange transition">Browse All</Link></li>
              <li><Link to="/notes" className="hover:text-brand-orange transition">Study Notes</Link></li>
              <li><Link to="/browse?is_exit_sale=true" className="hover:text-brand-orange text-red-400 transition">Hostel Exit Sales</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 inline-block">Categories</h4>
             <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/browse?category=Electronics" className="hover:text-brand-orange transition">Electronics</Link></li>
              <li><Link to="/browse?category=Books" className="hover:text-brand-orange transition">Books</Link></li>
              <li><Link to="/browse?category=Cycles" className="hover:text-brand-orange transition">Cycles</Link></li>
              <li><Link to="/browse?category=Furniture" className="hover:text-brand-orange transition">Furniture</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 inline-block">Support</h4>
             <ul className="space-y-2 text-sm text-gray-300">
               <li><Link to="/support/faqs" className="hover:text-brand-orange transition">FAQs</Link></li>
               <li><Link to="/support/contact" className="hover:text-brand-orange transition">Contact Us</Link></li>
               <li><Link to="/support/safety" className="hover:text-brand-orange transition">Safety Guidelines</Link></li>
               <li><Link to="/support/privacy" className="hover:text-brand-orange transition">Privacy Policy</Link></li>
               <li><Link to="/donate" className="hover:text-pink-400 text-pink-300 transition">❤️ Donate</Link></li>
            </ul>
          </div>

        </div>

         <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
           <div className="flex flex-col items-center md:items-start space-y-2">
              <p>&copy; {new Date().getFullYear()} BechDeYaar. All rights reserved.</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest border-l-2 border-brand-orange pl-3">
                 Developed by Deepak Singh
              </p>
           </div>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
