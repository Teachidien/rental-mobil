import React, { useRef, useState } from 'react';
import { PenTool, Check, RotateCcw, X, ShieldAlert } from 'lucide-react';

export default function EContractModal({ isOpen, onClose, onSaveContract, contractData }) {
  const canvasRef = useRef(null);
  const [isSigning, setIsSigning] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  if (!isOpen || !contractData) return null;

  // Canvas Mouse / Touch Handlers untuk Tanda Tangan Digital
  const startSigning = (e) => {
    setIsSigning(true);
    draw(e);
  };

  const stopSigning = () => {
    setIsSigning(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
    }
  };

  const draw = (e) => {
    if (!isSigning) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2563eb';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    setHasSignature(true);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSave = () => {
    if (!hasSignature) {
      alert('Harap bubuhkan tanda tangan digital Anda pada kotak yang disediakan.');
      return;
    }

    const canvas = canvasRef.current;
    const signatureDataUrl = canvas.toDataURL('image/png');
    
    if (onSaveContract) {
      onSaveContract({
        ...contractData,
        tandaTanganUrl: signatureDataUrl,
        tanggalPerjanjian: new Date().toISOString()
      });
    }
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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', padding: '24px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.1rem' }}>
            <PenTool color="var(--accent-secondary)" size={20} /> Perjanjian Sewa Digital (E-Contract)
          </h3>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '4px 8px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Syarat & Ketentuan Perjanjian Sewa */}
        <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px', maxHeight: '180px', overflowY: 'auto' }}>
          <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
            SYARAT & KETENTUAN PENYEWAAN BOSAUTO RENTAL:
          </strong>
          1. Penyewa wajib memiliki SIM A aktif & KTP asli yang valid.<br />
          2. Penggunaan mobil hanya untuk wilayah yang disepakati (dilarang dibawa ke luar pulau tanpa izin).<br />
          3. Dilarang mengalihkan penyewaan unit kepada pihak ketiga atau menggunakannya untuk tindakan melanggar hukum.<br />
          4. Kerusakan atau keterlambatan pengembalian unit akibat kelalaian penyewa akan dikenakan denda sesuai ketentuan yang berlaku.<br />
          5. Deposit jaminan akan dikembalikan 100% setelah pengecekan fisik unit selesai.
        </div>

        {/* Pad Tanda Tangan Digital Canvas */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label">Tanda Tangan Digital Penyewa (Goreskan di Kotak):</label>
            <button onClick={handleClear} className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
              <RotateCcw size={12} /> Hapus TTD
            </button>
          </div>

          <div style={{ border: '2px dashed var(--accent-primary)', borderRadius: '8px', background: '#ffffff', overflow: 'hidden' }}>
            <canvas
              ref={canvasRef}
              width={500}
              height={140}
              onMouseDown={startSigning}
              onMouseUp={stopSigning}
              onMouseMove={draw}
              onTouchStart={startSigning}
              onTouchEnd={stopSigning}
              onTouchMove={draw}
              style={{ width: '100%', height: '140px', cursor: 'crosshair', touchAction: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button onClick={onClose} className="btn btn-secondary">Batal</button>
          <button onClick={handleSave} className="btn btn-primary">
            <Check size={16} /> Setujui & Simpan Perjanjian
          </button>
        </div>
      </div>
    </div>
  );
}
