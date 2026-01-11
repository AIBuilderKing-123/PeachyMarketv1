import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { Send, Users, UserPlus, MessageCircle, ShieldCheck, ArrowLeft, MoreVertical } from 'lucide-react';
import { SEO } from '../components/SEO';

interface MessagesProps {
  user: User;
}

export const Messages: React.FC<MessagesProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'dm'>('global');
  const [activeDm, setActiveDm] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  
  // Empty State for Friends
  const [friends, setFriends] = useState<any[]>([]);
  
  // Chat History State
  const [chatHistory, setChatHistory] = useState<{user: string, text: string, isSystem?: boolean, avatar?: string}[]>([
    { user: 'System', text: 'Welcome to the chat! Please follow the rules.', isSystem: true }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, activeTab]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    try {
        // Simulate network
        const success = Math.random() > 0.05; // 95% success
        
        if (!success) {
            throw new Error("Message failed to send");
        }

        // Append new message to chat
        setChatHistory([...chatHistory, {
            user: user.username,
            text: message,
            avatar: user.avatarUrl
        }]);
        
        setMessage('');
    } catch (err) {
        alert("Error: Message could not be delivered. Please check your internet connection.");
    }
  };

  // Mobile View Logic:
  // If activeDm is selected, show Chat Area (hide Sidebar).
  // If no activeDm (or global tab), check screen size.
  // Note: Global chat treats 'activeDm' as null but 'activeTab' as 'global'.
  
  const showSidebar = !activeDm && activeTab === 'dm' || (window.innerWidth < 768 && !activeDm && activeTab === 'global') ? true : false;
  
  // Actually, simpler logic:
  // Mobile: Show List IF (Tab is DM AND No Active DM) OR (Tab is Global - wait global is a chatroom).
  // Let's refine:
  // 1. Sidebar is always visible on Desktop.
  // 2. On Mobile, Sidebar is visible ONLY if we are NOT inside a specific chat.
  
  // We need a way to "Go Back" on mobile.

  return (
    <div className="h-[calc(100vh-140px)] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 flex flex-col md:flex-row">
      <SEO title="Messages & Community" description="Chat with verified users in our global chatroom or send private direct messages." />
      
      {/* SIDEBAR - List of Chats */}
      {/* Hidden on Mobile if a chat is Open */}
      <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col bg-gray-50 ${activeDm || activeTab === 'global' ? 'hidden md:flex' : 'flex'}`}>
         <div className="p-4 border-b border-gray-200 bg-white">
           <div className="flex items-center mb-4 px-1">
              <div className="w-10 h-10 rounded-full bg-peach-100 flex items-center justify-center mr-3 border border-peach-200 shrink-0">
                  <img src={user.avatarUrl} alt="Me" className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="overflow-hidden">
                  <h3 className="font-bold text-slate-800 text-sm truncate">{user.username}</h3>
                  <div className="flex items-center text-xs text-green-600 font-bold">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                  </div>
              </div>
           </div>

           <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg">
             <button 
               onClick={() => { setActiveTab('global'); setActiveDm(null); }}
               className={`flex-1 text-sm font-bold py-1.5 rounded-md transition-all ${activeTab === 'global' ? 'bg-white shadow text-slate-800' : 'text-gray-500 hover:text-slate-700'}`}
             >
               Global
             </button>
             <button 
               onClick={() => setActiveTab('dm')}
               className={`flex-1 text-sm font-bold py-1.5 rounded-md transition-all ${activeTab === 'dm' ? 'bg-white shadow text-slate-800' : 'text-gray-500 hover:text-slate-700'}`}
             >
               Friends
             </button>
           </div>
         </div>
         
         <div className="flex-grow overflow-y-auto">
            {activeTab === 'global' ? (
               // On Desktop this is just a placeholder in sidebar, on mobile the sidebar IS the view logic
               // Wait, Global Chat IS the main view. 
               // If activeTab is Global, we want to show the ChatArea, NOT this placeholder sidebar on Mobile.
               // So on Mobile, if activeTab is Global, this Sidebar should be HIDDEN.
               <div className="p-8 text-center text-gray-500 text-sm flex flex-col items-center justify-center h-full">
                 <div className="w-16 h-16 bg-peach-50 rounded-full flex items-center justify-center mb-3">
                    <Users className="w-8 h-8 text-peach-400" />
                 </div>
                 <p className="font-bold text-slate-600">Global Room</p>
                 <p className="text-xs text-slate-400 mt-2">Select to join conversation</p>
              </div>
            ) : (
              <div>
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">Friends List</div>
                {friends.length === 0 && (
                    <div className="p-6 text-center text-gray-400 text-sm">
                        No friends added yet.
                    </div>
                )}
                {friends.map(friend => (
                  <div 
                    key={friend.id} 
                    onClick={() => setActiveDm(friend.id)}
                    className={`flex items-center px-4 py-3 cursor-pointer hover:bg-white transition-colors ${activeDm === friend.id ? 'bg-white border-l-4 border-peach-500' : 'border-l-4 border-transparent'}`}
                  >
                    <div className="relative">
                      <img src={friend.avatar} className="w-10 h-10 rounded-full object-cover bg-gray-300" alt={friend.name} />
                      {friend.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
                    </div>
                    <div className="ml-3 overflow-hidden">
                      <div className="text-sm font-bold text-slate-800 truncate">{friend.name}</div>
                      <div className="text-xs text-gray-500 truncate">Click to chat...</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
         </div>
         
         <div className="p-4 border-t border-gray-200 bg-white">
           <button className="w-full flex items-center justify-center py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-slate-600 hover:bg-gray-50 transition shadow-sm">
             <UserPlus className="w-4 h-4 mr-2" /> Find Friend
           </button>
         </div>
      </div>

      {/* CHAT AREA */}
      {/* On Mobile: Hidden if NO activeDm AND Tab is NOT Global */}
      {/* On Desktop: Always Flex */}
      <div className={`flex-grow flex-col bg-white ${(!activeDm && activeTab !== 'global') ? 'hidden md:flex' : 'flex'}`}>
         
         {/* Chat Header */}
         <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-10 shrink-0">
            <div className="flex items-center">
                {/* Mobile Back Button */}
                <button 
                    onClick={() => { setActiveDm(null); if(activeTab === 'global') setActiveTab('dm'); }} // Back logic
                    className="md:hidden mr-3 p-2 text-slate-500 hover:bg-slate-100 rounded-full"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <h2 className="font-bold text-slate-800 flex items-center text-sm md:text-base">
                {activeTab === 'global' ? (
                    <>
                        <div className="w-8 h-8 rounded-full bg-peach-100 flex items-center justify-center mr-2 text-peach-500"><MessageCircle className="w-4 h-4" /></div>
                        Global Chat
                    </>
                ) : (
                    <>
                        <img src={friends.find(f => f.id === activeDm)?.avatar} className="w-8 h-8 rounded-full mr-2 bg-gray-200" alt="" />
                        {friends.find(f => f.id === activeDm)?.name || 'Select a user'}
                    </>
                )}
                </h2>
            </div>
            
            {activeTab === 'global' ? (
                <span className="text-[10px] md:text-xs bg-peach-50 text-peach-600 border border-peach-100 px-2 py-1 rounded-full font-bold whitespace-nowrap">Verified Only</span>
            ) : (
                <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
            )}
         </div>

         {/* Messages List */}
         <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-hide">
            {activeTab === 'dm' && !activeDm ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <MessageCircle className="w-16 h-16 mb-2 opacity-20" />
                    <p>Select a friend to start chatting</p>
                </div>
            ) : (
                <>
                {chatHistory.map((msg, idx) => {
                    const isMe = msg.user === user.username;
                    return (
                        <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fadeIn`}>
                            <div className={`flex items-end max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                {!isMe && !msg.isSystem && (
                                    <img src={msg.avatar} alt={msg.user} className="w-6 h-6 md:w-8 md:h-8 rounded-full mb-1 mx-2 shadow-sm shrink-0" />
                                )}
                                
                                <div className={`px-3 py-2 md:px-4 md:py-2.5 shadow-sm relative text-sm ${
                                    msg.isSystem ? 'bg-white text-slate-600 border border-gray-200 w-full text-center rounded-xl self-center mb-2 text-xs' :
                                    isMe ? 'bg-peach-500 text-white rounded-2xl rounded-tr-sm' : 
                                    'bg-white text-slate-800 border border-gray-100 rounded-2xl rounded-tl-sm'
                                }`}>
                                    {msg.isSystem && <span className="text-xs font-bold text-peach-500 block mb-1">SYSTEM</span>}
                                    {!isMe && !msg.isSystem && <span className="text-[10px] md:text-xs font-bold text-peach-600 block mb-1">{msg.user}</span>}
                                    <p className="leading-relaxed break-words">{msg.text}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={chatEndRef} />
                </>
            )}
         </div>

         {/* Input Area */}
         <div className="p-3 md:p-4 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                disabled={activeTab === 'dm' && !activeDm}
                placeholder={activeTab === 'dm' && !activeDm ? "Select a chat..." : "Type message..."}
                className="flex-grow p-3 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-peach-300 transition-all text-sm text-gray-900 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button 
                onClick={handleSend}
                disabled={activeTab === 'dm' && !activeDm}
                className="p-3 bg-peach-500 text-white rounded-full hover:bg-peach-600 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 flex items-center justify-center shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
         </div>
      </div>
    </div>
  );
};