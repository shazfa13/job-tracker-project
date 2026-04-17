const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));

module.exports = router;