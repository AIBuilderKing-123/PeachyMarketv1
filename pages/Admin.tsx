import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, Activity, MessageSquare, ShieldAlert, CheckCircle, XCircle, AlertTriangle, ExternalLink, Image } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useNavigate } from 'react-router-dom';

// Start with empty/zero data
const TRAFFIC_DATA = [
  { name: 'Mon', visits: 0 },
  { name: 'Tue', visits: 0 },
  { name: 'Wed', visits: 0 },
  { name: 'Thu', visits: 0 },
  { name: 'Fri', visits: 0 },
  { name: 'Sat', visits: 0 },
  { name: 'Sun', visits: 0 },
];

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'verification' | 'users' | 'stats' | 'reports' | 'support'>('stats');
  
  // Empty State for Data Lists
  const [reports, setReports] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Generic handler for admin actions to simulate API calls and potential errors
  const handleAdminAction = (action: string, target: string) => {
    if (window.confirm(`Confirm Action: ${action} for ${target}?`)) {
      try {
        // Simulate API latency and potential failure
        const isSuccess = Math.random() > 0.1; // 90% success rate

        if (isSuccess) {
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
                 <p className="text-3xl font-bold text-slate-800">0</p>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <h3 className="text-sm text-gray-500 font-bold uppercase">Revenue (7%)</h3>
                 <p className="text-3xl font-bold text-green-600">$0.00</p>
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
            {verifications.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                    <tr>
                      <th className="p-4 font-bold">User</th>
                      <th className="p-4 font-bold">Documents</th>
                      <th className="p-4 font-bold">Date</th>
                      <th className="p-4 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* Map verifications here */}
                  </tbody>
                </table>
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
            <div className="p-4 border-b border-gray-100 flex justify-between">
              <input type="text" placeholder="Search users..." className="border rounded-lg px-3 py-1 text-sm outline-none focus:border-peach-400 text-gray-900" />
            </div>
            {users.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                    <tr>
                      <th className="p-4 font-bold">Member</th>
                      <th className="p-4 font-bold">Balance</th>
                      <th className="p-4 font-bold">Role</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {/* Map users here */}
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
    <div className="flex flex-col md:flex-row gap-6">
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
    </div>
  );
};