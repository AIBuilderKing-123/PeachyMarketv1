import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, FileText, Upload, Clock, CheckCircle, Search, Info, X, Trash2, ArrowLeft, MessageSquare, Paperclip, Send, User } from 'lucide-react';
import { SEO } from '../components/SEO';

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
}

interface DisputeMessage {
  id: string;
  sender: string;
  role: 'buyer' | 'seller' | 'admin';
  content: string;
  timestamp: string;
}

interface DisputeCase {
  id: string;
  date: string;
  subject: string;
  status: 'Under Review' | 'Resolved' | 'Action Required';
  type: string;
  update: string;
  description: string;
  transactionAmount: string;
  messages: DisputeMessage[];
  evidence: string[];
  resolution?: string;
}

export const Disputes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'open' | 'cases'>('open');
  const [selectedCase, setSelectedCase] = useState<DisputeCase | null>(null);
  
  // New Dispute Form State
  const [formData, setFormData] = useState({
    transactionId: '',
    type: 'Item Not Received',
    description: '',
    files: [] as UploadedFile[]
  });

  // Reply State
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cases Data - Empty by default
  const [cases, setCases] = useState<DisputeCase[]>([]);

  useEffect(() => {
    if (selectedCase) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedCase, cases]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (formData.files.some(f => f.progress < 100)) {
            alert("Error: Some files are still uploading. Please wait.");
            return;
        }
        alert("Success: Dispute ticket opened successfully. Reference ID: DSP-" + Math.floor(Math.random() * 10000));
        setActiveTab('cases');
        setSelectedCase(null);
        setFormData({ transactionId: '', type: 'Item Not Received', description: '', files: [] });
    } catch(err) {
        alert("Error: Could not submit dispute. System may be experiencing high load. Please try again.");
    }
  };

  const handleReplySubmit = () => {
    if (!replyText.trim() || !selectedCase) return;
    
    const newMessage: DisputeMessage = {
      id: `m${Date.now()}`,
      sender: 'You',
      role: 'buyer',
      content: replyText,
      timestamp: 'Just now'
    };

    // Update local state to show message immediately
    const updatedCases = cases.map(c => {
      if (c.id === selectedCase.id) {
        return { ...c, messages: [...c.messages, newMessage] };
      }
      return c;
    });

    setCases(updatedCases);
    // Update selected case reference to trigger re-render of messages
    setSelectedCase({ ...selectedCase, messages: [...selectedCase.messages, newMessage] });
    setReplyText('');
    
    // Simulate Admin Reply
    setTimeout(() => {
        alert("Alert: Your reply has been posted to the case file.");
    }, 500);
  };

  const simulateUpload = (fileId: string) => {
    let currentProgress = 0;
    const interval = setInterval(() => {
        currentProgress += Math.random() * 15 + 5; 
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(interval);
        }
        setFormData(prev => ({
            ...prev,
            files: prev.files.map(f => f.id === fileId ? { ...f, progress: currentProgress } : f)
        }));
    }, 200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          file,
          progress: 0
      }));
      setFormData(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
      newFiles.forEach(f => simulateUpload(f.id));
    }
  };

  const removeFile = (id: string) => {
      setFormData(prev => ({
          ...prev,
          files: prev.files.filter(f => f.id !== id)
      }));
  };

  // --- Render Detailed Case View ---
  const renderCaseDetail = () => {
    if (!selectedCase) return null;

    return (
      <div className="animate-fadeIn h-full flex flex-col">
        <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
          <button 
            onClick={() => setSelectedCase(null)} 
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-800">{selectedCase.subject}</h2>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                selectedCase.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {selectedCase.status}
              </span>
            </div>
            <p className="text-xs text-gray-400">Case ID: {selectedCase.id} • {selectedCase.date}</p>
          </div>
        </div>

        {/* Case Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
             <span className="text-xs font-bold text-slate-400 uppercase">Transaction Value</span>
             <div className="text-lg font-bold text-slate-800">{selectedCase.transactionAmount}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
             <span className="text-xs font-bold text-slate-400 uppercase">Category</span>
             <div className="text-lg font-bold text-slate-800">{selectedCase.type}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
             <span className="text-xs font-bold text-slate-400 uppercase">Latest Update</span>
             <div className="text-lg font-bold text-peach-600">{selectedCase.update}</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
           <h3 className="font-bold text-slate-800 mb-2 text-sm">Original Complaint</h3>
           <p className="text-slate-600 text-sm leading-relaxed">{selectedCase.description}</p>
           
           {selectedCase.evidence.length > 0 && (
             <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-400 block mb-2">Evidence Files</span>
                <div className="flex gap-2">
                  {selectedCase.evidence.map((file, idx) => (
                    <div key={idx} className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-blue-600 font-medium cursor-pointer hover:bg-blue-50">
                       <Paperclip className="w-3 h-3 mr-1" /> {file}
                    </div>
                  ))}
                </div>
             </div>
           )}
        </div>
        
        {/* Resolution Box (If Resolved) */}
        {selectedCase.resolution && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-green-800 mb-2 text-sm flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" /> Official Resolution
            </h3>
            <p className="text-green-700 text-sm">{selectedCase.resolution}</p>
          </div>
        )}

        {/* Chat Interface */}
        <div className="flex-grow flex flex-col bg-slate-50 border border-gray-200 rounded-xl overflow-hidden">
           <div className="bg-gray-100 p-3 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">Case Log & Messages</div>
           
           <div className="flex-grow overflow-y-auto p-4 space-y-4 max-h-[400px]">
              {selectedCase.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl p-3 ${
                    msg.role === 'buyer' 
                      ? 'bg-peach-500 text-white rounded-tr-none' 
                      : msg.role === 'admin' 
                        ? 'bg-slate-800 text-white rounded-tl-none border-l-4 border-yellow-400' 
                        : 'bg-white border border-gray-200 text-slate-700 rounded-tl-none'
                  }`}>
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className="text-xs font-bold opacity-90">
                        {msg.role === 'admin' && <ShieldCheck className="w-3 h-3 inline mr-1" />}
                        {msg.sender}
                      </span>
                      <span className="text-[10px] opacity-70">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
           </div>

           {selectedCase.status !== 'Resolved' && (
             <div className="p-3 bg-white border-t border-gray-200">
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={replyText}
                   onChange={(e) => setReplyText(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit()}
                   placeholder="Type a reply or provide more info..."
                   className="flex-grow p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-peach-400 text-sm text-gray-900"
                 />
                 <button 
                  onClick={handleReplySubmit}
                  className="bg-peach-500 hover:bg-peach-600 text-white p-2.5 rounded-lg transition-colors"
                 >
                   <Send className="w-4 h-4" />
                 </button>
               </div>
             </div>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <SEO title="Resolution Center" description="Resolve transaction disputes and report issues securely." />
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-peach-100 rounded-full mb-4">
           <ShieldCheck className="w-8 h-8 text-peach-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Resolution Center</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Securely resolve transaction issues. We mediate fairly between buyers and sellers to ensure a safe marketplace environment.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 min-h-[600px] flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-gray-100 p-6 flex flex-col">
          <button 
            onClick={() => { setActiveTab('open'); setSelectedCase(null); }}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold mb-3 flex items-center transition-all ${
              activeTab === 'open' && !selectedCase ? 'bg-peach-500 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 mr-3" /> Open Dispute
          </button>
          <button 
            onClick={() => { setActiveTab('cases'); setSelectedCase(null); }}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center transition-all ${
              activeTab === 'cases' || selectedCase ? 'bg-peach-500 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 mr-3" /> My Case History
          </button>

          <div className="mt-auto pt-8">
            <div className="bg-blue-100 p-4 rounded-xl border border-blue-200">
              <h4 className="text-xs font-bold text-blue-800 uppercase mb-2 flex items-center">
                <Info className="w-3 h-3 mr-1" /> Quick Tip
              </h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                Contact the seller via <span className="font-bold">Messages</span> first. 90% of issues are resolved instantly without opening a formal case.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-8 bg-white">
          {activeTab === 'open' && !selectedCase ? (
            <div className="max-w-2xl mx-auto animate-fadeIn">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-gray-100">Submit a New Claim</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Transaction ID</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="e.g. TX-12345678" 
                      className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-peach-400 outline-none transition-shadow text-gray-900"
                      required
                      value={formData.transactionId}
                      onChange={e => setFormData({...formData, transactionId: e.target.value})}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-1">You can find this in your Wallet > Transaction History.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Issue Type</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-peach-400 outline-none bg-white transition-shadow text-gray-900"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option>Item Not Received (Digital)</option>
                    <option>Item Not Received (Physical)</option>
                    <option>Item Not As Described</option>
                    <option>Duplicate Charge</option>
                    <option>Seller Harassment</option>
                    <option>Other Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description of Issue</label>
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-peach-400 outline-none h-32 resize-none transition-shadow text-gray-900"
                    placeholder="Please provide details about what went wrong..."
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Evidence / Screenshots</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    <input 
                        type="file" 
                        id="evidence" 
                        className="hidden" 
                        multiple 
                        onChange={handleFileChange} 
                    />
                    <label htmlFor="evidence" className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-8 h-8 mb-2 text-peach-500" />
                      <span className="text-sm font-bold text-slate-600">
                         Click to Upload Proof
                      </span>
                      <span className="text-xs text-gray-400 mt-1">Screenshots, PDF, or JPG (Max 5MB)</span>
                    </label>
                  </div>

                  {/* File List */}
                  {formData.files.length > 0 && (
                      <div className="mt-4 space-y-2">
                          {formData.files.map((fileObj) => (
                              <div key={fileObj.id} className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm flex items-center justify-between">
                                  <div className="flex-grow mr-4">
                                      <div className="flex justify-between items-center mb-1">
                                          <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{fileObj.file.name}</span>
                                          <span className="text-xs text-gray-500">{Math.round(fileObj.progress)}%</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                                          <div 
                                            className="bg-green-500 h-1.5 rounded-full transition-all duration-200" 
                                            style={{ width: `${fileObj.progress}%` }}
                                          ></div>
                                      </div>
                                  </div>
                                  <button 
                                    type="button"
                                    onClick={() => removeFile(fileObj.id)}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                          ))}
                      </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button type="submit" className="w-full bg-peach-500 hover:bg-peach-600 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.99]">
                    Submit Dispute for Review
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-4">
                    By submitting, you agree to allow Peachy Marketplace admins to review chat logs and transaction data associated with this ID.
                  </p>
                </div>
              </form>
            </div>
          ) : activeTab === 'cases' && !selectedCase ? (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b border-gray-100">My Disputes</h2>
              {cases.length > 0 ? (
                <div className="space-y-4">
                  {cases.map((c) => (
                    <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{c.id}</span>
                          <h3 className="font-bold text-lg text-slate-800">{c.subject}</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          c.status === 'Resolved' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-peach-400" /> Opened: {c.date}</div>
                        <div className="flex items-center"><FileText className="w-4 h-4 mr-2 text-peach-400" /> Type: {c.type}</div>
                      </div>

                      {c.status === 'Resolved' ? (
                        <div className="mt-2 flex justify-between items-center">
                          <div className="flex items-center text-green-600 text-sm font-bold">
                             <CheckCircle className="w-4 h-4 mr-2" /> Resolution: {c.update}
                          </div>
                          <button onClick={() => setSelectedCase(c)} className="text-slate-600 text-sm font-bold hover:text-peach-500 underline">View Full History</button>
                        </div>
                      ) : (
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-sm text-yellow-600 font-medium">Status: {c.update}</span>
                          <button onClick={() => setSelectedCase(c)} className="bg-peach-50 text-peach-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-peach-100 transition-colors">
                             View Details & Reply &gt;
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No active dispute cases found.</p>
                </div>
              )}
            </div>
          ) : (
             renderCaseDetail()
          )}
        </div>
      </div>
    </div>
  );
};