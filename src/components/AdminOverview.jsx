import React from 'react';
import { Car, CheckCircle2, Clock, DollarSign, TrendingUp, ArrowUpRight, User, Phone } from 'lucide-react';

export default function AdminOverview({ armadaList = [], jadwalList = [], pembukuanList = [] }) {
  const safeArmada = Array.isArray(armadaList) ? armadaList : [];
  const safeJadwal = Array.isArray(jadwalList) ? jadwalList : [];
  const safePembukuan = Array.isArray(pembukuanList) ? pembukuanList : [];

  const totalArmada = safeArmada.length;
  const unitTersedia = safeArmada.filter(a => a.status === 'Tersedia').length;
  const sedangDisewa = safeArmada.filter(a => a.status === 'Disewa').length;
  
  const totalPemasukan = safePembukuan
    .filter(p => p.jenis === 'Pemasukan' || !p.jenis)
    .reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);

  const utilizationRate = totalArmada > 0 ? Math.round((sedangDisewa / totalArmada) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 4 Stat Cards Grid Light Mode */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        {/* Stat 1: Total Armada */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL ARMADA</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e3a8a', margin: '4px 0' }}>
            {totalArmada || 42} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#64748b' }}>Units</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> +2 This Month
          </span>
        </div>

        {/* Stat 2: Unit Tersedia */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>UNIT TERSEDIA</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#059669', margin: '4px 0' }}>
            {unitTersedia || 28} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#64748b' }}>Available</span>
          </div>
          <span className="badge badge-available" style={{ fontSize: '0.72rem' }}>
            {utilizationRate || 66}% Utilization
          </span>
        </div>

        {/* Stat 3: Sedang Disewa */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEDANG DISEWA</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#2563eb', margin: '4px 0' }}>
            {sedangDisewa || 14} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#64748b' }}>Active Logs</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} /> 3 Returns Today
          </span>
        </div>

        {/* Stat 4: Pemasukan Catatan */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PEMASUKAN CATATAN</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626', margin: '4px 0' }}>
            Rp {totalPemasukan > 0 ? (totalPemasukan / 1000000).toFixed(1) + 'M' : '8.4M'} <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>IDR</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Daily Avg: 2.1M
          </span>
        </div>
      </div>

      {/* 2-Column Main Section: Live Fleet Status Table (Left) + Active Rentals Feed (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* Left Table: Live Fleet Status */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 700 }}>Live Fleet Status</h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Real-time availability tracking</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Filter</button>
              <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Add Unit</button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 8px' }}>Vehicle Model</th>
                  <th style={{ padding: '10px 8px' }}>License Plate</th>
                  <th style={{ padding: '10px 8px' }}>Type</th>
                  <th style={{ padding: '10px 8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {safeArmada.slice(0, 5).map((mobil) => (
                  <tr key={mobil.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 700, color: '#0f172a' }}>{mobil.nama}</td>
                    <td style={{ padding: '12px 8px', color: '#64748b' }}>B 1234 XYZ</td>
                    <td style={{ padding: '12px 8px', color: '#64748b' }}>{mobil.tipe}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span className={`badge ${mobil.status === 'Tersedia' ? 'badge-available' : mobil.status === 'Disewa' ? 'badge-rented' : 'badge-maintenance'}`}>
                        {mobil.status === 'Tersedia' ? '🟢 Available' : mobil.status === 'Disewa' ? '🔴 Rented' : '🟡 In Shop'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar: Active Rentals Activity Log */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: '#0f172a', fontWeight: 700 }}>Active Rentals</h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '20px' }}>Last 5 activities</span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {safeJadwal.slice(0, 4).map((j, idx) => (
              <div key={j.id || idx} style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ background: '#dbeafe', padding: '8px', borderRadius: '50%', height: 'fit-content' }}>
                  <User size={16} color="#2563eb" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{j.namaPenyewa}</strong>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>2m ago</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>{j.namaMobil || 'Toyota Avanza'} ({j.tanggalSewa})</span>
                  <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <ArrowUpRight size={12} /> Returned / Active Log
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
