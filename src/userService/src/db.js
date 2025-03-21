import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Database connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

export default pool;

// Authenticate user
export async function authenticateUser(userName, password) {
    const user = await getUser(userName);

    if (!user) {
        return null; // User does not exist
    }

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return null; // Incorrect password
    }

    return user; // Successful login
}

// Create a new user
export async function createUser(userName, email, hashedPassword) {
    const [result] = await pool.query(`
        INSERT INTO user (userName, email, password) 
        VALUES (?, ?, ?)
    `, [userName, email, hashedPassword]);

    const id = result.insertId;
    return getUser(id);
}

// Get user by username
export async function getUser(userName) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM user
        WHERE userName = ?
    `, [userName]);
    return rows[0];
}

// Get user by ID
export async function getUserById(id) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM user
        WHERE id = ?
    `, [id]);
    return rows[0];
}
