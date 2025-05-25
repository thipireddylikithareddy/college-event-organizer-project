import express, { request, response } from 'express';
import auth from '../middleware/auth.js';
import Event from '../models/events.js';
import User from '../models/user.js';
import { SendNotificationEmail, updateNotificationEmail, notifyEventEmail } from '../utils/sendNotificationEmail.js';
import user from '../models/user.js';

const router = express.Router();

router.post('/', auth, async (request, response) => {
    const { eventName, date, time, description, venue, register } = request.body;
    const newEvent = new Event({ eventName, date, time, venue, organizer: request.user.id, description, register });
    await newEvent.save();

    const participants = await User.find({ role: 'participant' });
    const recipients = participants.map(user => ({
        name: user.name,
        email: user.email
    }));

    const organizerUser = await User.findById(request.user.id);
    const organizerName = organizerUser?.name || 'JNTUH Organizer';

    await SendNotificationEmail(recipients, newEvent, organizerName);

    response.status(201).json({ message: 'Event created successfully ' });
});

router.get('/my', auth, async (request, response) => {
    const events = await Event.find({ organizer: request.user.id });
    response.json({ events });
});

router.get('/all', async (request, response) => {
    const events = await Event.find().populate('organizer', 'name');
    response.status(200).json({ events });
});

router.delete('/:id', auth, async (request, response) => {
    await Event.findByIdAndDelete(request.params.id);
    response.json({ message: 'Event deleted successfully' });
});

router.put('/:id', auth, async (req, res) => {
    const { eventName, date, time, description, venue, register } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        { eventName, date, time, description, venue, register },
        { new: true }
    );

    if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
    }

    const participants = await User.find({ role: 'participant' });
    const recipients = participants.map(user => ({
        name: user.name,
        email: user.email
    }));

    const organizerUser = await User.findById(req.user.id);
    const organizerName = organizerUser?.name || 'JNTUH Organizer';

    await updateNotificationEmail(recipients, updatedEvent, organizerName, 'Event Updated');

    res.json({ message: 'Event updated and participants notified' });
});

router.post('/:id', auth, async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    const participants = await User.find({ role: 'participant' });
    const recipients = participants.map(user => ({
        name: user.name,
        email: user.email
    }));

    const organizerUser = await User.findById(req.user.id);
    const organizerName = organizerUser?.name || 'JNTUH Organizer';

    await notifyEventEmail(recipients, event, organizerName, 'Event Reminder');

    res.json({ message: 'Participants notified about the event' });
});


export default router;