// Routes for auth

const express = require('express');
const router = express.Router();
const { getauth } = require('../controllers/auth.controller');

router.get('/', getauth);

module.exports = router;
