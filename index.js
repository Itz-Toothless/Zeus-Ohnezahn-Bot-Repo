const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});

const config = require('./config.json');
require('dotenv').config()

client.commands = new Collection()
client.aliases = new Collection()
client.slashCommands = new Collection();
client.prefix = config.prefix

module.exports = client;


readdirSync('./handlers').forEach((handler) => {
    require(`./handlers/${handler}`)(client)
});


client.login(process.env.W_PTOKEN)