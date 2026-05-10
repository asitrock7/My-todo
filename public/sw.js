self.addEventListener('push', e => {
    const data = e.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icon.png', // Add an icon in your public folder
        vibrate: [200, 100, 200],
        tag: 'task-alarm'
    });
});
