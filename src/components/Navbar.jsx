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
      background: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '14px',
        paddingBottom: '14px'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'var(--accent-primary)',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Car color="#ffffff" size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', lineHeight: 1.1, color: 'var(--accent-primary)', fontWeight: 800 }}>
              BosAuto<span style={{ color: 'var(--text-main)' }}>Rental</span>
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Premier Mobility Management</span>
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
            style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700 }}
          >
            <Lock size={14} />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
