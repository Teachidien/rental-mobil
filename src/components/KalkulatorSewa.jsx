import React, { useState, useEffect } from 'react';
import { Calculator, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import KalenderAvailability from './KalenderAvailability';

export default function KalkulatorSewa({ selectedMobil, armadaList = [], jadwalList = [] }) {
  const safeArmada = Array.isArray(armadaList) ? armadaList : [];
  const [mobil, setMobil] = useState(() => {
    if (selectedMobil && typeof selectedMobil === 'object' && selectedMobil.id) return selectedMobil;
    if (safeArmada.length > 0) return safeArmada[0];
    return null;
  });

  const [durasiHari, setDurasiHari] = useState(1);
  const [denganDriver, setDenganDriver] = useState(false);
  const [antarJemputBandara, setAntarJemputBandara] = useState(false);
  const [childSeat, setChildSeat] = useState(false);
  const [namaPenyewa, setNamaPenyewa] = useState('');
  const [tanggalSewa, setTanggalSewa] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (selectedMobil && typeof selectedMobil === 'object' && selectedMobil.id) {
      setMobil(selectedMobil);
    } else if (safeArmada.length > 0 && !mobil) {
      setMobil(safeArmada[0]);
    }
  }, [selectedMobil, safeArmada]);

  // Pricing Add-ons Rate
  const HARGA_DRIVER = 150000;
  const HARGA_BANDARA = 100000;
  const HARGA_CHILD_SEAT = 50000;

  // Hitung Total Biaya
  const hargaBase = mobil ? Number(mobil.harga || 0) * durasiHari : 0;
  const biayaDriver = denganDriver ? HARGA_DRIVER * durasiHari : 0;
  const biayaBandara = antarJemputBandara ? HARGA_BANDARA : 0;
  const biayaChildSeat = childSeat ? HARGA_CHILD_SEAT * durasiHari : 0;
  const totalBiaya = hargaBase + biayaDriver + biayaBandara + biayaChildSeat;

  // Generate WhatsApp Message Format & Confetti Effect
  const handlePesanWhatsApp = () => {
    if (!mobil) return;

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}

    const noWAAdmin = "6281234567890";
    const textPesan = `Halo Admin BosAuto Rental, saya ingin konfirmasi sewa mobil dengan detail berikut:

📌 *Data Pemesanan*
• Nama: ${namaPenyewa || 'Pelanggan'}
• Unit Mobil: ${mobil.nama || 'Mobil'} (${mobil.transmisi || 'Automatic'})
• Tanggal Sewa: ${tanggalSewa}
• Durasi: ${durasiHari} Hari

➕ *Layanan Tambahan (Add-on)*
• Dengan Driver: ${denganDriver ? 'Ya (+Rp 150.000/hr)' : 'Lepas Kunci (Tidak)'}
• Antar-Jemput Bandara: ${antarJemputBandara ? 'Ya (+Rp 100.000)' : 'Tidak'}
• Child Safety Seat: ${childSeat ? 'Ya (+Rp 50.000/hr)' : 'Tidak'}

💰 *Total Estimasi Biaya*: Rp ${totalBiaya.toLocaleString('id-ID')}

Apakah unit ini tersedia pada tanggal tersebut?`;

    const urlWA = `https://api.whatsapp.com/send?phone=${noWAAdmin}&text=${encodeURIComponent(textPesan)}`;
    setTimeout(() => {
      window.open(urlWA, '_blank');
    }, 400);
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
        <Calculator color="var(--accent-primary)" size={22} />
        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>Booking Engine</h3>
      </div>

      {/* Select Mobil & Form */}
      <div className="form-group">
        <label className="form-label">Selected Vehicle</label>
        <select
          className="form-select"
          value={mobil ? mobil.id : ''}
          onChange={(e) => {
            const selected = safeArmada.find(m => m.id === e.target.value);
            setMobil(selected);
          }}
        >
          {safeArmada.map(m => (
            <option key={m.id} value={m.id}>
              {m.nama} - Rp {Number(m.harga || 0).toLocaleString('id-ID')}/day
            </option>
          ))}
        </select>
      </div>

      {/* Kalender Availability */}
      <KalenderAvailability 
        mobil={mobil} 
        jadwalList={jadwalList} 
        onSelectRange={(selectedDate) => setTanggalSewa(selectedDate)}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
        <div className="form-group">
          <label className="form-label">Pick Up</label>
          <input
            type="date"
            className="form-input"
            value={tanggalSewa}
            onChange={(e) => setTanggalSewa(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Duration (Days)</label>
          <input
            type="number"
            min="1"
            className="form-input"
            value={durasiHari}
            onChange={(e) => setDurasiHari(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
      </div>

      {/* Add-ons Checkbox */}
      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
        <label className="form-label" style={{ marginBottom: '10px', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ADD-ONS</label>
        
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={denganDriver} onChange={(e) => setDenganDriver(e.target.checked)} />
            <span>Professional Driver</span>
          </span>
          <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>+Rp 150k</span>
        </label>

        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={antarJemputBandara} onChange={(e) => setAntarJemputBandara(e.target.checked)} />
            <span>Airport Transfer</span>
          </span>
          <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>+Rp 100k</span>
        </label>

        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={childSeat} onChange={(e) => setChildSeat(e.target.checked)} />
            <span>Child Safety Seat</span>
          </span>
          <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>+Rp 50k</span>
        </label>
      </div>

      {/* Total Cost Display */}
      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>Estimated Total ({durasiHari} Days)</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
            Rp {totalBiaya.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      <button
        onClick={handlePesanWhatsApp}
        className="btn btn-success"
        style={{ width: '100%', marginTop: '16px', padding: '12px', fontSize: '0.95rem', fontWeight: 700 }}
      >
        <MessageCircle size={18} /> BOOK VIA WHATSAPP
      </button>
    </div>
  );
}
