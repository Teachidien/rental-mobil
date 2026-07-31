import React, { useState } from 'react';
import { MessageCircle, X, Send, User, Phone } from 'lucide-react';

export default function FloatingWhatsApp({ adminWaList = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pesan, setPesan] = useState('');

  const safeList = Array.isArray(adminWaList) && adminWaList.length > 0
    ? adminWaList
    : [{ id: 'def-1', namaCs: 'Admin CS 24 Jam', noHp: '6281234567890', jabatan: 'Customer Care' }];

  const handleSendToCs = (cs) => {
    const noWA = cs.noHp || '6281234567890';
    const defaultText = pesan || `Halo ${cs.namaCs}, saya ingin bertanya mengenai sewa mobil di BosAuto Rental.`;
    const url = `https://api.whatsapp.com/send?phone=${noWA}&text=${encodeURIComponent(defaultText)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setPesan('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999 }}>
      {/* Pop-up Multi-Admin Chat Card */}
      {isOpen && (
        <div className="glass-panel" style={{
          width: '320px',
          padding: '16px',
          marginBottom: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--accent-primary)',
          borderRadius: '16px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--status-available)', display: 'inline-block' }}></span>
              <strong style={{ fontSize: '0.9rem' }}>Pilih Admin CS WA</strong>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.4 }}>
            Halo! Pilih salah satu Tim CS Admin kami yang sedang online untuk berkonsultasi:
          </p>

          {/* List Multi-Admin Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {safeList.map((cs) => (
              <button
                key={cs.id}
                onClick={() => handleSendToCs(cs)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ background: 'rgba(16,185,129,0.15)', padding: '6px', borderRadius: '50%' }}>
                    <User size={16} color="var(--status-available)" />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', display: 'block' }}>{cs.namaCs}</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{cs.jabatan || 'CS Online'}</span>
                  </div>
                </div>

                <div style={{ background: 'var(--status-available)', padding: '6px', borderRadius: '8px', color: '#fff' }}>
                  <Phone size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
          transition: 'transform 0.2s ease'
        }}
        title="Chat WhatsApp Multi CS Admin 24 Jam"
      >
        <MessageCircle size={28} />
      </button>
    </div>
  );
}
