const mongoose = require('mongoose');

let Schema = new mongoose.Schema({
    guildId: mongoose.SchemaTypes.String,
    userId: mongoose.SchemaTypes.String,
    content: mongoose.SchemaTypes.Array,
    timestamp: mongoose.SchemaTypes.String
})

module.exports = mongoose.model('warns', Schema);
