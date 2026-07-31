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
    <section id="kalkulator" style={{ padding: '40px 0 60px 0', background: 'rgba(255,255,255,0.01)' }}>
      <div className="container">
        <div className="glass-panel" style={{ padding: '32px', maxWidth: '880px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div style={{ background: 'var(--accent-glow)', padding: '10px', borderRadius: '10px' }}>
              <Calculator color="var(--accent-primary)" size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem' }}>Kalkulator Sewa & Direct Booking</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Cek tanggal kosong pada kalender dan hitung estimasi biaya pasti</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Form Input Kalkulator */}
            <div>
              <div className="form-group">
                <label className="form-label">Pilih Unit Mobil</label>
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
                      {m.nama} - Rp {Number(m.harga || 0).toLocaleString('id-ID')}/hr
                    </option>
                  ))}
                </select>
              </div>

              {/* Kalender Availability Interaktif */}
              <KalenderAvailability 
                mobil={mobil} 
                jadwalList={jadwalList} 
                onSelectRange={(selectedDate) => setTanggalSewa(selectedDate)}
              />

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="form-label">Nama Lengkap Anda</label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  className="form-input"
                  value={namaPenyewa}
                  onChange={(e) => setNamaPenyewa(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Tanggal Sewa Mulai</label>
                  <input
                    type="date"
                    className="form-input"
                    value={tanggalSewa}
                    onChange={(e) => setTanggalSewa(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Durasi (Hari)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={durasiHari}
                    onChange={(e) => setDurasiHari(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
              </div>

              {/* Add-ons Checkbox Options */}
              <div style={{ marginTop: '16px' }}>
                <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Fitur Opsional (Add-on)</label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={denganDriver}
                    onChange={(e) => setDenganDriver(e.target.checked)}
                  />
                  <span>+ Supir Berpengalaman (+Rp 150.000/hari)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={antarJemputBandara}
                    onChange={(e) => setAntarJemputBandara(e.target.checked)}
                  />
                  <span>+ Antar-Jemput Bandara (+Rp 100.000)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={childSeat}
                    onChange={(e) => setChildSeat(e.target.checked)}
                  />
                  <span>+ Kursi Balita / Child Safety Seat (+Rp 50.000/hari)</span>
                </label>
              </div>
            </div>

            {/* Rincian Total Biaya */}
            <div className="glass-panel" style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Rincian Biaya Transparan</h4>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span>Sewa Base ({durasiHari} Hari):</span>
                  <span>Rp {hargaBase.toLocaleString('id-ID')}</span>
                </div>

                {denganDriver && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>Jasa Driver:</span>
                    <span>Rp {biayaDriver.toLocaleString('id-ID')}</span>
                  </div>
                )}

                {antarJemputBandara && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>Antar-Jemput Bandara:</span>
                    <span>Rp {biayaBandara.toLocaleString('id-ID')}</span>
                  </div>
                )}

                {childSeat && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>Child Seat:</span>
                    <span>Rp {biayaChildSeat.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>Total Estimasi:</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--status-available)' }}>
                    Rp {totalBiaya.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePesanWhatsApp}
                className="btn btn-success"
                style={{ width: '100%', marginTop: '24px', padding: '12px', fontSize: '1rem' }}
              >
                <MessageCircle size={18} /> Sewa Sekarang via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
