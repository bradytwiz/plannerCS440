import authEvents from '../events/authEvents.js';

export const loginHandler = async (req, res) => {
    const { userName, password } = req.body;
    if (!userName || !password) {
        return res.status(400).json({ error: "Username and password required" });
    }

    authEvents.emit('login', { userName, password }, (error, user) => {
        if (error) {
            return res.status(401).json({ error: error.message });
        }
        res.json({ message: "Login successful", user });
    });
};

export const signupHandler = async (req, res) => {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    authEvents.emit('signup', { userName, email, password }, (error, newUser) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json({ message: "User created successfully", user: newUser });
    });
};