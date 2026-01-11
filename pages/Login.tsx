import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, UserRole } from '../types';
import { AlertOctagon, KeyRound, ArrowLeft, Mail } from 'lucide-react';
import { SEO } from '../components/SEO';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [banReason, setBanReason] = useState('');
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBanReason('');

    try {
      // Fetch users from local storage
      const storedUsers = localStorage.getItem('peachy_users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Find user
      const user = users.find((u: any) => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password === password);

      if (user) {
        // CHECK FOR BAN OR SUSPENSION
        if (user.isBanned) {
            setBanReason('PERMANENT BAN: Your account has been flagged for violations of our Terms of Service. Access is denied.');
            return;
        }
        if (user.isSuspended) {
            setBanReason('ACCOUNT SUSPENDED: Your account is temporarily suspended pending review.');
            return;
        }

        // --- OWNER OVERRIDE CHECK ---
        // If the email matches the owner email, ensure permissions are recognized internally elsewhere
        // We don't force role change here to allow "incognito" testing as VIP
        if (user.email.toLowerCase().trim() === 'thepeachymarkets@gmail.com') {
            user.isVerified = true; 
        }

        // Remove password from session object before saving/setting state
        const { password, ...safeUser } = user;
        onLogin(safeUser as User);
        navigate('/profile');
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      console.error(err);
      alert("System Error: Login service is not responding. Please check your connection and try again.");
      setError('An error occurred during login. Please try again.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Simulate sending email
      setResetSent(true);
      setTimeout(() => {
          // Reset view after a delay
          setResetEmail('');
          setResetSent(false);
          setView('login');
      }, 3000);
  };

  if (view === 'forgot') {
      return (
        <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl border border-peach-100">
            <SEO title="Reset Password" />
            <button onClick={() => setView('login')} className="flex items-center text-sm text-gray-500 hover:text-peach-600 mb-6 font-bold">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
            </button>
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-4 text-peach-500">
                    <KeyRound className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Forgot Password?</h1>
                <p className="text-slate-500 text-sm mt-2">Enter your email address and we'll send you a link to reset your password.</p>
            </div>
            
            {resetSent ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-fadeIn">
                    <div className="flex justify-center mb-3">
                        <Mail className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-green-800 font-bold mb-1">Link Sent!</h3>
                    <p className="text-green-700 text-sm">Check your inbox for instructions.</p>
                </div>
            ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-400 outline-none text-gray-900"
                            placeholder="you@example.com"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95"
                    >
                        Send Reset Link
                    </button>
                </form>
            )}
        </div>
      );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl border border-peach-100">
      <SEO title="Login" description="Sign in to your Peachy Marketplace account." />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
        <p className="text-slate-500">Login to your account</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium">
          {error}
        </div>
      )}

      {banReason && (
        <div className="mb-6 p-6 bg-red-50 border-l-4 border-red-600 rounded-r-lg animate-fadeIn">
            <div className="flex items-start">
                <AlertOctagon className="w-6 h-6 text-red-600 mr-3 shrink-0" />
                <div>
                    <h3 className="text-red-800 font-bold uppercase text-xs tracking-wider mb-1">Access Denied</h3>
                    <p className="text-red-700 text-sm leading-relaxed">{banReason}</p>
                </div>
            </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-400 outline-none transition-all text-gray-900"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-slate-700">Password</label>
            <button type="button" onClick={() => setView('forgot')} className="text-xs text-peach-600 font-bold hover:underline">
                Forgot Password?
            </button>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-400 outline-none transition-all text-gray-900"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={!!banReason}
          className={`w-full py-3 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 ${banReason ? 'bg-gray-400 cursor-not-allowed' : 'bg-peach-500 hover:bg-peach-600 shadow-peach-200'}`}
        >
          Sign In
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/signup" className="text-peach-600 font-bold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
};