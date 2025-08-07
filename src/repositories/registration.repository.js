const pool = require('../config/db');

async function registerStudents(teacherId, studentIds) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insert many with ON DUPLICATE KEY to avoid duplicates
    const values = studentIds.map((sid) => [teacherId, sid]);
    await conn.query('INSERT IGNORE INTO registrations (teacher_id, student_id) VALUES ?', [values]);

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function getStudentsByTeacher(teacherId) {
  const [rows] = await pool.query(
    `SELECT s.email FROM students s
     INNER JOIN registrations r ON s.id = r.student_id
     WHERE r.teacher_id = ?`,
    [teacherId]
  );
  return rows.map((row) => row.email);
}

async function getCommonStudents(teacherIds) {
  if (!teacherIds.length) return [];

  const placeholders = teacherIds.map(() => '?').join(',');
  const sql = `
    SELECT s.email FROM students s
    INNER JOIN registrations r ON s.id = r.student_id
    WHERE r.teacher_id IN (${placeholders})
    GROUP BY s.id
    HAVING COUNT(DISTINCT r.teacher_id) = ?
  `;
  const params = [...teacherIds, teacherIds.length];

  const [rows] = await pool.query(sql, params);
  return rows.map((row) => row.email);
}

module.exports = { registerStudents, getStudentsByTeacher, getCommonStudents };
