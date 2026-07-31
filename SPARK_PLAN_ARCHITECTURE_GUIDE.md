# Architecture & Optimization Guide: Professional Rental Web on Firebase Spark Plan (100% Free Tier)

Dokumen ini berisi panduan teknis bagaimana membangun **Website Rental Mobil (BosAuto)** tingkat profesional enterprise, namun dirancang khusus agar **100% berjalan di atas Paket Firebase Spark Plan (Gratis)** tanpa pernah melebihi limit harian atau membutuhkan kartu kredit.

---

## 💡 Strategi "Spark Plan Master": Trik Profesional Hemat Bandwidth & Quota

Paket **Firebase Spark Plan (Free)** memiliki batasan kuota harian:
- **Firestore Reads**: 50,000 document reads / hari
- **Firestore Writes**: 20,000 document writes / hari
- **Firebase Hosting**: 10 GB bandwidth / bulan
- **Firebase Auth**: Unlimited (Email/Password)

Berikut adalah strategi arsitektur yang kita gunakan agar aplikasi tetap terlihat premium & profesional tanpa menyentuh kuota bayar:

### 1. Zero-Cost Image Storage (Cloudinary Unsigned Upload)
- **Trik**: Jangan menyimpan foto armada di Firebase Storage (karena ada limit 5 GB & bandwidth ketat).
- **Eksekusi**: Kita gunakan **Cloudinary Free Tier** (gratis 25 GB storage & bandwidth). Foto di-compress via HTML5 Canvas di browser pengguna ke format **WebP (max 800px)** sebelum di-upload. Foto menjadi sangat ringan (~100 KB) dan dimuat via CDN global Cloudinary.

### 2. Firestore Read Quota Protection (Local Cache & Batch Loading)
- **Trik**: Mencegah browser melakukan `getDocs()` berulang kali saat halaman di-refresh.
- **Eksekusi**:
  - Mengaktifkan `enableIndexedDbPersistence()`. Sekali data armada diambil, browser akan membaca dari memori lokal (IndexedDB), mengurangi query ke Firestore hingga **90%**.
  - Menggunakan fallback data dummy saat database Firestore awal masih kosong.

### 3. Zero Backend Server (Client-Side Direct WhatsApp Order)
- **Trik**: Mencegah biaya server backend / Cloud Functions untuk penanganan checkout/order.
- **Eksekusi**: Menggunakan **WhatsApp API Deep Link** dengan pesan terformat otomatis (Detail Sewa, Hari, Add-on, & Total Biaya). Admin rental langsung menerima chat di WhatsApp Business tanpa perlu server backend.

---

## 📱 Aspek Tambahan Professional UI/UX & Security

### 1. Keamanan Firestore (Security Rules)
Aturan keamanan Firestore ketat agar publik tidak bisa mengacak-acak data armada/keuangan:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Publik hanya bisa membaca armada
    match /armada/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Hanya Admin yang terautentikasi yang bisa akses jadwal & pembukuan
    match /jadwal/{document} {
      allow read, write: if request.auth != null;
    }
    match /pembukuan/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. PWA (Installable Desktop & Mobile App)
- Pengguna bisa menekan tombol **"Add to Home Screen"** di Chrome/Safari.
- Aplikasi web akan ter-install di layar HP/Laptop seperti aplikasi Android/iOS native tanpa melalui Play Store.
- Berjalan instan dalam mode **Offline** saat sinyal hilang.

### 3. Micro-Interactions & Professional UX Touch
- **Confetti Celebration**: Efek kembang api/confetti halus saat pengguna meng-klik "Hitung & Sewa via WhatsApp".
- **Dynamic Due Date Highlight**: Warna merah kontras pada tabel jadwal admin untuk mobil yang terlambat dikembalikan hari ini.
- **Instant CSV Financial Export**: Pembukuan keuangan admin dapat diunduh dalam bentuk file `.csv` untuk diolah di Excel.
