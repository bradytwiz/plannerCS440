import express from 'express';
import cors from 'cors';
import authRoutes from './controllers/authController.js';
import eventRoutes from './controllers/eventController.js';
import userRoutes from './controllers/userController.js';

const app = express();

// Middleware
app.use(cors({ origin: 'http://127.0.0.1:5500', credentials: true }));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/users', userRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));