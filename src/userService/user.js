import mysql from 'mysql2'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import express from 'express'
import cors from 'cors'
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


app.listen(5001, () => {
    console.log("Server is running on port 5001");
});
