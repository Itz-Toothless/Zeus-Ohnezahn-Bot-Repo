const mongoose = require('mongoose');

const modChannelSchema = new mongoose.Schema({
    GuildID: String,
    ChannelID: String
});

module.exports = mongoose.model('modChannelModal', modChannelSchema);
