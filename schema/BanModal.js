const mongoose = require('mongoose');

let BanSchema = new mongoose.Schema({
    GuildID: mongoose.SchemaTypes.String,
    UserID: mongoose.SchemaTypes.String
});

module.exports = mongoose.model('bans', BanSchema);
