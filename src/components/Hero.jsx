import React from 'react';
import { ShieldCheck, Clock, Award, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section style={{ padding: '60px 0 40px 0', textAlign: 'center', position: 'relative' }}>
      {/* Subtle Glow Background Effect */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(11,15,25,0) 70%)',
        zIndex: -1,
        pointerEvents: 'none'
      }}></div>

      <div className="container">
        <span className="badge badge-available" style={{ marginBottom: '16px', padding: '6px 14px' }}>
          <Sparkles size={14} /> Sewa Mobil Tanpa Ribet 100% Bebas Khawatir
        </span>

        <h1 style={{ 
          fontSize: '2.8rem', 
          lineHeight: 1.2, 
          maxWidth: '800px', 
          margin: '0 auto 16px auto',
          background: 'linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Perjalanan Nyaman Dengan Armada Bersih & Siap Pakai
        </h1>

        <p style={{ 
          fontSize: '1.1rem', 
          color: 'var(--text-muted)', 
          maxWidth: '640px', 
          margin: '0 auto 32px auto' 
        }}>
          Pilihan mobil lepas kunci atau dengan driver berpengalaman. Harga jujur tanpa biaya tersembunyi, siap mengantar kemanapun tujuan Anda.
        </p>

        {/* Feature Highlights Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginTop: '40px'
        }}>
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left' }}>
            <ShieldCheck color="var(--accent-secondary)" size={28} style={{ marginBottom: '10px' }} />
            <h4 style={{ marginBottom: '6px' }}>Mobil Selalu Prima</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Rutin service berkala di bengkel resmi & disinfeksi sebelum diserahterimakan.</p>
          </div>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left' }}>
            <Clock color="var(--accent-primary)" size={28} style={{ marginBottom: '10px' }} />
            <h4 style={{ marginBottom: '6px' }}>Layanan 24/7</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Tim customer care siap membantu proses booking & kendala darurat kapanpun.</p>
          </div>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left' }}>
            <Award color="var(--status-available)" size={28} style={{ marginBottom: '10px' }} />
            <h4 style={{ marginBottom: '6px' }}>Harga Transparan</h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Tanpa biaya tambahan tersembunyi. Apa yang tertera di kalkulator adalah harga pasti.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
