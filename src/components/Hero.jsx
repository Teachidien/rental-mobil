import React from 'react';
import { ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react';

export default function Hero() {
  return (
    <section style={{
      position: 'relative',
      padding: '70px 0 60px 0',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'center'
      }}>
        {/* Left Headline */}
        <div>
          <span style={{
            background: 'rgba(5, 150, 105, 0.1)',
            color: 'var(--accent-primary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            padding: '6px 12px',
            borderRadius: '999px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'inline-block',
            marginBottom: '16px'
          }}>
            PREMIER CORPORATE & LUXURY MOBILITY
          </span>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            lineHeight: 1.15,
            marginBottom: '16px',
            color: 'var(--accent-secondary)'
          }}>
            Precision Fleet Management for the Modern Executive.
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            marginBottom: '28px',
            lineHeight: 1.6
          }}>
            Experience reliability and prestige with our curated selection of premium vehicles. Book in seconds, drive with absolute confidence.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a href="#katalog" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
              EXPLORE FLEET <ArrowRight size={18} />
            </a>
            <a href="#kalkulator" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
              OUR SERVICES
            </a>
          </div>
        </div>

        {/* Right Hero Image Card */}
        <div style={{ position: 'relative' }}>
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: '1px solid var(--border-color)',
            background: '#ffffff'
          }}>
            <img
              src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
              alt="BosAuto Executive Fleet"
              style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
