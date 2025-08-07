const pool = require('../config/db');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM students WHERE email = ?', [email]);
  return rows[0] || null;
}

async function createStudent(email) {
  const [result] = await pool.query('INSERT INTO students (email) VALUES (?)', [email]);
  return { id: result.insertId, email };
}

async function suspendStudent(email) {
  const [result] = await pool.query('UPDATE students SET suspended = TRUE WHERE email = ?', [email]);
  return result.affectedRows > 0;
}

async function isSuspended(email) {
  const [rows] = await pool.query('SELECT suspended FROM students WHERE email = ?', [email]);
  return rows[0]?.suspended ?? null;
}

module.exports = { findByEmail, createStudent, suspendStudent, isSuspended };
