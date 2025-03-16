import mysql from 'mysql2'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'

dotenv.config()

const app = express();

app.use(cors({ origin: 'http://127.0.0.1:5001', credentials: true }));
app.use(express.json());

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

app.listen(5001, () => {
    console.log("Server is running on port 5001");
});
