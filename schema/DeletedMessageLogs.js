const mongoose = require('mongoose');

const deletedMessageSchema = new mongoose.Schema({
    GuildID: String,
    ChannelID: String
});

module.exports = mongoose.model('deletedMessageLogs', deletedMessageSchema);
