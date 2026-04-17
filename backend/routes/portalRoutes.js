const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const {
  createJobPosting,
  listJobPostings,
  getRecruiterJobs,
  deleteJobPosting,
  applyJob,
  listUserApplications,
  withdrawApplication,
  updateApplicationStatus,
  recruiterAnalytics,
  getJobApplicants
} = require('../controllers/portalController');

const router = express.Router();

router.post('/create-job-posting', asyncHandler(createJobPosting));
router.get('/job-postings', asyncHandler(listJobPostings));
router.get('/recruiter-jobs/:recruiterId', asyncHandler(getRecruiterJobs));
router.delete('/job-postings/:jobId', asyncHandler(deleteJobPosting));
router.post('/apply-job', asyncHandler(applyJob));
router.get('/job-applications/:userId', asyncHandler(listUserApplications));
router.delete('/job-applications/:applicationId', asyncHandler(withdrawApplication));
router.patch('/job-applications/:applicationId/status', asyncHandler(updateApplicationStatus));
router.get('/recruiter-analytics/:recruiterId', asyncHandler(recruiterAnalytics));
router.get('/job-applicants/:jobId', asyncHandler(getJobApplicants));

module.exports = router;