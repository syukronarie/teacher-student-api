const RegisterDTO = require('../dtos/register.dto');
const SuspendDTO = require('../dtos/suspend.dto');
const NotificationDTO = require('../dtos/notification.dto');
const teacherService = require('../services/teacher.service');
const zodValidation = require('../middlewares/zodValidation');
const express = require('express');
const { logWithContext } = require('../config/logger');
const { getFileName } = require('../utils/getFileName');
const { constructSuccessResponse } = require('../utils/responseBuilder');
const router = express.Router();

const log = logWithContext({ module: getFileName(__filename) });

router.post('/register', zodValidation(RegisterDTO), async (req, res, next) => {
  try {
    await teacherService.registerStudents(req.validatedData);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get('/commonstudents', async (req, res, next) => {
  try {
    let teachers = req.query.teacher;
    if (!teachers) return res.status(400).json({ message: 'teacher query parameter is required' });
    if (!Array.isArray(teachers)) teachers = [teachers];
    const students = await teacherService.getCommonStudents(teachers);
    const response = constructSuccessResponse({ message: 'Getting list of common students', students, data: { resCode: res.statusCode } });
    log.info(response);
    res.status(200).json({ students });
  } catch (error) {
    next(error);
  }
});

router.post('/suspend', zodValidation(SuspendDTO), async (req, res, next) => {
  try {
    await teacherService.suspendStudent(req.validatedData.student);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post('/retrievefornotifications', zodValidation(NotificationDTO), async (req, res, next) => {
  try {
    const recipients = await teacherService.retrieveForNotifications(req.validatedData);
    res.status(200).json({ recipients });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
