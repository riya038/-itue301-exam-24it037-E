import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import FleetPage from './pages/FleetPage';
import MyBookingsPage from './pages/MyBookingsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('fleet');

  return (
    <div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {activeTab === 'fleet' && <FleetPage />}
        {activeTab === 'bookings' && <MyBookingsPage />}
        {activeTab === 'login' && <LoginPage />}
      </main>
    </div>
  );
}
