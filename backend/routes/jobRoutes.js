const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const {
  createJob,
  listJobs,
  updateJob,
  deleteJob,
  getJobNotes,
  updateJobNotes,
  resetDatabase,
  analyzeSkills
} = require('../controllers/jobController');

const router = express.Router();

router.post('/jobs', asyncHandler(createJob));
router.get('/jobs', asyncHandler(listJobs));
router.put('/jobs/:jobId', asyncHandler(updateJob));
router.delete('/jobs/:jobId', asyncHandler(deleteJob));
router.get('/jobs/:jobId/notes', asyncHandler(getJobNotes));
router.post('/jobs/:jobId/notes', asyncHandler(updateJobNotes));
router.post('/reset-db', asyncHandler(resetDatabase));
router.post('/analyze-skills', asyncHandler(analyzeSkills));

module.exports = router;