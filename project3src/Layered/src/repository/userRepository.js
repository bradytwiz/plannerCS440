import pool from '../config/database.js';

export async function getUser(userName) {
  const [rows] = await pool.query('SELECT * FROM user WHERE userName = ?', [userName]);
  return rows[0];
}

export async function createUser(userName, email, password) {
  const [result] = await pool.query(
    'INSERT INTO user (userName, email, password) VALUES (?, ?, ?)',
    [userName, email, password]
  );
  return { id: result.insertId, userName, email };
}