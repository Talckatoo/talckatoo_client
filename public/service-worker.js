// eslint-disable-next-line no-restricted-globals
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icon.png',
    badge: '/badge.png',
  };
  event.waitUntil(
    self.registration.showNotification('Notification Title', options),
  );
});
