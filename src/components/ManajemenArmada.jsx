import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ClipboardCheck } from 'lucide-react';
import ModalArmada from './ModalArmada';
import { addArmada, updateArmada, deleteArmada } from '../services/firestoreService';

export default function ManajemenArmada({ armadaList = [], onRefresh, onOpenInspeksi }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMobil, setEditingMobil] = useState(null);

  const safeArmada = Array.isArray(armadaList) ? armadaList : [];

  const handleOpenAdd = () => {
    setEditingMobil(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mobil) => {
    setEditingMobil(mobil);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus unit armada ini?')) {
      try {
        await deleteArmada(id);
        if (onRefresh) onRefresh();
      } catch (err) {
        alert('Gagal menghapus armada: ' + err.message);
      }
    }
  };

  const handleQuickStatusChange = async (mobil, newStatus) => {
    try {
      await updateArmada(mobil.id, { status: newStatus });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Gagal mengedit status: ' + err.message);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingMobil) {
        await updateArmada(editingMobil.id, data);
      } else {
        await addArmada(data);
      }
      setIsModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Gagal menyimpan data armada: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Daftar Unit Kendaraan</h3>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Kelola ketersediaan, status sewa, dan informasi harga armada.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
          <Plus size={16} /> Tambah Unit Armada
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 8px' }}>Armada</th>
                <th style={{ padding: '12px 8px' }}>Tipe / Transmisi</th>
                <th style={{ padding: '12px 8px' }}>Harga / Hari</th>
                <th style={{ padding: '12px 8px' }}>Status Saat Ini</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Aksi Admin</th>
              </tr>
            </thead>
            <tbody>
              {safeArmada.map((mobil) => (
                <tr key={mobil.id || Math.random()} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={mobil.gambar || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                        alt={mobil.nama}
                        style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div>
                        <strong style={{ display: 'block' }}>{mobil.nama}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{mobil.kapasitas} Seat • {mobil.bbm}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>
                    {mobil.tipe} ({mobil.transmisi})
                  </td>
                  <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--accent-secondary)' }}>
                    Rp {Number(mobil.harga || 0).toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <select
                      value={mobil.status || 'Tersedia'}
                      onChange={(e) => handleQuickStatusChange(mobil, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        background: 'var(--bg-secondary)',
                        color: mobil.status === 'Tersedia' ? 'var(--status-available)' : mobil.status === 'Disewa' ? 'var(--status-rented)' : 'var(--status-maintenance)',
                        border: '1px solid var(--border-color)',
                        fontWeight: 600
                      }}
                    >
                      <option value="Tersedia">🟢 Tersedia</option>
                      <option value="Disewa">🔴 Disewa</option>
                      <option value="Maintenance">🟡 Service</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button 
                        onClick={() => onOpenInspeksi && onOpenInspeksi(mobil)} 
                        className="btn btn-secondary" 
                        style={{ padding: '6px', fontSize: '0.8rem', color: 'var(--status-available)' }}
                        title="Checklist Inspeksi Pre-Rental"
                      >
                        <ClipboardCheck size={14} />
                      </button>
                      <button onClick={() => handleOpenEdit(mobil)} className="btn btn-secondary" style={{ padding: '6px', fontSize: '0.8rem' }}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(mobil.id)} className="btn btn-secondary" style={{ padding: '6px', fontSize: '0.8rem', color: 'var(--status-rented)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ModalArmada
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingMobil}
        />
      )}
    </div>
  );
}
