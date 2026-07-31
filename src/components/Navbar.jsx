import React, { useState, useEffect } from 'react';
import { Car, Wifi, WifiOff, Lock } from 'lucide-react';

export default function Navbar({ onOpenLogin }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '16px',
        paddingBottom: '16px'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Car color="#ffffff" size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', lineHeight: 1.1 }}>BosAuto<span style={{ color: 'var(--accent-secondary)' }}>Rental</span></h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Armada Terawat & Transparan</span>
          </div>
        </div>

        {/* Navigation Links & Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Online/Offline Status Indicator Badge */}
          <div className={`badge ${isOnline ? 'badge-available' : 'badge-rented'}`} title={isOnline ? 'Terhubung ke server' : 'Berjalan di mode offline'}>
            {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          <a href="#katalog" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            Armada
          </a>

          <a href="#kalkulator" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            Kalkulator Sewa
          </a>

          {/* Login Admin Button */}
          <button 
            onClick={onOpenLogin} 
            className="btn btn-primary" 
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <Lock size={14} />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
