'use strict';
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const process = require('node:process');
const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});

const config = require('./config.json');
require('dotenv').config()

process.on('unhandledRejection', async(error) => {
    await console.log(`Would have crashed on unhandled promise rejection: ${error.stack}`);
});

process.on('uncaughtException', async(error) => {
    await console.log(`Would have crashed on unhandled exception: ${error.stack}`);
});

client.commands = new Collection()
client.aliases = new Collection()
client.slashCommands = new Collection();
client.prefix = config.prefix

module.exports = client;


readdirSync('./handlers').forEach((handler) => {
    require(`./handlers/${handler}`)(client)
});


client.login(process.env.Z_OTOKEN);
