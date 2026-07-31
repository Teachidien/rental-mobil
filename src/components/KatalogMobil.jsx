import React, { useState } from 'react';
import { Users, Fuel, Settings, Search, MessageCircle } from 'lucide-react';

export default function KatalogMobil({ armadaList = [], onSelectMobil }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipe, setSelectedTipe] = useState('Semua');
  const [selectedTransmisi, setSelectedTransmisi] = useState('Semua');

  // Filter Logic Aman
  const filteredArmada = (Array.isArray(armadaList) ? armadaList : []).filter(item => {
    if (!item || typeof item !== 'object') return false;
    const matchSearch = (item.nama || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipe = selectedTipe === 'Semua' || item.tipe === selectedTipe;
    const matchTransmisi = selectedTransmisi === 'Semua' || item.transmisi === selectedTransmisi;
    return matchSearch && matchTipe && matchTransmisi;
  });

  const tipeOptions = ['Semua', 'City Car', 'MPV', 'SUV Premium'];
  const transmisiOptions = ['Semua', 'Automatic', 'Manual'];

  return (
    <section id="katalog" style={{ padding: '40px 0 60px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2>Pilihan Armada Siap Pakai</h2>
          <p style={{ color: 'var(--text-muted)' }}>Pilih unit kendaraan sesuai kebutuhan perjalanan keluarga atau bisnis Anda</p>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-panel" style={{ padding: '16px', marginBottom: '32px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Cari nama mobil..."
              className="form-input"
              style={{ paddingLeft: '38px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tipe Filter */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {tipeOptions.map(tipe => (
              <button
                key={tipe}
                onClick={() => setSelectedTipe(tipe)}
                className={`btn ${selectedTipe === tipe ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                {tipe}
              </button>
            ))}
          </div>

          {/* Transmisi Filter */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {transmisiOptions.map(transmisi => (
              <button
                key={transmisi}
                onClick={() => setSelectedTransmisi(transmisi)}
                className={`btn ${selectedTransmisi === transmisi ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                {transmisi}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Kartu Armada Light Mode */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredArmada.map(mobil => (
            <div key={mobil.id || Math.random()} style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Foto Unit Armada + Status Badge Overlay */}
              <div style={{ height: '190px', width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                <img
                  src={mobil.gambar || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                  alt={mobil.nama || 'Mobil'}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect width="800" height="400" fill="%23e2e8f0"/><text x="50%" y="50%" font-size="28" fill="%2364748b" text-anchor="middle" dominant-baseline="middle">BosAuto Fleet</text></svg>';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span className={`badge ${mobil.status === 'Tersedia' ? 'badge-available' : mobil.status === 'Disewa' ? 'badge-rented' : 'badge-maintenance'}`} style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {mobil.status === 'Tersedia' ? '🟢 TERSEDIA' : mobil.status === 'Disewa' ? '🔴 DISEWA' : '🟡 SERVICE'}
                </span>
              </div>

              {/* Detail Info Armada */}
              <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', margin: '0 0 6px 0', fontWeight: 700 }}>
                    {mobil.nama || 'Mobil Rental'}
                  </h3>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
                    {mobil.tipe || 'MPV'} • {mobil.kapasitas || 7} Seats • {mobil.transmisi || 'Automatic'}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>STARTING FROM</span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                      Rp {Number(mobil.harga || 0).toLocaleString('id-ID')}
                      <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>/day</span>
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectMobil && onSelectMobil(mobil)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    Hitung & Sewa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
