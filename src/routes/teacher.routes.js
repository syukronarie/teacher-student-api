const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');

router.use('/', teacherController);

module.exports = router;
