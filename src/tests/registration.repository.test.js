const pool = require('../config/db');
const registrationRepo = require('../repositories/registration.repository');

jest.mock('../config/db');

describe('registration.repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerStudents', () => {
    it('should insert student registrations and commit transaction', async () => {
      const mockConn = {
        beginTransaction: jest.fn(),
        query: jest.fn(),
        commit: jest.fn(),
        rollback: jest.fn(),
        release: jest.fn(),
      };

      pool.getConnection.mockResolvedValue(mockConn);

      const teacherId = 1;
      const studentIds = [2, 3];

      await registrationRepo.registerStudents(teacherId, studentIds);

      expect(mockConn.beginTransaction).toHaveBeenCalled();
      expect(mockConn.query).toHaveBeenCalledWith('INSERT IGNORE INTO registrations (teacher_id, student_id) VALUES ?', [
        [
          [1, 2],
          [1, 3],
        ],
      ]);
      expect(mockConn.commit).toHaveBeenCalled();
      expect(mockConn.release).toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      const mockConn = {
        beginTransaction: jest.fn(),
        query: jest.fn().mockRejectedValue(new Error('Insert failed')),
        commit: jest.fn(),
        rollback: jest.fn(),
        release: jest.fn(),
      };

      pool.getConnection.mockResolvedValue(mockConn);

      const teacherId = 1;
      const studentIds = [2];

      await expect(registrationRepo.registerStudents(teacherId, studentIds)).rejects.toThrow('Insert failed');

      expect(mockConn.rollback).toHaveBeenCalled();
      expect(mockConn.release).toHaveBeenCalled();
    });
  });

  describe('getStudentsByTeacher', () => {
    it('should return student emails for given teacher ID', async () => {
      const mockRows = [{ email: 'a@student.com' }, { email: 'b@student.com' }];
      pool.query.mockResolvedValue([mockRows]);

      const result = await registrationRepo.getStudentsByTeacher(1);
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT s.email'), [1]);
      expect(result).toEqual(['a@student.com', 'b@student.com']);
    });
  });

  describe('getCommonStudents', () => {
    it('should return emails of students common to all teachers', async () => {
      const teacherIds = [1, 2];
      const mockRows = [{ email: 'common@student.com' }];
      pool.query.mockResolvedValue([mockRows]);

      const result = await registrationRepo.getCommonStudents(teacherIds);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('HAVING COUNT(DISTINCT'), [...teacherIds, teacherIds.length]);
      expect(result).toEqual(['common@student.com']);
    });

    it('should return empty array if teacherIds is empty', async () => {
      const result = await registrationRepo.getCommonStudents([]);
      expect(result).toEqual([]);
      expect(pool.query).not.toHaveBeenCalled();
    });
  });
});
