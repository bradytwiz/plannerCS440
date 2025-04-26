import eventEvents from '../events/eventEvents.js';

export const getEventsHandler = async (req, res) => {
    eventEvents.emit('getEvents', (error, events) => {
        if (error) {
            return res.status(500).json({ error: "Error retrieving events" });
        }
        res.json({ events });
    });
};

export const createEventHandler = async (req, res) => {
    const { name, description, date, time, type_id, user_id } = req.body;

    if (!user_id) {
        return res.status(401).json({ error: "Unauthorized: Please log in." });
    }

    if (!name || !date || !type_id) {
        return res.status(400).json({ error: "Event name, date, and type are required" });
    }

    eventEvents.emit('createEvent', { name, description, date, time, user_id, type_id }, (error, newEvent) => {
        if (error) {
            return res.status(500).json({ error: "Error creating event" });
        }
        res.status(201).json({ message: "Event created", event: newEvent });
    });
};

export const getUserEventsHandler = async (req, res) => {
    const { user_id, date } = req.query;

    if (!user_id || !date) {
        return res.status(400).json({ error: "User ID and date are required." });
    }

    eventEvents.emit('getUserEvents', { user_id, date }, (error, events) => {
        if (error) {
            return res.status(500).json({ error: "Error retrieving events" });
        }
        res.json({ events });
    });
};