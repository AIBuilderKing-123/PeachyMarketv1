import React from 'react';
import { Users, DollarSign, Crown, Rocket, Gift, CheckCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const Referrals: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto pb-12">
      <SEO title="Referral Program" description="Earn lifetime royalties and revenue boosts by inviting others to The Peachy Marketplace." />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-peach-600 to-rose-600 rounded-3xl p-10 md:p-20 text-center text-white mb-16 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Partner Program</h1>
            <p className="text-xl md:text-2xl text-peach-100 max-w-2xl mx-auto mb-8 font-light">
              Earn lifetime royalties and unlock massive revenue boosts by inviting creators and fans to The Peachy Marketplace.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/contact" className="bg-white text-peach-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-all">
                    Apply to be a Partner
                </Link>
                <Link to="/signup" className="bg-peach-800/30 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-full font-bold hover:bg-peach-800/50 transition-all">
                    Join Marketplace
                </Link>
            </div>
        </div>
      </div>

      <div className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
             <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-peach-900/50 rounded-2xl flex items-center justify-center mb-6 text-peach-500 border border-peach-500/30">
                    <DollarSign className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">1% Lifetime Royalty</h3>
                <p className="text-gray-400 leading-relaxed">
                    Earn 1% of ALL future sales made by every user who signs up with your code. This royalty is paid out monthly to your account balance. Build a passive income stream that grows with the platform.
                </p>
             </div>

             <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-xl hover:-translate-y-2 transition-transform duration-300 relative">
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    EXCLUSIVE
                </div>
                <div className="w-16 h-16 bg-purple-900/50 rounded-2xl flex items-center justify-center mb-6 text-purple-500 border border-purple-500/30">
                    <Rocket className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">100% Rev Share Boost</h3>
                <p className="text-gray-400 leading-relaxed">
                    Whenever someone uses your code, YOU get <span className="text-white font-bold">100% Revenue Share</span> on tokens for 1 Month. Keep everything you earn. No fees. No cuts.
                </p>
             </div>

             <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-blue-900/50 rounded-2xl flex items-center justify-center mb-6 text-blue-400 border border-blue-500/30">
                    <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Free VIP for Invitees</h3>
                <p className="text-gray-400 leading-relaxed">
                    Users who sign up with your referral code instantly receive <span className="text-white font-bold">1 Month of Free VIP Status</span> (Values at $49.99). It's the easiest way to incentivize your fans to join.
                </p>
             </div>
          </div>

          {/* Detailed Info */}
          <div className="bg-white rounded-3xl p-10 md:p-16 shadow-xl border border-gray-100 max-w-5xl mx-auto">
             <div className="text-center mb-12">
                 <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Who is this for?</h2>
                 <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                    This program is exclusively available to our most dedicated members and professional partners.
                 </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-6">
                     <div className="flex items-start">
                        <div className="mt-1 mr-4">
                            <Crown className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Diamond VIP Members</h3>
                            <p className="text-slate-600 mt-2">
                                All Diamond VIP members are automatically enrolled. Your referral code is your <strong>Screen Name</strong>. 
                                Simply share your profile or tell people to use your name when signing up.
                            </p>
                        </div>
                     </div>
                     <div className="flex items-start">
                        <div className="mt-1 mr-4">
                            <Users className="w-6 h-6 text-peach-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Affiliated Partners</h3>
                            <p className="text-slate-600 mt-2">
                                Influencers, Agencies, and Marketers can apply to become an Affiliated Partner. You will receive a unique custom code to track your referrals.
                            </p>
                        </div>
                     </div>
                 </div>

                 <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                     <h3 className="text-xl font-bold text-slate-800 mb-6">How to Apply</h3>
                     <ul className="space-y-4 mb-8">
                         <li className="flex items-center text-slate-700">
                             <CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Minimum 5k Followers on Social Media
                         </li>
                         <li className="flex items-center text-slate-700">
                             <CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Proven track record in adult industry
                         </li>
                         <li className="flex items-center text-slate-700">
                             <CheckCircle className="w-5 h-5 text-green-500 mr-3" /> Ability to drive quality traffic
                         </li>
                     </ul>
                     <Link to="/contact" className="block w-full text-center bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-slate-900 transition-all flex items-center justify-center">
                         <Mail className="w-5 h-5 mr-2" /> Contact Support to Apply
                     </Link>
                 </div>
             </div>
          </div>
      </div>
    </div>
  );
};