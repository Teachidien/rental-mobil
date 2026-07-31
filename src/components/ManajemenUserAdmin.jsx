import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Shield, Mail, Key, UserCheck, Search } from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function ManajemenUserAdmin() {
  const [adminUsers, setAdminUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [nama, setNama] = useState('');
  const [role, setRole] = useState('Admin Operasional');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const DUMMY_ADMINS = [
    { id: 'ad-1', email: 'admin@bosauto.id', nama: 'Super Admin BosAuto', role: 'Super Admin', status: 'Aktif', createdAt: '2024-01-01' },
    { id: 'ad-2', email: 'budi.ops@bosauto.id', nama: 'Budi Santoso', role: 'Fleet Manager', status: 'Aktif', createdAt: '2024-02-15' },
    { id: 'ad-3', email: 'sarah.finance@bosauto.id', nama: 'Sarah Amelia', role: 'Finance Admin', status: 'Aktif', createdAt: '2024-03-10' }
  ];

  const fetchAdmins = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'admin_users'));
      if (snapshot.empty) {
        setAdminUsers(DUMMY_ADMINS);
      } else {
        setAdminUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (err) {
      console.warn('Menggunakan fallback list admin:', err);
      setAdminUsers(DUMMY_ADMINS);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!email || !nama) {
      alert('Nama dan Email Admin wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'admin_users'), {
        nama,
        email,
        role,
        status: 'Aktif',
        createdAt: new Date().toISOString().split('T')[0]
      });

      setEmail('');
      setNama('');
      setPassword('');
      fetchAdmins();
      alert(`Akun Admin baru "${nama}" berhasil didaftarkan!`);
    } catch (err) {
      alert('Gagal menambah admin: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id, namaAdmin) => {
    if (confirm(`Apakah Anda yakin ingin menghapus hak akses Admin "${namaAdmin}"?`)) {
      try {
        await deleteDoc(doc(db, 'admin_users', id));
        fetchAdmins();
      } catch (err) {
        setAdminUsers(prev => prev.filter(a => a.id !== id));
      }
    }
  };

  const filteredAdmins = adminUsers.filter(a =>
    (a.nama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#1e3a8a', margin: 0, fontWeight: 800 }}>Manajemen User Admin</h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#64748b' }}>Kelola daftar akun pengelola yang memiliki hak akses masuk ke Portal Admin.</p>
        </div>

        <div style={{ background: '#dbeafe', border: '1px solid #93c5fd', color: '#1e3a8a', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Shield size={16} /> TOTAL ADMIN: {adminUsers.length} AKUN
        </div>
      </div>

      {/* Main Grid: Form Tambah Admin Baru vs Tabel Daftar Admin */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Card Form Tambah Admin Baru */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={20} color="#059669" /> Tambah Akun Admin Baru
          </h3>

          <form onSubmit={handleAddAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Nama Lengkap Admin</label>
              <input
                type="text"
                placeholder="Contoh: Sarah Amelia"
                className="form-input"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Email Log-in Admin</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder="admin.sarah@bosauto.id"
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Password Akses</label>
              <div style={{ position: 'relative' }}>
                <Key size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Role / Level Akses</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Admin Operasional">Admin Operasional (Input Sewa & Armada)</option>
                <option value="Fleet Manager">Fleet Manager (Manajemen Armada & Inspeksi)</option>
                <option value="Finance Admin">Finance Admin (Akses Pembukuan)</option>
                <option value="Super Admin">Super Admin (Akses Penuh Seluruh Sistem)</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '12px', width: '100%', marginTop: '8px', fontWeight: 700 }}>
              <UserCheck size={18} /> {loading ? 'Mendaftarkan...' : 'DAFTARKAN ADMIN BARU'}
            </button>
          </form>
        </div>

        {/* Right Column: Tabel Daftar User Admin */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>Daftar Pengelola Terdaftar</h3>

            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari email / nama..."
                className="form-input"
                style={{ paddingLeft: '36px', padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 10px' }}>ADMIN PROFILE</th>
                  <th style={{ padding: '12px 10px' }}>ROLE / LEVEL</th>
                  <th style={{ padding: '12px 10px' }}>STATUS</th>
                  <th style={{ padding: '12px 10px', textAlign: 'right' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#d1fae5', color: '#065f46', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                          {(admin.nama || 'AD').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>{admin.nama}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{admin.email}</span>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ background: '#f1f5f9', color: '#1e3a8a', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {admin.role || 'Admin Operasional'}
                      </span>
                    </td>

                    <td style={{ padding: '12px 10px' }}>
                      <span className="badge badge-available" style={{ fontSize: '0.72rem' }}>
                        🟢 Aktif
                      </span>
                    </td>

                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      {admin.email === 'admin@bosauto.id' ? (
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>Super Access</span>
                      ) : (
                        <button
                          onClick={() => handleDeleteAdmin(admin.id, admin.nama)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '4px' }}
                          title="Hapus Hak Akses Admin"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
