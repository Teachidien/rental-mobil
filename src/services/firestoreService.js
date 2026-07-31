import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase.js';

// Dummy initial data jika database Firestore masih kosong
const DUMMY_ARMADA = [
  {
    nama: "Toyota Avanza Grand New",
    tipe: "MPV",
    transmisi: "Automatic",
    kapasitas: 7,
    bbm: "Bensin",
    harga: 350000,
    status: "Tersedia",
    gambar: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
  },
  {
    nama: "Honda Brio RS",
    tipe: "City Car",
    transmisi: "Automatic",
    kapasitas: 5,
    bbm: "Bensin",
    harga: 300000,
    status: "Tersedia",
    gambar: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80"
  },
  {
    nama: "Mitsubishi Pajero Sport",
    tipe: "SUV Premium",
    transmisi: "Automatic",
    kapasitas: 7,
    bbm: "Solar/Diesel",
    harga: 850000,
    status: "Disewa",
    gambar: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"
  }
];

/* ==================== ARMADA SERVICES ==================== */
export const getArmadaList = async () => {
  try {
    const q = query(collection(db, 'armada'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return DUMMY_ARMADA.map((item, index) => ({ id: `dummy-${index}`, ...item }));
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn('Menggunakan data armada fallback:', error);
    return DUMMY_ARMADA.map((item, index) => ({ id: `dummy-${index}`, ...item }));
  }
};

export const addArmada = async (armadaData) => {
  return await addDoc(collection(db, 'armada'), {
    ...armadaData,
    createdAt: serverTimestamp()
  });
};

export const updateArmada = async (id, updatedData) => {
  const armadaRef = doc(db, 'armada', id);
  return await updateDoc(armadaRef, updatedData);
};

export const deleteArmada = async (id) => {
  const armadaRef = doc(db, 'armada', id);
  return await deleteDoc(armadaRef);
};

/* ==================== JADWAL & PEMBUKUAN SERVICES ==================== */
export const getJadwalSewa = async () => {
  try {
    const q = query(collection(db, 'jadwal'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn('Gagal mengambil data jadwal sewa:', error);
    return [];
  }
};

export const addJadwalSewa = async (jadwalData) => {
  // 1. Simpan Jadwal Sewa
  const res = await addDoc(collection(db, 'jadwal'), {
    ...jadwalData,
    createdAt: serverTimestamp()
  });

  // 2. OTOMATIS Update Status Armada menjadi "Disewa"
  if (jadwalData.armadaId && !jadwalData.armadaId.startsWith('dummy-')) {
    try {
      await updateArmada(jadwalData.armadaId, { status: 'Disewa' });
    } catch (e) {
      console.warn('Gagal update status armada:', e);
    }
  }

  // 3. OTOMATIS Catat ke Pembukuan Pemasukan (+) jika ada estimasi total biaya
  if (jadwalData.totalBiaya && Number(jadwalData.totalBiaya) > 0) {
    try {
      await addPembukuan({
        jenis: 'Pemasukan',
        kategori: `Sewa ${jadwalData.namaMobil || 'Armada'}`,
        jumlah: Number(jadwalData.totalBiaya),
        keterangan: `Sewa a.n ${jadwalData.namaPenyewa} (${jadwalData.tanggalSewa} s/d ${jadwalData.tanggalKembali})`,
        tanggal: jadwalData.tanggalSewa || new Date().toISOString().split('T')[0]
      });
    } catch (e) {
      console.warn('Gagal auto-record pembukuan:', e);
    }
  }

  return res;
};

export const getPembukuan = async () => {
  try {
    const q = query(collection(db, 'pembukuan'), orderBy('tanggal', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn('Gagal mengambil data pembukuan:', error);
    return [];
  }
};

export const addPembukuan = async (transaksiData) => {
  return await addDoc(collection(db, 'pembukuan'), {
    ...transaksiData,
    createdAt: serverTimestamp()
  });
};

/* ==================== MULTI-ADMIN WA SERVICES ==================== */
export const getAdminWaList = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'admin_wa'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn('Gagal mengambil data admin WA:', error);
    return [];
  }
};

export const addWaAdmin = async (waData) => {
  return await addDoc(collection(db, 'admin_wa'), {
    ...waData,
    createdAt: serverTimestamp()
  });
};

export const updateWaAdmin = async (id, updatedData) => {
  const adminRef = doc(db, 'admin_wa', id);
  return await updateDoc(adminRef, updatedData);
};

export const deleteWaAdmin = async (id) => {
  const adminRef = doc(db, 'admin_wa', id);
  return await deleteDoc(adminRef);
};
