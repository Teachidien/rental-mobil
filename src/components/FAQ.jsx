import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqData = [
    {
      q: "Apa saja persyaratan dokumen untuk sewa mobil lepas kunci?",
      a: "Persyaratan utama lepas kunci yaitu: KTP asli (domisili/daerah), SIM A aktif, foto kartu keluarga/ID karyawan, serta deposit jaminan keamanan yang akan dikembalikan 100% setelah masa sewa selesai."
    },
    {
      q: "Apakah harga sewa sudah termasuk bensin dan tol?",
      a: "Harga sewa dasar adalah harga unit mobil (tanpa bensin & tol). Jika Anda memilih paket dengan Driver, Anda bisa memilih paket All-in (Mobil + Driver + Bensin + Tol) dengan konfirmasi awal ke Admin."
    },
    {
      q: "Bagaimana sistem pembayaran dan pembatalan sewa?",
      a: "Pembayaran DP minimal 20% dilakukan via transfer bank resmi saat booking untuk mengamankan unit. Pembatalan H-2 gratis refund DP 100%."
    },
    {
      q: "Apakah mobil bisa diantarkan langsung ke lokasi saya atau ke Bandara?",
      a: "Ya! Kami menyediakan layanan antar-jemput armada ke rumah, hotel, maupun Bandara dengan memilih opsi Add-on saat melakukan pemesanan."
    }
  ];

  return (
    <section style={{ padding: '40px 0 60px 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="badge badge-available" style={{ marginBottom: '8px' }}>FAQ</span>
          <h2>Pertanyaan Umum & Syarat Sewa</h2>
          <p style={{ color: 'var(--text-muted)' }}>Segala hal yang perlu Anda ketahui sebelum melakukan pemesanan</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="glass-panel"
                style={{ overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s ease' }}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <div style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <HelpCircle size={18} color="var(--accent-secondary)" />
                    {item.q}
                  </h4>
                  {isOpen ? <ChevronUp size={18} color="var(--accent-primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </div>

                {isOpen && (
                  <div style={{ padding: '0 20px 18px 48px', color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
