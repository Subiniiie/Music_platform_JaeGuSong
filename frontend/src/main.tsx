import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
// import App from './App.tsx'

import router from "./routes/router";

const queryClient = new QueryClient();

const firebaseConfig = {
  apiKey: "AIzaSyCODWPtWjWTlW0-IJDO4fdwU6SFRMkYreA",
  authDomain: "reco-73229.firebaseapp.com",
  projectId: "reco-73229",
  storageBucket: "reco-73229.firebasestorage.app",
  messagingSenderId: "321181797924",
  appId: "1:321181797924:web:ee39ad406876dc1a1412b1",
  measurementId: "G-T33W4M6ZZY",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Notification 권한 요청
if (Notification.permission === "default") {
  Notification.requestPermission()
    .then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
        // FCM 토큰 발급
        getToken(messaging, {
          vapidKey: "YOUR_VAPID_KEY", // Firebase Console에서 발급받은 VAPID 키
        }).then((currentToken) => {
          if (currentToken) {
            console.log("FCM Token:", currentToken);
            localStorage.setItem("fcmToken", currentToken);
          } else {
            console.error("No FCM token available.");
          }
        });
      } else {
        console.error("Notification permission denied.");
      }
    })
    .catch((error) => {
      console.error("Error requesting notification permission:", error);
    });
}

// Foreground 메시지 처리
onMessage(messaging, (payload) => {
  console.log("Foreground message received:", payload);

  const notificationTitle = payload.notification?.title || "알림";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: payload.notification?.icon,
  };

  new Notification(notificationTitle, notificationOptions);
});

// 서비스 워커 등록
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <App /> */}
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
