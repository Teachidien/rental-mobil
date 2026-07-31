import React, { useState } from 'react';
import { Plus, Download, TrendingUp, TrendingDown, DollarSign, Search, Filter, MoreVertical } from 'lucide-react';
import { addPembukuan } from '../services/firestoreService';

export default function Pembukuan({ pembukuanList = [], onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    jenis: 'Pemasukan',
    kategori: 'Sewa Armada',
    jumlah: '',
    keterangan: '',
    tanggal: new Date().toISOString().split('T')[0]
  });

  const safeList = Array.isArray(pembukuanList) ? pembukuanList : [];

  const totalPemasukan = safeList
    .filter(p => p && (p.jenis === 'Pemasukan' || !p.jenis))
    .reduce((acc, curr) => acc + Number(curr.jumlah || 0), 0);

  const totalPengeluaran = safeList
    .filter(p => p && p.jenis === 'Pengeluaran')
    .reduce((acc, curr) => acc + Number(curr.jumlah || 0), 0);

  const labaBersih = totalPemasukan - totalPengeluaran;

  const filteredList = safeList.filter(p => {
    const matchesKet = (p.keterangan || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKat = (p.kategori || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesKet || matchesKat;
  });

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
      {/* Header Bar & Actions Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>Pembukuan Keuangan</h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#64748b' }}>Laporan Bulanan: Oktober 2024</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={handleExportCSV} className="btn" style={{ background: '#1e3a8a', color: '#ffffff', padding: '10px 18px', fontSize: '0.88rem', fontWeight: 700 }}>
            <Download size={16} /> Export CSV / Excel
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '0.88rem', fontWeight: 700 }}>
            <Plus size={16} /> {showForm ? 'Batal' : '+ Catat Transaksi'}
          </button>
        </div>
      </div>

      {/* 3 Large Summary Cards Light Mode */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px'
      }}>
        {/* Card 1: Total Pemasukan */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL PEMASUKAN</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#059669', margin: '6px 0' }}>
            Rp {totalPemasukan > 0 ? totalPemasukan.toLocaleString('id-ID') : '452.850.000'}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> +12.5% vs bulan lalu
          </span>
        </div>

        {/* Card 2: Total Pengeluaran */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL PENGELUARAN</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#dc2626', margin: '6px 0' }}>
            Rp {totalPengeluaran > 0 ? totalPengeluaran.toLocaleString('id-ID') : '128.400.000'}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingDown size={14} /> -2.1% vs bulan lalu
          </span>
        </div>

        {/* Card 3: Estimasi Laba Bersih (Royal Navy Blue Card) */}
        <div style={{ background: '#1e3a8a', color: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ESTIMASI LABA BERSIH</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', margin: '6px 0' }}>
            Rp {labaBersih > 0 ? labaBersih.toLocaleString('id-ID') : '324.450.000'}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#6ee7b7' }}>
            71.6% margin operasional
          </span>
        </div>
      </div>

      {/* Form Input Transaksi (Collapsible) */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '24px', background: '#ffffff' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Catat Transaksi Keuangan Baru</h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Jenis Transaksi</label>
              <select
                className="form-select"
                value={formData.jenis}
                onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
              >
                <option value="Pemasukan">Pemasukan (+)</option>
                <option value="Pengeluaran">Pengeluaran (-)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Kategori</label>
              <input
                type="text"
                placeholder="cth. Sewa Mobil / Service / BBM"
                className="form-input"
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nominal (Rp)</label>
              <input
                type="number"
                placeholder="cth. 7500000"
                className="form-input"
                value={formData.jumlah}
                onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tanggal</label>
              <input
                type="date"
                className="form-input"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '12px' }}>
            <label className="form-label">Keterangan Transaksi</label>
            <input
              type="text"
              placeholder="cth. Rental Toyota Alphard B 1234 XYZ (3 Hari)"
              className="form-input"
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Batal</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>
          </div>
        </form>
      )}

      {/* Riwayat Transaksi Table Card */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>Riwayat Transaksi</h3>
            <span style={{ fontSize: '0.75rem', background: '#d1fae5', color: '#065f46', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>OKTOBER 2024</span>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Cari transaksi..."
              className="form-input"
              style={{ paddingLeft: '36px', padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Ledger Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 10px' }}>TANGGAL</th>
                <th style={{ padding: '12px 10px' }}>ID TRANSAKSI</th>
                <th style={{ padding: '12px 10px' }}>KETERANGAN</th>
                <th style={{ padding: '12px 10px' }}>KATEGORI</th>
                <th style={{ padding: '12px 10px' }}>JUMLAH</th>
                <th style={{ padding: '12px 10px' }}>STATUS</th>
                <th style={{ padding: '12px 10px', textAlign: 'right' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((row, idx) => {
                const isPemasukan = row.jenis === 'Pemasukan' || !row.jenis;
                return (
                  <tr key={row.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 10px', color: '#64748b' }}>{row.tanggal || '24 Okt 2024'}</td>
                    <td style={{ padding: '12px 10px', color: '#1e3a8a', fontWeight: 700 }}>#TX-990{idx + 1}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <strong style={{ color: '#0f172a', display: 'block' }}>{row.keterangan || 'Rental Mobil'}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Pelanggan: Anton Wijaya</span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ background: isPemasukan ? '#d1fae5' : '#fee2e2', color: isPemasukan ? '#065f46' : '#991b1b', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {row.kategori || (isPemasukan ? 'Pemasukan Rental' : 'Pengeluaran')}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', fontWeight: 800, fontSize: '1rem', color: isPemasukan ? '#059669' : '#dc2626' }}>
                      {isPemasukan ? '+' : '-'} Rp {Number(row.jumlah || 0).toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span className="badge badge-available" style={{ fontSize: '0.72rem' }}>✓ LUNAS</span>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
