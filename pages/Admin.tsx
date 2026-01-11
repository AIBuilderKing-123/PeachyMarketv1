import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, Activity, MessageSquare, ShieldAlert, CheckCircle, XCircle, AlertTriangle, ExternalLink, Image, X, ZoomIn, Check, Ban } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useNavigate } from 'react-router-dom';

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
  const [reports, setReports] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Image Modal State
  const [viewImage, setViewImage] = useState<string | null>(null);

  // Initialize Mock Data
  useEffect(() => {
    // Mock Verifications
    setVerifications([
      {
        id: 'v1',
        user: { username: 'PeachLover99', email: 'user@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Peach' },
        legalName: 'Jane Doe',
        dob: '1995-05-15',
        // Using high-res placeholders
        idPhotoUrl: 'https://images.unsplash.com/photo-1563237023-b1e970526dcb?auto=format&fit=crop&w=1200&q=90', 
        selfieUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=90',
        date: '2023-10-25'
      },
      {
        id: 'v2',
        user: { username: 'MikeTheModel', email: 'mike@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
        legalName: 'Michael Smith',
        dob: '1990-12-01',
        idPhotoUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1200&q=90',
        selfieUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=90',
        date: '2023-10-26'
      }
    ]);

    // Mock Users
    setUsers([
        { id: 'u1', username: 'PeachLover99', balance: 120.50, role: 'USER', email: 'jane@test.com' },
        { id: 'u2', username: 'MikeTheModel', balance: 5000.00, role: 'VIP', email: 'mike@test.com' },
        { id: 'u3', username: 'AdminUser', balance: 0, role: 'ADMIN', email: 'admin@peachy.market' },
    ]);
  }, []);

  // Generic handler for admin actions to simulate API calls and potential errors
  const handleAdminAction = (action: string, target: string, id?: string) => {
    if (window.confirm(`Confirm Action: ${action} for ${target}?`)) {
      try {
        const isSuccess = true; // Simulating success

        if (isSuccess) {
          if (id) {
            // Optimistically remove processed item
            if (activeTab === 'verification') setVerifications(prev => prev.filter(v => v.id !== id));
          }
          alert(`Success: ${action} has been applied to ${target}.`);
        } else {
          throw new Error("Database Write Failed");
        }
      } catch (error) {
        console.error(error);
        alert(`System Error: Failed to execute ${action}. The server is not responding or the database is locked. Please try again.`);
      }
    }
  };

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
                 <h3 className="text-sm text-gray-500 font-bold uppercase">Revenue (7%)</h3>
                 <p className="text-3xl font-bold text-green-600">$4,320.50</p>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <h3 className="text-sm text-gray-500 font-bold uppercase">Pending Verifications</h3>
                 <p className="text-3xl font-bold text-orange-500">{verifications.length}</p>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <h3 className="text-sm text-gray-500 font-bold uppercase">Total Members</h3>
                 <p className="text-3xl font-bold text-slate-800">{users.length}</p>
               </div>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
               <h3 className="text-lg font-bold mb-6">Traffic Overview (Last 7 Days)</h3>
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={TRAFFIC_DATA}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} />
                   <YAxis axisLine={false} tickLine={false} />
                   <Tooltip cursor={{fill: '#fff1f2'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                   <Bar dataKey="visits" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={40} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
        );
      case 'verification':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[300px]">
            <div className="p-4 bg-orange-50 border-b border-orange-100">
                <h3 className="font-bold text-orange-800 flex items-center">
                    <ShieldAlert className="w-5 h-5 mr-2" /> Pending Requests ({verifications.length})
                </h3>
            </div>
            {verifications.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                        <tr>
                        <th className="p-4 font-bold">User</th>
                        <th className="p-4 font-bold">Legal Info</th>
                        <th className="p-4 font-bold">Documents (Click to Zoom)</th>
                        <th className="p-4 font-bold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {verifications.map((req) => (
                            <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center">
                                        <img src={req.user.avatar} className="w-10 h-10 rounded-full mr-3 bg-gray-200" alt="" />
                                        <div>
                                            <div className="font-bold text-slate-800">{req.user.username}</div>
                                            <div className="text-xs text-gray-500">{req.user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm font-medium text-slate-800">{req.legalName}</div>
                                    <div className="text-xs text-gray-500">DOB: {req.dob}</div>
                                    <div className="text-xs text-gray-400 mt-1">Submitted: {req.date}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-4">
                                        <div className="group relative cursor-zoom-in" onClick={() => setViewImage(req.idPhotoUrl)}>
                                            <img src={req.idPhotoUrl} className="w-20 h-14 object-cover rounded-lg border border-gray-200 shadow-sm transition-transform group-hover:scale-105" alt="ID" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                                                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 w-6 h-6 drop-shadow-md" />
                                            </div>
                                            <p className="text-[10px] text-center mt-1 text-gray-500 font-bold uppercase">ID Card</p>
                                        </div>
                                        <div className="group relative cursor-zoom-in" onClick={() => setViewImage(req.selfieUrl)}>
                                            <img src={req.selfieUrl} className="w-20 h-14 object-cover rounded-lg border border-gray-200 shadow-sm transition-transform group-hover:scale-105" alt="Selfie" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                                                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 w-6 h-6 drop-shadow-md" />
                                            </div>
                                            <p className="text-[10px] text-center mt-1 text-gray-500 font-bold uppercase">Selfie</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleAdminAction('Reject', req.user.username, req.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Reject"
                                        >
                                            <XCircle className="w-6 h-6" />
                                        </button>
                                        <button 
                                            onClick={() => handleAdminAction('Approve', req.user.username, req.id)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Approve"
                                        >
                                            <CheckCircle className="w-6 h-6" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400">
                    <FileText className="w-12 h-12 mb-3 opacity-20" />
                    <p>No pending verifications.</p>
                </div>
            )}
          </div>
        );
      case 'users':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[300px]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-slate-800">Member List ({users.length})</h3>
              <input type="text" placeholder="Search users..." className="border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-peach-400 text-gray-900 bg-white" />
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
                         <tr key={user.id} className="hover:bg-gray-50">
                             <td className="p-4 font-medium text-slate-800">
                                 {user.username} <br/>
                                 <span className="text-xs text-gray-400 font-normal">{user.email}</span>
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
                                 <button onClick={() => handleAdminAction('Edit', user.username)} className="text-blue-600 font-bold text-xs hover:underline mr-3">Manage</button>
                                 <button onClick={() => handleAdminAction('Ban', user.username)} className="text-red-600 font-bold text-xs hover:underline">Ban</button>
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
      case 'reports':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[300px]">
            <div className="p-4 bg-red-50 border-b border-red-100 flex items-center">
               <ShieldAlert className="w-5 h-5 text-red-600 mr-2" />
               <h3 className="font-bold text-red-800">User Reports</h3>
            </div>
            {reports.length > 0 ? (
                <table className="w-full text-left">
                   <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                     <tr>
                       <th className="p-4 font-bold">Reported User</th>
                       <th className="p-4 font-bold">Reported By</th>
                       <th className="p-4 font-bold">Reason</th>
                       <th className="p-4 font-bold">Status</th>
                       <th className="p-4 font-bold text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {reports.map(report => (
                       <tr key={report.id} className="hover:bg-gray-50">
                         {/* Render report row */}
                       </tr>
                     ))}
                   </tbody>
                </table>
            ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400">
                    <ShieldAlert className="w-12 h-12 mb-3 opacity-20" />
                    <p>Clean record! No reports pending.</p>
                </div>
            )}
          </div>
        );
      case 'support':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[300px]">
             <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center">
               <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
               <h3 className="font-bold text-blue-800">Live Support Tickets</h3>
             </div>
             {tickets.length > 0 ? (
                 <div className="divide-y divide-gray-100">
                   {tickets.map(ticket => (
                     <div key={ticket.id} className="p-4 hover:bg-gray-50 flex justify-between items-center transition-colors">
                        {/* Render ticket row */}
                     </div>
                   ))}
                 </div>
             ) : (
                 <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400">
                    <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                    <p>Inbox zero. No active tickets.</p>
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
            { id: 'verification', label: 'Verification Requests', icon: FileText },
            { id: 'users', label: 'Member Management', icon: Users },
            { id: 'reports', label: 'User Reports', icon: ShieldAlert },
            { id: 'support', label: 'Live Support', icon: MessageSquare },
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
          
          <div className="border-t border-gray-100 my-2 pt-2">
              <button 
                onClick={() => navigate('/admin/branding')}
                className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-colors text-slate-600 hover:bg-gray-50 hover:text-blue-600"
              >
                  <Image className="w-4 h-4 mr-3" />
                  Site Branding
              </button>
          </div>
       </div>

       {/* Main Content */}
       <div className="flex-grow">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h1>
            <p className="text-sm text-slate-500">Admin Control Panel</p>
          </div>
          {renderContent()}
       </div>

       {/* IMAGE ZOOM MODAL */}
       {viewImage && (
         <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-fadeIn" 
            onClick={() => setViewImage(null)}
         >
            <button 
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
                onClick={() => setViewImage(null)}
            >
                <X className="w-8 h-8" />
            </button>
            <img 
                src={viewImage} 
                alt="Verification Document" 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl pointer-events-auto cursor-default" 
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-bold pointer-events-none">
                Click background to close
            </div>
         </div>
       )}
    </div>
  );
};