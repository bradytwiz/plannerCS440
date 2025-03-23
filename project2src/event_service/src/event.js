import express from 'express';
import cors from 'cors';
import pool from './db.js';
import { getEvents, getEvent, getUserEvents, createEvent, getTypes, getType, createType } from './db.js';

const app = express();
app.use(cors({
    origin: ['http://localhost:5000', 'http://localhost:5001', 'http://localhost:5002', 'http://127.0.0.1:5001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'User-ID'],
    credentials: true
}));
app.use(express.json());


app.get("/data", async (req, res) => {
    try {
        const userId = req.headers["user-id"];

        if (!userId) {
            return res.status(401).json({ error: "User not logged in" });
        }

        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const events = await getEvents();
        const types = await getTypes();

        res.json({ user, events, types });
    } catch (error) {
        console.error("Error in /data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Retrieve user event data
app.get('/user-events', async (req, res) => {
    const { user_id, date } = req.query;

    if (!user_id || !date) {
        return res.status(400).json({ error: "User ID and date are required." });
    }

    try {
        const events = await getUserEvents(user_id, date);
        res.json({ events });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Error retrieving events" });
    }
});


// Retrieve all types
app.get('/types', async (req, res) => {
    try {
        const types = await getTypes(); // Fetch types from database
        res.json({ types });
    } catch (error) {
        console.error("Error fetching types:", error);
        res.status(500).json({ error: "Error retrieving types" });
    }
});

// Create Event
app.post('/event', async (req, res) => {
    const { name, description, date, time, type_id, user_id } = req.body;

    if (!user_id) {
        return res.status(401).json({ error: "Unauthorized: Please log in." });
    }

    if (!name || !date || !type_id) {
        return res.status(400).json({ error: "Event name, date, and type are required" });
    }

    try {
        const newEvent = await createEvent(name, description, date, time, user_id, type_id);
        res.status(201).json({ message: "Event created", event: newEvent });
    } catch (error) {
        console.error("Event Creation Error:", error);
        res.status(500).json({ error: "Error creating event" });
    }
});


// Create Type
app.post('/type', async (req, res) => {
    try {
        const { name, importance, color } = req.body;
        if (!name || !importance || !color) {
            return res.status(400).json({ error: "All type fields are required" });
        }

        const newType = await createType(name, importance, color);
        res.status(201).json({ message: "Type created", type: newType });
    } catch (error) {
        console.error("Type Creation Error:", error);
        res.status(500).json({ error: "Error creating type" });
    }
});

// set port
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Event Service is running on port ${PORT}`);
});