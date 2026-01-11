import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Check, Crown, Gem, Star, Loader, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PayPalButton } from '../components/PayPalButton';
import { SEO } from '../components/SEO';

interface MembershipsProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
}

export const Memberships: React.FC<MembershipsProps> = ({ user, onUpdateUser }) => {
  const navigate = useNavigate();
  const [checkoutPlan, setCheckoutPlan] = useState<{name: string, role: UserRole, price: number} | null>(null);

  const initiateSubscribe = (planName: string, targetRole: UserRole, price: number) => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Basic logic to prevent downgrading via this UI
    if (user.role === UserRole.DIAMOND_VIP && targetRole === UserRole.VIP) {
        alert("You are already a Diamond VIP!");
        return;
    }

    setCheckoutPlan({ name: planName, role: targetRole, price: price });
  };

  const handlePaymentSuccess = (details: any) => {
      if (!user || !checkoutPlan) return;
      
      const updatedUser = { ...user, role: checkoutPlan.role };
            
      // Update Session
      onUpdateUser(updatedUser);

      // Update Permanent Storage (Mock Backend)
      const storedUsers = localStorage.getItem('peachy_users');
      if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const newUsers = users.map((u: User) => u.id === user.id ? updatedUser : u);
          localStorage.setItem('peachy_users', JSON.stringify(newUsers));
      }
      
      setCheckoutPlan(null);
      alert(`Payment Verified! Welcome to the ${checkoutPlan.name} club. Your profile has been upgraded.`);
  };

  const isCurrentPlan = (role: UserRole) => {
      if (!user) return role === UserRole.USER || role === UserRole.VERIFIED;
      // If user is verified, they are effectively on the "Free" plan if not VIP
      if (role === UserRole.VERIFIED) return user.role === UserRole.VERIFIED || user.role === UserRole.USER;
      return user.role === role;
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <SEO 
        title="Memberships & VIP Club" 
        description="Upgrade your Peachy Marketplace experience. Get higher revenue shares, premium exposure, and exclusive badges with VIP and Diamond status."
      />
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Upgrade Your Status</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Unlock higher revenue shares, premium visibility, and exclusive badges with our VIP memberships.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Standard Plan */}
        <div className={`bg-white rounded-2xl p-8 shadow-sm border ${isCurrentPlan(UserRole.VERIFIED) ? 'border-green-500 ring-2 ring-green-500/20' : 'border-gray-100'} transition-all`}>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Star className="w-8 h-8 text-gray-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Verified</h2>
          <div className="text-center mb-8">
            <span className="text-4xl font-bold text-slate-800">Free</span>
            <span className="text-gray-500">/forever</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center text-slate-600">
              <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" /> 85% Token Revenue Share
            </li>
            <li className="flex items-center text-slate-600">
              <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" /> Standard Listing Fees
            </li>
            <li className="flex items-center text-slate-600">
              <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" /> Cam Booking: $5.00/block
            </li>
            <li className="flex items-center text-slate-600">
              <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" /> Standard Support
            </li>
          </ul>
          <button 
            disabled 
            className={`w-full py-3 rounded-xl border-2 font-bold cursor-default ${isCurrentPlan(UserRole.VERIFIED) ? 'border-green-500 text-green-600 bg-green-50' : 'border-gray-200 text-gray-400'}`}
          >
            {isCurrentPlan(UserRole.VERIFIED) ? 'Current Plan' : 'Included'}
          </button>
        </div>

        {/* VIP Plan */}
        <div className={`bg-white rounded-2xl p-8 shadow-xl border-2 ${isCurrentPlan(UserRole.VIP) ? 'border-peach-500 ring-4 ring-peach-500/20' : 'border-peach-400'} transform md:scale-105 relative z-10 transition-all`}>
          {isCurrentPlan(UserRole.VIP) ? (
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap flex items-center">
                 <Check className="w-3 h-3 mr-1" /> ACTIVE
             </div>
          ) : (
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-peach-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
                RECOMMENDED
             </div>
          )}
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-peach-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">VIP Membership</h2>
          <div className="text-center mb-8">
            <span className="text-4xl font-bold text-slate-800">$49.99</span>
            <span className="text-gray-500">/month</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center text-slate-700 font-bold">
              <Check className="w-5 h-5 text-peach-500 mr-3 shrink-0" /> 90% Token Revenue Share
            </li>
            <li className="flex items-center text-slate-700">
              <Check className="w-5 h-5 text-peach-500 mr-3 shrink-0" /> Free Sticky Posts
            </li>
            <li className="flex items-center text-slate-700">
              <Check className="w-5 h-5 text-peach-500 mr-3 shrink-0" /> Cam Booking: $2.50/block
            </li>
            <li className="flex items-center text-slate-700">
              <Check className="w-5 h-5 text-peach-500 mr-3 shrink-0" /> Exclusive VIP Badge
            </li>
          </ul>
          {isCurrentPlan(UserRole.VIP) ? (
              <button disabled className="w-full py-4 bg-gray-100 text-gray-500 font-bold rounded-xl cursor-default border border-gray-200">
                  Plan Active
              </button>
          ) : isCurrentPlan(UserRole.DIAMOND_VIP) ? (
              <button disabled className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-default">
                  Included in Diamond
              </button>
          ) : (
              <button 
                onClick={() => initiateSubscribe('VIP', UserRole.VIP, 49.99)}
                className="w-full py-4 bg-peach-500 hover:bg-peach-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex justify-center items-center"
              >
                Join VIP
              </button>
          )}
          <p className="text-center text-xs text-slate-400 mt-4 italic">more coming soon...</p>
        </div>

        {/* Diamond VIP Plan */}
        <div className={`bg-slate-900 rounded-2xl p-8 shadow-2xl border ${isCurrentPlan(UserRole.DIAMOND_VIP) ? 'border-blue-500 ring-4 ring-blue-500/30' : 'border-slate-700'} text-white relative overflow-hidden transition-all`}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
              <Gem className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">Diamond VIP</h2>
          <div className="text-center mb-8">
            <span className="text-4xl font-bold">$499.99</span>
            <span className="text-gray-400 text-sm block mt-1">One-time Payment</span>
          </div>
          <ul className="space-y-4 mb-8 relative z-10">
             <li className="flex items-center text-white font-bold">
               <Check className="w-5 h-5 text-blue-400 mr-3 shrink-0" /> 95% Token Revenue Share
             </li>
             <li className="flex items-center text-gray-200">
               <Check className="w-5 h-5 text-blue-400 mr-3 shrink-0" /> Free Premium Sticky Posts
             </li>
             <li className="flex items-center text-gray-200">
               <Check className="w-5 h-5 text-blue-400 mr-3 shrink-0" /> Diamond Profile Ring & Badge
             </li>
             <li className="flex items-center text-gray-200">
               <Check className="w-5 h-5 text-blue-400 mr-3 shrink-0" /> Free Cam Booking
             </li>
             <li className="flex items-center text-gray-200">
               <Check className="w-5 h-5 text-blue-400 mr-3 shrink-0" /> Lifetime Access
             </li>
             <li className="flex items-center text-gray-200">
               <Check className="w-5 h-5 text-blue-400 mr-3 shrink-0" /> Priority Support (24/7)
             </li>
             <li className="flex items-center text-gray-200">
               <Check className="w-5 h-5 text-blue-400 mr-3 shrink-0" /> Access to Referral Links
             </li>
          </ul>
          {isCurrentPlan(UserRole.DIAMOND_VIP) ? (
               <button disabled className="w-full py-4 bg-blue-900/50 text-blue-200 border border-blue-800 font-bold rounded-xl cursor-default flex items-center justify-center">
                  <Gem className="w-4 h-4 mr-2" /> You are Legendary
               </button>
          ) : (
              <button 
                 onClick={() => initiateSubscribe('Diamond VIP', UserRole.DIAMOND_VIP, 499.99)}
                 className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 border border-white/10 flex justify-center items-center"
              >
                Become Legendary
              </button>
          )}
          <p className="text-center text-xs text-gray-500 mt-4 italic">more coming soon...</p>
        </div>
      </div>
      
      {!user && (
          <div className="mt-12 text-center bg-yellow-50 p-4 rounded-xl border border-yellow-200 inline-block w-full">
              <p className="text-yellow-800 font-bold flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 mr-2" /> Please log in to upgrade your membership.
              </p>
          </div>
      )}

      {/* Checkout Modal */}
      {checkoutPlan && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-8 border border-gray-200">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h2 className="text-2xl font-bold text-slate-800">Complete Upgrade</h2>
                   <p className="text-slate-500 text-sm">{checkoutPlan.name}</p>
                 </div>
                 <button onClick={() => setCheckoutPlan(null)} className="text-gray-400 hover:text-gray-600"><X /></button>
               </div>
               
               <PayPalButton 
                 amount={checkoutPlan.price} 
                 description={`Membership: ${checkoutPlan.name}`}
                 customId={user?.id}
                 onSuccess={handlePaymentSuccess}
               />
            </div>
         </div>
      )}
    </div>
  );
};