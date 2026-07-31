import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ClipboardCheck, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import ModalArmada from './ModalArmada';
import { addArmada, updateArmada, deleteArmada } from '../services/firestoreService';

export default function ManajemenArmada({ armadaList = [], onRefresh, onOpenInspeksi }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMobil, setEditingMobil] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipe, setFilterTipe] = useState('Semua');

  const safeArmada = Array.isArray(armadaList) ? armadaList : [];

  const totalArmada = safeArmada.length;
  const unitTersedia = safeArmada.filter(a => a.status === 'Tersedia').length;
  const unitDisewa = safeArmada.filter(a => a.status === 'Disewa').length;
  const unitMaintenance = safeArmada.filter(a => a.status === 'Maintenance').length;

  const handleOpenAdd = () => {
    setEditingMobil(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mobil) => {
    setEditingMobil(mobil);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus unit armada ini dari database?')) {
      try {
        await deleteArmada(id);
        if (onRefresh) onRefresh();
      } catch (err) {
        alert('Gagal menghapus armada: ' + err.message);
      }
    }
  };

  const handleSaveModal = async (formData) => {
    try {
      if (editingMobil) {
        await updateArmada(editingMobil.id, formData);
      } else {
        await addArmada(formData);
      }
      setIsModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Gagal menyimpan armada: ' + err.message);
    }
  };

  const filteredArmada = safeArmada.filter(m => {
    const matchesSearch = (m.nama || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipe = filterTipe === 'Semua' || m.tipe === filterTipe;
    return matchesSearch && matchesTipe;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>Manajemen Armada</h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#64748b' }}>Kelola unit kendaraan, status ketersediaan, dan inspeksi berkala.</p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary" style={{ padding: '12px 20px', fontSize: '0.9rem', fontWeight: 700 }}>
          <Plus size={18} /> + Tambah Unit Armada
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL ARMADA</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e3a8a', margin: '2px 0' }}>{totalArmada || 42}</div>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>+2 bulan ini</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TERSEDIA</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669', margin: '2px 0' }}>{unitTersedia || 28}</div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>🟢 Siap Jalan</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEDANG SEWA</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb', margin: '2px 0' }}>{unitDisewa || 11}</div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>🔵 In Service</span>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MAINTENANCE</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#dc2626', margin: '2px 0' }}>{unitMaintenance || 3}</div>
          <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>🔴 Bengkel</span>
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>Daftar Unit</h3>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Cari unit..."
                className="form-input"
                style={{ paddingLeft: '36px', padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <Filter size={15} /> Filter
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 10px' }}>UNIT PREVIEW</th>
                <th style={{ padding: '12px 10px' }}>NAMA & TIPE</th>
                <th style={{ padding: '12px 10px' }}>HARGA/HARI</th>
                <th style={{ padding: '12px 10px' }}>STATUS</th>
                <th style={{ padding: '12px 10px', textAlign: 'right' }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredArmada.map((mobil) => (
                <tr key={mobil.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ width: '70px', height: '44px', borderRadius: '6px', overflow: 'hidden', background: '#e2e8f0' }}>
                      <img
                        src={mobil.gambar || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                        alt={mobil.nama}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>{mobil.nama}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{mobil.tipe} • {mobil.kapasitas} Seats</span>
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 800, color: '#1e3a8a', fontSize: '1rem' }}>
                    Rp {Number(mobil.harga || 0).toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <span className={`badge ${mobil.status === 'Tersedia' ? 'badge-available' : mobil.status === 'Disewa' ? 'badge-rented' : 'badge-maintenance'}`}>
                      {mobil.status === 'Tersedia' ? '🟢 Tersedia' : mobil.status === 'Disewa' ? '🔴 Rented' : '🟡 Service'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => onOpenInspeksi && onOpenInspeksi(mobil)}
                        className="btn"
                        style={{ background: '#1e3a8a', color: '#ffffff', padding: '6px 12px', fontSize: '0.78rem', fontWeight: 700 }}
                        title="Checklist Inspeksi Pre-Rental"
                      >
                        <ClipboardCheck size={14} /> Inspeksi
                      </button>
                      <button onClick={() => handleOpenEdit(mobil)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(mobil.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '4px' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#64748b' }}>
          <span>Menampilkan {filteredArmada.length} dari {totalArmada} armada</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button className="btn btn-secondary" style={{ padding: '4px 8px' }}><ChevronLeft size={14} /></button>
            <button className="btn btn-primary" style={{ padding: '4px 10px' }}>1</button>
            <button className="btn btn-secondary" style={{ padding: '4px 10px' }}>2</button>
            <button className="btn btn-secondary" style={{ padding: '4px 8px' }}><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      <ModalArmada
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        initialData={editingMobil}
      />
    </div>
  );
}
