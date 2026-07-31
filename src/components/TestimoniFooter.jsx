import React from 'react';
import { Star, MapPin, Phone, Mail, Car } from 'lucide-react';

export default function TestimoniFooter() {
  const testimoniData = [
    {
      nama: "Rizky Pratama",
      role: "Pengusaha",
      ulasan: "Mobil Avanza bersih banget, wangi, dan mesinnya halus. Proses booking via WhatsApp gercep tidak pakai ribet!",
      bintang: 5
    },
    {
      nama: "Siti Aminah",
      role: "Wisatawan",
      ulasan: "Sewa Brio 3 hari buat jalan-jalan di kota. Jasa drivernya ramah dan hapal jalan pintas. Sangat memuaskan!",
      bintang: 5
    },
    {
      nama: "Bambang Wijaya",
      role: "Corporate Client",
      ulasan: "Unit Pajero Sport kondisi prima untuk tamu direksi. Pelayanan profesional dan invoice transparan.",
      bintang: 5
    }
  ];

  return (
    <>
      {/* Testimoni Section */}
      <section style={{ padding: '40px 0 60px 0', background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="badge badge-available" style={{ marginBottom: '8px' }}>Testimoni</span>
            <h2>Ulasan Pelanggan Setia</h2>
            <p style={{ color: 'var(--text-muted)' }}>Kepercayaan dan kepuasan Anda adalah prioritas utama BosAuto Rental</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {testimoniData.map((t, i) => (
              <div key={i} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                    {[...Array(t.bintang)].map((_, idx) => (
                      <Star key={idx} size={16} fill="var(--status-maintenance)" color="var(--status-maintenance)" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '20px' }}>
                    "{t.ulasan}"
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <h4 style={{ fontSize: '0.95rem' }}>{t.nama}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '40px 0 20px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ background: 'var(--accent-primary)', padding: '6px', borderRadius: '8px' }}>
                  <Car color="#fff" size={20} />
                </div>
                <h4 style={{ margin: 0 }}>BosAuto Rental</h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Penyedia jasa rental mobil terpercaya dengan armada terawat, harga transparan, & pelayanan 24 jam nonstop.
              </p>
            </div>

            <div>
              <h4 style={{ marginBottom: '12px', fontSize: '1rem' }}>Kontak Layanan</h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={15} color="var(--accent-secondary)" /> WhatsApp: +62 812-3456-7890
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={15} color="var(--accent-secondary)" /> Email: info@bosauto.id
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={15} color="var(--accent-secondary)" /> Jl. Raya Utama No. 88, Jakarta
                </li>
              </ul>
            </div>

            <div>
              <h4 style={{ marginBottom: '12px', fontSize: '1rem' }}>Jam Operasional</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Senin - Minggu: 24 Jam Nonstop<br />
                Layanan Antar-Jemput Bandara & Hotel Siap Standby.
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            © {new Date().getFullYear()} BosAuto Rental. All Rights Reserved. Built with React & Firebase.
          </div>
        </div>
      </footer>
    </>
  );
}
