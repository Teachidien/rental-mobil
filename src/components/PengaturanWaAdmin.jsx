import React, { useState } from 'react';
import { UserPlus, Trash2, Edit2, MessageSquare, Phone, ShieldCheck, Search, ToggleLeft, ToggleRight, Clock, Eye } from 'lucide-react';
import { addWaAdmin, updateWaAdmin, deleteWaAdmin } from '../services/firestoreService';

export default function PengaturanWaAdmin({ waAdminList = [], onRefresh }) {
  const [nama, setNama] = useState('');
  const [nomorWa, setNomorWa] = useState('');
  const [shift, setShift] = useState('Customer Service (Pagi)');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const safeList = Array.isArray(waAdminList) ? waAdminList : [];

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!nama || !nomorWa) {
      alert('Nama Admin dan Nomor WA wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      let formattedNo = nomorWa.trim();
      if (formattedNo.startsWith('0')) {
        formattedNo = '62' + formattedNo.slice(1);
      } else if (!formattedNo.startsWith('62')) {
        formattedNo = '62' + formattedNo;
      }

      await addWaAdmin({
        nama,
        nomorWa: formattedNo,
        shift,
        aktif: true
      });

      setNama('');
      setNomorWa('');
      if (onRefresh) onRefresh();
      alert('Admin WhatsApp berhasil ditambahkan!');
    } catch (err) {
      alert('Gagal menambah admin: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (admin) => {
    try {
      await updateWaAdmin(admin.id, { aktif: !admin.aktif });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Gagal mengubah status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus kontak CS Admin ini?')) {
      try {
        await deleteWaAdmin(id);
        if (onRefresh) onRefresh();
      } catch (err) {
        alert('Gagal menghapus admin: ' + err.message);
      }
    }
  };

  const filteredList = safeList.filter(a =>
    (a.nama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.nomorWa || '').includes(searchTerm)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#1e3a8a', margin: 0, fontWeight: 800 }}>Pengaturan Kontak WA</h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#64748b' }}>Kelola daftar admin WhatsApp yang tampil di widget pengunjung situs.</p>
        </div>

        <div style={{ background: '#d1fae5', border: '1px solid #a7f3d0', color: '#065f46', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Eye size={16} /> STATUS: WIDGET AKTIF
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', color: '#0f172a', fontWeight: 700 }}>Tambah CS Admin Baru</h3>
            
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Nama CS</label>
                <input
                  type="text"
                  placeholder="Contoh: Andi Wijaya"
                  className="form-input"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Nomor WhatsApp</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '10px 14px', borderRadius: '8px', fontWeight: 700, color: '#475569', fontSize: '0.9rem' }}>+62</span>
                  <input
                    type="text"
                    placeholder="8123456789"
                    className="form-input"
                    value={nomorWa}
                    onChange={(e) => setNomorWa(e.target.value)}
                    required
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Jabatan / Shift</label>
                <select
                  className="form-select"
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }}
                >
                  <option value="Customer Service (Pagi)">Customer Service (Pagi)</option>
                  <option value="Sales Fleet Operations">Sales Fleet Operations</option>
                  <option value="CS Malam / Emergency">CS Malam / Emergency</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '12px', width: '100%', marginTop: '8px', fontWeight: 700, background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                <UserPlus size={16} /> {loading ? 'Menyimpan...' : 'SIMPAN ADMIN BARU'}
              </button>
            </form>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LIVE PREVIEW WIDGET</span>
              <span style={{ fontSize: '0.68rem', background: '#e2e8f0', color: '#334155', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>DESKTOP</span>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <div style={{ background: '#059669', color: '#ffffff', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={20} />
                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>Ada yang bisa kami bantu?</strong>
                  <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>Klik admin untuk mulai chat via WA</span>
                </div>
              </div>

              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc' }}>
                {safeList.filter(a => a.aktif).slice(0, 2).map((a, idx) => (
                  <div key={a.id || idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block' }}>{a.nama}</strong>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{a.shift || 'Customer Service'}</span>
                    </div>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', display: 'inline-block' }}></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>Daftar Admin Aktif</h3>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari admin..."
                style={{ width: '100%', padding: '8px 12px 8px 36px', fontSize: '0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 10px' }}>PROFIL ADMIN</th>
                  <th style={{ padding: '12px 10px' }}>NOMOR WA</th>
                  <th style={{ padding: '12px 10px' }}>SHIFT / PERAN</th>
                  <th style={{ padding: '12px 10px' }}>STATUS</th>
                  <th style={{ padding: '12px 10px', textAlign: 'right' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((admin) => (
                  <tr key={admin.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#dbeafe', color: '#1e3a8a', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                          {(admin.nama || 'AW').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>{admin.nama}</strong>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 10px', color: '#0f172a', fontWeight: 600 }}>+{admin.nomorWa}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>{admin.shift || 'CS Pagi'}</span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <button onClick={() => handleToggleStatus(admin)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: admin.aktif ? '#059669' : '#cbd5e1' }}>
                        {admin.aktif ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                      </button>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      <button onClick={() => handleDelete(admin.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '4px' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#d1fae5', padding: '10px', borderRadius: '8px' }}><MessageSquare color="#059669" size={20} /></div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Total Click-to-WA</span>
            <strong style={{ fontSize: '1.2rem', color: '#0f172a' }}>1.240</strong>
          </div>
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#dbeafe', padding: '10px', borderRadius: '8px' }}><Phone color="#1e3a8a" size={20} /></div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Admin Terbanyak</span>
            <strong style={{ fontSize: '1.2rem', color: '#0f172a' }}>Andi W.</strong>
          </div>
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#ffedd5', padding: '10px', borderRadius: '8px' }}><Clock color="#c2410c" size={20} /></div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Response Time</span>
            <strong style={{ fontSize: '1.2rem', color: '#0f172a' }}>~2 Min</strong>
          </div>
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#fee2e2', padding: '10px', borderRadius: '8px' }}><ShieldCheck color="#dc2626" size={20} /></div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Inactive Admin</span>
            <strong style={{ fontSize: '1.2rem', color: '#0f172a' }}>1</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
