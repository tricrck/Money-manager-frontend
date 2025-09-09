importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCnbLdQ7T5olaJPqsC9pGEiLJXNzItECWE",
  authDomain: "moneymanager-484ed.firebaseapp.com",
  projectId: "moneymanager-484ed",
  storageBucket: "moneymanager-484ed.firebasestorage.app",
  messagingSenderId: "507027471562",
  appId: "1:507027471562:web:b63a97361df98068148833",
});

const messaging = firebase.messaging();

// Optional background handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: './favicon.ico',
  });
});