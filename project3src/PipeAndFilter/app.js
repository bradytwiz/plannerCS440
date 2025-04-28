// src/app.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";

import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import typeRoutes from "./routes/type.routes.js";
import dataRoutes from "./routes/data.routes.js";

dotenv.config();

const app = express();

// --- Global Middlewares (Filters) ---
app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
}));

// --- Pipe Routes ---
app.use("/auth", authRoutes);     // login, signup, logout
app.use("/events", eventRoutes);  // create event, user events
app.use("/types", typeRoutes);    // create type
app.use("/data", dataRoutes);     // get user and events

// --- 404 Not Found Handler ---
app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found" });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error("Global Error:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

export default app;
