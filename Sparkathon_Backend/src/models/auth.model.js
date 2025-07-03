// Model for auth

const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    // Define schema here
});

module.exports = mongoose.model('auth', authSchema);
