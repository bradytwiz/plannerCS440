import express from 'express';
import { getEvents, createEvent, getUserEvents } from '../services/eventService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const events = await getEvents();
    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const eventData = req.body;
    const newEvent = await createEvent(eventData);
    res.status(201).json({ message: "Event created", event: newEvent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/user', async (req, res) => {
  try {
    const { userId, date } = req.query;
    const events = await getUserEvents(userId, date);
    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;