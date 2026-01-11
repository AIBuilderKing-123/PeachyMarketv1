import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Video, Mail, ShieldCheck, ChevronRight, Crown } from 'lucide-react';
import { SLOGAN } from '../constants';
import { SEO } from '../components/SEO';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const bubbles = [
    { label: 'Marketplace', icon: ShoppingBag, path: '/marketplace', color: 'bg-gray-800 border border-peach-500/30', text: 'text-peach-500', desc: 'Verified Listings' },
    { label: 'Cam Rooms', icon: Video, path: '/cam-rooms', color: 'bg-gray-800 border border-orange-500/30', text: 'text-orange-500', desc: 'Live Shows' },
    { label: 'VIP Club', icon: Crown, path: '/memberships', color: 'bg-gray-800 border border-purple-500/30', text: 'text-purple-500', desc: 'Get Exclusive' },
    { label: 'ID Verify', icon: ShieldCheck, path: '/verification', color: 'bg-gray-800 border border-emerald-500/30', text: 'text-emerald-500', desc: 'Get Verified' },
    { label: 'Contact Us', icon: Mail, path: '/contact', color: 'bg-gray-800 border border-gray-600/30', text: 'text-gray-400', desc: 'Get Support' },
  ];

  return (
    <div className="flex flex-col items-center">
      <SEO 
        title="Home" 
        description="Welcome to The Peachy Marketplace. The secure, ID-verified platform for adult content creators. Buy photos, videos, and book live cam shows."
      />

      {/* Hero Section */}
      <div className="w-full max-w-7xl bg-gray-800 rounded-3xl shadow-2xl overflow-hidden mb-20 border border-gray-700 relative group mx-auto">
        <div className="relative h-[600px] bg-gray-900">
          {/* Sexy Image */}
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop" 
            alt="Welcome" 
            className="w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-1000 ease-in-out"
          />
          {/* Sexy Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 text-left">
            <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 tracking-tighter drop-shadow-2xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-peach-500 to-rose-600">Peachy</span> Market
            </h1>
            <div className="h-1.5 w-32 bg-peach-600 mb-8 rounded-full shadow-[0_0_20px_rgba(225,29,72,0.6)]"></div>
            <p className="text-2xl md:text-4xl text-gray-200 font-light max-w-2xl drop-shadow-lg mb-12 tracking-wide leading-tight">
              {SLOGAN}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <button 
                onClick={() => navigate('/marketplace')}
                className="bg-peach-600 hover:bg-peach-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-[0_0_25px_rgba(225,29,72,0.4)] transition-all transform hover:scale-105 flex items-center justify-center w-full sm:w-auto"
              >
                Enter Market <ChevronRight className="ml-2 w-5 h-5" />
              </button>
              <button 
                 onClick={() => navigate('/cam-rooms')}
                 className="bg-gray-800/80 hover:bg-gray-700 text-white border border-gray-600 hover:border-white px-10 py-4 rounded-full font-bold text-lg backdrop-blur-md transition-all w-full sm:w-auto"
              >
                Live Cams
              </button>
            </div>

            <p className="text-gray-400 max-w-lg text-sm mt-10 opacity-80 font-medium">
              Join the most secure adult marketplace. Lowest fees (7%), instant payouts, and a safe verified community.
            </p>
          </div>
        </div>
      </div>

      {/* Bubbles Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 w-full px-4 mb-24 max-w-7xl">
        {bubbles.map((bubble) => (
          <button
            key={bubble.label}
            onClick={() => navigate(bubble.path)}
            className="group flex flex-col items-center focus:outline-none"
          >
            <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full ${bubble.color} flex items-center justify-center shadow-xl group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:scale-105 transition-all duration-300 mb-6 relative overflow-hidden backdrop-blur-sm`}>
              <bubble.icon className={`w-12 h-12 md:w-16 md:h-16 ${bubble.text} group-hover:text-white transition-colors duration-300`} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-200 group-hover:text-peach-500 transition-colors tracking-wide uppercase">{bubble.label}</h3>
            <span className="text-xs md:text-sm text-gray-500 group-hover:text-gray-400 transition-colors mt-1">{bubble.desc}</span>
          </button>
        ))}
      </div>
      
      {/* Feature Highlights */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl w-full px-4 mb-16">
         <div className="p-10 bg-gray-800 rounded-3xl shadow-xl border border-gray-700 hover:border-peach-900/50 transition-colors group">
            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-peach-900/20 transition-colors border border-gray-700 group-hover:border-peach-900/30">
              <ShieldCheck className="w-7 h-7 text-peach-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-100 mb-3">Secure & Verified</h3>
            <p className="text-gray-400 leading-relaxed">
              Every seller is ID Verified. Automated delivery ensures your content is safe and delivered instantly.
            </p>
         </div>
         <div className="p-10 bg-gray-800 rounded-3xl shadow-xl border border-gray-700 hover:border-peach-900/50 transition-colors group">
            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-peach-900/20 transition-colors border border-gray-700 group-hover:border-peach-900/30">
              <span className="text-peach-500 font-bold text-xl">7%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-100 mb-3">Lowest Fees</h3>
            <p className="text-gray-400 leading-relaxed">
              We take less so you keep more. Only 7% service fee on transactions with instant balance updates.
            </p>
         </div>
         <div className="p-10 bg-gray-800 rounded-3xl shadow-xl border border-gray-700 hover:border-peach-900/50 transition-colors group">
            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-peach-900/20 transition-colors border border-gray-700 group-hover:border-peach-900/30">
              <Video className="w-7 h-7 text-peach-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-100 mb-3">Premium Cams</h3>
            <p className="text-gray-400 leading-relaxed">
              High-quality streaming rooms with BunnyCDN integration for low latency and high stability.
            </p>
         </div>
      </div>
    </div>
  );
};