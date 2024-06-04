// public/service-worker.js
self.addEventListener("push", function (event) {
  const options = {
    body: event.data.text(),
    icon: "/icon.png",
    badge: "/badge.png",
  };
  event.waitUntil(
    self.registration.showNotification("Notification Title", options)
  );
});
