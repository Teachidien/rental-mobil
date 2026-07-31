import React, { useRef, useState } from 'react';
import { FileText, Download, Check, X } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function DigitalInvoiceModal({ isOpen, onClose, invoiceData }) {
  const invoiceRef = useRef();
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !invoiceData) return null;

  const handleDownloadPDF = () => {
    setDownloading(true);
    const element = invoiceRef.current;
    const opt = {
      margin: 10,
      filename: `Invoice_BosAuto_${invoiceData.noInvoice || 'INV-001'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save().then(() => {
      setDownloading(false);
    }).catch(err => {
      console.error('PDF error:', err);
      setDownloading(false);
    });
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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '24px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <FileText color="var(--accent-secondary)" size={20} /> Invoice Nota Sewa Digital
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleDownloadPDF} disabled={downloading} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
              <Download size={15} /> {downloading ? 'Membuat PDF...' : 'Download PDF'}
            </button>
            <button onClick={onClose} className="btn btn-secondary" style={{ padding: '6px 10px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice PDF Printable Element */}
        <div ref={invoiceRef} style={{ background: '#ffffff', color: '#0f172a', padding: '32px', borderRadius: '12px', fontSize: '0.9rem', lineHeight: 1.5 }}>
          {/* Header Invoice */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0284c7', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ color: '#0284c7', margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>BosAuto RENTAL</h2>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Armada Terawat & Transparan</span>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0' }}>Jl. Raya Utama No. 88, Jakarta • Telp: +62 812-3456-7890</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem' }}>INVOICE SEWA</h3>
              <span style={{ fontWeight: 700, color: '#0284c7', fontSize: '0.85rem' }}>#{invoiceData.noInvoice || 'INV-202607-001'}</span>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0' }}>Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
            </div>
          </div>

          {/* Customer & Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>DITERBITKAN UNTUK:</span>
              <h4 style={{ margin: '4px 0 2px 0', color: '#0f172a' }}>{invoiceData.namaPenyewa || 'Pelanggan'}</h4>
              <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>No WA: {invoiceData.noHp || '-'}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>DETAIL KENDARAAN:</span>
              <h4 style={{ margin: '4px 0 2px 0', color: '#0f172a' }}>{invoiceData.namaMobil || 'Mobil Rental'}</h4>
              <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>
                Durasi: {invoiceData.tanggalSewa} s/d {invoiceData.tanggalKembali} ({invoiceData.durasiHari || 1} Hari)
              </p>
            </div>
          </div>

          {/* Table Rincian Biaya */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#334155', textAlign: 'left', fontSize: '0.8rem' }}>
                <th style={{ padding: '8px 12px' }}>Deskripsi Layanan</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px 12px' }}>
                  <strong>Sewa {invoiceData.namaMobil || 'Mobil'}</strong> ({invoiceData.durasiHari || 1} Hari)
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>
                  Rp {Number(invoiceData.totalBiaya || 0).toLocaleString('id-ID')}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Total Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <span style={{ fontWeight: 700, color: '#334155' }}>TOTAL TAGIHAN LUNAS:</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0284c7' }}>
              Rp {Number(invoiceData.totalBiaya || 0).toLocaleString('id-ID')}
            </span>
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px dashed #cbd5e1', paddingTop: '16px', fontSize: '0.75rem', color: '#94a3b8' }}>
            Terima kasih telah mempercayakan perjalanan Anda bersama BosAuto Rental!
          </div>
        </div>
      </div>
    </div>
  );
}
