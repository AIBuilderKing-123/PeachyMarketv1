import React, { useState, useEffect } from 'react';
import { Listing, User } from '../types';
import { FEES } from '../constants';
import { Star, Download, Image as ImageIcon, Video, Link as LinkIcon, Plus, ShieldAlert, Upload, CheckCircle, Flag, Eye, Users, Activity, X, ShoppingCart, Search } from 'lucide-react';
import { PayPalButton } from '../components/PayPalButton';
import { SEO } from '../components/SEO';

interface MarketplaceProps {
  user: User | null;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ user }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [purchaseModalListing, setPurchaseModalListing] = useState<Listing | null>(null);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create Listing Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSticky, setIsSticky] = useState(false);
  const [isPremiumSticky, setIsPremiumSticky] = useState(false);
  const [autoDelivery, setAutoDelivery] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Simulate Live Viewers & View Counts
  useEffect(() => {
    const interval = setInterval(() => {
      setListings(prev => prev.map(item => {
        // Random change for live viewers (-1 to +2) to fluctuate
        const viewerChange = Math.floor(Math.random() * 4) - 1; 
        const newLive = Math.max(0, item.liveViewers + viewerChange);
        
        // Randomly increment total views based on if people are watching or random traffic
        const viewIncrement = (newLive > 0 && Math.random() > 0.6) || Math.random() > 0.85 ? 1 : 0;
        
        return {
          ...item,
          liveViewers: newLive,
          views: item.views + viewIncrement
        };
      }));
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  // Filter Listings based on search term
  const filteredListings = listings.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (a.isPremiumSticky && !b.isPremiumSticky) return -1;
    if (!a.isPremiumSticky && b.isPremiumSticky) return 1;
    if (a.isSticky && !b.isSticky) return -1;
    if (!a.isSticky && b.isSticky) return 1;
    return 0;
  });

  const handleCreateButtonClick = () => {
    if (!user) return alert("Please log in.");
    if (!user.isVerified) return alert("You must be ID Verified to create a listing.");
    setShowCreateModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  const handleReport = (listingId: string, listingTitle: string) => {
      if (!user) return alert("Please log in to report content.");
      const confirmed = window.confirm(`Report "${listingTitle}" for violating terms of service?`);
      if (confirmed) {
         alert(`Report submitted successfully. Administrators will review this shortly.`);
      }
  };

  const handlePurchaseSuccess = (details: any) => {
      if (!purchaseModalListing) return;

      const paidAmount = details.purchase_units[0].amount.value;
      const transactionId = details.id;

      alert(`PAYMENT SUCCESSFUL!\n\nTransaction ID: ${transactionId}\nAmount: $${paidAmount}\n\nThank you for your purchase. The content has been sent to your email address.`);
      
      // In a real app, backend would trigger email now.
      setPurchaseModalListing(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (autoDelivery && !uploadedFileName) {
          alert("Error: Automatic Delivery is enabled but no private content file was uploaded.");
          return;
        }

        const newItem: Listing = {
          id: `l${Date.now()}`,
          sellerId: user?.id || 'u1',
          sellerName: user?.username || 'PeachyUser',
          sellerAvatar: user?.avatarUrl || 'https://picsum.photos/200/200?random=1',
          title: newTitle,
          description: newDesc,
          price: parseFloat(newPrice),
          images: ['https://picsum.photos/400/300?grayscale'],
          isSticky,
          isPremiumSticky,
          autoDelivery,
          category: 'Photo',
          views: 1, 
          liveViewers: 0
        };
        setListings([newItem, ...listings]);
        setShowCreateModal(false);
        
        let fee = 0;
        if (isPremiumSticky) fee = FEES.PREMIUM_STICKY_PRICE;
        else if (isSticky) fee = FEES.STICKY_PRICE;
        
        if (fee > 0) {
          alert(`Listing created successfully! $${fee.toFixed(2)} has been deducted from your balance.`);
        } else {
          alert(`Listing created successfully!`);
        }

        // Reset form
        setNewTitle('');
        setNewPrice('');
        setNewDesc('');
        setIsSticky(false);
        setIsPremiumSticky(false);
        setAutoDelivery(false);
        setUploadedFileName(null);
    } catch (error) {
        console.error("Listing Error:", error);
    }
  };

  return (
    <div>
      <SEO 
        title="Marketplace" 
        description="Browse exclusive content from verified sellers. Photos, videos, and digital downloads available with instant delivery."
      />
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-100 mb-2">Marketplace</h1>
          <p className="text-gray-400">Buy exclusive content from ID Verified sellers. Safe & Secure.</p>
        </div>
        <div>
          <button 
            onClick={handleCreateButtonClick}
            className={`flex items-center px-8 py-3 rounded-full transition-all shadow-lg font-bold ${user?.isVerified ? 'bg-peach-600 hover:bg-peach-700 text-white shadow-peach-900/20' : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'}`}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Listing
          </button>
          {!user?.isVerified && <p className="text-xs text-red-400 mt-2 text-center">Verification Required</p>}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl leading-5 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:bg-gray-900 focus:border-peach-500 sm:text-sm transition-colors"
                placeholder="Search listings by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {sortedListings.length === 0 ? (
          <div className="text-center py-24 bg-gray-800 rounded-3xl border border-gray-700 border-dashed">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                  <Activity className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">
                {searchTerm ? 'No results found' : 'Marketplace is Empty'}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Be the first to list content on The Peachy Marketplace!'}
              </p>
              {user?.isVerified && !searchTerm && (
                  <button onClick={handleCreateButtonClick} className="mt-6 text-peach-500 font-bold hover:text-white transition-colors">
                      + Create First Listing
                  </button>
              )}
          </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {sortedListings.map((listing) => (
          <div 
            key={listing.id} 
            className={`bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative border ${
              listing.isPremiumSticky ? 'border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 
              listing.isSticky ? 'border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-gray-700'
            }`}
          >
            {/* Badges */}
            {listing.isPremiumSticky && (
              <div className="absolute top-3 right-3 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10 flex items-center shadow-lg">
                <Star className="w-3 h-3 mr-1 fill-current" /> PREMIUM
              </div>
            )}
            {listing.isSticky && !listing.isPremiumSticky && (
              <div className="absolute top-3 right-3 bg-amber-500 text-amber-950 text-[10px] font-bold px-3 py-1 rounded-full z-10 shadow-lg">
                FEATURED
              </div>
            )}
            {listing.autoDelivery && (
               <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10 flex items-center shadow-lg">
               <Download className="w-3 h-3 mr-1" /> AUTO
             </div>
            )}

            {/* Image Preview */}
            <div className="h-56 bg-gray-900 relative overflow-hidden group cursor-pointer">
              <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
              
              {/* Live Viewers Badge */}
              <div className="absolute bottom-2 left-2 flex items-center space-x-2">
                 {listing.liveViewers > 0 && (
                   <div className="bg-red-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center shadow-lg animate-pulse">
                     <Users className="w-3 h-3 mr-1.5" />
                     {listing.liveViewers} watching
                   </div>
                 )}
              </div>

               {/* Total Views Badge */}
               <div className="absolute bottom-2 right-2 flex items-center">
                   <div className="bg-black/60 backdrop-blur-md text-gray-200 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center shadow-sm border border-white/10">
                     <Eye className="w-3 h-3 mr-1.5" />
                     {listing.views.toLocaleString()}
                   </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-gray-100 line-clamp-1 hover:text-peach-500 transition-colors cursor-pointer">{listing.title}</h3>
                <span className="font-bold text-peach-500 text-xl">${listing.price.toFixed(2)}</span>
              </div>
              
              <p className="text-gray-400 text-sm mb-5 line-clamp-2 min-h-[2.5rem] leading-relaxed">{listing.description}</p>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center">
                  <img src={listing.sellerAvatar} alt={listing.sellerName} className="w-9 h-9 rounded-full mr-3 object-cover border border-gray-600" />
                  <span className="text-xs font-bold text-gray-300 hover:text-white cursor-pointer">{listing.sellerName}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => handleReport(listing.id, listing.title)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Report Violation"
                    >
                        <Flag className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setPurchaseModalListing(listing)}
                      className="bg-gray-100 hover:bg-white text-gray-900 text-xs font-bold px-5 py-2.5 rounded-lg transition-colors shadow-lg"
                    >
                      Buy Now
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Purchase Modal (PayPal) */}
      {purchaseModalListing && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-8 border border-gray-200">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h2 className="text-2xl font-bold text-slate-800">Checkout</h2>
                   <p className="text-slate-500 text-sm">{purchaseModalListing.title}</p>
                 </div>
                 <button onClick={() => setPurchaseModalListing(null)} className="text-gray-400 hover:text-gray-600"><X /></button>
               </div>
               
               <PayPalButton 
                 amount={purchaseModalListing.price} 
                 description={`Purchase: ${purchaseModalListing.title}`}
                 onSuccess={handlePurchaseSuccess}
               />

               <div className="text-center mt-4">
                 <p className="text-xs text-gray-400">Secure Payment via PayPal Business</p>
               </div>
            </div>
         </div>
      )}

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gray-800 border border-gray-700 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-100">Create New Listing</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold text-gray-400 mb-2">Title</label>
                   <input 
                    required
                    type="text" 
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full p-4 bg-gray-900 border border-gray-700 text-white rounded-xl focus:border-peach-500 outline-none transition-colors"
                    placeholder="E.g. Summer Photoset"
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-400 mb-2">Price ($)</label>
                   <input 
                    required
                    type="number" 
                    min="1"
                    step="0.01"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="w-full p-4 bg-gray-900 border border-gray-700 text-white rounded-xl focus:border-peach-500 outline-none transition-colors"
                    placeholder="19.99"
                   />
                   <p className="text-xs text-gray-500 mt-2">You receive: <span className="text-green-500">${(parseFloat(newPrice || '0') * 0.93).toFixed(2)}</span> (7% fee)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Description (Max 250 chars)</label>
                <textarea 
                  required
                  maxLength={250}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full p-4 bg-gray-900 border border-gray-700 text-white rounded-xl focus:border-peach-500 outline-none h-32 resize-none"
                  placeholder="Describe your content..."
                />
                <div className="text-right text-xs text-gray-500 mt-2">{newDesc.length}/250</div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Upload Preview Image (1-2 Photos)</label>
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center bg-gray-900/50 hover:bg-gray-900 transition-colors">
                   <p className="text-gray-400 text-sm mb-2">Drag & Drop or Click to Upload Preview</p>
                   <input type="file" className="hidden" id="preview-upload" />
                   <label htmlFor="preview-upload" className="inline-block text-peach-500 cursor-pointer font-bold hover:text-peach-400">Browse Files</label>
                </div>
              </div>

              {/* Auto Delivery Section */}
              <div className="bg-gray-900/50 p-6 rounded-2xl space-y-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-500/10 rounded-lg mr-3">
                        <Download className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                        <span className="font-bold text-gray-200 block">Automatic Delivery</span>
                        <span className="text-xs text-gray-500">Securely upload content now. Sent automatically upon payment.</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setAutoDelivery(!autoDelivery)}
                    className={`w-14 h-8 rounded-full transition-colors relative ${autoDelivery ? 'bg-green-600' : 'bg-gray-600'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${autoDelivery ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
                
                {autoDelivery && (
                    <div className="mt-4 bg-gray-800 p-5 rounded-xl border border-gray-600 animate-fadeIn">
                         <label className="block text-sm font-bold text-gray-300 mb-2">Upload Private Content</label>
                         <p className="text-xs text-gray-500 mb-4">
                             Only the buyer will receive this file via email. It is stored in our secure database.
                         </p>
                         <div className="flex items-center gap-3">
                             <input type="file" id="private-file" className="hidden" onChange={handleFileUpload} />
                             <label 
                                htmlFor="private-file" 
                                className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-bold cursor-pointer flex items-center transition-colors"
                             >
                                <Upload className="w-4 h-4 mr-2" /> Choose File
                             </label>
                             {uploadedFileName ? (
                                 <span className="text-sm text-green-500 font-bold flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> {uploadedFileName}</span>
                             ) : (
                                 <span className="text-sm text-gray-500 italic">No file selected</span>
                             )}
                         </div>
                    </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button 
                  type="button"
                  onClick={() => { setIsSticky(!isSticky); setIsPremiumSticky(false); }}
                  className={`p-5 rounded-xl border-2 text-center transition-all ${isSticky ? 'border-amber-500 bg-amber-500/10' : 'border-gray-700 bg-gray-900 hover:border-amber-500/50'}`}
                 >
                    <div className={`font-bold ${isSticky ? 'text-amber-500' : 'text-gray-300'}`}>Sticky Post</div>
                    <div className="text-sm text-gray-500 mt-1">Feature for ${FEES.STICKY_PRICE.toFixed(2)}</div>
                 </button>
                 <button 
                  type="button"
                  onClick={() => { setIsPremiumSticky(!isPremiumSticky); setIsSticky(false); }}
                  className={`p-5 rounded-xl border-2 text-center transition-all ${isPremiumSticky ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-gray-900 hover:border-purple-500/50'}`}
                 >
                    <div className={`font-bold ${isPremiumSticky ? 'text-purple-500' : 'text-gray-300'}`}>Premium Sticky</div>
                    <div className="text-sm text-gray-500 mt-1">Top Spot for ${FEES.PREMIUM_STICKY_PRICE.toFixed(2)}</div>
                 </button>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-peach-600 hover:bg-peach-700 text-white rounded-xl font-bold shadow-lg shadow-peach-900/30 transition-all"
                >
                  Post Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};