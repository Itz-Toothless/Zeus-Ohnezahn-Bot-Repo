const db = require('../../schema/warns')
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'removewarn',
    description: 'Löscht eine Verwarnung eines Nutzers',
    aliases: ['del-warn', 'rm-warns'],
    userPerms: ['ModerateMembers'],
    botPerms: [],
    run: async (client, message, args) => {
        try {
            const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!user) return message.channel.send('Der angegebene Nutzer konnte nicht gefunden werden!');
            db.findOne({ guildId: message.guild.id, userId: user.user.id }, async (err, data) => {
                if (err) throw err;
                let number = parseInt(args[1]) - 1
                data.content.splice(number, 1)
                data.save()
                let deletedWarns = new EmbedBuilder()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                    .setColor('Blurple')
                    .setDescription(`Eine Verwarnung wurde von ${user.user.tag} entfernt!` ? `Eine Verwarnung wurde von ${user.user.tag} entfernt!` : `${user.user.tag} hat keine Verwarnungen!`)
                    .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: client.users.cache.get('705557092802625576').displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
                return message.channel.send({ embeds: [deletedWarns] });
            });
        } catch (err) {
            message.channel.send('Ein Fehler ist aufgetreten!');
            console.log(err);
        }
    }
};
