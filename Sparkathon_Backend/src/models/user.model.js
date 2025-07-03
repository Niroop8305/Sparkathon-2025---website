// Model for user

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Define schema here
});

module.exports = mongoose.model('user', userSchema);
