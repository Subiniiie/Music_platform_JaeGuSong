import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCODWPtWjWTlW0-IJDO4fdwU6SFRMkYreA",
  authDomain: "reco-73229.firebaseapp.com",
  projectId: "reco-73229",
  storageBucket: "reco-73229.firebasestorage.app",
  messagingSenderId: "321181797924",
  appId: "1:321181797924:web:ee39ad406876dc1a1412b1",
  measurementId: "G-T33W4M6ZZY",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { messaging };
