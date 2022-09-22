const mongoose = require('mongoose');

const modSchema = new mongoose.Schema({
    GuildID: String,
    ChannelID: String
});

module.exports = mongoose.model('modModal', modSchema);
