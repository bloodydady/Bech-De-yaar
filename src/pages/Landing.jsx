import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getListings } from '../firebase/firestore';
import ListingCard from '../components/ListingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowRight, ShoppingBag, Sparkles, Zap, ShieldCheck, Users } from 'lucide-react';

const CATEGORIES = [
  { name: 'Electronics', icon: '📱' },
  { name: 'Books', icon: '📚' },
  { name: 'Furniture', icon: '🪑' },
  { name: 'Cycles', icon: '🚲' },
  { name: 'Clothing', icon: '👕' },
  { name: 'Accessories', icon: '🎒' },
  { name: 'Essential Items', icon: '🏠' },
  { name: 'Study Materials', icon: '📝' },
  { name: 'Engineering Tools', icon: '🔧' },
  { name: 'Notes', icon: '📄' },
  { name: 'Lab Equipment', icon: '🧪' },
  { name: 'Calculators', icon: '🧮' },
];

const Landing = () => {
  const { currentUser } = useAuth();
  const [featuredItems, setFeaturedItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const res = await getListings({ status: 'active' }, 4);
        setFeaturedItems(res.data);
      } catch (error) {
        console.error("Landing data error", error);
      } finally {
        setLoading(false);
      }
    };
    if (!currentUser) fetchLandingData();
  }, [currentUser]);

  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="flex flex-col space-y-24 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">

      {/* Premium Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 bg-mesh text-white overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-brand-orange rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 glass px-4 py-2 rounded-full text-blue-200 text-sm font-bold border border-white/20 animate-fade-up shadow-xl backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-brand-orange" />
            <span>India's #1 Student Marketplace</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-tight animate-fade-up [animation-delay:200ms]">
            Bech <span className="text-brand-orange drop-shadow-[0_0_15px_rgba(245,166,35,0.4)]">De</span> Yaar!
          </h1>

          <p className="text-xl md:text-2xl text-blue-100/80 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-up [animation-delay:400ms] font-medium">
             Buy, Sell, and Rent items with zero commission. For school students, college students, and exam aspirants—safe, fast, and trusted.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 animate-fade-up [animation-delay:600ms]">
            <Link to="/browse" className="group bg-brand-orange text-white text-base md:text-lg font-black px-6 md:px-8 py-4 rounded-xl md:rounded-2xl shadow-[0_10px_30px_rgba(245,166,35,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center w-full md:w-auto">
              Browse Listings <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/lazy-tasks" className="text-brand-navy bg-white hover:bg-gray-50 text-base md:text-lg font-black px-6 md:px-8 py-4 rounded-xl md:rounded-2xl border-2 border-white transition-all duration-300 flex items-center justify-center w-full md:w-auto shadow-xl">
              <Zap className="w-5 h-5 mr-2 text-brand-orange fill-brand-orange" /> Lazy Tasks
            </Link>
            <Link to="/signup" className="text-white bg-white/5 hover:bg-white/10 glass text-base md:text-lg font-bold px-6 md:px-8 py-4 rounded-xl md:rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-lg w-full md:w-auto text-center">
              Start Selling
            </Link>
          </div>

          {/* Stats/Social Proof */}
          <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 animate-fade-up [animation-delay:800ms]">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black">2k+</span>
              <span className="text-xs uppercase tracking-widest font-bold">Active Ads</span>
            </div>
            <div className="flex flex-col items-center border-l border-white/10 pl-8">
              <span className="text-2xl font-black">500+</span>
              <span className="text-xs uppercase tracking-widest font-bold">Daily Deals</span>
            </div>
            <div className="flex flex-col items-center border-l border-white/10 pl-8">
              <span className="text-2xl font-black">50+</span>
              <span className="text-xs uppercase tracking-widest font-bold">Schools & Colleges</span>
            </div>
            <div className="flex flex-col items-center border-l border-white/10 pl-8">
              <span className="text-2xl font-black">Verified</span>
              <span className="text-xs uppercase tracking-widest font-bold">Students Only</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all group">
            <div className="w-14 h-14 bg-orange-100 text-brand-orange rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-orange group-hover:text-white transition-colors">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-brand-navy mb-3">Lightning Fast</h3>
            <p className="text-gray-500 font-medium">Post an ad in under 60 seconds. Instant notifications for your messages.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all group">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-brand-navy mb-3">Secure Network</h3>
            <p className="text-gray-500 font-medium">Only verified students can access. We keep it safe for school, college, and prep communities.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all group">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-brand-navy mb-3">Community First</h3>
            <p className="text-gray-500 font-medium">Build trust within your student circle. Chat directly with verified peers.</p>
          </div>
        </div>
      </section>

      {/* Categories Grid - Elevated */}
      <section className="bg-brand-bg relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-10">
            <div className="h-0.5 flex-1 bg-gray-200"></div>
            <h2 className="text-3xl font-black text-brand-navy shrink-0">Explore Categories</h2>
            <div className="h-0.5 flex-1 bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {CATEGORIES.map(category => (
              <Link
                to={`/browse?category=${encodeURIComponent(category.name)}`}
                key={category.name}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-transparent hover:border-brand-orange hover:shadow-2xl hover:-rotate-2 text-center transition-all group flex flex-col items-center space-y-4"
              >
                <span className="text-5xl group-hover:scale-125 transition-transform duration-500">{category.icon}</span>
                <span className="text-sm font-black text-gray-700 tracking-tight">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Real Featured Listings */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-32">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 border-b-4 border-brand-orange pb-6">
          <div>
            <span className="text-brand-orange font-black uppercase tracking-tighter text-sm">Recently Added</span>
            <h2 className="text-4xl font-black text-brand-navy mt-1 whitespace-nowrap overflow-hidden">🔥 Latest Deals & Sales</h2>
          </div>
          <Link to="/browse" className="text-brand-navy font-black text-lg hover:text-brand-orange transition-colors flex items-center mt-4 sm:mt-0">
            Explore All <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : featuredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-inner border-2 border-dashed border-gray-100">
            <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-brand-navy mb-2">Marketplace is Fresh!</h3>
            <p className="text-gray-400 font-medium">No live listings yet. Start the movement and post your first ad!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredItems.map(item => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Landing;
