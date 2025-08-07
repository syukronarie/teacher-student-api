const mysql = require('mysql2/promise');
const { logger } = require('./logger');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'teacher_student_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.on('connection', () => {
  logger.info('MySQL connection established');
});

pool.on('error', (err) => {
  logger.error(`MySQL error: ${err.message}`);
});

module.exports = pool;
