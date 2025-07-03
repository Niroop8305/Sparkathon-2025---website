// Routes for user

const express = require('express');
const router = express.Router();
const { getuser } = require('../controllers/user.controller');

router.get('/', getuser);

module.exports = router;
