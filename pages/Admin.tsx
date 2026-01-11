import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, Activity, MessageSquare, ShieldAlert, CheckCircle, XCircle, AlertTriangle, ExternalLink, Image, X, ZoomIn, Check, Ban, Lock, Edit2, Save, UserCheck, Shield } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';

// Start with empty/zero data
const TRAFFIC_DATA = [
  { name: 'Mon', visits: 120 },
  { name: 'Tue', visits: 200 },
  { name: 'Wed', visits: 150 },
  { name: 'Thu', visits: 300 },
  { name: 'Fri', visits: 250 },
  { name: 'Sat', visits: 400 },
  { name: 'Sun', visits: 380 },
];

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'verification' | 'users' | 'stats' | 'reports' | 'support'>('stats');
  
  // Data Lists
  const [verifications, setVerifications] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Management Modal State
  const [managingUser, setManagingUser] = useState<User | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Image Modal State
  const [viewImage, setViewImage] = useState<string | null>(null);

  // Fetch Users
  const fetchUsers = async () => {
      try {
          const res = await fetch('/api/admin/users');
          if (res.ok) {
              const data = await res.json();
              setUsers(data);
          }
      } catch (e) {
          console.error("Failed to fetch users");
      }
  };

  useEffect(() => {
    if (activeTab === 'users') {
        fetchUsers();
    }
  }, [activeTab]);

  // Open Manage Modal
  const openManageModal = (user: User) => {
      setManagingUser(user);
      setAdminNoteInput(user.adminNotes || '');
  };

  // API Actions
  const handleUserAction = async (action: 'suspend' | 'ban' | 'promote' | 'notes', payload?: any) => {
      if (!managingUser) return;
      
      try {
          let url = `/api/admin/user/${managingUser.id}/${action}`;
          let body = payload || {};

          // For promote, confirm only Owner can do it is handled on UI, server also checks? Server logic allows call.
          // Owner Check in Frontend
          const currentUserJson = localStorage.getItem('peachy_session');
          const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
          
          if (action === 'promote') {
              if (currentUser?.role !== 'OWNER' && currentUser?.email !== 'thepeachymarkets@gmail.com') {
                  alert("Only the Owner can promote staff.");
                  return;
              }
          }

          const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
          });

          const data = await res.json();
          if (res.ok) {
              // Update local state
              setManagingUser(data.user);
              setUsers(prev => prev.map(u => u.id === data.user.id ? data.user : u));
              
              if (action === 'notes') alert("Notes saved.");
          } else {
              alert(data.error || "Action failed");
          }

      } catch (e) {
          console.error(e);
          alert("Connection Error");
      }
  };

  // Check if current logged in user is Owner
  const currentUserJson = localStorage.getItem('peachy_session');
  const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;
  const isOwner = currentUser?.role === UserRole.OWNER || currentUser?.email === 'thepeachymarkets@gmail.com';


  const renderContent = () => {
    switch(activeTab) {
      case 'stats':
        return (
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <h3 className="text-sm text-gray-500 font-bold uppercase">Daily Traffic</h3>
                 <p className="text-3xl font-bold text-slate-800">1,245</p>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <h3 className="text-sm text-gray-500 font-bold uppercase">Total Members</h3>
                 <p className="text-3xl font-bold text-slate-800">{users.length}</p>
               </div>
             </div>
             {/* Charts... */}
          </div>
        );
      case 'users':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[300px]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-slate-800">Member List ({users.length})</h3>
              <button onClick={fetchUsers} className="text-xs text-blue-500 font-bold">Refresh</button>
            </div>
            {users.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="bg-white text-gray-500 text-sm uppercase border-b border-gray-100">
                    <tr>
                      <th className="p-4 font-bold">Member</th>
                      <th className="p-4 font-bold">Balance</th>
                      <th className="p-4 font-bold">Role</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {users.map((user) => (
                         <tr key={user.id} className={`hover:bg-gray-50 ${user.isBanned ? 'bg-red-50' : user.isSuspended ? 'bg-orange-50' : ''}`}>
                             <td className="p-4 font-medium text-slate-800">
                                 <div className="flex items-center">
                                     <img src={user.avatarUrl} className="w-8 h-8 rounded-full mr-2" alt="" />
                                     <div>
                                         {user.username}
                                         {user.isBanned && <span className="ml-2 text-[10px] bg-red-600 text-white px-1 rounded">BANNED</span>}
                                         {user.isSuspended && <span className="ml-2 text-[10px] bg-orange-500 text-white px-1 rounded">SUSPENDED</span>}
                                         <div className="text-xs text-gray-400 font-normal">{user.email}</div>
                                     </div>
                                 </div>
                             </td>
                             <td className="p-4 text-slate-600 font-mono">${user.balance.toFixed(2)}</td>
                             <td className="p-4">
                                 <span className={`px-2 py-1 rounded text-xs font-bold ${
                                     user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                                     user.role === 'VIP' ? 'bg-yellow-100 text-yellow-700' :
                                     'bg-blue-100 text-blue-700'
                                 }`}>
                                     {user.role}
                                 </span>
                             </td>
                             <td className="p-4 text-right">
                                 <button 
                                    onClick={() => openManageModal(user)} 
                                    className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700"
                                 >
                                     Manage
                                 </button>
                             </td>
                         </tr>
                     ))}
                  </tbody>
                </table>
            ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400">
                    <Users className="w-12 h-12 mb-3 opacity-20" />
                    <p>No members found.</p>
                </div>
            )}
          </div>
        );
      default:
        return <div className="p-12 text-center text-gray-400">Select a tab</div>
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 relative">
       <SEO title="Admin Portal" description="Restricted Access Area" />
       
       {/* Sidebar Nav */}
       <div className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-2 h-fit">
          {[
            { id: 'stats', label: 'Overview & Stats', icon: Activity },
            { id: 'users', label: 'Member Management', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-colors ${
                activeTab === tab.id ? 'bg-peach-50 text-peach-700' : 'text-slate-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-3" />
              {tab.label}
            </button>
          ))}
       </div>

       {/* Main Content */}
       <div className="flex-grow">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h1>
            <p className="text-sm text-slate-500">Admin Control Panel</p>
          </div>
          {renderContent()}
       </div>

       {/* MANAGE USER MODAL */}
       {managingUser && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
               <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                   <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                       <h3 className="font-bold text-lg text-slate-800 flex items-center">
                           <Edit2 className="w-4 h-4 mr-2 text-peach-500" /> Manage User
                       </h3>
                       <button onClick={() => setManagingUser(null)} className="text-gray-400 hover:text-gray-600">
                           <X className="w-6 h-6" />
                       </button>
                   </div>
                   
                   <div className="p-6">
                       {/* User Summary */}
                       <div className="flex items-center mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                           <img src={managingUser.avatarUrl} className="w-12 h-12 rounded-full mr-4 border border-gray-300" alt="" />
                           <div>
                               <div className="font-bold text-slate-800 text-lg">{managingUser.username}</div>
                               <div className="text-xs text-gray-500">{managingUser.email}</div>
                               <div className="text-xs text-gray-400 font-mono mt-1">{managingUser.id}</div>
                           </div>
                           <div className="ml-auto text-right">
                               <div className={`text-xs font-bold px-2 py-1 rounded inline-block mb-1 ${
                                   managingUser.role === 'OWNER' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                               }`}>{managingUser.role}</div>
                           </div>
                       </div>

                       {/* Action Grid */}
                       <div className="grid grid-cols-2 gap-4 mb-6">
                           <button 
                               onClick={() => handleUserAction('suspend')}
                               className={`p-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center ${
                                   managingUser.isSuspended 
                                   ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600' 
                                   : 'bg-white text-orange-600 border-orange-200 hover:border-orange-500'
                               }`}
                           >
                               <AlertTriangle className="w-6 h-6 mb-2" />
                               {managingUser.isSuspended ? 'Unsuspend' : 'Suspend'}
                           </button>

                           <button 
                               onClick={() => handleUserAction('ban')}
                               className={`p-4 rounded-xl border-2 font-bold text-sm transition-all flex flex-col items-center justify-center ${
                                   managingUser.isBanned 
                                   ? 'bg-red-600 text-white border-red-600 hover:bg-red-700' 
                                   : 'bg-white text-red-600 border-red-200 hover:border-red-600'
                               }`}
                           >
                               <Ban className="w-6 h-6 mb-2" />
                               {managingUser.isBanned ? 'Unban' : 'Ban User'}
                           </button>
                       </div>

                       {/* Admin Notes */}
                       <div className="mb-6">
                           <label className="block text-sm font-bold text-slate-700 mb-2">Admin Notes (Private)</label>
                           <div className="flex gap-2">
                               <textarea 
                                   className="w-full p-3 border border-gray-300 rounded-lg text-sm h-20 resize-none outline-none focus:border-peach-400"
                                   placeholder="Internal notes about this user..."
                                   value={adminNoteInput}
                                   onChange={e => setAdminNoteInput(e.target.value)}
                               />
                               <button 
                                   onClick={() => handleUserAction('notes', { notes: adminNoteInput })}
                                   className="bg-slate-800 text-white p-3 rounded-lg hover:bg-slate-700"
                               >
                                   <Save className="w-5 h-5" />
                               </button>
                           </div>
                       </div>

                       {/* Owner Only: Promote */}
                       {isOwner && (
                           <div className="border-t border-gray-100 pt-6">
                               <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center">
                                   <Shield className="w-3 h-3 mr-1" /> Owner Actions
                               </h4>
                               <div className="grid grid-cols-3 gap-2">
                                   <button onClick={() => handleUserAction('promote', { role: 'VERIFIED' })} className="text-xs bg-blue-50 text-blue-700 py-2 rounded border border-blue-200 hover:bg-blue-100 font-bold">Make Verified</button>
                                   <button onClick={() => handleUserAction('promote', { role: 'VIP' })} className="text-xs bg-yellow-50 text-yellow-700 py-2 rounded border border-yellow-200 hover:bg-yellow-100 font-bold">Make VIP</button>
                                   <button onClick={() => handleUserAction('promote', { role: 'ADMIN' })} className="text-xs bg-red-50 text-red-700 py-2 rounded border border-red-200 hover:bg-red-100 font-bold">Make Admin</button>
                               </div>
                           </div>
                       )}

                   </div>
               </div>
           </div>
       )}
    </div>
  );
};