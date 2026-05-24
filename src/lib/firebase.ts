import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDgqpwlWdEtKzvXmY1nvexa2CpVO9zfo28",
  authDomain: "pos-system-8ba5b.firebaseapp.com",
  projectId: "pos-system-8ba5b",
  storageBucket: "pos-system-8ba5b.firebasestorage.app",
  messagingSenderId: "347411430820",
  appId: "1:347411430820:web:c01145d79ac5ed8c545531",
  measurementId: "G-R1Q9R362D4",
};

export function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

/** Call only in the browser (e.g. from a client `useEffect`). */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (!(await isSupported())) return null;
  return getAnalytics(getFirebaseApp());
}
