const { ActivityType } = require('discord.js');
const client = require('..');
const chalk = require('chalk');

client.on("ready", () => {
    try {
        const activities = [
            { name: `${client.guilds.cache.size} Server`, type: ActivityType.Listening },
            { name: `${client.channels.cache.size} Kanäle`, type: ActivityType.Playing },
            { name: `${client.users.cache.size - 1} Nutzer`, type: ActivityType.Watching },
            { name: `Discord.js v14`, type: ActivityType.Competing }
        ];
        const status = [
            'online',
            'dnd',
            'idle'
        ];
        let i = 0;
        setInterval(() => {
            if (i >= activities.length || !i) i = 0
            client.user.setActivity(activities[i])
            i++;
        }, 300000);

        let s = 0;
        setInterval(() => {
            if (s >= activities.length || !s) s = 0
            client.user.setStatus(status[s])
            s++;
        }, 300000);
        console.log(chalk.green(`Logged in as ${client.user.tag}!`))
    } catch (err) {
        console.log(err)
    }
});
