const mongoose = require('mongoose');

let ModSchema = new mongoose.Schema({
    GuildID: mongoose.SchemaTypes.String,
    UserID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    timestamp: mongoose.SchemaTypes.String,
    Punishments: mongoose.SchemaTypes.Array
});

module.exports = mongoose.model('moderation', ModSchema);
