importScripts(
  "https://www.gstatic.com/firebasejs/10.5.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.5.2/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCODWPtWjWTlW0-IJDO4fdwU6SFRMkYreA",
  authDomain: "reco-73229.firebaseapp.com",
  projectId: "reco-73229",
  storageBucket: "reco-73229.firebasestorage.app",
  messagingSenderId: "321181797924",
  appId: "1:321181797924:web:ee39ad406876dc1a1412b1",
  measurementId: "G-T33W4M6ZZY",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
