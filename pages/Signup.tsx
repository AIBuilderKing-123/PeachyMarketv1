import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';
import { SEO } from '../components/SEO';
import { Loader2, ServerOff } from 'lucide-react';

interface SignupProps {
  onLogin: (user: User) => void;
}

export const Signup: React.FC<SignupProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '', 
    realName: '',
    referralCode: '', 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
                username: formData.username,
                realName: formData.realName,
                referralCode: formData.referralCode
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Signup failed");
        }

        onLogin(data);
        navigate('/profile');
        alert('Account created successfully!');
    } catch (err: any) {
        console.error("Signup Error:", err);
        setError(err.message || "Failed to create account. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-peach-100">
      <SEO title="Create Account" description="Join The Peachy Marketplace today." />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
        <p className="text-slate-500">Join The Peachy Marketplace today</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-sm font-bold border border-red-200 flex items-center">
          <ServerOff className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-400 outline-none text-gray-900"
              placeholder="you@example.com"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Screen Name</label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-400 outline-none text-gray-900"
              placeholder="UniqueUsername"
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-bold text-slate-700 mb-2">Full Legal Name (Private)</label>
           <input
              type="text"
              name="realName"
              required
              value={formData.realName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-400 outline-none text-gray-900"
              placeholder="Jane Doe"
            />
            <p className="text-xs text-gray-400 mt-1">Required for age verification and payouts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-400 outline-none text-gray-900"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-400 outline-none text-gray-900"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-bold text-slate-700 mb-2">Referral Code (Optional)</label>
           <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-400 outline-none text-gray-900"
              placeholder="Partner Code"
            />
        </div>

        <div className="flex items-start">
            <input type="checkbox" required className="mt-1 w-4 h-4 text-peach-600 rounded border-gray-300 focus:ring-peach-500" />
            <span className="ml-2 text-sm text-gray-600">
                I certify I am at least 18 years old and agree to the <Link to="/terms" className="text-peach-600 underline">Terms of Service</Link>.
            </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-peach-500 hover:bg-peach-600 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-peach-600 font-bold hover:underline">
          Login here
        </Link>
      </div>
    </div>
  );
};