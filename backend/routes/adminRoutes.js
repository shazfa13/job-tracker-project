const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { listAdminJobs, listAdminClients, deleteClient, deleteAdminJob } = require('../controllers/adminController');

const router = express.Router();

router.get('/admin/jobs', asyncHandler(listAdminJobs));
router.get('/admin/clients', asyncHandler(listAdminClients));
router.delete('/admin/clients/:clientId', asyncHandler(deleteClient));
router.delete('/admin/jobs/:jobId', asyncHandler(deleteAdminJob));

module.exports = router;