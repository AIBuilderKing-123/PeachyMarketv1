import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AgeGate } from './components/AgeGate';
import { DevTools } from './components/DevTools';
import { Home } from './pages/Home';
import { Marketplace } from './pages/Marketplace';
import { CamRooms } from './pages/CamRooms';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { Branding } from './pages/Branding';
import { Verification } from './pages/Verification';
import { Messages } from './pages/Messages';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Memberships } from './pages/Memberships';
import { Terms } from './pages/Terms';
import { Disputes } from './pages/Disputes';
import { Referrals } from './pages/Referrals';
import { Payouts } from './pages/Payouts';
import { INITIAL_CAM_ROOMS } from './constants';
import { User, CamRoom, UserRole } from './types';

function App() {
  const [ageVerified, setAgeVerified] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<CamRoom[]>(INITIAL_CAM_ROOMS);

  // Initialize App Data
  useEffect(() => {
    // 1. Age Gate
    const verified = localStorage.getItem('age-verified');
    if (verified === 'true') {
      setAgeVerified(true);
    }

    // 2. User Session (Keep session token in local storage, but auth logic is now server based)
    const storedSession = localStorage.getItem('peachy_session');
    if (storedSession) {
      try {
        const parsedUser = JSON.parse(storedSession);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse session", e);
        localStorage.removeItem('peachy_session');
      }
    }
  }, []);

  // Simulate Cam Room Viewers
  useEffect(() => {
    const interval = setInterval(() => {
      setRooms(prevRooms => prevRooms.map(room => {
        // Check if room is logically "live" (has a booking right now)
        const now = new Date().toISOString();
        const isOccupied = room.bookedSlots.some(s => s.startTime <= now && s.endTime > now);

        if (isOccupied) {
          // Fluctuate viewers randomly between -3 and +5
          const change = Math.floor(Math.random() * 9) - 3;
          // Clamp between 0 and 100 (Max capacity)
          return { 
            ...room, 
            isLive: true,
            viewers: Math.min(100, Math.max(0, room.viewers + change)) 
          };
        } else {
           // If not live, viewers drop to 0
           return { ...room, isLive: false, viewers: 0 };
        }
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleAgeVerify = () => {
    localStorage.setItem('age-verified', 'true');
    setAgeVerified(true);
  };

  const handleAgeReject = () => {
    window.location.href = 'https://google.com';
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('peachy_session', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('peachy_session');
    // Optional: Navigate to home
    window.location.hash = '#/';
  };

  const handleUserUpdate = async (updatedUser: User) => {
    // 1. Update React State immediately for UI responsiveness
    setUser(updatedUser);
    localStorage.setItem('peachy_session', JSON.stringify(updatedUser));
    
    // 2. Sync with Server Background
    try {
        await fetch('/api/user/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser)
        });
    } catch (err) {
        console.error("Failed to sync user state to server", err);
        // Silent fail for UX, but data might be out of sync if they reload
    }
  };

  // Helper check for owner
  const isOwner = user?.role === UserRole.OWNER || user?.email === 'thepeachymarkets@gmail.com';

  if (!ageVerified) {
    return <AgeGate onVerify={handleAgeVerify} onReject={handleAgeReject} />;
  }

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/profile" />} />
          <Route path="/signup" element={!user ? <Signup onLogin={handleLogin} /> : <Navigate to="/profile" />} />
          
          {/* Passed handleUserUpdate here */}
          <Route path="/marketplace" element={<Marketplace user={user} onUpdateUser={handleUserUpdate} />} />
          
          <Route path="/cam-rooms" element={<CamRooms user={user} onUpdateUser={handleUserUpdate} rooms={rooms} onUpdateRooms={setRooms} />} />
          <Route path="/profile" element={user ? <Profile user={user} onUpdateUser={handleUserUpdate} /> : <Navigate to="/login" />} />
          <Route path="/verification" element={user ? <Verification /> : <Navigate to="/login" />} />
          
          <Route 
            path="/messages" 
            element={
              user ? (
                user.isVerified ? <Messages user={user} /> : <Navigate to="/verification" />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route path="/memberships" element={<Memberships user={user} onUpdateUser={handleUserUpdate} />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/disputes" element={<Disputes />} />
          <Route path="/referrals" element={<Referrals />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={(user?.role === 'ADMIN' || isOwner) ? <Admin /> : <Navigate to="/" />} />
          <Route path="/admin/branding" element={isOwner ? <Branding user={user} /> : <Navigate to="/" />} />
          
          <Route path="/contact" element={<Contact />} />
          <Route path="/payouts" element={user ? <Payouts user={user} onUpdateUser={handleUserUpdate} /> : <Navigate to="/login" />} />
        </Routes>
      </Layout>
      
      {/* Developer Tools Toggle */}
      <DevTools user={user} setUser={setUser} />
    </HashRouter>
  );
}

export default App;