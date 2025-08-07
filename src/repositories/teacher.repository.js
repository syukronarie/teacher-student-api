const pool = require('../config/db');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM teachers WHERE email = ?', [email]);
  return rows[0] || null;
}

async function createTeacher(email) {
  const [result] = await pool.query('INSERT INTO teachers (email) VALUES (?)', [email]);
  return { id: result.insertId, email };
}

module.exports = { findByEmail, createTeacher };
