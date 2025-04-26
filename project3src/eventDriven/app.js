import express from 'express';
import cors from 'cors';
import {
    loginHandler,
    signupHandler
} from './handlers/authHandlers.js';
import {
    getEventsHandler,
    createEventHandler,
    getUserEventsHandler
} from './handlers/eventHandlers.js';
import {
    getTypesHandler,
    createTypeHandler
} from './handlers/typeHandlers.js';
import {
    getUserDataHandler
} from './handlers/userHandlers.js';

const app = express();

app.use(cors({ origin: 'http://127.0.0.1:5500', credentials: true }));
app.use(express.json());

// Auth routes
app.post('/login', loginHandler);
app.post('/signup', signupHandler);

// Event routes
app.get("/data", getUserDataHandler);
app.get('/user-events', getUserEventsHandler);
app.post('/event', createEventHandler);

// Type routes
app.get('/types', getTypesHandler);
app.post('/type', createTypeHandler);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});