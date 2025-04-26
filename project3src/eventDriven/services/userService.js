import pool from '../database.js';

class UserService {
    async getUsers() {
        const [rows] = await pool.query("SELECT * FROM user");
        return rows;
    }

    async getUser(userName) {
        const [rows] = await pool.query(`
            SELECT * FROM user WHERE userName = ?
        `, [userName]);
        return rows[0];
    }

    async getUserById(id) {
        const [rows] = await pool.query(`
            SELECT * FROM user WHERE id = ?
        `, [id]);
        return rows[0];
    }

    async createUser(userName, email, password) {
        const [result] = await pool.query(`
            INSERT INTO user (userName, email, password) 
            VALUES (?, ?, ?)
        `, [userName, email, password]);
        return this.getUserById(result.insertId);
    }
}

export default new UserService();