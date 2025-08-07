const pool = require('../config/db');
const studentRepo = require('../repositories/student.repository');

jest.mock('../config/db');

describe('student.repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return student object if found', async () => {
      const mockStudent = { id: 1, email: 'test@example.com' };
      pool.query.mockResolvedValue([[mockStudent]]);

      const result = await studentRepo.findByEmail('test@example.com');
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM students WHERE email = ?', ['test@example.com']);
      expect(result).toEqual(mockStudent);
    });

    it('should return null if student not found', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await studentRepo.findByEmail('notfound@example.com');
      expect(result).toBeNull();
    });
  });

  describe('createStudent', () => {
    it('should insert student and return id + email', async () => {
      pool.query.mockResolvedValue([{ insertId: 123 }]);

      const result = await studentRepo.createStudent('new@student.com');
      expect(pool.query).toHaveBeenCalledWith('INSERT INTO students (email) VALUES (?)', ['new@student.com']);
      expect(result).toEqual({ id: 123, email: 'new@student.com' });
    });
  });

  describe('suspendStudent', () => {
    it('should return true if student was suspended', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]);

      const result = await studentRepo.suspendStudent('suspend@student.com');
      expect(pool.query).toHaveBeenCalledWith('UPDATE students SET suspended = TRUE WHERE email = ?', ['suspend@student.com']);
      expect(result).toBe(true);
    });

    it('should return false if no student was affected', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 0 }]);

      const result = await studentRepo.suspendStudent('missing@student.com');
      expect(result).toBe(false);
    });
  });

  describe('isSuspended', () => {
    it('should return true if student is suspended', async () => {
      pool.query.mockResolvedValue([[{ suspended: 1 }]]);

      const result = await studentRepo.isSuspended('suspended@student.com');
      expect(result).toBe(1); // or true if your DB returns boolean
    });

    it('should return false if student is not suspended', async () => {
      pool.query.mockResolvedValue([[{ suspended: 0 }]]);

      const result = await studentRepo.isSuspended('active@student.com');
      expect(result).toBe(0); // or false
    });

    it('should return null if student does not exist', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await studentRepo.isSuspended('unknown@student.com');
      expect(result).toBeNull();
    });
  });
});
