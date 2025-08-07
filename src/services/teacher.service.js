const { constructErrorResponse } = require('../utils/errorResponse');
const { getFileName } = require('../utils/getFileName');
const { logWithContext } = require('../config/logger');
const registrationRepo = require('../repositories/registration.repository');
const studentRepo = require('../repositories/student.repository');
const teacherRepo = require('../repositories/teacher.repository');

const log = logWithContext({ module: getFileName(__filename) });

class TeacherService {
  async registerStudents({ teacher, students }) {
    let teacherData = await teacherRepo.findByEmail(teacher);
    if (!teacherData) teacherData = await teacherRepo.createTeacher(teacher);

    const studentDataList = [];
    for (const email of students) {
      let student = await studentRepo.findByEmail(email);
      if (!student) student = await studentRepo.createStudent(email);
      studentDataList.push(student);
    }

    const studentIds = studentDataList.map((s) => s.id);
    await registrationRepo.registerStudents(teacherData.id, studentIds);
  }

  async getCommonStudents(teacherEmails) {
    const teachers = [];
    for (const email of teacherEmails) {
      const teacher = await teacherRepo.findByEmail(email);
      if (!teacher) {
        const errorResponse = constructErrorResponse({ statusCode: 404, message: `Teacher ${email} not found` });
        log.error(errorResponse);
        throw errorResponse;
      }
      teachers.push(teacher);
    }
    const teacherIds = teachers.map((t) => t.id);
    return await registrationRepo.getCommonStudents(teacherIds);
  }

  async suspendStudent(studentEmail) {
    const student = await studentRepo.findByEmail(studentEmail);
    if (!student) {
      const errorResponse = constructErrorResponse({ statusCode: 404, message: 'Student not found' });
      log.error(errorResponse);
      throw errorResponse;
    }
    await studentRepo.suspendStudent(studentEmail);
  }

  async retrieveForNotifications({ teacher, notification }) {
    const teacherData = await teacherRepo.findByEmail(teacher);
    if (!teacherData) {
      const errorResponse = constructErrorResponse({ statusCode: 404, message: 'Teacher not found' });
      log.error(errorResponse);
      throw errorResponse;
    }
    // Get registered students for this teacher (not suspended)
    const registeredStudents = await registrationRepo.getStudentsByTeacher(teacherData.id);

    // Get all @mentioned students
    const mentions = [...(notification.match(/@([\w.+-]+@[\w.-]+\.[\w.-]+)/g) || [])].map((s) => s.substring(1)); // remove '@'

    // Filter suspended students out
    const filteredRegisteredStudents = [];
    for (const email of registeredStudents) {
      const suspended = await studentRepo.isSuspended(email);
      if (!suspended) filteredRegisteredStudents.push(email);
    }

    // Filter mentioned students (not suspended)
    const filteredMentionedStudents = [];
    for (const email of mentions) {
      const suspended = await studentRepo.isSuspended(email);
      if (!suspended) filteredMentionedStudents.push(email);
    }

    // Combine and remove duplicates
    const recipients = Array.from(new Set([...filteredRegisteredStudents, ...filteredMentionedStudents]));
    return recipients;
  }
}

module.exports = new TeacherService();
