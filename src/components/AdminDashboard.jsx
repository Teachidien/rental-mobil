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
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc', color: '#0f172a' }}>
      {/* Admin Sidebar Light Executive */}
      <aside style={{
        width: '260px',
        borderRight: '1px solid #e2e8f0',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#ffffff'
      }}>
        <div>
          {/* Admin Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', paddingLeft: '8px' }}>
            <div style={{ background: '#059669', padding: '8px', borderRadius: '8px' }}>
              <Car color="#ffffff" size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#1e3a8a', fontWeight: 800 }}>
                Admin Panel
              </h4>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>FLEET OPERATIONS</span>
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
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive ? '#059669' : 'transparent',
                    color: isActive ? '#ffffff' : '#64748b',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={18} color={isActive ? '#ffffff' : '#64748b'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Back to Public Button */}
        <div>
          <button
            onClick={onLogout}
            className="btn btn-secondary"
            style={{ width: '100%', marginBottom: '16px', fontSize: '0.82rem', padding: '8px' }}
          >
            <ArrowLeft size={14} /> Lihat Tampilan Publik
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <div>
              <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>Admin User</strong>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Fleet Manager</span>
            </div>
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '4px' }}
              title="Keluar Admin"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content View Area */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto', background: '#f8fafc' }}>
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#047857', margin: 0, fontWeight: 800 }}>
            {activeTab === 'overview' ? 'Dashboard Overview' :
             activeTab === 'armada' ? 'Manajemen Armada Kendaraan' :
             activeTab === 'jadwal' ? 'Penjadwalan & Log Sewa' :
             activeTab === 'pembukuan' ? 'Pembukuan Keuangan' : 'Pengaturan Kontak WA'}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-available" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              🟢 Live System: Stable
            </span>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              <ArrowLeft size={15} /> Lihat Publik
            </button>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
