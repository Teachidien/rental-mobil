import React, { useState } from 'react';
import { Plus, Trash2, Phone, User, Check, Settings } from 'lucide-react';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function PengaturanWaAdmin({ adminWaList = [], onRefresh }) {
  const [namaCs, setNamaCs] = useState('');
  const [noHp, setNoHp] = useState('');
  const [jabatan, setJabatan] = useState('Customer Support');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!namaCs || !noHp) {
      alert('Harap isi Nama CS dan Nomor WhatsApp.');
      return;
    }

    setLoading(true);
    try {
      // Format nomor HP ke 62
      let cleanNo = noHp.replace(/\D/g, '');
      if (cleanNo.startsWith('0')) {
        cleanNo = '62' + cleanNo.slice(1);
      }

      await addDoc(collection(db, 'admin_wa'), {
        namaCs,
        noHp: cleanNo,
        jabatan,
        status: 'Online'
      });

      setNamaCs('');
      setNoHp('');
      setJabatan('Customer Support');
      if (onRefresh) onRefresh();
      alert('Nomor CS Admin WhatsApp berhasil ditambahkan!');
    } catch (err) {
      console.error('Error adding admin WA:', err);
      alert('Gagal menambahkan admin WA: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus kontak CS Admin ini?')) {
      try {
        await deleteDoc(doc(db, 'admin_wa', id));
        if (onRefresh) onRefresh();
      } catch (err) {
        alert('Gagal menghapus kontak: ' + err.message);
      }
    }
  };

  const safeList = Array.isArray(adminWaList) ? adminWaList : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Pengaturan Kontak Multi-Admin WhatsApp</h3>
        <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Kelola tim CS/Admin WhatsApp. Kontak yang ditambahkan di sini akan tampil sebagai pilihan di Floating Button WA Halaman Publik!
        </p>
      </div>

      {/* Form Tambah CS Admin WA */}
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h4 style={{ margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          Tambah Kontak CS Admin Baru
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Nama CS / Admin</label>
            <input
              type="text"
              placeholder="cth. Mbak Sarah"
              value={namaCs}
              onChange={(e) => setNamaCs(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Nomor WhatsApp (dengan 08 / 62)</label>
            <input
              type="text"
              placeholder="cth. 081234567890"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Jabatan / Shift</label>
            <input
              type="text"
              placeholder="cth. CS Shift Pagi / Admin Booking"
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-secondary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <button type="submit" disabled={loading} className="btn btn-primary">
            <Plus size={16} /> {loading ? 'Menyimpan...' : 'Simpan CS Admin WA'}
          </button>
        </div>
      </form>

      {/* Tabel Kontak Multi-Admin */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h4 style={{ marginBottom: '16px' }}>Daftar CS Admin Aktif ({safeList.length})</h4>

        {safeList.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Belum ada kontak tambahan. Menggunakan kontak default BosAuto CS 24 Jam.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 8px' }}>Nama CS</th>
                  <th style={{ padding: '12px 8px' }}>No WhatsApp</th>
                  <th style={{ padding: '12px 8px' }}>Jabatan</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {safeList.map((cs) => (
                  <tr key={cs.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 600 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={15} color="var(--accent-primary)" /> {cs.namaCs}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', color: 'var(--accent-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={14} /> +{cs.noHp}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{cs.jabatan || 'Customer Support'}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span className="badge badge-available">🟢 Standby</span>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                      <button onClick={() => handleDelete(cs.id)} className="btn btn-secondary" style={{ padding: '6px', color: 'var(--status-rented)' }}>
                        <Trash2 size={14} />
                      </button>
                    </td>
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
