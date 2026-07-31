import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { uploadToCloudinary } from '../services/cloudinary';

export default function ModalArmada({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    nama: initialData?.nama || '',
    tipe: initialData?.tipe || 'MPV',
    transmisi: initialData?.transmisi || 'Automatic',
    kapasitas: initialData?.kapasitas || 7,
    bbm: initialData?.bbm || 'Bensin',
    harga: initialData?.harga || 350000,
    status: initialData?.status || 'Tersedia',
    gambar: initialData?.gambar || ''
  });

  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, gambar: url }));
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      harga: Number(formData.harga),
      kapasitas: Number(formData.kapasitas)
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '24px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <h3 style={{ marginBottom: '20px' }}>
          {initialData ? 'Edit Data Armada' : 'Tambah Armada Baru'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Nama Mobil</label>
            <input
              type="text"
              required
              placeholder="cth. Toyota Avanza Grand New"
              className="form-input"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Tipe Mobil</label>
              <select
                className="form-select"
                value={formData.tipe}
                onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
              >
                <option value="City Car">City Car</option>
                <option value="MPV">MPV</option>
                <option value="SUV Premium">SUV Premium</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Transmisi</label>
              <select
                className="form-select"
                value={formData.transmisi}
                onChange={(e) => setFormData({ ...formData, transmisi: e.target.value })}
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Seat</label>
              <input
                type="number"
                required
                className="form-input"
                value={formData.kapasitas}
                onChange={(e) => setFormData({ ...formData, kapasitas: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">BBM</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.bbm}
                onChange={(e) => setFormData({ ...formData, bbm: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Disewa">Disewa</option>
                <option value="Maintenance">Perawatan</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Harga Sewa / Hari (Rp)</label>
            <input
              type="number"
              required
              placeholder="350000"
              className="form-input"
              value={formData.harga}
              onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
            />
          </div>

          {/* Photo Picker Cloudinary */}
          <div className="form-group">
            <label className="form-label">Foto Armada (Auto WebP Compress)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="photo-picker"
              />
              <label htmlFor="photo-picker" className="btn btn-secondary" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                <Upload size={16} /> {uploading ? 'Mengompres...' : 'Pilih Foto'}
              </label>

              <input
                type="text"
                placeholder="atau tempel URL Foto..."
                className="form-input"
                style={{ flex: 1 }}
                value={formData.gambar}
                onChange={(e) => setFormData({ ...formData, gambar: e.target.value })}
              />
            </div>

            {formData.gambar && (
              <div style={{ marginTop: '10px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <img src={formData.gambar} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Batal</button>
            <button type="submit" disabled={uploading} className="btn btn-primary">
              Simpan Armada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
