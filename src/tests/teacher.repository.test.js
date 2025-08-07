const pool = require('../config/db');
const teacherRepo = require('../repositories/teacher.repository');

jest.mock('../config/db');

describe('teacher.repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return teacher if found', async () => {
      const mockTeacher = { id: 1, email: 'teacher@example.com' };
      pool.query.mockResolvedValue([[mockTeacher]]);

      const result = await teacherRepo.findByEmail('teacher@example.com');

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM teachers WHERE email = ?', ['teacher@example.com']);
      expect(result).toEqual(mockTeacher);
    });

    it('should return null if teacher not found', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await teacherRepo.findByEmail('notfound@example.com');
      expect(result).toBeNull();
    });
  });

  describe('createTeacher', () => {
    it('should insert teacher and return ID + email', async () => {
      pool.query.mockResolvedValue([{ insertId: 42 }]);

      const result = await teacherRepo.createTeacher('new@teacher.com');

      expect(pool.query).toHaveBeenCalledWith('INSERT INTO teachers (email) VALUES (?)', ['new@teacher.com']);
      expect(result).toEqual({ id: 42, email: 'new@teacher.com' });
    });
  });
});
