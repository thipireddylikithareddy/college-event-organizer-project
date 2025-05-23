import express, { request, response} from 'express';
import auth from '../middleware/auth.js';
import Event from '../models/events.js';
import User from '../models/user.js';
import { SendNotificationEmail } from '../utils/sendNotificationEmail.js';

const router = express.Router();

router.post('/create', auth, async(request, response) => {
    const { eventName, date, time, venue, register } = request.body;
    const newEvent = new Event({ eventName, date, time, venue, organizer: request.user.id, register });
    await newEvent.save();

    const participants = await User.find({ role: 'participant' });
    const participantsEmails = participants.map(user => user.email);

    await SendNotificationEmail(participantsEmails, newEvent);

    response.status(201).json({ message: 'Event created successfully '});
});

router.get('/my', auth, async(request, response) => {
    const events = await Event.find({ organizer: request.user.id });
    response.json({ events });
});

router.get('/all', async(request, response) => {
    const events = await Event.find().populate('organizer', 'name');
    response.status(200).json({ events });
});

export default router;