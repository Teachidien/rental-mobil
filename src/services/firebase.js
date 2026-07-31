import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  enableIndexedDbPersistence 
} from 'firebase/firestore';

// Konfigurasi Firebase Project (bosauto-6f32a)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA4fh5I5BlrmQ_G-jExZze7wekUR9H2ICs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bosauto-6f32a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bosauto-6f32a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bosauto-6f32a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "145145293685",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:145145293685:web:458fe6674e509d61cb013c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-Q8LP6PEDH0"
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Inisialisasi Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Aktifkan Offline Persistence (IndexedDB) secara aman
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore offline persistence: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore offline persistence: Browser not supported');
    }
  });
} catch (e) {
  console.warn('Firestore persistence init error:', e);
}

export default app;
