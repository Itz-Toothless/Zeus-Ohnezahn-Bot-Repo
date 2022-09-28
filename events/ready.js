const { ActivityType } = require('discord.js');
const client = require('..');

const mongoose = require('mongoose');
require('dotenv').config();

const chalk = require('chalk');
const activities = [
    { name: `Discord.js v14.5.0`, type: ActivityType.Competing }
];
const status = [
    'online',
    'dnd',
    'idle'
];
setInterval(async () => {
    let sta = status[Math.floor(Math.random() * status.length)];
    client.user.setStatus(sta);
}, 60e3);
client.on("ready", () => {

    console.log(chalk.green(`Eingeloggt als ${client.user.tag}!`))

    if (!process.env.DBURL) return;

    mongoose.connect(process.env.DBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Client is now connected to the Database')
    }).catch((err) => {
        console.log(err);
    })
});
