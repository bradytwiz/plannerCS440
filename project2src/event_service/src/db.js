import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Database connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export default pool;

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