import React from 'react';
import { Car, LayoutDashboard, Calendar, DollarSign, LogOut, ArrowLeft, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard({ onLogout, activeTab, setActiveTab, children }) {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.warn('Logout fallback trigger');
    }
    onLogout();
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'armada', label: 'Manajemen Armada', icon: Car },
    { id: 'jadwal', label: 'Jadwal Rental', icon: Calendar },
    { id: 'pembukuan', label: 'Pembukuan', icon: DollarSign },
    { id: 'wa_admin', label: 'Kontak CS WA', icon: Phone }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
      {/* Admin Sidebar */}
      <aside style={{
        width: '260px',
        borderRight: '1px solid var(--border-color)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'var(--bg-secondary)'
      }}>
        <div>
          {/* Admin Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', paddingLeft: '8px' }}>
            <div style={{ background: 'var(--accent-primary)', padding: '6px', borderRadius: '8px' }}>
              <Car color="#fff" size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.05rem' }}>BosAuto <span style={{ color: 'var(--accent-secondary)' }}>Admin</span></h4>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Management System</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isActive ? 'var(--accent-glow)' : 'transparent',
                    color: isActive ? 'var(--accent-secondary)' : 'var(--text-muted)',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '12px', paddingLeft: '8px' }}>
            Logged in as: <strong style={{ color: 'var(--text-main)', display: 'block' }}>{currentUser?.email || 'admin@bosauto.id'}</strong>
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--status-rented)' }}
          >
            <LogOut size={16} /> Keluar Admin
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ textTransform: 'capitalize' }}>
            {activeTab === 'overview' ? 'Dashboard Overview' : 
             activeTab === 'armada' ? 'Manajemen Armada Kendaraan' : 
             activeTab === 'jadwal' ? 'Penjadwalan & Log Sewa' : 'Pembukuan Keuangan'}
          </h2>

          <button onClick={handleLogout} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            <ArrowLeft size={15} /> Lihat Tampilan Publik
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}
