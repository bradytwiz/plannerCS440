import pool from '../database.js';

class TypeService {
    async getTypes() {
        const [rows] = await pool.query("SELECT * FROM type");
        return rows;
    }

    async getType(id) {
        const [rows] = await pool.query(`
            SELECT * FROM type WHERE id = ?
        `, [id]);
        return rows[0];
    }

    async createType({ name, importance, color }) {
        const [result] = await pool.query(`
            INSERT INTO type (name, importance, color)
            VALUES (?, ?, ?)
        `, [name, importance, color]);
        return this.getType(result.insertId);
    }
}

export default new TypeService();