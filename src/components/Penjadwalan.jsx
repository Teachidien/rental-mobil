import React, { useState } from 'react';
import { Plus, AlertCircle, Phone, User, Car, FileText, PenTool } from 'lucide-react';
import { addJadwalSewa } from '../services/firestoreService';

export default function Penjadwalan({ jadwalList = [], armadaList = [], onRefresh, onOpenInvoice, onOpenContract }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
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
      await addJadwalSewa({
        ...formData,
        namaMobil: selectedMobil ? selectedMobil.nama : 'Mobil Rental',
        durasiHari,
        totalBiaya,
        status: 'Aktif'
      });

      setShowForm(false);
      setFormData({ armadaId: '', namaPenyewa: '', noHp: '', tanggalSewa: '', tanggalKembali: '', catatan: '' });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error adding jadwal:', err);
      alert('Gagal menambah jadwal sewa: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const isDueDateOver = (tanggalKembaliStr) => {
    if (!tanggalKembaliStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const returnDate = new Date(tanggalKembaliStr);
    return returnDate < today;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Penjadwalan & Monitoring Due Date</h3>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Catat booking penyewa. Status armada & pembukuan pemasukan akan terisi secara otomatis!
          </p>
        </div>

        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
          <Plus size={16} /> {showForm ? 'Batal' : 'Tambah Sewa Baru'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            Form Input Sewa Baru (Auto-Update Armada & Pembukuan)
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Pilih Armada Unit</label>
              <select
                value={formData.armadaId}
                onChange={(e) => setFormData({ ...formData, armadaId: e.target.value })}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
              >
                <option value="">-- Pilih Mobil --</option>
                {safeArmada.map(a => (
                  <option key={a.id} value={a.id}>{a.nama} ({a.status})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Nama Penyewa</label>
              <input
                type="text"
                placeholder="cth. Budi Santoso"
                value={formData.namaPenyewa}
                onChange={(e) => setFormData({ ...formData, namaPenyewa: e.target.value })}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>No WhatsApp / HP</label>
              <input
                type="text"
                placeholder="cth. 081234567890"
                value={formData.noHp}
                onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Tanggal Sewa (Mulai)</label>
              <input
                type="date"
                value={formData.tanggalSewa}
                onChange={(e) => setFormData({ ...formData, tanggalSewa: e.target.value })}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Tanggal Pengembalian (Due Date)</label>
              <input
                type="date"
                value={formData.tanggalKembali}
                onChange={(e) => setFormData({ ...formData, tanggalKembali: e.target.value })}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Batal</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Menyimpan...' : 'Simpan & Process Booking'}
            </button>
          </div>
        </form>
      )}

      {/* Grid List Jadwal */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h4 style={{ marginBottom: '16px' }}>Daftar Sewa Aktif ({safeJadwal.length})</h4>

        {safeJadwal.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Belum ada data jadwal penyewaan aktif. Klik "Tambah Sewa Baru" untuk mencatat booking.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 8px' }}>Armada</th>
                  <th style={{ padding: '12px 8px' }}>Penyewa</th>
                  <th style={{ padding: '12px 8px' }}>Kontak</th>
                  <th style={{ padding: '12px 8px' }}>Tgl Sewa</th>
                  <th style={{ padding: '12px 8px' }}>Status Due Date</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Dokumen Digital</th>
                </tr>
              </thead>
              <tbody>
                {safeJadwal.map((j) => {
                  const overdue = isDueDateOver(j.tanggalKembali);
                  return (
                    <tr key={j.id || Math.random()} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 600 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Car size={15} color="var(--accent-primary)" /> {j.namaMobil || 'Mobil'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={14} color="var(--text-muted)" /> {j.namaPenyewa}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={14} /> {j.noHp || '-'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>{j.tanggalSewa} s/d {j.tanggalKembali}</td>
                      <td style={{ padding: '12px 8px' }}>
                        {overdue ? (
                          <span className="badge badge-rented" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <AlertCircle size={12} /> Overdue / Terlambat
                          </span>
                        ) : (
                          <span className="badge badge-available">Berjalan</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            onClick={() => onOpenInvoice && onOpenInvoice(j)}
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                            title="Cetak Invoice PDF"
                          >
                            <FileText size={14} /> Invoice PDF
                          </button>
                          <button
                            onClick={() => onOpenContract && onOpenContract(j)}
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.78rem', color: 'var(--accent-secondary)' }}
                            title="Perjanjian Sewa Digital (TTD Canvas)"
                          >
                            <PenTool size={14} /> E-Contract
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
