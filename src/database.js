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

// Function to authenticate user
export async function authenticateUser(userName, password) {
    const user = await getUser(userName);

    console.log("Retrieved User:", user)

    if (!user) {
        console.log("User not found")
        return null; // User does not exist
    }
    
    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log("Password Match", passwordMatch)
    if (!passwordMatch) {
        console.log("Incorrect Password")
        return null; // Incorrect password
    }

    return user; // Successful login
}

export async function createUser(userName, email, hashedPassword) {
    const [result] = await pool.query(`
    INSERT INTO user (userName, email, password) 
    VALUES (?, ?, ?)
    `, [userName, email, hashedPassword])
    
    const id = result.insertId;
    return getUser(id);
}


export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM user")
    return rows
}

export async function  getUser(userName) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM user
    WHERE userName = ?
    `, [userName])
    return rows[0]
}

export async function  getUserById(id) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM user
    WHERE id = ?
    `, [id])
    return rows[0]
}

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