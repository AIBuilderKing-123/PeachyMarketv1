import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';
import { AlertOctagon } from 'lucide-react';
import { SEO } from '../components/SEO';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [banReason, setBanReason] = useState('');
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
      const user = users.find((u: any) => u.email === email && u.password === password);

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
          <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
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