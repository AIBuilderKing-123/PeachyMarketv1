import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { Home, ShoppingBag, Video, Users, ShieldCheck, Mail, Settings, LogOut, Menu, X, MessageCircle, Crown } from 'lucide-react';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { to: '/cam-rooms', label: 'Live Cams', icon: Video },
    { to: '/memberships', label: 'VIP Club', icon: Crown },
    { to: '/messages', label: 'Community', icon: MessageCircle, requiredAuth: true },
    { to: '/contact', label: 'Contact', icon: Mail },
  ];

  if (user?.role === UserRole.ADMIN || user?.role === UserRole.OWNER) {
    navItems.push({ to: '/admin', label: 'Admin', icon: ShieldCheck });
  }

  const handleProfileClick = () => {
    navigate('/profile');
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 font-sans">
      {/* Navigation */}
      <nav className="bg-gray-900/95 backdrop-blur-md shadow-lg sticky top-0 z-40 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center cursor-pointer group" onClick={() => navigate('/')}>
              <img 
                src="/logo.png" 
                alt="Peachy Marketplace Logo" 
                onError={(e) => {
                  // Fallback if local image not found yet
                  e.currentTarget.src = "https://img.icons8.com/fluency/96/peach.png";
                  e.currentTarget.onerror = null; 
                }}
                className="w-12 h-12 mr-3 object-contain drop-shadow-md group-hover:drop-shadow-[0_0_15px_rgba(244,63,94,0.6)] transition-all duration-300"
              />
              <span className="font-bold text-2xl text-gray-100 hidden sm:block tracking-tight">
                Peachy<span className="text-peach-500">Market</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-2">
              {navItems.map((item) => (
                (!item.requiredAuth || user) && (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                        isActive
                          ? 'bg-gray-800 text-peach-500 shadow-inner'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </NavLink>
                )
              ))}
              
              {!user?.isVerified && user && (
                 <NavLink
                 to="/verification"
                 className={({ isActive }) =>
                   `flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                     isActive
                       ? 'bg-blue-900/20 text-blue-400 border border-blue-900/50'
                       : 'text-blue-500 hover:bg-blue-900/10'
                   }`
                 }
               >
                 <ShieldCheck className="w-4 h-4 mr-2" />
                 Verify ID
               </NavLink>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative group">
                  <button className="flex items-center focus:outline-none" onClick={handleProfileClick}>
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className={`w-10 h-10 rounded-full object-cover border-2 ${user.role === UserRole.DIAMOND_VIP ? 'border-blue-400 ring-2 ring-blue-500/30' : 'border-peach-600'}`}
                    />
                    <div className="hidden lg:block ml-3 text-left">
                      <p className="text-sm font-bold text-gray-200 group-hover:text-peach-500 transition-colors">{user.username}</p>
                      <p className="text-xs text-gray-500 font-medium">${user.balance.toFixed(2)}</p>
                    </div>
                  </button>
                  {/* Dropdown (Hover) */}
                  <div className="absolute right-0 mt-4 w-56 bg-gray-800 rounded-xl shadow-2xl py-2 hidden group-hover:block border border-gray-700 animate-fadeIn">
                     <button onClick={handleProfileClick} className="flex items-center w-full text-left px-5 py-3 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
                        <Settings className="w-4 h-4 mr-3" /> Profile
                     </button>
                     <button onClick={() => navigate('/memberships')} className="flex items-center w-full text-left px-5 py-3 text-sm text-peach-400 hover:bg-gray-700/50 font-bold transition-colors">
                        <Crown className="w-4 h-4 mr-3" /> Upgrade to VIP
                     </button>
                     <div className="border-t border-gray-700 my-1"></div>
                     <button onClick={onLogout} className="flex items-center w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-gray-700/50 transition-colors">
                        <LogOut className="w-4 h-4 mr-3" /> Logout
                     </button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-gray-300 px-5 py-2.5 rounded-xl text-sm font-bold hover:text-white hover:bg-gray-800 transition-all"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => navigate('/signup')}
                    className="bg-gradient-to-r from-peach-600 to-peach-500 hover:from-peach-500 hover:to-peach-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-peach-900/20 transition-all transform hover:scale-105"
                  >
                    Sign Up
                  </button>
                </div>
              )}
              
              {/* Mobile Menu Button */}
              <button className="md:hidden text-gray-300 hover:text-white" onClick={toggleMenu}>
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 pt-2 pb-6 space-y-2 shadow-2xl">
            {navItems.map((item) => (
              (!item.requiredAuth || user) && (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-base font-bold transition-colors ${
                    isActive ? 'bg-gray-800 text-peach-500' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </div>
              </NavLink>
              )
            ))}
            {user ? (
              <>
               <div className="border-t border-gray-800 my-3"></div>
               <button onClick={handleProfileClick} className="flex items-center w-full px-4 py-3 text-base font-bold text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg">
                  <Settings className="w-5 h-5 mr-3" /> Profile
               </button>
               <button onClick={() => { navigate('/memberships'); setMobileMenuOpen(false); }} className="flex items-center w-full px-4 py-3 text-base font-bold text-peach-500 hover:bg-gray-800 rounded-lg">
                  <Crown className="w-5 h-5 mr-3" /> Upgrade to VIP
               </button>
               <button onClick={onLogout} className="flex items-center w-full px-4 py-3 text-base font-bold text-red-500 hover:bg-gray-800 rounded-lg">
                  <LogOut className="w-5 h-5 mr-3" /> Logout
               </button>
              </>
            ) : (
              <>
               <div className="border-t border-gray-800 my-3"></div>
               <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-base font-bold text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg">
                  Login
               </button>
               <button onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-base font-bold text-peach-500 hover:bg-gray-800 rounded-lg">
                  Create Account
               </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-10 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-peach-600 mb-6 uppercase tracking-widest">{APP_NAME}</h2>
          <p className="max-w-xl mx-auto mb-10 text-base text-gray-500 leading-relaxed">
            The ultimate sanctuary for verified adult content. 
            <br/>Secure. Private. Professional.
          </p>
          <div className="flex justify-center space-x-8 mb-10 text-sm font-semibold flex-wrap gap-y-4">
             <NavLink to="/terms" className="hover:text-peach-500 transition-colors uppercase tracking-wide">Legal Center</NavLink>
             <NavLink to="/contact" className="hover:text-peach-500 transition-colors uppercase tracking-wide">Support</NavLink>
             <NavLink to="/referrals" className="hover:text-peach-500 transition-colors uppercase tracking-wide text-peach-500">Referral Program</NavLink>
             <NavLink to="/disputes" className="hover:text-white transition-colors text-gray-300 bg-gray-800 border border-gray-700 px-6 py-2 rounded-full hover:bg-gray-700 hover:border-gray-600">Resolution Center</NavLink>
          </div>
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved. 18+ Content.
          </p>
        </div>
      </footer>
    </div>
  );
};