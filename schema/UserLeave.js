const mongoose = require('mongoose');

const userLeaveSchema = new mongoose.Schema({
    GuildID: String,
    ChannelID: String
});

module.exports = mongoose.model('userLeave', userLeaveSchema);
