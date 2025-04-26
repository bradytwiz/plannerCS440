import pool from '../database.js';

class EventService {
    async getEvents() {
        const [rows] = await pool.query("SELECT * FROM event");
        return rows;
    }

    async getEvent(id) {
        const [rows] = await pool.query(`
            SELECT * FROM event WHERE id = ?
        `, [id]);
        return rows[0];
    }

    async getUserEvents({ user_id, date }) {
        const [events] = await pool.query(`
            SELECT event.id, event.name, event.description, event.time, 
                   type.importance, type.color 
            FROM event
            JOIN type ON event.type_id = type.id
            WHERE event.user_id = ? AND event.date = ?
        `, [user_id, date]);
        return events;
    }

    async createEvent({ name, description, date, time, user_id, type_id }) {
        const [result] = await pool.query(`
            INSERT INTO event (name, description, date, time, user_id, type_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [name, description, date, time, user_id, type_id]);
        return this.getEvent(result.insertId);
    }
}

export default new EventService();