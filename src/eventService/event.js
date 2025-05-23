import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import pool from './database.js'
import mysql from 'mysql2'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

dotenv.config()

// pool creation that uses .env file
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export default pool;


const app = express();

app.use(cors({ origin: 'http://127.0.0.1:5002', credentials: true }));
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

// event creation and retrieval functions
export async function getEvents() {
    const [rows] = await pool.query("SELECT * FROM event")
    return rows
}

export async function  getEvent(id) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM event
    WHERE id = ?
    `, [id])
    return rows[0]
}

export async function getUserEvents(user_id, date) {
    const query = `
        SELECT * FROM event 
        WHERE user_id = ? AND date = ? 
        ORDER BY time ASC
    `;
    
    try {
        console.log("Fetching events for user:", user_id, "on date:", date);
        const [events] = await pool.query(query, [user_id, date]);
        console.log("Events retrieved:", events);
        return events;
    } catch (error) {
        console.error("Database error in getUserEvents:", error);
        throw error;
    }
}

export async function createEvent(name, description, date, time, user_id, type_id) {
    const [result] = await pool.query(`
    INSERT INTO event (name, description, date, time, user_id, type_id)
    VALUES (?, ?, ?, ?, ?, ?)
    `, [name, description, date, time, user_id, type_id])
    const id = result.insertId
    return getEvent(id)
}

// type creation and retrieval functions
export async function getTypes() {
    const [rows] = await pool.query("SELECT * FROM type")
    return rows
}

export async function  getType(id) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM type
    WHERE id = ?
    `, [id])
    return rows[0]
}

export async function createType(name, importance, color) {
    const [result] = await pool.query(`
    INSERT INTO type (name, importance, color)
    VALUES (?, ?, ?)
    `, [name, importance, color])
    const id = result.insertId
    return getType(id)
}

pool.query("SELECT 1")
    .then(() => console.log("✅ Database Connected"))
    .catch(err => console.error("❌ DB Connection Error:", err));
