import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { Wrench, X, Shield, Crown, Trash, Ban, AlertTriangle, Coins, Search, RefreshCw, Save } from 'lucide-react';

interface DevToolsProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const DevTools: React.FC<DevToolsProps> = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [editTokens, setEditTokens] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Access Control: Only Owner can see/open.
  // Exception: If NO user is logged in, show button to create Owner for initial setup.
  const canAccess = !user || user.role === UserRole.OWNER;

  useEffect(() => {
    if (isOpen) {
      refreshUserList();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedUserId) {
        const target = allUsers.find(u => u.id === selectedUserId);
        if (target) setEditTokens(target.tokens);
    }
  }, [selectedUserId, allUsers]);

  const refreshUserList = () => {
    const stored = localStorage.getItem('peachy_users');
    if (stored) {
      setAllUsers(JSON.parse(stored));
    } else {
        setAllUsers([]);
    }
  };

  // Helper to save updates to localStorage and state
  const saveUserUpdates = (updatedUser: User) => {
    const newUsers = allUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem('peachy_users', JSON.stringify(newUsers));
    setAllUsers(newUsers);

    // If we modified the currently logged in user, update session
    if (user && user.id === updatedUser.id) {
        setUser(updatedUser);
        localStorage.setItem('peachy_session', JSON.stringify(updatedUser));
    }
  };

  const loginAsOwner = () => {
    // 1. Get current users or initialize empty array
    const storedUsers = localStorage.getItem('peachy_users');
    let currentUsers: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    // 2. Check if RootAdmin already exists to prevent duplicates
    let ownerUser = currentUsers.find(u => u.role === UserRole.OWNER && u.username === 'RootAdmin');

    if (!ownerUser) {
        ownerUser = {
            id: `owner-${Date.now()}`,
            username: `RootAdmin`,
            email: `root@peachy.local`,
            realName: 'System Root',
            role: UserRole.OWNER,
            avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=ROOT`,
            bannerUrl: 'https://picsum.photos/1200/400?grayscale',
            bio: `Root Administrator`,
            balance: 1000000,
            tokens: 1000000,
            isVerified: true
        };
        currentUsers.push(ownerUser);
        localStorage.setItem('peachy_users', JSON.stringify(currentUsers));
    }

    // 3. Update State Reactively (No Reload)
    setAllUsers(currentUsers); // Update list in DevTool
    setUser(ownerUser);        // Log the user in globally
    localStorage.setItem('peachy_session', JSON.stringify(ownerUser));
  };

  const modifyTokens = (amount: number) => {
    const target = allUsers.find(u => u.id === selectedUserId);
    if (!target) return;
    const newAmount = Math.max(0, target.tokens + amount);
    saveUserUpdates({ ...target, tokens: newAmount });
    setEditTokens(newAmount);
  };
  
  const setExactTokens = () => {
    const target = allUsers.find(u => u.id === selectedUserId);
    if (!target) return;
    saveUserUpdates({ ...target, tokens: editTokens });
  };

  const setRole = (role: UserRole) => {
    const target = allUsers.find(u => u.id === selectedUserId);
    if (!target) return;
    saveUserUpdates({ ...target, role });
  };

  const toggleStatus = (field: 'isBanned' | 'isSuspended') => {
    const target = allUsers.find(u => u.id === selectedUserId);
    if (!target) return;
    saveUserUpdates({ ...target, [field]: !target[field] });
  };

  const clearAllData = () => {
      if(window.confirm("CRITICAL: Wipe entire database? This will log everyone out.")) {
          localStorage.clear();
          setUser(null);
          setAllUsers([]);
          setIsOpen(false);
          alert("Database wiped. Please refresh manually if needed, or simply log in again.");
      }
  };

  if (!canAccess) return null;

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-[9999] bg-gray-900 text-red-500 p-3 rounded-full shadow-2xl border-2 border-red-600 hover:bg-gray-800 transition-all hover:scale-110 group"
        title="Root Admin Tools"
      >
        <Wrench className="w-6 h-6 group-hover:rotate-90 transition-transform" />
      </button>
    );
  }

  // View for Non-Logged In User (Emergency Access)
  if (!user) {
      return (
        <div className="fixed bottom-4 left-4 z-[9999] bg-gray-900 border-2 border-red-600 rounded-xl shadow-2xl p-6 w-80 animate-fadeIn text-center">
            <h3 className="font-bold text-red-500 mb-4 text-xl">Restricted Access</h3>
            <p className="text-gray-400 text-sm mb-6">Owner privileges required.</p>
            <button onClick={loginAsOwner} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg mb-2">
                Initialize Owner Account
            </button>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 text-sm hover:text-white underline">Close</button>
        </div>
      );
  }

  // Main Admin Panel
  const selectedUser = allUsers.find(u => u.id === selectedUserId);
  const filteredUsers = allUsers.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border-2 border-red-600 rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
                <div className="bg-red-600 p-2 rounded-lg">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Root Administration</h2>
                    <p className="text-xs text-red-400 font-mono">ACCESS_LEVEL: OWNER</p>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        <div className="flex flex-grow overflow-hidden">
            {/* User List Sidebar */}
            <div className="w-1/3 border-r border-gray-700 flex flex-col bg-gray-900/50">
                <div className="p-3 border-b border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-9 p-2 text-sm text-white focus:border-red-500 outline-none"
                        />
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto p-2 space-y-2">
                    {filteredUsers.map(u => (
                        <button 
                            key={u.id}
                            onClick={() => setSelectedUserId(u.id)}
                            className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${selectedUserId === u.id ? 'bg-red-900/30 border border-red-500/50' : 'hover:bg-gray-800 border border-transparent'}`}
                        >
                            <div className="flex items-center overflow-hidden">
                                <img src={u.avatarUrl} className="w-8 h-8 rounded-full mr-3 bg-gray-700" alt="" />
                                <div className="truncate">
                                    <div className={`font-bold text-sm ${selectedUserId === u.id ? 'text-red-400' : 'text-gray-300'}`}>{u.username}</div>
                                    <div className="text-[10px] text-gray-500">{u.role}</div>
                                </div>
                            </div>
                            {u.isBanned && <Ban className="w-4 h-4 text-red-500" />}
                        </button>
                    ))}
                    {filteredUsers.length === 0 && <div className="text-center text-gray-500 text-sm mt-4">No users found.</div>}
                </div>
            </div>

            {/* Editor Panel */}
            <div className="w-2/3 p-6 overflow-y-auto bg-gray-800">
                {selectedUser ? (
                    <div className="space-y-8">
                        {/* User Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <img src={selectedUser.avatarUrl} className="w-16 h-16 rounded-full border-2 border-gray-600" alt="" />
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{selectedUser.username}</h3>
                                    <p className="text-gray-400 text-sm">{selectedUser.email}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="px-2 py-0.5 bg-gray-700 rounded text-xs font-mono text-gray-300">{selectedUser.id}</span>
                                        {selectedUser.isBanned && <span className="px-2 py-0.5 bg-red-600 text-white rounded text-xs font-bold">BANNED</span>}
                                        {selectedUser.isSuspended && <span className="px-2 py-0.5 bg-orange-600 text-white rounded text-xs font-bold">SUSPENDED</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Token Management */}
                        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                            <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center">
                                <Coins className="w-4 h-4 mr-2" /> Token Economy
                            </h4>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-3xl font-bold text-yellow-500">{selectedUser.tokens.toLocaleString()} <span className="text-sm text-gray-500">Tk</span></div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                                <button onClick={() => modifyTokens(100)} className="bg-green-900/30 text-green-400 border border-green-800 p-2 rounded hover:bg-green-900/50 font-bold">+100</button>
                                <button onClick={() => modifyTokens(1000)} className="bg-green-900/30 text-green-400 border border-green-800 p-2 rounded hover:bg-green-900/50 font-bold">+1k</button>
                                <button onClick={() => modifyTokens(-100)} className="bg-red-900/30 text-red-400 border border-red-800 p-2 rounded hover:bg-red-900/50 font-bold">-100</button>
                                <button onClick={() => modifyTokens(-1000)} className="bg-red-900/30 text-red-400 border border-red-800 p-2 rounded hover:bg-red-900/50 font-bold">-1k</button>
                            </div>
                            <div className="flex gap-2">
                                <input 
                                    type="number" 
                                    value={editTokens} 
                                    onChange={e => setEditTokens(Number(e.target.value))}
                                    className="bg-gray-800 border border-gray-600 rounded p-2 flex-grow text-white"
                                />
                                <button onClick={setExactTokens} className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded font-bold">Set Exact</button>
                            </div>
                        </div>

                        {/* Role & Membership */}
                        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                             <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center">
                                <Crown className="w-4 h-4 mr-2" /> Membership Level
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => setRole(UserRole.USER)}
                                    className={`p-3 rounded border text-sm font-bold transition-all ${selectedUser.role === UserRole.USER ? 'bg-white text-black border-white' : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-400'}`}
                                >
                                    Standard User
                                </button>
                                <button 
                                    onClick={() => setRole(UserRole.VERIFIED)}
                                    className={`p-3 rounded border text-sm font-bold transition-all ${selectedUser.role === UserRole.VERIFIED ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-blue-500'}`}
                                >
                                    Verified
                                </button>
                                <button 
                                    onClick={() => setRole(UserRole.VIP)}
                                    className={`p-3 rounded border text-sm font-bold transition-all ${selectedUser.role === UserRole.VIP ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-yellow-500'}`}
                                >
                                    VIP Status
                                </button>
                                <button 
                                    onClick={() => setRole(UserRole.DIAMOND_VIP)}
                                    className={`p-3 rounded border text-sm font-bold transition-all ${selectedUser.role === UserRole.DIAMOND_VIP ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-purple-600'}`}
                                >
                                    Diamond VIP
                                </button>
                            </div>
                        </div>

                        {/* Moderation Zone */}
                        <div className="bg-red-950/20 p-6 rounded-xl border border-red-900/50">
                             <h4 className="text-sm font-bold text-red-500 uppercase mb-4 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-2" /> Danger Zone
                            </h4>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => toggleStatus('isSuspended')}
                                    className={`flex-1 py-3 px-4 rounded font-bold border-2 transition-all ${selectedUser.isSuspended ? 'bg-orange-600 text-white border-orange-600' : 'bg-transparent text-orange-500 border-orange-500 hover:bg-orange-900/30'}`}
                                >
                                    {selectedUser.isSuspended ? 'Unsuspend' : 'Suspend Account'}
                                </button>
                                <button 
                                    onClick={() => toggleStatus('isBanned')}
                                    className={`flex-1 py-3 px-4 rounded font-bold border-2 transition-all ${selectedUser.isBanned ? 'bg-red-600 text-white border-red-600' : 'bg-transparent text-red-500 border-red-500 hover:bg-red-900/30'}`}
                                >
                                    {selectedUser.isBanned ? 'Lift Ban' : 'Ban User (IP)'}
                                </button>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <Search className="w-16 h-16 mb-4 opacity-20" />
                        <p>Select a user to manage their account.</p>
                    </div>
                )}
            </div>
        </div>
        <div className="mt-4 flex justify-between px-2">
            <button onClick={clearAllData} className="flex items-center text-red-500 hover:text-red-400 text-xs font-bold">
                <Trash className="w-3 h-3 mr-1" /> WIPE DATABASE
            </button>
            <div className="text-gray-500 text-xs">v1.0.1-ROOT-STABLE</div>
        </div>
      </div>
    </div>
  );
};