const mongoose = require('mongoose');

let RoleSchema = new mongoose.Schema({
    GuildID: mongoose.SchemaTypes.String,
    ChannelID: mongoose.SchemaTypes.String
});

module.exports = mongoose.model('roles', RoleSchema);
