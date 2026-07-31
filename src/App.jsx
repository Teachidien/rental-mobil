import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import KatalogMobil from './components/KatalogMobil';
import KalkulatorSewa from './components/KalkulatorSewa';
import FAQ from './components/FAQ';
import TestimoniFooter from './components/TestimoniFooter';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import AdminOverview from './components/AdminOverview';
import ManajemenArmada from './components/ManajemenArmada';
import Penjadwalan from './components/Penjadwalan';
import Pembukuan from './components/Pembukuan';
import PengaturanWaAdmin from './components/PengaturanWaAdmin';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import DigitalInvoiceModal from './components/DigitalInvoiceModal';
import EContractModal from './components/EContractModal';
import InspeksiMobilModal from './components/InspeksiMobilModal';
import { AuthProvider } from './context/AuthContext';
import { getArmadaList, getJadwalSewa, getPembukuan, getAdminWaList } from './services/firestoreService';

export default function App() {
  const [armadaList, setArmadaList] = useState([]);
  const [jadwalList, setJadwalList] = useState([]);
  const [pembukuanList, setPembukuanList] = useState([]);
  const [adminWaList, setAdminWaList] = useState([]);
  const [selectedMobil, setSelectedMobil] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminTab, setAdminTab] = useState('overview');

  // Modals state
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [activeContract, setActiveContract] = useState(null);
  const [activeInspeksiMobil, setActiveInspeksiMobil] = useState(null);

  const refreshData = async () => {
    try {
      const armada = await getArmadaList();
      setArmadaList(armada);
      const jadwal = await getJadwalSewa();
      setJadwalList(jadwal);
      const pembukuan = await getPembukuan();
      setPembukuanList(pembukuan);
      const waList = await getAdminWaList();
      setAdminWaList(waList);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSelectMobil = (mobil) => {
    setSelectedMobil(mobil);
    const kalkulatorElem = document.getElementById('kalkulator');
    if (kalkulatorElem) {
      kalkulatorElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AuthProvider>
      {isAdminLoggedIn ? (
        <AdminDashboard 
          activeTab={adminTab} 
          setActiveTab={setAdminTab} 
          onLogout={() => setIsAdminLoggedIn(false)}
        >
          {adminTab === 'overview' && (
            <AdminOverview 
              armadaList={armadaList} 
              jadwalList={jadwalList} 
              pembukuanList={pembukuanList} 
            />
          )}

          {adminTab === 'armada' && (
            <ManajemenArmada 
              armadaList={armadaList} 
              onRefresh={refreshData}
              onOpenInspeksi={(mobil) => setActiveInspeksiMobil(mobil)}
            />
          )}

          {adminTab === 'jadwal' && (
            <Penjadwalan 
              jadwalList={jadwalList} 
              armadaList={armadaList} 
              onRefresh={refreshData}
              onOpenInvoice={(jadwal) => setActiveInvoice(jadwal)}
              onOpenContract={(jadwal) => setActiveContract(jadwal)}
            />
          )}

          {adminTab === 'pembukuan' && (
            <Pembukuan 
              pembukuanList={pembukuanList} 
              onRefresh={refreshData} 
            />
          )}

          {adminTab === 'wa_admin' && (
            <PengaturanWaAdmin 
              adminWaList={adminWaList} 
              onRefresh={refreshData} 
            />
          )}
        </AdminDashboard>
      ) : (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <Navbar onOpenLogin={() => setIsLoginOpen(true)} />

          <main style={{ flex: 1, background: '#f8fafc' }}>
            <Hero />

            {/* Public Section Layout: 2-Column Desktop Grid (Fleet Catalog + Booking Engine Sidebar) */}
            <div className="container" style={{ padding: '40px 20px 60px 20px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '32px',
                alignItems: 'start'
              }}>
                {/* Left Column: Available Fleet List */}
                <div style={{ flex: 1 }}>
                  <KatalogMobil armadaList={armadaList} onSelectMobil={handleSelectMobil} />
                </div>

                {/* Right Column: Sticky Booking Engine & Hotel Availability Calendar Sidebar */}
                <div style={{ width: '100%', maxWidth: '420px', position: 'sticky', top: '90px' }}>
                  <KalkulatorSewa selectedMobil={selectedMobil} armadaList={armadaList} jadwalList={jadwalList} />
                </div>
              </div>

              <FAQ />
            </div>

            <TestimoniFooter />
          </main>

          <FloatingWhatsApp adminWaList={adminWaList} />

          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onLoginSuccess={() => setIsAdminLoggedIn(true)}
          />
        </div>
      )}

      {/* Global Admin Modals */}
      <DigitalInvoiceModal
        isOpen={Boolean(activeInvoice)}
        onClose={() => setActiveInvoice(null)}
        invoiceData={activeInvoice}
      />

      <EContractModal
        isOpen={Boolean(activeContract)}
        onClose={() => setActiveContract(null)}
        contractData={activeContract}
        onSaveContract={(contract) => {
          alert('Perjanjian Sewa Digital & Tanda Tangan berhasil disimpan!');
        }}
      />

      <InspeksiMobilModal
        isOpen={Boolean(activeInspeksiMobil)}
        onClose={() => setActiveInspeksiMobil(null)}
        mobil={activeInspeksiMobil}
      />
    </AuthProvider>
  );
}
