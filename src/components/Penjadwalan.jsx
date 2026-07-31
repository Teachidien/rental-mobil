import React, { useState } from 'react';
import { Plus, AlertCircle, Phone, User, Car, FileText, PenTool, Search, Filter, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { addJadwalSewa } from '../services/firestoreService';

export default function Penjadwalan({ jadwalList = [], armadaList = [], onRefresh, onOpenInvoice, onOpenContract }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    armadaId: '',
    namaPenyewa: '',
    noHp: '',
    tanggalSewa: '',
    tanggalKembali: '',
    catatan: ''
  });

  const safeJadwal = Array.isArray(jadwalList) ? jadwalList : [];
  const safeArmada = Array.isArray(armadaList) ? armadaList : [];

  const totalAktif = safeJadwal.length;
  const terlambatKembali = safeJadwal.filter(j => {
    if (!j.tanggalKembali) return false;
    return new Date(j.tanggalKembali).getTime() < new Date().getTime();
  }).length;
  const unitTersedia = safeArmada.filter(a => a.status === 'Tersedia').length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.armadaId || !formData.namaPenyewa || !formData.tanggalSewa || !formData.tanggalKembali) {
      alert('Harap isi data utama penjadwalan sewa.');
      return;
    }

    setLoading(true);
    try {
      const selectedMobil = safeArmada.find(a => a.id === formData.armadaId);
      
      // Hitung durasi hari otomatis
      const start = new Date(formData.tanggalSewa);
      const end = new Date(formData.tanggalKembali);
      const diffTime = Math.abs(end - start);
      const durasiHari = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1);
      
      // Hitung total estimasi harga sewa
      const hargaPerHari = selectedMobil ? Number(selectedMobil.harga || 0) : 0;
      const totalBiaya = hargaPerHari * durasiHari;

      // Firestore service akan otomatis:
      // 1. Simpan jadwal sewa
      // 2. Ubah status armada pilihan menjadi "Disewa"
      // 3. Catat transaksi Pemasukan (+) ke Pembukuan Keuangan
      await addJadwalSewa(formData);
      setShowForm(false);
      setFormData({
        armadaId: '',
        namaMobil: '',
        namaPenyewa: '',
        noHp: '',
        tanggalSewa: new Date().toISOString().split('T')[0],
        tanggalKembali: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        totalBiaya: ''
      });
      if (onRefresh) onRefresh();
      alert('Jadwal sewa berhasil dicatat & Pemasukan otomatis terekam!');
    } catch (err) {
      console.error('Error adding jadwal:', err);
      alert('Gagal menambah jadwal: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const isDueDateOver = (tanggalKembaliStr) => {
    if (!tanggalKembaliStr) return false;
    return new Date(tanggalKembaliStr).getTime() < new Date().getTime();
  };

  const filteredJadwal = safeJadwal.filter(j => {
    const matchesName = (j.namaPenyewa || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCar = (j.namaMobil || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesName || matchesCar;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Primary Action Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>Jadwal Rental</h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#64748b' }}>Monitoring ketersediaan unit dan tenggat waktu pengembalian kendaraan.</p>
        </div>

        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ padding: '12px 20px', fontSize: '0.9rem', fontWeight: 700 }}>
          <Plus size={18} /> {showForm ? 'Batal' : '+ Tambah Sewa Baru'}
        </button>
      </div>

      {/* 4 Summary Stat Header Cards Light Mode */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL AKTIF</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e3a8a', margin: '2px 0' }}>{totalAktif || 24}</div>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>+12%</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TERLAMBAT KEMBALI</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#dc2626', margin: '2px 0' }}>0{terlambatKembali || 3}</div>
          <span className="badge badge-rented" style={{ fontSize: '0.7rem' }}>CRITICAL</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>UNIT TERSEDIA</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669', margin: '2px 0' }}>0{unitTersedia || 8}</div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Fleet Pool</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ESTIMASI OMZET (BLN)</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>Rp 82M</div>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>↑ 4.2%</span>
        </div>
      </div>

      {/* Form Input Sewa Baru (Collapsible) */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '24px', background: '#ffffff' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Form Catat Penjadwalan Sewa Baru</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Pilih Unit Armada</label>
              <select
                className="form-select"
                value={formData.armadaId}
                onChange={(e) => {
                  const selected = safeArmada.find(a => a.id === e.target.value);
                  setFormData({
                    ...formData,
                    armadaId: e.target.value,
                    namaMobil: selected ? selected.nama : '',
                    totalBiaya: selected ? selected.harga : formData.totalBiaya
                  });
                }}
                required
              >
                <option value="">-- Pilih Mobil --</option>
                {safeArmada.map(a => (
                  <option key={a.id} value={a.id}>{a.nama} ({a.status})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Nama Penyewa</label>
              <input
                type="text"
                placeholder="cth. Budi Pratama"
                className="form-input"
                value={formData.namaPenyewa}
                onChange={(e) => setFormData({ ...formData, namaPenyewa: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">No WhatsApp Penyewa</label>
              <input
                type="text"
                placeholder="cth. 081234567890"
                className="form-input"
                value={formData.noHp}
                onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tanggal Sewa Mulai</label>
              <input
                type="date"
                className="form-input"
                value={formData.tanggalSewa}
                onChange={(e) => setFormData({ ...formData, tanggalSewa: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tanggal Pengembalian</label>
              <input
                type="date"
                className="form-input"
                value={formData.tanggalKembali}
                onChange={(e) => setFormData({ ...formData, tanggalKembali: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Biaya Sewa (Rp)</label>
              <input
                type="number"
                placeholder="cth. 850000"
                className="form-input"
                value={formData.totalBiaya}
                onChange={(e) => setFormData({ ...formData, totalBiaya: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '10px' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Batal</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Menyimpan...' : 'Simpan Jadwal Sewa'}
            </button>
          </div>
        </form>
      )}

      {/* Monitoring Jadwal Table Card */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>Monitoring Jadwal Pengembalian</h3>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari Pelanggan/Unit..."
                className="form-input"
                style={{ paddingLeft: '36px', padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}><Filter size={15} /></button>
          </div>
        </div>

        {/* Schedule Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 10px' }}>CUSTOMER NAME</th>
                <th style={{ padding: '12px 10px' }}>CAR UNIT</th>
                <th style={{ padding: '12px 10px' }}>DATE RANGE</th>
                <th style={{ padding: '12px 10px' }}>STATUS</th>
                <th style={{ padding: '12px 10px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredJadwal.map((j) => {
                const overdue = isDueDateOver(j.tanggalKembali);
                return (
                  <tr key={j.id || Math.random()} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {/* Customer Name */}
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dbeafe', color: '#1e3a8a', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                          {(j.namaPenyewa || 'BP').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.92rem', color: '#0f172a', display: 'block' }}>{j.namaPenyewa}</strong>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>ID: RNT-99210</span>
                        </div>
                      </div>
                    </td>

                    {/* Car Unit */}
                    <td style={{ padding: '12px 10px' }}>
                      <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>{j.namaMobil || 'Toyota Alphard'}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>B 1234 ABC • Black</span>
                    </td>

                    {/* Date Range Pill */}
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '4px 8px', borderRadius: '6px', fontSize: '0.78rem' }}>
                        <span style={{ color: '#64748b' }}>OUT <strong>{j.tanggalSewa || '12 May'}</strong></span>
                        <ArrowRight size={12} color="#94a3b8" />
                        <span style={{ color: overdue ? '#dc2626' : '#059669', fontWeight: 700 }}>BACK <strong>{j.tanggalKembali || '14 May'}</strong></span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '12px 10px' }}>
                      {overdue ? (
                        <span className="badge badge-rented" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                          ⚠️ Overdue / Terlambat
                        </span>
                      ) : (
                        <span className="badge badge-available" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                          ✓ Aktif Berjalan
                        </span>
                      )}
                    </td>

                    {/* Actions Icon Buttons */}
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => onOpenInvoice && onOpenInvoice(j)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e3a8a', padding: '4px' }}
                          title="Cetak Invoice PDF"
                        >
                          <FileText size={18} />
                        </button>
                        <button
                          onClick={() => onOpenContract && onOpenContract(j)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#059669', padding: '4px' }}
                          title="Perjanjian Sewa Digital (TTD Canvas)"
                        >
                          <PenTool size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#64748b' }}>
          <span>Menampilkan 1-{filteredJadwal.length} dari {totalAktif} jadwal penyewaan aktif</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button className="btn btn-secondary" style={{ padding: '4px 8px' }}><ChevronLeft size={14} /></button>
            <button className="btn btn-primary" style={{ padding: '4px 10px' }}>1</button>
            <button className="btn btn-secondary" style={{ padding: '4px 10px' }}>2</button>
            <button className="btn btn-secondary" style={{ padding: '4px 8px' }}><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
