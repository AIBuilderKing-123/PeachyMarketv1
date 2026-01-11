import React, { useState, useEffect, useRef } from 'react';
import { CamRoom, User, CamMenuOption, UserRole, BookedSlot } from '../types';
import { Video, User as UserIcon, DollarSign, X, Coins, Gift, Menu as MenuIcon, Send as SendIcon, Edit2, Trash2, Plus, Save, AlertTriangle, Calendar, Clock, CheckCircle, Key, Radio, Settings, Signal, Copy, Activity } from 'lucide-react';
import { FEES, BUNNY_CDN_CONFIG } from '../constants';
import { PayPalButton } from '../components/PayPalButton';
import { SEO } from '../components/SEO';
import Hls from 'hls.js';

interface CamRoomsProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
  rooms: CamRoom[];
  onUpdateRooms: (rooms: CamRoom[]) => void;
}

export const CamRooms: React.FC<CamRoomsProps> = ({ user, onUpdateUser, rooms, onUpdateRooms }) => {
  const [activeRoom, setActiveRoom] = useState<CamRoom | null>(null);
  const [streamCode, setStreamCode] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  // Booking System State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingRoomId, setBookingRoomId] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0); 
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null); // To show user after booking

  // Token System State
  const [showBuyTokens, setShowBuyTokens] = useState(false);
  const [tokensToBuy, setTokensToBuy] = useState<number>(500);
  const [purchaseStep, setPurchaseStep] = useState<'input' | 'confirm'>('input');
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'chat' | 'menu'>('chat');
  
  // Tipping State
  const [tipAmount, setTipAmount] = useState<string>('');
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{user: string, text: string, type?: 'chat' | 'tip' | 'system', amount?: number}[]>([
    { user: 'System', text: 'Welcome to the room! Be respectful.', type: 'system' }
  ]);

  // Host Menu Editing State
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [editedMenuOptions, setEditedMenuOptions] = useState<CamMenuOption[]>([]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTab]);

  // Reset states
  useEffect(() => {
    if (!showBuyTokens) setPurchaseStep('input');
  }, [showBuyTokens]);

  useEffect(() => {
    if (activeRoom) {
      setIsEditingMenu(false);
      setEditedMenuOptions(activeRoom.menuOptions || []);
    }
  }, [activeRoom]);

  // HLS Video Logic
  useEffect(() => {
    // Cleanup function for HLS instance
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // If we have an active room, video enabled, and a video ref
    if (activeRoom && BUNNY_CDN_CONFIG.ENABLED && videoRef.current) {
      const playbackUrl = `${BUNNY_CDN_CONFIG.PULL_ZONE_URL}/room${activeRoom.id}/playlist.m3u8`;
      
      // Check for HLS.js support (Chrome, Firefox, Edge, etc.)
      if (Hls.isSupported()) {
        // Destroy prev instance if exists
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        const hls = new Hls({
          maxBufferLength: 30, // Increase buffer for smoother HD playback
          maxMaxBufferLength: 60,
          enableWorker: true, // Use web workers for performance
          lowLatencyMode: true, // Attempt low latency for live interaction
          backBufferLength: 90
        });

        hls.loadSource(playbackUrl);
        hls.attachMedia(videoRef.current);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current?.play().catch(e => console.log("Autoplay policy prevented playback", e));
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log("Network error encountered, trying to recover");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log("Media error encountered, trying to recover");
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          }
        });

        hlsRef.current = hls;

      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS Support (Safari)
        videoRef.current.src = playbackUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current?.play().catch(e => console.log("Autoplay policy prevented playback", e));
        });
      }
    }
  }, [activeRoom]);

  // --- Utility Functions for Booking ---
  
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const generateTimeSlots = (dateOffset: number) => {
    const slots = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + dateOffset);
    baseDate.setMinutes(0);
    baseDate.setSeconds(0);
    baseDate.setMilliseconds(0);

    for (let i = 0; i < 24; i += 2) {
      const start = new Date(baseDate);
      start.setHours(i);
      const end = new Date(baseDate);
      end.setHours(i + 2);
      
      if (dateOffset === 0 && start.getTime() < Date.now()) {
        continue;
      }

      slots.push({
        start: start.toISOString(),
        end: end.toISOString(),
        label: `${i.toString().padStart(2, '0')}:00 - ${(i + 2).toString().padStart(2, '0')}:00`
      });
    }
    return slots;
  };

  const getSlotPrice = () => {
    if (user?.role === UserRole.DIAMOND_VIP) {
      return FEES.CAM_BLOCK_PRICE_DIAMOND; // $0.00
    }
    if (user?.role === UserRole.VIP) {
      return FEES.CAM_BLOCK_PRICE_VIP; // $2.50
    }
    return FEES.CAM_BLOCK_PRICE; // $5.00
  };

  // --- Event Handlers ---

  const handleBuyTokensSuccess = (details: any) => {
    if (!user) return;
    onUpdateUser({ ...user, tokens: user.tokens + tokensToBuy });
    setShowBuyTokens(false);
    alert(`Success: ${tokensToBuy} tokens added to your wallet! Transaction: ${details.id}`);
  };

  const handleJoinRoom = (room: CamRoom) => {
    try {
      if (room.viewers >= 100) {
          alert("Room is Full! Max capacity (100 viewers) reached.");
          return;
      }
      setActiveRoom(room);
      setMessages([{ user: 'System', text: `Welcome to Room #${room.id}`, type: 'system' }]);
    } catch (e) {
      alert("Error: Unable to join room. Connection failed.");
    }
  };

  const openBookingModal = (roomId: number) => {
    if (!user) return alert("You must be logged in to book a room.");
    if (!user.isVerified) return alert("You must be ID Verified to book a cam room.");
    setBookingRoomId(roomId);
    setSelectedDay(0);
    setSelectedSlots([]);
    setGeneratedCode(null);
    setShowBookingModal(true);
  };

  const toggleSlotSelection = (startTime: string) => {
    if (selectedSlots.includes(startTime)) {
      setSelectedSlots(prev => prev.filter(s => s !== startTime));
    } else {
      setSelectedSlots(prev => [...prev, startTime]);
    }
  };

  const submitBooking = () => {
    try {
      if (!user || bookingRoomId === null) throw new Error("Invalid Session");
      
      const pricePerBlock = getSlotPrice();
      const totalBookingCost = selectedSlots.length * pricePerBlock;

      if (user.balance < totalBookingCost) {
        alert(`Error: Insufficient funds. You need $${totalBookingCost.toFixed(2)} USD but have $${user.balance.toFixed(2)}.`);
        return;
      }

      // Deduct Balance
      onUpdateUser({ ...user, balance: user.balance - totalBookingCost });

      // Generate Unique Code (This acts as the Stream Key for BunnyCDN)
      // Format: {roomId}-{userId}-{timestamp} to ensure uniqueness
      const uniqueCode = `room${bookingRoomId}-${user.id}-${Date.now().toString(36)}`;
      setGeneratedCode(uniqueCode);

      // Create new booked slots
      const newBookedSlots: BookedSlot[] = selectedSlots.map(startTime => {
        const endDate = new Date(startTime);
        endDate.setHours(endDate.getHours() + 2);
        return {
          userId: user.id,
          username: user.username,
          startTime: startTime,
          endTime: endDate.toISOString()
        };
      });

      onUpdateRooms(rooms.map(r => {
        if (r.id === bookingRoomId) {
          return { ...r, bookedSlots: [...r.bookedSlots, ...newBookedSlots] };
        }
        return r;
      }));
    } catch (e) {
      console.error(e);
      alert("System Error: Booking transaction failed. Please try again.");
    }
  };

  const handleTip = (amount: number, note?: string) => {
    try {
      if (!user) return alert("Error: Login to tip.");
      if (amount <= 0 || isNaN(amount)) return alert("Error: Please enter a valid amount.");
      if (user.tokens < amount) return alert("Error: Insufficient tokens.");

      // Determine Split based on Host role (needs backend lookup, mocked here)
      const sellerShare = amount * FEES.TOKEN_SPLIT_SELLER;
      const ownerShare = amount * FEES.TOKEN_SPLIT_OWNER;
      
      onUpdateUser({ ...user, tokens: user.tokens - amount });
      
      setMessages(prev => [...prev, { 
        user: user.username, 
        text: note || `Tipped ${amount} tokens`, 
        type: 'tip', 
        amount 
      }]);

      if (activeTab !== 'chat') setActiveTab('chat');
    } catch (e) {
      alert("Error: Tipping failed. Please try again.");
    }
  };

  const handleMenuOption = (option: { label: string, cost: number }) => {
    const confirm = window.confirm(`Request "${option.label}" for ${option.cost} tokens?`);
    if (confirm) {
      handleTip(option.cost, `Requested: ${option.label}`);
    }
  };

  const handleSendMessage = () => {
    if (chatInput.trim() && user) {
       setMessages(prev => [...prev, { user: user.username, text: chatInput, type: 'chat' }]);
       setChatInput('');
    }
  };

  // Helper Methods for Host/Room Logic
  const getCurrentHostName = (room: CamRoom) => {
    const now = new Date().toISOString();
    const slot = room.bookedSlots.find(slot => slot.startTime <= now && slot.endTime > now);
    return slot ? slot.username : null;
  };

  const getCurrentHostId = (room: CamRoom) => {
    const now = new Date().toISOString();
    const slot = room.bookedSlots.find(slot => slot.startTime <= now && slot.endTime > now);
    return slot ? slot.userId : null;
  };

  // Added missing helper function
  const isUserScheduledNow = (room: CamRoom) => {
    const hostId = getCurrentHostId(room);
    return !!user && hostId === user.id;
  };

  if (activeRoom) {
    const currentHostId = getCurrentHostId(activeRoom);
    const isHost = user?.id === currentHostId;
    const isRoomLive = activeRoom.isLive;
    
    // Playback URL constructed from CDN config
    const playbackUrl = `${BUNNY_CDN_CONFIG.PULL_ZONE_URL}/room${activeRoom.id}/playlist.m3u8`;

    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col md:flex-row">
        {/* Main Stream Area */}
        <div className="flex-grow relative bg-gray-900 flex items-center justify-center overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex space-x-4">
             <button onClick={() => setActiveRoom(null)} className="bg-black/50 text-white p-3 rounded-full hover:bg-white/20 transition backdrop-blur-sm">
                <X className="w-6 h-6" />
             </button>
             {isRoomLive ? (
               <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold uppercase text-sm animate-pulse flex items-center shadow-lg">
                 <div className="w-3 h-3 bg-white rounded-full mr-3" /> LIVE
               </div>
             ) : (
               <div className="bg-gray-700/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-bold uppercase text-sm flex items-center shadow-lg">
                 OFFLINE
               </div>
             )}
          </div>
          
          {/* VIDEO PLAYER AREA */}
          {BUNNY_CDN_CONFIG.ENABLED && isRoomLive ? (
             <div className="w-full h-full bg-black relative">
               <video 
                 ref={videoRef}
                 className="w-full h-full object-contain"
                 controls
                 playsInline
                 autoPlay
                 muted // Muted by default to allow autoplay
                 poster="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80"
               >
                 Your browser does not support the video tag.
               </video>
               
               {/* HLS Status Indicator (Hidden usually, visible for debug) */}
               <div className="absolute bottom-4 left-4 text-[10px] text-gray-500 opacity-50 pointer-events-none">
                  Adaptive Bitrate: Auto (1080p/720p)
               </div>
             </div>
          ) : (
            /* Placeholder / Offline State */
            <div className="text-center text-gray-600 p-8">
              <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center animate-pulse border-4 border-gray-700">
                  <Signal className="w-24 h-24 text-gray-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-400 mb-2">Waiting for Stream...</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                The host is currently offline or setting up. <br/>
                {BUNNY_CDN_CONFIG.ENABLED && "Video player will initialize automatically when signal is received."}
              </p>
              {currentHostId && <p className="text-lg text-peach-500 mt-6 font-bold bg-peach-900/10 px-4 py-2 rounded-full inline-block border border-peach-500/20">Host: {getCurrentHostName(activeRoom)}</p>}
            </div>
          )}
        </div>

        {/* Sidebar - ZOOMED OUT (Wider / Larger) UI */}
        <div className="w-full md:w-96 bg-gray-800 flex flex-col h-[50vh] md:h-full border-l border-gray-700 shadow-2xl relative z-20">
           {/* Room Header */}
           <div className="p-4 border-b border-gray-700 bg-gray-900 shrink-0">
             <div className="flex justify-between items-center mb-4">
               <h2 className="font-bold text-lg flex items-center text-gray-100">
                 <UserIcon className="w-5 h-5 mr-2 text-peach-500" /> Room #{activeRoom.id}
               </h2>
               <div className="flex items-center bg-gray-800 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-700 border border-gray-700 shadow-sm" onClick={() => setShowBuyTokens(true)}>
                  <Coins className="w-4 h-4 text-peach-500 mr-2" />
                  <span className="font-bold text-peach-500 text-sm">{user?.tokens || 0}</span>
                  <div className="ml-2 bg-peach-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">+</div>
               </div>
             </div>

             {/* Host Controls - Only visible to the Host (Owner/Admin can see for debugging) */}
             {(isHost || user?.role === UserRole.OWNER) && (
                 <div className="mb-4 bg-gray-900 p-4 rounded-xl border-2 border-peach-500/50 shadow-lg relative overflow-hidden group">
                   <div className="absolute -top-2 -right-2 p-1 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Radio className="w-16 h-16 text-peach-500" />
                   </div>
                   <div className="flex items-center justify-between mb-3 relative z-10">
                     <span className="text-xs text-peach-500 font-bold flex items-center uppercase tracking-widest">
                        <Key className="w-3 h-3 mr-2"/> Host Settings
                     </span>
                     {user?.role === UserRole.OWNER && <span className="text-[10px] bg-red-900 text-red-200 px-2 rounded">OWNER</span>}
                   </div>
                   
                   <div className="space-y-3 relative z-10">
                      <div>
                          <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">RTMP Server (BunnyCDN)</label>
                          <div className="flex bg-gray-800 rounded border border-gray-600 p-1">
                              <code className="text-xs text-gray-300 flex-grow p-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
                                  {BUNNY_CDN_CONFIG.RTMP_INGEST_URL}
                              </code>
                              <button onClick={() => navigator.clipboard.writeText(BUNNY_CDN_CONFIG.RTMP_INGEST_URL)} className="p-1 hover:text-white text-gray-500"><Copy className="w-3 h-3"/></button>
                          </div>
                      </div>
                      
                      <div>
                          <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Stream Key</label>
                          <div className="flex bg-gray-800 rounded border border-gray-600 p-1">
                              {/* NOTE: In a real app, you would fetch the reserved stream key for this slot */}
                              <input 
                                type="text" 
                                value={streamCode || "Enter Key or Book Slot"} 
                                onChange={(e) => setStreamCode(e.target.value)}
                                className="bg-transparent text-xs text-white flex-grow p-1 outline-none"
                                placeholder="Paste Key..."
                              />
                               <button onClick={() => navigator.clipboard.writeText(streamCode)} className="p-1 hover:text-white text-gray-500"><Copy className="w-3 h-3"/></button>
                          </div>
                      </div>
                   </div>
                   
                   <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between items-center">
                        <span className="text-[10px] text-gray-400">Status: {isRoomLive ? 'Streaming' : 'Ready'}</span>
                        <button 
                            onClick={() => alert("Signal Sent: If OBS is streaming to the URL above, you are LIVE.")}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded font-bold transition-colors"
                        >
                            Test Signal
                        </button>
                   </div>
                 </div>
               )}
             
             <div className="flex space-x-2 bg-gray-700 p-1 rounded-lg">
               <button onClick={() => setActiveTab('chat')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'chat' ? 'bg-gray-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Chat</button>
               <button onClick={() => setActiveTab('menu')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'menu' ? 'bg-gray-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Menu</button>
             </div>
           </div>

           {/* Content */}
           <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-gray-800 scrollbar-hide min-h-0">
             {activeTab === 'chat' ? (
                <>
                  <div className="text-xs text-gray-500 text-center my-2 uppercase tracking-wider font-bold">Chat Started</div>
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`text-sm py-2 px-3 rounded-xl hover:bg-gray-700/50 transition-colors ${msg.type === 'tip' ? 'bg-amber-900/20 border border-amber-700/30' : ''}`}>
                      <div className="flex items-baseline mb-0.5">
                        <span className={`font-bold mr-2 ${msg.type === 'system' ? 'text-peach-500 text-xs uppercase' : 'text-gray-200'}`}>{msg.user}</span>
                        {msg.type === 'tip' && <span className="font-bold text-amber-500 bg-amber-950 px-2 py-0.5 rounded text-[10px] border border-amber-900/50">TIP {msg.amount}</span>}
                      </div>
                      <p className={`text-gray-300 break-words leading-relaxed ${msg.type === 'system' ? 'text-peach-400 italic' : ''}`}>{msg.text}</p>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </>
             ) : (
                <div className="space-y-4">
                  <div className="bg-peach-900/10 p-4 rounded-xl border border-peach-500/20">
                     <h3 className="font-bold text-peach-500 mb-3 flex items-center text-sm"><Gift className="w-4 h-4 mr-2" /> Send Tip</h3>
                     <div className="grid grid-cols-4 gap-2">
                       {[10, 50, 100, 500].map(amt => (
                         <button key={amt} onClick={() => handleTip(amt)} className="bg-gray-700 border border-gray-600 text-peach-400 font-bold py-2 rounded-lg text-sm hover:bg-peach-600 hover:text-white hover:border-peach-500 transition-all shadow-sm">
                           {amt}
                         </button>
                       ))}
                     </div>
                  </div>
                  
                  {/* Menu Logic here */}
                  <div className="grid grid-cols-1 gap-2">
                     {activeRoom.menuOptions?.map(option => (
                        <button 
                           key={option.id} 
                           onClick={() => handleMenuOption(option)}
                           disabled={isHost}
                           className="flex justify-between items-center p-3 bg-gray-700/50 border border-gray-600 rounded-xl hover:bg-gray-700 hover:border-peach-500/50 transition-all group"
                        >
                           <span className="font-medium text-gray-200 group-hover:text-white text-sm">{option.label}</span>
                           <span className="bg-gray-800 px-3 py-1 rounded-lg text-xs font-bold text-peach-500 border border-gray-600 group-hover:border-peach-500">{option.cost} Tk</span>
                        </button>
                     ))}
                  </div>
                </div>
             )}
           </div>

           {activeTab === 'chat' && (
             <div className="p-4 border-t border-gray-700 bg-gray-900 flex mt-auto items-center shrink-0 gap-2">
                 <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-grow p-3 bg-gray-800 border border-gray-600 rounded-xl outline-none text-sm text-white focus:border-peach-500 placeholder-gray-500 transition-colors" 
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                 />
                 <button onClick={handleSendMessage} className="bg-peach-600 hover:bg-peach-700 text-white p-3 rounded-xl font-medium text-sm flex items-center justify-center transition-colors shadow-lg">
                   <SendIcon className="w-5 h-5" />
                 </button>
             </div>
           )}
        </div>
      </div>
    );
  }

  // Calculate Dates/Slots
  const upcomingDays = getNext7Days();
  const timeSlots = generateTimeSlots(selectedDay);
  const selectedRoomForBooking = rooms.find(r => r.id === bookingRoomId);

  return (
    <div>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-md">Live Cam Rooms</h1>
          <p className="text-gray-400">10 Exclusive High-Quality Rooms. Book yours today.</p>
        </div>
        <button 
             onClick={() => setShowBuyTokens(true)}
             className="bg-peach-600 hover:bg-peach-700 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-peach-900/20 flex items-center transition-all"
           >
             <DollarSign className="w-4 h-4 mr-1" /> Buy Tokens
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {rooms.map((room) => {
          const liveHost = getCurrentHostName(room);
          const userIsScheduled = isUserScheduledNow(room);
          
          return (
            <div key={room.id} className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all group border border-gray-700">
              <div className="h-44 bg-gray-900 relative flex items-center justify-center border-b border-gray-700">
                <Video className="text-gray-700 w-12 h-12" />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">Room {room.id}</div>
                {liveHost && <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] px-2 py-1 rounded animate-pulse font-bold tracking-wider">LIVE</div>}
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all cursor-pointer" onClick={() => handleJoinRoom(room)}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-peach-600 text-white px-5 py-2 rounded-full font-bold shadow-lg transform scale-90 group-hover:scale-100 transition-transform">Enter Room</span>
                    </div>
                </div>
              </div>
              <div className="p-5 text-center">
                {liveHost ? (
                  <div className="mb-4">
                    <p className="text-sm font-bold text-gray-100 truncate">{liveHost}</p>
                    <div className="text-xs text-peach-500 mt-1 font-bold">{room.viewers} Viewers</div>
                  </div>
                ) : (
                  <div className="mb-4 text-sm text-gray-500 italic">No Host Online</div>
                )}
                
                {userIsScheduled ? (
                   <button onClick={() => handleJoinRoom(room)} className="w-full border border-green-500 text-green-500 bg-green-500/10 font-bold py-2 rounded-lg text-sm hover:bg-green-500 hover:text-white transition-colors">Start Stream</button>
                ) : (
                  user?.isVerified && (
                    <button onClick={() => openBookingModal(room.id)} className="w-full border border-gray-600 text-gray-400 hover:border-peach-500 hover:text-peach-500 hover:bg-peach-500/10 font-bold py-2 rounded-lg text-sm transition-all">Book Slot</button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
           <div className="bg-gray-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-gray-700">
              <div className="bg-peach-600 p-6 text-white flex justify-between items-center shrink-0">
                 <div>
                    <h2 className="text-2xl font-bold flex items-center"><Calendar className="mr-3" /> Book Room #{bookingRoomId}</h2>
                    <p className="text-peach-100 text-sm mt-1">Select 2-hour blocks. Rate: ${getSlotPrice().toFixed(2)}/block.</p>
                 </div>
                 <button onClick={() => setShowBookingModal(false)}><X className="w-6 h-6 hover:rotate-90 transition-transform" /></button>
              </div>

              {generatedCode ? (
                <div className="p-12 text-center">
                  <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Key className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-100 mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-400 mb-8">You have successfully reserved your slots.</p>
                  
                  <div className="bg-gray-900 p-8 rounded-2xl inline-block mb-8 border border-gray-700">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-3 tracking-wider">Your Live Stream Key (BunnyCDN)</p>
                    <p className="text-4xl font-mono font-bold text-peach-500 tracking-wider select-all">{generatedCode}</p>
                  </div>
                  
                  <p className="text-sm text-red-400 font-bold mb-8 flex justify-center items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" /> SAVE THIS KEY! Enter it in OBS to go live.
                  </p>
                  
                  <button onClick={() => setShowBookingModal(false)} className="bg-gray-700 hover:bg-gray-600 text-white px-10 py-3 rounded-full font-bold transition-colors">
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex overflow-x-auto bg-gray-900 p-3 space-x-3 shrink-0 border-b border-gray-700">
                    {upcomingDays.map((date, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDay(index)}
                        className={`flex-shrink-0 px-5 py-4 rounded-xl flex flex-col items-center min-w-[90px] transition-all ${selectedDay === index ? 'bg-gray-800 text-peach-500 border border-peach-500/50 shadow-lg' : 'text-gray-500 hover:bg-gray-800 border border-transparent'}`}
                      >
                        <span className="text-xs font-bold uppercase mb-1">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className="text-xl font-bold">{date.getDate()}</span>
                      </button>
                    ))}
                  </div>

                  <div className="p-6 overflow-y-auto bg-gray-800 flex-grow">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {timeSlots.map((slot, index) => {
                          const isBooked = selectedRoomForBooking?.bookedSlots.some(bs => bs.startTime === slot.start);
                          const isSelected = selectedSlots.includes(slot.start);
                          return (
                            <button
                              key={index}
                              disabled={isBooked}
                              onClick={() => toggleSlotSelection(slot.start)}
                              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${isBooked ? 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed' : isSelected ? 'bg-peach-600 border-peach-600 text-white shadow-lg transform scale-105' : 'bg-gray-800 border-gray-600 hover:border-peach-500/50 hover:bg-gray-700 text-gray-300'}`}
                            >
                              <Clock className={`w-5 h-5 mb-2 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                              <span className="font-bold text-sm">{slot.label}</span>
                              <span className="text-xs mt-1 font-medium">{isBooked ? 'Reserved' : isSelected ? 'Selected' : `$${getSlotPrice().toFixed(2)}`}</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  <div className="bg-gray-900 border-t border-gray-800 p-6 shrink-0 flex justify-between items-center">
                    <div>
                        <p className="text-xl font-bold text-gray-200">Total: <span className="text-peach-500">${(selectedSlots.length * getSlotPrice()).toFixed(2)}</span></p>
                        <p className="text-xs text-gray-500 mt-1">Cancel up to 6hrs before for refund.</p>
                    </div>
                    <button 
                        disabled={selectedSlots.length === 0}
                        onClick={submitBooking}
                        className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center transition-all ${selectedSlots.length === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-peach-600 hover:bg-peach-700'}`}
                    >
                        <CheckCircle className="w-5 h-5 mr-2" /> Pay & Book
                    </button>
                  </div>
                </>
              )}
           </div>
        </div>
      )}

      {/* Buy Tokens Modal (Styled for dark theme) */}
      {showBuyTokens && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
             <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-8 border border-gray-200">
                 <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Buy Tokens</h2>
                 {purchaseStep === 'input' ? (
                   <>
                    <div className="mb-6">
                      <label className="text-slate-600 text-sm font-bold mb-2 block">Amount of Tokens</label>
                      <input type="number" value={tokensToBuy} onChange={(e) => setTokensToBuy(Number(e.target.value))} className="w-full bg-slate-50 border border-gray-300 rounded-xl p-4 text-slate-800 text-center text-xl font-bold focus:border-peach-500 outline-none" />
                      <p className="text-center text-xs text-gray-400 mt-2">10 Tokens = $1.00 USD</p>
                    </div>
                    <button onClick={() => { if(tokensToBuy < 10) return alert("Min 10 Tokens"); setPurchaseStep('confirm'); }} className="bg-peach-600 hover:bg-peach-700 text-white w-full py-4 rounded-xl font-bold shadow-lg shadow-peach-900/20 transition-all">
                        Proceed to Checkout
                    </button>
                   </>
                 ) : (
                    <>
                      <PayPalButton 
                          key={tokensToBuy}
                          amount={tokensToBuy / 10} 
                          description={`${tokensToBuy} Tokens`}
                          customId={user?.id}
                          onSuccess={handleBuyTokensSuccess} 
                      />
                      <button onClick={() => setPurchaseStep('input')} className="mt-4 w-full text-gray-400 hover:text-gray-600 font-bold text-sm">Back</button>
                    </>
                 )}
                 <button onClick={() => setShowBuyTokens(false)} className="mt-2 w-full text-gray-400 hover:text-gray-600 font-bold text-sm">Close</button>
             </div>
          </div>
      )}
    </div>
  );
};