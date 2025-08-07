const teacherRepo = require('../repositories/teacher.repository');
const studentRepo = require('../repositories/student.repository');
const registrationRepo = require('../repositories/registration.repository');
const errorResponse = require('../utils/errorResponse');
const logger = require('../config/logger');
const TeacherService = require('../services/teacher.service'); // Adjust path as needed

jest.mock('../repositories/teacher.repository');
jest.mock('../repositories/student.repository');
jest.mock('../repositories/registration.repository');

const log = { error: jest.fn(), info: jest.fn() };
require('../utils/getFileName').getFileName = jest.fn(() => 'teacher.service.js');

describe('TeacherService', () => {
  afterEach(() => {
    jest.spyOn(logger, 'logWithContext').mockReturnValue(log);
    jest.clearAllMocks();
  });

  describe('registerStudents', () => {
    it('should register students for a teacher', async () => {
      teacherRepo.findByEmail.mockResolvedValue(null);
      teacherRepo.createTeacher.mockResolvedValue({ id: 1 });
      studentRepo.findByEmail.mockResolvedValueOnce(null);
      studentRepo.createStudent.mockResolvedValue({ id: 2 });
      registrationRepo.registerStudents.mockResolvedValue();

      await TeacherService.registerStudents({
        teacher: 'teacher@example.com',
        students: ['student@example.com'],
      });

      expect(teacherRepo.createTeacher).toHaveBeenCalledWith('teacher@example.com');
      expect(studentRepo.createStudent).toHaveBeenCalledWith('student@example.com');
      expect(registrationRepo.registerStudents).toHaveBeenCalledWith(1, [2]);
    });
  });

  describe('getCommonStudents', () => {
    it('should return common students for given teachers', async () => {
      teacherRepo.findByEmail.mockResolvedValueOnce({ id: 1 }).mockResolvedValueOnce({ id: 2 });

      registrationRepo.getCommonStudents.mockResolvedValue(['student1@example.com']);

      const result = await TeacherService.getCommonStudents(['t1@example.com', 't2@example.com']);

      expect(result).toEqual(['student1@example.com']);
      expect(registrationRepo.getCommonStudents).toHaveBeenCalledWith([1, 2]);
    });

    it('should throw error if a teacher is not found', async () => {
      const error = { statusCode: 404, message: 'Teacher not found' };
      jest.spyOn(errorResponse, 'constructErrorResponse').mockReturnValue(error);
      teacherRepo.findByEmail.mockResolvedValue(null);

      await expect(TeacherService.getCommonStudents(['notfound@example.com'])).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('suspendStudent', () => {
    it('should suspend a student', async () => {
      studentRepo.findByEmail.mockResolvedValue({ id: 1 });
      studentRepo.suspendStudent.mockResolvedValue();

      await TeacherService.suspendStudent('student@example.com');

      expect(studentRepo.suspendStudent).toHaveBeenCalledWith('student@example.com');
    });

    it('should throw error if student not found', async () => {
      const error = { statusCode: 404, message: 'Student not found' };
      jest.spyOn(errorResponse, 'constructErrorResponse').mockReturnValue(error);
      studentRepo.findByEmail.mockResolvedValue(null);

      await expect(TeacherService.suspendStudent('unknown@student.com')).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('retrieveForNotifications', () => {
    it('should return recipients from registered and mentioned students (non-suspended)', async () => {
      teacherRepo.findByEmail.mockResolvedValue({ id: 1 });
      registrationRepo.getStudentsByTeacher.mockResolvedValue(['student1@example.com', 'student2@example.com']);
      studentRepo.isSuspended
        .mockResolvedValueOnce(false) // student1
        .mockResolvedValueOnce(true) // student2
        .mockResolvedValueOnce(false); // mentioned student

      const result = await TeacherService.retrieveForNotifications({
        teacher: 'teacher@example.com',
        notification: 'Hello @mentioned@example.com',
      });

      expect(result).toEqual(['student1@example.com', 'mentioned@example.com']);
    });

    it('should throw error if teacher not found', async () => {
      const error = { statusCode: 404, message: 'Teacher not found' };
      jest.spyOn(errorResponse, 'constructErrorResponse').mockReturnValue(error);
      teacherRepo.findByEmail.mockResolvedValue(null);
      await expect(
        TeacherService.retrieveForNotifications({
          teacher: 'noone@example.com',
          notification: 'Test message',
        })
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
