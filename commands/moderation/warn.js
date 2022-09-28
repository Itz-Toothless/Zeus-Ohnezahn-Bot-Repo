const db = require('../../schema/warns')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'warn',
    description: 'Verwarnt einen Nutzer',
    aliases: ['warn-user'],
    userPerms: ['ModerateMembers'],
    botPerms: [],
    cooldown: 3000,
    run: async (client, message, args) => {
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.channel.send('Der angegebene Nutzer konnte nicht gefunden werden!');
        const reason = args.slice(1).join(" ")
        if (!reason) return message.channel.send('Bitte nennen Sie einen Grund für die Verwarnung!');
        db.findOne({ guildId: message.guild.id, userId: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                data = new db({
                    guildId: message.guild.id,
                    userId: user.user.id,
                    content: [
                        {
                            moderator: message.author.id,
                            reason: reason,
                            timestamp: Math.round(parseInt(Date.now() / 1000)),
                        }
                    ]
                })
            } else {
                const obj = {
                    moderator: message.author.id,
                    reason: reason,
                    timestamp: Math.round(parseInt(Date.now() / 1000)),
                }
                data.content.push(obj)
            }
            data.save()
        });
        try {
            let punishmentDM = new EmbedBuilder()
                .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                .setTitle('Verwarnt!')
                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: client.users.cache.get('705557092802625576').displayAvatarURL({ dynamic: true }) })
                .setDescription(`Sie wurden auf dem Server ${message.guild.name} verwarnt!\nGrund: ${reason}`)
                .setColor('Red')
            user.send({ embeds: [punishmentDM] });
        } catch (err) {
            message.channel.send('Ich konnte dem Nutzer keine Direktnachricht senden!').then((msg) => {
                setTimeout(async () => {
                    await msg.delete();
                }, 3000)
            });
            console.log(err)
        }
        let channelMessage = new EmbedBuilder()
            .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
            .setTitle('Verwarnung ausgestellt!')
            .setDescription(`Du hast ${user} verwarnt!\nGrund: ${reason}`)
            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: client.users.cache.get('705557092802625576').displayAvatarURL({ dynamic: true }) })
            .setColor('Blurple')
        return message.channel.send({ embeds: [channelMessage] })
    }
};
