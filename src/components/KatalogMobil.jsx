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

        {/* Grid List Armada */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredArmada.map(mobil => (
            <div key={mobil.id || Math.random()} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Foto Unit Armada */}
              <div style={{ height: '200px', width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#1e293b' }}>
                <img
                  src={mobil.gambar || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                  alt={mobil.nama || 'Mobil'}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect width="800" height="400" fill="%231e293b"/><text x="50%" y="50%" font-size="32" fill="%2394a3b8" text-anchor="middle" dominant-baseline="middle">Foto Mobil BosAuto</text></svg>';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                />
              </div>

              {/* Detail Info Armada */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{mobil.nama || 'Mobil Rental'}</h3>
                      <span className={`badge ${mobil.status === 'Tersedia' ? 'badge-available' : mobil.status === 'Disewa' ? 'badge-rented' : 'badge-maintenance'}`}>
                        {mobil.status || 'Tersedia'}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                      {mobil.tipe || 'MPV'}
                    </span>
                  </div>

                  {/* Specification Badges */}
                  <div style={{ display: 'flex', gap: '14px', color: 'var(--text-muted)', fontSize: '0.85rem', margin: '14px 0 20px 0' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={15} color="var(--accent-secondary)" /> {mobil.kapasitas || 5} Seat
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Settings size={15} color="var(--accent-secondary)" /> {mobil.transmisi || 'Automatic'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Fuel size={15} color="var(--accent-secondary)" /> {mobil.bbm || 'Bensin'}
                    </span>
                  </div>
                </div>

                {/* Price & Action Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Harga Sewa</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                      Rp {Number(mobil.harga || 0).toLocaleString('id-ID')}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> / hari</span>
                  </div>

                  <button
                    onClick={() => onSelectMobil && onSelectMobil(mobil)}
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <MessageCircle size={15} /> Hitung & Sewa
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
