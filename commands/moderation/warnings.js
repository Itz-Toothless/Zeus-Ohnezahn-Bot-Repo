const db = require('../../schema/warns')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'warnings',
    description: 'Zeigt die Verwarnungen eines Nutzers an',
    aliases: ['checkwarns'],
    userPerms: ['ModerateMembers'],
    botPerms: [],
    cooldown: 3000,
    run: async (client, message, args) => {
        try {
            const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if (!user) return message.channel.send('Der angegebene Nutzer konnte nicht gefunden werden!');
            db.findOne({ guildId: message.guild.id, userId: user.user.id }, async (err, data) => {
                if (err) throw err;
                let arr = [];
                let count = 0;
                try {
                    data.content.forEach(element => {
                        count += 1;
                        arr.push(`${count}) Moderator: ${message.guild.members.cache.get(element.moderator).user.tag}\nGrund: ${element.reason}\n**<t:${element.timestamp}:f>**\n`);
                    });
                } catch (err) {
                    arr.push('Derzeit hat ' + user.user.tag + ' keine Verwarnungen!')
                };
                let warnList = new EmbedBuilder()
                    .setTitle(`${user.user.tag}'s Verwarnungen`)
                    .setDescription(`${arr.join('\n')}`)
                    .setColor('Blurple')
                return message.channel.send({ embeds: [warnList] });
            });
        } catch (err) {
            console.log(err);
        }
    }
};
