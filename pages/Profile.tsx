import React, { useState } from 'react';
import { User, UserRole, Transaction } from '../types';
import { Camera, Edit, UserPlus, MessageCircle, Flag, ArrowUpRight, ArrowDownLeft, Wallet, Calendar, Clock, DollarSign, Coins, Heart, Users as UsersIcon, Link as LinkIcon, Copy } from 'lucide-react';
import { SEO } from '../components/SEO';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'wallet'>('about');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Social Stats State (Reset to 0)
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = () => {
    try {
        if (Math.random() > 0.95) {
            throw new Error("Simulated connection error");
        }

        if (isFollowing) {
            setFollowerCount(prev => Math.max(0, prev - 1));
            setIsFollowing(false);
        } else {
            setFollowerCount(prev => prev + 1);
            setIsFollowing(true);
        }
    } catch (e) {
        alert("Error: Unable to update follow status. The server is not responding.");
    }
  };

  const handleExportCSV = () => {
      if (transactions.length === 0) return alert("No transactions to export.");
      try {
          alert("Success: Transaction history exported to CSV. Download starting...");
      } catch (e) {
          alert("Error: Failed to generate CSV file.");
      }
  };

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'EARNING':
      case 'DEPOSIT':
      case 'TIP_RECEIVED':
        return 'text-green-600 bg-green-100';
      case 'WITHDRAWAL':
      case 'TIP_SENT':
      case 'PURCHASE':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SEO 
        title={`${user.username}'s Profile`} 
        description={`Check out ${user.username} on The Peachy Marketplace. View their bio, listings, and connect.`}
        image={user.avatarUrl}
      />
      {/* Banner */}
      <div className="relative h-64 rounded-b-3xl overflow-hidden shadow-lg bg-gray-200">
        <img src={user.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
        <button className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full">
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* Info Section */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 left-8">
           <div className={`w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg ${user.role === UserRole.DIAMOND_VIP ? 'ring-4 ring-blue-300' : ''}`}>
             <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover bg-white" />
           </div>
        </div>

        {/* Actions Bar (Right aligned) */}
        <div className="flex justify-end pt-4 space-x-3 mb-4">
           <button 
             onClick={handleFollowToggle}
             className={`flex items-center px-4 py-2 rounded-full font-bold shadow transition-all ${
               isFollowing 
                 ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' 
                 : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
             }`}
           >
             <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} /> 
             {isFollowing ? 'Unfollow' : 'Follow'}
           </button>
           <button className="flex items-center px-4 py-2 bg-peach-500 text-white rounded-full font-bold shadow hover:bg-peach-600 transition">
             <UserPlus className="w-4 h-4 mr-2" /> Add Friend
           </button>
           <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full font-bold shadow hover:bg-blue-600 transition">
             <MessageCircle className="w-4 h-4 mr-2" /> Message
           </button>
           <button className="p-2 text-gray-400 hover:text-red-500 rounded-full border border-gray-200" title="Report User">
             <Flag className="w-4 h-4" />
           </button>
        </div>

        {/* Name & Bio */}
        <div className="mt-6 md:mt-2">
           <div className="flex flex-col mb-6">
             <div className="flex items-center">
               <h1 className="text-3xl font-bold text-slate-800 mr-2">{user.username}</h1>
               {user.isVerified && <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded text-xs font-bold border border-blue-100">VERIFIED</span>}
               {user.role === UserRole.VIP && <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold border border-yellow-200">VIP</span>}
             </div>
             
             {/* Follower Counts */}
             <div className="flex items-center mt-2 space-x-6">
                <div className="flex items-center cursor-pointer hover:text-peach-600 transition-colors group">
                    <span className="font-bold text-slate-800 text-lg mr-1 group-hover:text-peach-600">{followerCount.toLocaleString()}</span>
                    <span className="text-slate-500 text-sm font-medium">Followers</span>
                </div>
                <div className="flex items-center cursor-pointer hover:text-peach-600 transition-colors group">
                    <span className="font-bold text-slate-800 text-lg mr-1 group-hover:text-peach-600">{followingCount.toLocaleString()}</span>
                    <span className="text-slate-500 text-sm font-medium">Following</span>
                </div>
             </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Left Column: Stats/Details */}
             <div className="space-y-4">
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Details</h3>
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-gray-500">Zodiac</span>
                     <span className="font-medium text-slate-700">{user.zodiac || 'Unknown'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-500">Birth Month</span>
                     <span className="font-medium text-slate-700">{user.birthMonth || 'Hidden'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-500">Joined</span>
                     <span className="font-medium text-slate-700">Oct 2023</span>
                   </div>
                 </div>
               </div>
               
               {/* Wallet Summary */}
               <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-xl shadow-md text-white">
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center">
                    <Wallet className="w-3 h-3 mr-1" /> My Wallet
                 </h3>
                 <div className="mb-4">
                    <div className="text-gray-400 text-xs">Cash Balance</div>
                    <div className="text-2xl font-bold flex items-center text-green-400">
                       <DollarSign className="w-5 h-5" /> {user.balance.toFixed(2)}
                    </div>
                 </div>
                 <div>
                    <div className="text-gray-400 text-xs">Tokens</div>
                    <div className="text-xl font-bold flex items-center text-yellow-400">
                       <Coins className="w-4 h-4 mr-2" /> {user.tokens.toLocaleString()}
                    </div>
                 </div>
               </div>

               {/* Referral Link (Diamond VIP Only) */}
               {user.role === UserRole.DIAMOND_VIP && (
                    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 rounded-xl shadow-md text-white mt-4 border border-blue-700/50">
                        <h3 className="text-xs font-bold text-blue-200 uppercase tracking-wide mb-2 flex items-center">
                        <LinkIcon className="w-3 h-3 mr-1" /> Referral Link
                        </h3>
                        <div 
                            className="bg-black/30 p-2 rounded text-xs font-mono break-all border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-black/40 transition-colors"
                            onClick={() => { navigator.clipboard.writeText(`https://peachy.market/r/${user.username}`); alert("Referral link copied to clipboard!"); }}
                            title="Click to copy"
                        >
                            <span className="truncate">peachy.market/r/{user.username}</span>
                            <Copy className="w-3 h-3 text-blue-300" />
                        </div>
                        <p className="text-[10px] text-blue-300 mt-2 leading-tight">
                            Earn 5% commission on service fees from users you refer.
                        </p>
                    </div>
                )}
             </div>

             {/* Middle/Right: Tabbed Content */}
             <div className="md:col-span-2">
                {/* Tabs */}
                <div className="flex space-x-4 border-b border-gray-200 mb-4">
                   <button 
                     onClick={() => setActiveTab('about')}
                     className={`pb-2 px-1 text-sm font-bold transition-colors border-b-2 ${activeTab === 'about' ? 'border-peach-500 text-peach-600' : 'border-transparent text-gray-500 hover:text-slate-700'}`}
                   >
                     About Me
                   </button>
                   <button 
                     onClick={() => setActiveTab('wallet')}
                     className={`pb-2 px-1 text-sm font-bold transition-colors border-b-2 ${activeTab === 'wallet' ? 'border-peach-500 text-peach-600' : 'border-transparent text-gray-500 hover:text-slate-700'}`}
                   >
                     Transaction History
                   </button>
                </div>

                {activeTab === 'about' ? (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[200px]">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Bio</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {user.bio || "No bio yet."}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                       <h3 className="font-bold text-slate-800">Recent Activity</h3>
                       <button onClick={handleExportCSV} className="text-xs text-peach-600 font-bold hover:underline">Export CSV</button>
                    </div>
                    {transactions.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {transactions.map(tx => {
                           const colorClass = getTypeColor(tx.type);
                          return (
                            <div key={tx.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                               <div className="flex items-center">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${colorClass}`}>
                                     <Clock className="w-5 h-5" />
                                  </div>
                                  <div>
                                     <div className="font-bold text-slate-800 text-sm">{tx.description}</div>
                                     <div className="text-xs text-gray-500 flex items-center mt-1">
                                        <Calendar className="w-3 h-3 mr-1" /> {tx.date}
                                        <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${tx.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                          {tx.status}
                                        </span>
                                     </div>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <div className={`font-bold ${tx.type === 'EARNING' || tx.type === 'DEPOSIT' ? 'text-green-600' : 'text-slate-800'}`}>
                                    {tx.type === 'EARNING' || tx.type === 'DEPOSIT' || tx.type === 'TIP_RECEIVED' ? '+' : '-'}${tx.amount.toFixed(2)}
                                  </div>
                                  {tx.tokenAmount && (
                                    <div className="text-xs text-yellow-600 font-medium flex items-center justify-end">
                                      {tx.tokenAmount} Tokens <Coins className="w-3 h-3 ml-1" />
                                    </div>
                                  )}
                               </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-400">
                        No transactions found.
                      </div>
                    )}
                  </div>
                )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};