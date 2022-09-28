const mongoose = require('mongoose');

const editedMessageSchema = new mongoose.Schema({
    GuildID: String,
    ChannelID: String
});

module.exports = mongoose.model('editedMessageLogs', editedMessageSchema);
