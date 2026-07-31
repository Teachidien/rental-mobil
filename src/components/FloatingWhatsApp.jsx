import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [pesan, setPesan] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    const noWA = "6281234567890";
    const defaultText = pesan || "Halo Admin BosAuto Rental, saya ingin bertanya ketersediaan armada mobil.";
    const url = `https://api.whatsapp.com/send?phone=${noWA}&text=${encodeURIComponent(defaultText)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setPesan('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999 }}>
      {/* Pop-up Chat Card */}
      {isOpen && (
        <div className="glass-panel" style={{
          width: '300px',
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
              <strong style={{ fontSize: '0.9rem' }}>CS BosAuto Standby</strong>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.4 }}>
            Halo! Ada yang bisa kami bantu mengenai sewa mobil hari ini? 🚗
          </p>

          <form onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Tulis pesan pertanyaan..."
              className="form-input"
              style={{ fontSize: '0.85rem', marginBottom: '8px' }}
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
            />
            <button type="submit" className="btn btn-success" style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}>
              <Send size={14} /> Kirim ke WhatsApp
            </button>
          </form>
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
        title="Chat WhatsApp CS 24 Jam"
      >
        <MessageCircle size={28} />
      </button>
    </div>
  );
}
