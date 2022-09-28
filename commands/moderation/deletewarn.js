const db = require('../../schema/warns')
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'deletewarns',
    description: 'Löscht alle Verwarnungen eines Nutzers',
    aliases: ['del-warns', 'rm-all-warns'],
    userPerms: ['ModerateMembers'],
    botPerms: [],
    run: async (client, message, args) => {
        try {
            const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!user) return message.channel.send('Der angegebene Nutzer konnte nicht gefunden werden!');
            db.findOne({ guildId: message.guild.id, userId: user.user.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    await db.findOneAndDelete({ guildId: message.guild.id, userId: user.user.id })
                    let deletedWarns = new EmbedBuilder()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                        .setColor('Blurple')
                        .setDescription(`Alle Verwarnungen wurden von ${user.user.tag} entfernt!`)
                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: client.users.cache.get('705557092802625576').displayAvatarURL({ dynamic: true }) })
                        .setTimestamp()
                    return message.channel.send({ embeds: [deletedWarns] });
                } else {
                    let noWarnsFound = new EmbedBuilder()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                        .setColor('Red')
                        .setDescription(`${user.user.tag} hat keine Verwarnungen!`)
                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: client.users.cache.get('705557092802625576').displayAvatarURL({ dynamic: true }) })
                        .setTimestamp()
                    return message.channel.send({ embeds: [noWarnsFound] });
                }
            });
        } catch (err) {
            message.channel.send('Ein Fehler ist aufgetreten!');
            console.log(err);
        }
    }
};
