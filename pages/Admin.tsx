import React, { useState, useEffect } from 'react';
import { Users, Activity, Edit2, Save, AlertTriangle, Ban, X, Shield, RefreshCw } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';

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
          if (res.ok) {
              const data = await res.json();
              setUsers(data);
          }
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

  const handleUserAction = async (action: 'suspend' | 'ban' | 'promote' | 'notes', payload?: any) => {
      if (!managingUser) return;
      try {
          const res = await fetch(`/api/admin/user/${managingUser.id}/${action}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload || {})
          });
          const data = await res.json();
          if (res.ok) {
              setManagingUser(data.user);
              setUsers(prev => prev.map(u => u.id === data.user.id ? data.user : u));
              if (action === 'notes') alert("Notes saved.");
          } else {
              alert(data.error || "Action failed");
          }
      } catch (e) {
          alert("Connection Error");
      }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
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
                                 <img src={user.avatarUrl} className="w-8 h-8 rounded-full mr-2" />
                                 {user.username}
                                 {user.isBanned && <span className="ml-2 text-[10px] bg-red-600 text-white px-1 rounded">BANNED</span>}
                             </td>
                             <td className="p-4 text-sm">{user.role}</td>
                             <td className="p-4 text-sm font-mono">${user.balance.toFixed(2)}</td>
                             <td className="p-4 text-right">
                                 <button onClick={() => openManageModal(user)} className="bg-slate-800 text-white px-3 py-1 rounded text-xs font-bold">Manage</button>
                             </td>
                         </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          ) : (
             <div className="p-8 bg-white rounded-xl text-center text-gray-500">Stats Module Placeholder</div>
          )}
       </div>

       {managingUser && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
               <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
                   <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                       <h3 className="font-bold flex items-center"><Edit2 className="w-4 h-4 mr-2" /> Manage {managingUser.username}</h3>
                       <button onClick={() => setManagingUser(null)}><X className="w-5 h-5 text-gray-400" /></button>
                   </div>
                   <div className="p-6 space-y-4">
                       <div className="grid grid-cols-2 gap-3">
                           <button onClick={() => handleUserAction('suspend')} className={`p-3 rounded font-bold border ${managingUser.isSuspended ? 'bg-orange-500 text-white' : 'border-orange-500 text-orange-500'}`}>
                               <AlertTriangle className="w-4 h-4 mx-auto mb-1" /> {managingUser.isSuspended ? 'Unsuspend' : 'Suspend'}
                           </button>
                           <button onClick={() => handleUserAction('ban')} className={`p-3 rounded font-bold border ${managingUser.isBanned ? 'bg-red-600 text-white' : 'border-red-600 text-red-600'}`}>
                               <Ban className="w-4 h-4 mx-auto mb-1" /> {managingUser.isBanned ? 'Unban' : 'Ban'}
                           </button>
                       </div>
                       
                       <div>
                           <label className="text-xs font-bold text-gray-500">Admin Notes</label>
                           <div className="flex gap-2">
                               <input value={adminNoteInput} onChange={e => setAdminNoteInput(e.target.value)} className="border p-2 rounded w-full text-sm" placeholder="Notes..." />
                               <button onClick={() => handleUserAction('notes', { notes: adminNoteInput })} className="bg-blue-600 text-white p-2 rounded"><Save className="w-4 h-4" /></button>
                           </div>
                       </div>

                       <div className="border-t pt-4">
                           <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Promote User</p>
                           <div className="grid grid-cols-3 gap-2">
                               <button onClick={() => handleUserAction('promote', { role: 'VERIFIED' })} className="text-xs border p-2 rounded hover:bg-gray-50">Verified</button>
                               <button onClick={() => handleUserAction('promote', { role: 'VIP' })} className="text-xs border p-2 rounded hover:bg-gray-50">VIP</button>
                               <button onClick={() => handleUserAction('promote', { role: 'ADMIN' })} className="text-xs border border-red-200 text-red-600 p-2 rounded hover:bg-red-50">Admin</button>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};
