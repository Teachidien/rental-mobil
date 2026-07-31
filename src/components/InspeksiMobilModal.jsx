import React, { useState } from 'react';
import { ClipboardCheck, CheckCircle2, AlertTriangle, Save, X } from 'lucide-react';

export default function InspeksiMobilModal({ isOpen, onClose, mobil, onSaveInspeksi }) {
  const [bensinBar, setBensinBar] = useState(4);
  const [kmAwal, setKmAwal] = useState('45200');
  const [kondisiBody, setKondisiBody] = useState('Mulus Siap Pakai');
  const [stnkAda, setStnkAda] = useState(true);
  const [banSerepAda, setBanSerepAda] = useState(true);

  if (!isOpen || !mobil) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSaveInspeksi) {
      onSaveInspeksi({
        mobilId: mobil.id,
        namaMobil: mobil.nama,
        bensinBar,
        kmAwal,
        kondisiBody,
        stnkAda,
        banSerepAda,
        tanggalInspeksi: new Date().toISOString().split('T')[0]
      });
    }
    alert(`Hasil Inspeksi Pre-Rental unit ${mobil.nama} berhasil dicatat!`);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '24px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.1rem' }}>
            <ClipboardCheck color="var(--status-available)" size={20} /> Checklist Inspeksi Pre-Rental
          </h3>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '4px 8px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <strong style={{ color: 'var(--accent-secondary)' }}>{mobil.nama}</strong> ({mobil.tipe})
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Sisa Bensin (Bar)</label>
              <select className="form-select" value={bensinBar} onChange={(e) => setBensinBar(Number(e.target.value))}>
                <option value={4}>Full (4 Bar)</option>
                <option value={3}>3/4 Bar</option>
                <option value={2}>1/2 Bar</option>
                <option value={1}>1/4 Bar (Resto)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Kilometer (KM) Awal</label>
              <input
                type="number"
                className="form-input"
                value={kmAwal}
                onChange={(e) => setKmAwal(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Kondisi Body & Fisik</label>
            <input
              type="text"
              className="form-input"
              value={kondisiBody}
              onChange={(e) => setKondisiBody(e.target.value)}
              placeholder="cth. Mulus / Bumper kanan ada baret tipis"
            />
          </div>

          {/* Checkbox Kelengkapan STNK & Ban Serep */}
          <div style={{ display: 'flex', gap: '20px', margin: '8px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={stnkAda} onChange={(e) => setStnkAda(e.target.checked)} />
              <span>STNK Asli ADA</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={banSerepAda} onChange={(e) => setBanSerepAda(e.target.checked)} />
              <span>Ban Serep & Dongkrak ADA</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Batal</button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Simpan Hasil Inspeksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
