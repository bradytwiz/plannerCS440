import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import pool from './database.js'

import {getUsers, getUser, getUserById, createUser, authenticateUser,
        getEvents, getEvent, getUserEvents, createEvent,
        getTypes, getType, createType} from './database.js'

const app = express()

app.use(cors({ origin: 'http://127.0.0.1:5500', credentials: true }));
app.use(express.json())

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

app.get('/user-events', async (req, res) => {
    const { user_id, date } = req.query;

    if (!user_id || !date) {
        return res.status(400).json({ error: "User ID and date are required." });
    }

    try {
        const [events] = await pool.query(`
            SELECT event.id, event.name, event.description, event.time, 
                   type.importance, type.color 
            FROM event
            JOIN type ON event.type_id = type.id
            WHERE event.user_id = ? AND event.date = ?
        `, [user_id, date]);

        res.json({ events });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Error retrieving events" });
    }
});



app.post('/signup', async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Hash password using bcryptjs
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createUser(userName, email, hashedPassword);

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Error creating user" });
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



// Login Route - Authenticate User
app.post('/login', async (req, res) => {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }

        const user = await authenticateUser(userName, password);
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Send user details but exclude the password
        res.json({ message: "Login successful", user: { id: user.id, userName: user.userName } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Error logging in" });
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

// Logout
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out successfully" });
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log("Server is running on port 8080")
})