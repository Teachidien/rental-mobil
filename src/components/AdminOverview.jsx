import React from 'react';
import { Car, CheckCircle, Clock, DollarSign } from 'lucide-react';

export default function AdminOverview({ armadaList = [], jadwalList = [], pembukuanList = [] }) {
  const safeArmada = Array.isArray(armadaList) ? armadaList : [];
  const safePembukuan = Array.isArray(pembukuanList) ? pembukuanList : [];

  const totalArmada = safeArmada.length;
  const unitDisewa = safeArmada.filter(a => a && a.status === 'Disewa').length;
  const unitTersedia = safeArmada.filter(a => a && a.status === 'Tersedia').length;

  // Hitung total pemasukan
  const totalPemasukan = safePembukuan
    .filter(p => p && p.jenis === 'Pemasukan')
    .reduce((acc, curr) => acc + Number(curr.jumlah || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Armada</span>
              <h3 style={{ fontSize: '1.8rem', marginTop: '4px' }}>{totalArmada} Unit</h3>
            </div>
            <div style={{ background: 'var(--accent-glow)', padding: '10px', borderRadius: '12px' }}>
              <Car color="var(--accent-primary)" size={24} />
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--status-available)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unit Tersedia</span>
              <h3 style={{ fontSize: '1.8rem', marginTop: '4px', color: 'var(--status-available)' }}>{unitTersedia} Unit</h3>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.15)', padding: '10px', borderRadius: '12px' }}>
              <CheckCircle color="var(--status-available)" size={24} />
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--status-rented)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sedang Disewa</span>
              <h3 style={{ fontSize: '1.8rem', marginTop: '4px', color: 'var(--status-rented)' }}>{unitDisewa} Unit</h3>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.15)', padding: '10px', borderRadius: '12px' }}>
              <Clock color="var(--status-rented)" size={24} />
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--accent-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pemasukan Catatan</span>
              <h3 style={{ fontSize: '1.4rem', marginTop: '6px', color: 'var(--accent-secondary)' }}>
                Rp {totalPemasukan.toLocaleString('id-ID')}
              </h3>
            </div>
            <div style={{ background: 'rgba(6,182,212,0.15)', padding: '10px', borderRadius: '12px' }}>
              <DollarSign color="var(--accent-secondary)" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Overview Table Quick Glance */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Car size={18} color="var(--accent-secondary)" /> Status Ringkas Armada Kendaraan
        </h4>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 8px' }}>Mobil</th>
                <th style={{ padding: '12px 8px' }}>Tipe</th>
                <th style={{ padding: '12px 8px' }}>Transmisi</th>
                <th style={{ padding: '12px 8px' }}>Harga / Hari</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {safeArmada.map((mobil) => (
                <tr key={mobil.id || Math.random()} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 600 }}>{mobil.nama || 'Mobil'}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{mobil.tipe || '-'}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{mobil.transmisi || '-'}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--accent-secondary)' }}>Rp {Number(mobil.harga || 0).toLocaleString('id-ID')}</td>
                  <td style={{ padding: '12px 8px' }}>
                    <span className={`badge ${mobil.status === 'Tersedia' ? 'badge-available' : mobil.status === 'Disewa' ? 'badge-rented' : 'badge-maintenance'}`}>
                      {mobil.status || 'Tersedia'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
