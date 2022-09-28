const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
    GuildID: String,
    ChannelID: String
});

module.exports = mongoose.model('updateModal', updateSchema);
