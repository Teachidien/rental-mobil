import React, { useState } from 'react';
import { Plus, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { addPembukuan } from '../services/firestoreService';

export default function Pembukuan({ pembukuanList = [], onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jenis: 'Pemasukan',
    kategori: 'Sewa Armada',
    jumlah: '',
    keterangan: '',
    tanggal: new Date().toISOString().split('T')[0]
  });

  const safePembukuan = Array.isArray(pembukuanList) ? pembukuanList : [];

  const totalPemasukan = safePembukuan
    .filter(p => p && p.jenis === 'Pemasukan')
    .reduce((acc, curr) => acc + Number(curr.jumlah || 0), 0);

  const totalPengeluaran = safePembukuan
    .filter(p => p && p.jenis === 'Pengeluaran')
    .reduce((acc, curr) => acc + Number(curr.jumlah || 0), 0);

  const labaBersih = totalPemasukan - totalPengeluaran;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.jumlah || !formData.tanggal) {
      alert('Harap lengkapi nominal dan tanggal transaksi.');
      return;
    }

    setLoading(true);
    try {
      await addPembukuan({
        ...formData,
        jumlah: Number(formData.jumlah)
      });
      setShowForm(false);
      setFormData({
        jenis: 'Pemasukan',
        kategori: 'Sewa Armada',
        jumlah: '',
        keterangan: '',
        tanggal: new Date().toISOString().split('T')[0]
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error adding pembukuan:', err);
      alert('Gagal mencatat pembukuan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper Export CSV
  const handleExportCSV = () => {
    if (safePembukuan.length === 0) {
      alert('Tidak ada data pembukuan untuk diexport.');
      return;
    }

    const headers = ['ID,Tanggal,Jenis,Kategori,Jumlah (Rp),Keterangan'];
    const rows = safePembukuan.map(p => 
      `"${p.id}","${p.tanggal}","${p.jenis}","${p.kategori}","${p.jumlah}","${(p.keterangan || '').replace(/"/g, '""')}"`
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan_pembukuan_rental_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Financial Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--status-available)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Pemasukan</span>
              <h3 style={{ fontSize: '1.5rem', marginTop: '4px', color: 'var(--status-available)' }}>
                Rp {totalPemasukan.toLocaleString('id-ID')}
              </h3>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.15)', padding: '10px', borderRadius: '12px' }}>
              <TrendingUp color="var(--status-available)" size={24} />
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--status-rented)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Pengeluaran</span>
              <h3 style={{ fontSize: '1.5rem', marginTop: '4px', color: 'var(--status-rented)' }}>
                Rp {totalPengeluaran.toLocaleString('id-ID')}
              </h3>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.15)', padding: '10px', borderRadius: '12px' }}>
              <TrendingDown color="var(--status-rented)" size={24} />
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--accent-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimasi Laba Bersih</span>
              <h3 style={{ fontSize: '1.5rem', marginTop: '4px', color: 'var(--accent-secondary)' }}>
                Rp {labaBersih.toLocaleString('id-ID')}
              </h3>
            </div>
            <div style={{ background: 'rgba(6,182,212,0.15)', padding: '10px', borderRadius: '12px' }}>
              <DollarSign color="var(--accent-secondary)" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Catatan Pembukuan & Transaksi</h3>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Catat arus kas masuk dan keluar unit rental mobil Anda.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            <Download size={16} /> Export CSV
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            <Plus size={16} /> {showForm ? 'Batal' : 'Catat Transaksi'}
          </button>
        </div>
      </div>

      {/* Form Catat Transaksi */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
            Form Input Transaksi Keuangan
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Jenis Transaksi</label>
              <select
                value={formData.jenis}
                onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
              >
                <option value="Pemasukan">Pemasukan (+)</option>
                <option value="Pengeluaran">Pengeluaran (-)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Kategori</label>
              <input
                type="text"
                placeholder="cth. Sewa Armada, Service, Bensin, Gaji Driver"
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Nominal (Rp)</label>
              <input
                type="number"
                placeholder="cth. 350000"
                value={formData.jumlah}
                onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Tanggal Transaksi</label>
              <input
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Keterangan / Detail</label>
            <input
              type="text"
              placeholder="Catatan tambahan (Opsional)"
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Batal</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>
          </div>
        </form>
      )}

      {/* Tabel Data Pembukuan */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h4 style={{ marginBottom: '16px' }}>Riwayat Transaksi Keuangan ({safePembukuan.length})</h4>

        {safePembukuan.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Belum ada catatan pembukuan transaksi. Klik "Catat Transaksi" untuk memulai.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 8px' }}>Tanggal</th>
                  <th style={{ padding: '12px 8px' }}>Jenis</th>
                  <th style={{ padding: '12px 8px' }}>Kategori</th>
                  <th style={{ padding: '12px 8px' }}>Nominal</th>
                  <th style={{ padding: '12px 8px' }}>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {safePembukuan.map((p) => (
                  <tr key={p.id || Math.random()} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{p.tanggal}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span className={p.jenis === 'Pemasukan' ? 'badge badge-available' : 'badge badge-rented'}>
                        {p.jenis}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', fontWeight: 600 }}>{p.kategori}</td>
                    <td style={{ 
                      padding: '12px 8px', 
                      fontWeight: 600, 
                      color: p.jenis === 'Pemasukan' ? 'var(--status-available)' : 'var(--status-rented)' 
                    }}>
                      {p.jenis === 'Pemasukan' ? '+' : '-'} Rp {Number(p.jumlah || 0).toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{p.keterangan || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
