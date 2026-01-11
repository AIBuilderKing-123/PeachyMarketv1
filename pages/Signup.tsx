import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, UserRole } from '../types';
import { SEO } from '../components/SEO';
import { Loader2 } from 'lucide-react';

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

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    const isOwnerEmail = formData.email.toLowerCase() === 'thepeachymarkets@gmail.com';
    
    if (!isOwnerEmail && formData.username.includes(' ')) {
      setError('Screen Name cannot contain spaces.');
      setIsLoading(false);
      return;
    }

    // Prepare User Object for Server
    let initialRole = UserRole.USER;
    let isVerified = false;
    let initialBalance = 0;
    let initialTokens = 0;
    let vipExpiry: string | undefined = undefined;

    if (isOwnerEmail) {
        initialRole = UserRole.OWNER;
        isVerified = true;
        initialBalance = 10000;
        initialTokens = 50000;
    }
    
    // NOTE: Referral Logic simplified for Server-Side. 
    // Ideally server handles referral validation, but for this JSON-DB implementation we pass the code.

    const newUserPayload: Partial<User> & { password: string } = {
      id: `u${Date.now()}`,
      email: formData.email,
      username: formData.username,
      realName: formData.realName,
      password: formData.password,
      role: initialRole,
      joinedAt: new Date().toISOString(),
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.username}`,
      bannerUrl: 'https://picsum.photos/1200/400?grayscale',
      balance: initialBalance,
      tokens: initialTokens,
      isVerified: isVerified,
      bio: `Hi, I'm ${formData.username}!`,
      referralCode: formData.referralCode // Pass to server
    };

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUserPayload)
        });

        const data = await response.json();

        if (response.ok) {
            onLogin(data.user); // data.user returned from server
            navigate('/profile');
            
            if (initialRole === UserRole.OWNER) {
                alert('Welcome Owner! Full permissions granted.');
            } else {
                alert('Account created successfully! Please proceed to Verification.');
            }
        } else {
            setError(data.error || 'Failed to create account.');
        }

    } catch (err) {
        console.error(err);
        setError('Server Error: Unable to create account. Please check your connection.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-peach-100">
      <SEO title="Create Account" description="Join The Peachy Marketplace today and start connecting with verified users." />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
        <p className="text-slate-500">Join The Peachy Marketplace today</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-sm text-center font-bold border border-red-200">
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
              placeholder="NoSpacesAllowed"
              autoCapitalize="none"
              autoCorrect="off"
            />
            <p className="text-xs text-red-500 font-bold mt-1">NO SPACES ALLOWED (Except Owner)</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Full Legal Name</label>
          <input
            type="text"
            name="realName"
            required
            value={formData.realName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-400 outline-none text-gray-900"
            placeholder="First Last"
            autoCapitalize="words"
          />
          <p className="text-xs text-gray-400 mt-1">Private. For ID verification and billing only.</p>
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
              autoCapitalize="none"
              autoCorrect="off"
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
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
        </div>
        
        <div className="bg-peach-50 p-4 rounded-xl border border-peach-100">
            <label className="block text-sm font-bold text-peach-700 mb-2">Referral Code (Optional)</label>
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              className="w-full p-3 border border-peach-200 bg-white rounded-lg focus:ring-2 focus:ring-peach-400 outline-none text-gray-900"
              placeholder="Partner Code"
              autoCapitalize="none"
              autoCorrect="off"
            />
            <p className="text-xs text-peach-600 mt-2">
                Use a valid partner code to get <span className="font-bold">1 Month Free VIP Status</span> instantly!
            </p>
        </div>

        <div className="pt-4">
           <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-peach-500 hover:bg-peach-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-peach-200 transition-transform active:scale-95 flex items-center justify-center"
          >
             {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-peach-600 font-bold hover:underline">
          Login here
        </Link>
      </div>
    </div>
  );
};