import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';
import { KeyRound, ArrowLeft, Loader2, ServerOff } from 'lucide-react';
import { SEO } from '../components/SEO';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'login' | 'forgot'>('login');
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Login failed. Please check your credentials.");
        }

        onLogin(data);
        navigate('/profile');

    } catch (err: any) {
        console.error("Login Error:", err);
        setError(err.message || "Unable to connect to server.");
    } finally {
        setIsLoading(false);
    }
  };

  if (view === 'forgot') {
      return (
        <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl border border-peach-100 animate-fadeIn">
            <SEO title="Reset Password" />
            <button onClick={() => { setView('login'); }} className="flex items-center text-sm text-gray-500 hover:text-peach-600 mb-6 font-bold">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
            </button>
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-4 text-peach-500">
                    <KeyRound className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Account Recovery</h1>
                <p className="text-slate-500 text-sm mt-2">Enter your email to verify account ownership.</p>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); alert("Feature coming soon."); setView('login'); }} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input type="email" required className="w-full p-3 border border-gray-300 rounded-lg" placeholder="you@example.com" />
                </div>
                <button type="submit" className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-lg">Send Reset Link</button>
            </form>
        </div>
      );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl border border-peach-100 animate-fadeIn">
      <SEO title="Login" description="Sign in to your Peachy Marketplace account." />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
        <p className="text-slate-500">Login to your account</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm flex items-start border border-red-200">
          <ServerOff className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
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
          disabled={isLoading}
          className={`w-full py-3 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 bg-peach-500 hover:bg-peach-600 shadow-peach-200 flex items-center justify-center`}
        >
          {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/signup" className="text-peach-600 font-bold hover:underline">
          Create Account
        </Link>
      </div>
      
      {/* Dev Hint */}
      <div className="mt-8 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
         <p>Default Admin: admin@peachy.market / admin123</p>
      </div>
    </div>
  );
};