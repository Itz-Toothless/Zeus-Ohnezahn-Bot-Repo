'use strict'
const { ActivityType } = require('discord.js');
const client = require('..');
const mongoose = require('mongoose');
require('dotenv').config();

const chalk = require('chalk');
const activities = [
    { name: `Discord.js v${require('discord.js').version}`, type: ActivityType.Competing }
];
const status = [
    'online'
];

client.on("ready", () => {
    client.user.setActivity(activities[0]);
	client.user.setStatus(status[0]);
    try{
        function users_fetch() {
            client.guilds.cache.forEach(async (guild) => {
                await guild.members.fetch();
            });
        }
        setInterval(users_fetch, 600000);
    } catch(err) {
        console.log(err);
    };
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
