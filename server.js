const express = require('express');
const webpush = require('web-push');
const schedule = require('node-schedule');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Generate VAPID keys once: web-push.generateVAPIDKeys()
const publicVapidKey = 'YOUR_PUBLIC_VAPID_KEY';
const privateVapidKey = 'YOUR_PRIVATE_VAPID_KEY';

webpush.setVapidDetails('mailto:admin@yourdomain.com', publicVapidKey, privateVapidKey);

let subscriptions = []; // In production, save this to a database

// Route to subscribe a device for notifications
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
});

// Route to create a task and schedule the 4-minute alarm
app.post('/add-task', (req, res) => {
    const { taskName, taskTime, subscription } = req.body;
    const executionTime = new Date(new Date(taskTime).getTime() - (4 * 60000));

    console.log(`Scheduling alarm for "${taskName}" at: ${executionTime}`);

    schedule.scheduleJob(executionTime, function() {
        const payload = JSON.stringify({
            title: 'Task Starting Soon!',
            body: `"${taskName}" starts in 4 minutes.`
        });

        webpush.sendNotification(subscription, payload)
            .catch(err => console.error("Notification failed", err));
    });

    res.status(200).send({ message: 'Task scheduled' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
