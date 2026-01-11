import React, { useState, useEffect } from 'react';
import { Users, Activity, Edit2, Save, AlertTriangle, Ban, X, Shield, RefreshCw } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'stats'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [managingUser, setManagingUser] = useState<User | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Check Permissions
  useEffect(() => {
    const session = localStorage.getItem('peachy_session');
    if (!session) { navigate('/login'); return; }
    const user = JSON.parse(session);
    if (user.role !== 'ADMIN' && user.role !== 'OWNER' && user.email !== 'thepeachymarkets@gmail.com') {
      navigate('/');
    }
  }, []);

  const fetchUsers = async () => {
      try {
          const res = await fetch('/api/admin/users');
          const data = await res.json();
          setUsers(Array.isArray(data) ? data : []);
      } catch (e) {
          console.error("Failed to fetch users");
      }
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const openManageModal = (user: User) => {
      setManagingUser(user);
      setAdminNoteInput(user.adminNotes || '');
  };

  // ACTION HANDLER
  const handleUserAction = async (action: 'suspend' | 'ban' | 'promote' | 'notes', payload?: any) => {
      if (!managingUser) return;
      
      let updatedFields: Partial<User> = {};

      switch (action) {
          case 'suspend':
              updatedFields = { isSuspended: !managingUser.isSuspended };
              break;
          case 'ban':
              updatedFields = { isBanned: !managingUser.isBanned };
              break;
          case 'promote':
              updatedFields = { role: payload.role };
              break;
          case 'notes':
              updatedFields = { adminNotes: payload.notes };
              break;
      }

      // API CALL
      try {
        const response = await fetch('/api/user/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: managingUser.id, ...updatedFields })
        });

        const data = await response.json();
        
        // Update Local State instantly
        setManagingUser(data);
        setUsers(prev => prev.map(u => u.id === data.id ? data : u));

        alert(`Action '${action}' successful.`);
      } catch (err) {
        alert("Failed to update user on server.");
      }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-100px)]">
       <SEO title="Admin Portal" description="Restricted Access" />
       
       <div className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-2 h-fit">
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium mb-1 ${activeTab === 'users' ? 'bg-peach-50 text-peach-700' : 'text-slate-600'}`}>
              <Users className="w-4 h-4 mr-3" /> Member Management
          </button>
          <button onClick={() => setActiveTab('stats')} className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium mb-1 ${activeTab === 'stats' ? 'bg-peach-50 text-peach-700' : 'text-slate-600'}`}>
              <Activity className="w-4 h-4 mr-3" /> Statistics
          </button>
       </div>

       <div className="flex-grow">
          {activeTab === 'users' ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-slate-800">Members ({users.length})</h3>
                  <button onClick={fetchUsers} className="text-blue-500 hover:text-blue-700"><RefreshCw className="w-4 h-4" /></button>
               </div>
               
               {users.length === 0 ? (
                   <div className="p-8 text-center text-gray-500">Loading users from server...</div>
               ) : (
               <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500">
                        <tr>
                          <th className="p-4">User</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">Balance</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                         {users.map(user => (
                             <tr key={user.id} className={`border-b border-gray-50 hover:bg-gray-50 ${user.isBanned ? 'bg-red-50' : ''}`}>
                                 <td className="p-4 font-bold text-slate-800 flex items-center">
                                     <img src={user.avatarUrl} className="w-8 h-8 rounded-full mr-2 object-cover" />
                                     <div>
                                         <div>{user.username}</div>
                                         <div className="text-[10px] text-gray-400 font-normal">{user.email}</div>
                                     </div>
                                     {user.isBanned && <span className="ml-2 text-[10px] bg-red-600 text-white px-1 rounded">BANNED</span>}
                                 </td>
                                 <td className="p-4 text-sm">
                                     <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                         user.role === 'OWNER' ? 'bg-red-100 text-red-800' :
                                         user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                         user.role === 'DIAMOND_VIP' ? 'bg-blue-100 text-blue-800' :
                                         'bg-gray-100 text-gray-600'
                                     }`}>{user.role}</span>
                                 </td>
                                 <td className="p-4 text-sm font-mono">${user.balance.toFixed(2)}</td>
                                 <td className="p-4 text-right">
                                     <button onClick={() => openManageModal(user)} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">Manage</button>
                                 </td>
                             </tr>
                         ))}
                      </tbody>
                   </table>
               </div>
               )}
            </div>
          ) : (
             <div className="p-8 bg-white rounded-xl text-center text-gray-500">
                 <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                 <h3 className="text-xl font-bold text-gray-400">Statistics Panel</h3>
                 <p className="text-sm">Traffic analytics and revenue charts coming soon.</p>
             </div>
          )}
       </div>

       {managingUser && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
               <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                   <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                       <h3 className="font-bold flex items-center text-slate-800"><Edit2 className="w-4 h-4 mr-2" /> Manage {managingUser.username}</h3>
                       <button onClick={() => setManagingUser(null)}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
                   </div>
                   <div className="p-6 space-y-6">
                       
                       {/* Role Management */}
                       <div>
                           <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Change Role</p>
                           <div className="grid grid-cols-3 gap-2">
                               <button 
                                onClick={() => handleUserAction('promote', { role: 'VERIFIED' })} 
                                className={`text-xs border p-2 rounded font-bold transition-colors ${managingUser.role === 'VERIFIED' ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50 text-slate-600'}`}
                               >
                                Verified
                               </button>
                               <button 
                                onClick={() => handleUserAction('promote', { role: 'VIP' })} 
                                className={`text-xs border p-2 rounded font-bold transition-colors ${managingUser.role === 'VIP' ? 'bg-yellow-500 text-white border-yellow-500' : 'hover:bg-gray-50 text-slate-600'}`}
                               >
                                VIP
                               </button>
                               <button 
                                onClick={() => handleUserAction('promote', { role: 'ADMIN' })} 
                                className={`text-xs border p-2 rounded font-bold transition-colors ${managingUser.role === 'ADMIN' ? 'bg-purple-600 text-white border-purple-600' : 'hover:bg-red-50 text-red-600 border-red-200'}`}
                               >
                                Admin
                               </button>
                           </div>
                       </div>

                       {/* Punishments */}
                       <div className="grid grid-cols-2 gap-3">
                           <button onClick={() => handleUserAction('suspend')} className={`p-3 rounded font-bold border transition-all flex items-center justify-center ${managingUser.isSuspended ? 'bg-orange-500 text-white border-orange-500' : 'border-orange-500 text-orange-500 hover:bg-orange-50'}`}>
                               <AlertTriangle className="w-4 h-4 mr-2" /> {managingUser.isSuspended ? 'Unsuspend' : 'Suspend'}
                           </button>
                           <button onClick={() => handleUserAction('ban')} className={`p-3 rounded font-bold border transition-all flex items-center justify-center ${managingUser.isBanned ? 'bg-red-600 text-white border-red-600' : 'border-red-600 text-red-600 hover:bg-red-50'}`}>
                               <Ban className="w-4 h-4 mr-2" /> {managingUser.isBanned ? 'Unban' : 'Ban User'}
                           </button>
                       </div>
                       
                       {/* Notes */}
                       <div>
                           <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Admin Notes</label>
                           <div className="flex gap-2">
                               <input value={adminNoteInput} onChange={e => setAdminNoteInput(e.target.value)} className="border border-gray-300 p-2 rounded w-full text-sm outline-none focus:border-peach-500 text-gray-800" placeholder="Internal notes..." />
                               <button onClick={() => handleUserAction('notes', { notes: adminNoteInput })} className="bg-slate-800 text-white p-2 rounded hover:bg-slate-700 transition-colors"><Save className="w-4 h-4" /></button>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};