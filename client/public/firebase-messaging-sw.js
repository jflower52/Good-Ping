/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
importScripts("/firebase-config.js");
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js"
);

firebase.initializeApp(self.FIREBASE_CONFIG);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: "/assets/logo2-DjOMUWLD.png",
  });
});
