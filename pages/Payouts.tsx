import React, { useState } from 'react';
import { User } from '../types';
import { SEO } from '../components/SEO';
import { DollarSign, CreditCard, Landmark, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PayoutsProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export const Payouts: React.FC<PayoutsProps> = ({ user, onUpdateUser }) => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<'paypal' | 'ach' | null>(null);
  
  // ACH Form State
  const [achForm, setAchForm] = useState({
    name: user.realName || '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    contractorNumber: ''
  });

  // PayPal Form State
  const [paypalEmail, setPaypalEmail] = useState(user.email);
  const [paypalAmount, setPaypalAmount] = useState('');

  const handleACHSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(achForm.amount);
    
    if (amount > user.balance) return alert("Error: Insufficient funds.");
    if (amount <= 0) return alert("Error: Invalid amount.");

    // Simulate 3% fee calc for display
    const fee = amount * 0.03;
    const net = amount - fee;

    if (window.confirm(`Confirm ACH Withdrawal?\n\nAmount: $${amount.toFixed(2)}\nFee (3%): -$${fee.toFixed(2)}\nNet Payout: $${net.toFixed(2)}\n\nThis will be emailed to staff for processing.`)) {
        onUpdateUser({ ...user, balance: user.balance - amount });
        alert(`Request Sent! An email with your 1099 Contractor details has been sent to staff@peachy-markets.com.\n\nFunds will arrive in 3-5 business days.`);
        navigate('/profile');
    }
  };

  const handlePayPalSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const amount = parseFloat(paypalAmount);
      
      if (amount > user.balance) return alert("Error: Insufficient funds.");
      if (amount <= 0) return alert("Error: Invalid amount.");
      
      onUpdateUser({ ...user, balance: user.balance - amount });
      alert(`Success: $${amount.toFixed(2)} sent to ${paypalEmail}.`);
      navigate('/profile');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
       <SEO title="Request Payout" description="Withdraw your earnings via PayPal or Direct Deposit (ACH)." />
       <button onClick={() => navigate('/profile')} className="flex items-center text-gray-400 hover:text-white mb-6 font-bold transition-colors">
         <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
       </button>
       
       <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="bg-slate-900 p-8 text-center">
             <h1 className="text-3xl font-bold text-white mb-2">Withdraw Funds</h1>
             <p className="text-slate-400">Current Balance: <span className="text-green-400 font-bold">${user.balance.toFixed(2)}</span></p>
          </div>

          <div className="p-8">
             {!method ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                        onClick={() => setMethod('paypal')}
                        className="p-8 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center group"
                    >
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <CreditCard className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">PayPal</h3>
                        <p className="text-sm text-gray-500 mt-2">Instant transfer to your linked account.</p>
                    </button>

                    <button 
                        onClick={() => setMethod('ach')}
                        className="p-8 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-center group"
                    >
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Landmark className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Direct Deposit (ACH)</h3>
                        <p className="text-sm text-gray-500 mt-2">For 1099 Contractors. 3% Fee applies.</p>
                    </button>
                 </div>
             ) : method === 'paypal' ? (
                 <div className="max-w-md mx-auto animate-fadeIn">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">PayPal Withdrawal</h2>
                    <form onSubmit={handlePayPalSubmit} className="space-y-4">
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">PayPal Email</label>
                            <input type="email" required value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-slate-900 outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block font-bold text-slate-700 mb-1">Amount ($)</label>
                            <input type="number" step="0.01" max={user.balance} required value={paypalAmount} onChange={e => setPaypalAmount(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg text-slate-900 outline-none focus:border-blue-500" />
                        </div>
                        <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-[0.99]">Process Payout</button>
                        <button type="button" onClick={() => setMethod(null)} className="w-full py-2 text-gray-500 hover:text-gray-700 font-bold">Cancel</button>
                    </form>
                 </div>
             ) : (
                 <div className="max-w-lg mx-auto animate-fadeIn">
                    <div className="flex items-center justify-center mb-6">
                        <Landmark className="w-8 h-8 text-green-600 mr-2" />
                        <h2 className="text-2xl font-bold text-slate-800">ACH Direct Deposit</h2>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-r-lg">
                        <div className="flex">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 shrink-0" />
                            <p className="text-sm text-yellow-800">
                                <strong>Important:</strong> ACH Deposits are only available for those enrolled as a 1099 Contractor. 
                                A <strong>3% Processing Fee</strong> will be deducted from the withdrawal amount.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleACHSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1 text-sm">Full Legal Name</label>
                                <input type="text" required value={achForm.name} onChange={e => setAchForm({...achForm, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg text-slate-900 outline-none focus:border-green-500" />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1 text-sm">Date</label>
                                <input type="date" required value={achForm.date} onChange={e => setAchForm({...achForm, date: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg text-slate-900 outline-none focus:border-green-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1 text-sm">Contractor Number (1099)</label>
                            <input type="text" required placeholder="e.g. C-123456" value={achForm.contractorNumber} onChange={e => setAchForm({...achForm, contractorNumber: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg text-slate-900 outline-none focus:border-green-500" />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 mb-1 text-sm">Withdrawal Amount ($)</label>
                            <input type="number" step="0.01" max={user.balance} required value={achForm.amount} onChange={e => setAchForm({...achForm, amount: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg text-slate-900 outline-none focus:border-green-500" />
                            <p className="text-xs text-gray-500 mt-1">Available: ${user.balance.toFixed(2)}</p>
                        </div>

                        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200 mt-4 leading-relaxed">
                            <strong>Disclaimer:</strong> Direct deposit can take up to 3-5 business days to arrive. 
                            The Peachy Marketplace is not responsible for funds not arriving if the wrong account or routing number is provided. 
                            This form will be emailed to <strong>staff@peachy-markets.com</strong> for processing.
                        </div>

                        <button type="submit" className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg mt-2 transition-transform active:scale-[0.99]">
                            Submit ACH Request
                        </button>
                        <button type="button" onClick={() => setMethod(null)} className="w-full py-2 text-gray-500 hover:text-gray-700 font-bold mt-2">Cancel</button>
                    </form>
                 </div>
             )}
          </div>
       </div>
    </div>
  );
};