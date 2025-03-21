import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { authenticateUser, createUser, getUserById, getUsers } from './db.js';

const app = express();
app.use(cors({ origin: 'http://127.0.0.1:5001', credentials: true }));
app.use(express.json());

// Signup route
app.post('/signup', async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await createUser(userName, email, hashedPassword);
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Error creating user" });
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }

        // Authenticate user
        const user = await authenticateUser(userName, password);
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Return user details (excluding password)
        res.json({ message: "Login successful", user: { id: user.id, userName: user.userName } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Error logging in" });
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await getUsers();
        res.json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Error retrieving users" });
    }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Error retrieving user" });
    }
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`User Service is running on port ${PORT}`);
});