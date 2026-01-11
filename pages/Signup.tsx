import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, UserRole } from '../types';
import { SEO } from '../components/SEO';

interface SignupProps {
  onLogin: (user: User) => void;
}

export const Signup: React.FC<SignupProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '', // Screen Name
    realName: '', // Full Legal Name
    referralCode: '', // New Field
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // STRICT USERNAME RULES
    // No spaces allowed for regular members.
    if (formData.username.includes(' ')) {
      setError('Screen Name cannot contain spaces.');
      return;
    }

    try {
      // Get existing users
      const storedUsers = localStorage.getItem('peachy_users');
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      // Check for duplicates
      if (users.some((u: any) => u.email === formData.email)) {
        setError('Email is already registered.');
        return;
      }

      if (users.some((u: any) => u.username.toLowerCase() === formData.username.toLowerCase())) {
        setError('Screen Name is already taken.');
        return;
      }

      // REFERRAL LOGIC
      let referredByUserId: string | undefined = undefined;
      let initialRole = UserRole.USER;
      let isVerified = false;
      let initialBalance = 0;
      let initialTokens = 0;
      let vipExpiry: string | undefined = undefined;
      let isReferralValid = false;

      // --- OWNER OVERRIDE ---
      // If the specific owner email is used, force OWNER role and Verification
      if (formData.email.toLowerCase() === 'thepeachymarkets@gmail.com') {
          initialRole = UserRole.OWNER;
          isVerified = true;
          initialBalance = 10000; // Starter funds for testing
          initialTokens = 50000;
      }

      if (formData.referralCode) {
          const referrer = users.find(u => 
              (u.role === UserRole.DIAMOND_VIP || u.isAffiliate) && 
              (u.username.toLowerCase() === formData.referralCode.toLowerCase() || u.referralCode === formData.referralCode)
          );

          if (referrer) {
              // Valid Referrer Found
              referredByUserId = referrer.id;
              isReferralValid = true;
              
              // 1. New User gets 1 Month Free VIP (Only if not already Owner)
              if (initialRole !== UserRole.OWNER) {
                 initialRole = UserRole.VIP;
              }
              const date = new Date();
              date.setDate(date.getDate() + 30);
              vipExpiry = date.toISOString();

              // 2. Referrer gets 100% Rev Share for 1 Month (Update Referrer)
              referrer.bonusRevShareExpiry = date.toISOString();
              // Save updated referrer immediately to list
              // Note: Ideally we update this in the backend, but we modify the array here
              // referrer object in `users` array is a reference, so it's updated in `users`
          } else {
              // Invalid code logic - optionally error or just ignore
              // For now, let's ignore but warn? Or just proceed without bonus.
              // Let's decide to show an error if they tried to use one.
              setError("Invalid Referral Code. Please check or leave blank.");
              return;
          }
      }

      // Create New User
      const newUser: User = {
        id: `u${Date.now()}`,
        email: formData.email,
        username: formData.username,
        realName: formData.realName,
        // @ts-ignore - simulating password stored in user obj for mock auth
        password: formData.password, 
        role: initialRole,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.username}`,
        bannerUrl: 'https://picsum.photos/1200/400?grayscale',
        balance: initialBalance,
        tokens: initialTokens,
        isVerified: isVerified,
        bio: `Hi, I'm ${formData.username}!`,
        referredBy: referredByUserId,
        vipExpiry: vipExpiry,
        referralEarnings: 0
      };

      // Save to Local Storage
      users.push(newUser);
      localStorage.setItem('peachy_users', JSON.stringify(users));

      // Login immediately
      // Remove password for session
      const { password, ...safeUser } = newUser as any;
      onLogin(safeUser as User);
      navigate('/profile'); 
      
      if (initialRole === UserRole.OWNER) {
          alert('Welcome Owner! Full permissions granted.');
      } else if (isReferralValid) {
          alert('Account created! Referral Code Accepted: You have 1 Month of Free VIP Status.');
      } else {
          alert('Account created successfully! Please proceed to Verification.');
      }

    } catch (err) {
      console.error(err);
      alert("System Error: Unable to create account. Please check your storage settings or try a different browser.");
      setError('Failed to create account. Please ensure local storage is enabled.');
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
            />
            <p className="text-xs text-red-500 font-bold mt-1">NO SPACES ALLOWED</p>
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
        
        <div className="bg-peach-50 p-4 rounded-xl border border-peach-100">
            <label className="block text-sm font-bold text-peach-700 mb-2">Referral Code (Optional)</label>
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              className="w-full p-3 border border-peach-200 bg-white rounded-lg focus:ring-2 focus:ring-peach-400 outline-none text-gray-900"
              placeholder="Partner Code"
            />
            <p className="text-xs text-peach-600 mt-2">
                Use a valid partner code to get <span className="font-bold">1 Month Free VIP Status</span> instantly!
            </p>
        </div>

        <div className="pt-4">
           <button
            type="submit"
            className="w-full py-4 bg-peach-500 hover:bg-peach-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-peach-200 transition-transform active:scale-95"
          >
            Create Account
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