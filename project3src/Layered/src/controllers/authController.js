import express from 'express';
import { loginUser, registerUser } from '../services/authService.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await loginUser(userName, password);
    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const newUser = await registerUser(userName, email, password);
    res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;