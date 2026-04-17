const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const {
  createResume,
  listResumes,
  updateResume,
  deleteResume,
  uploadResume,
  listUserResumes
} = require('../controllers/resumeController');

const router = express.Router();

router.post('/resumes', asyncHandler(createResume));
router.get('/resumes', asyncHandler(listResumes));
router.put('/resumes/:resumeId', asyncHandler(updateResume));
router.delete('/resumes/:resumeId', asyncHandler(deleteResume));
router.post('/upload-resume', asyncHandler(uploadResume));
router.get('/resumes/:userId', asyncHandler(listUserResumes));

module.exports = router;