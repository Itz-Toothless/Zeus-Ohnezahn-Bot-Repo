const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const ms = require('ms'); 

module.exports = {
    name: 'timeout',
    description: 'Versetzt einen Nutzer in den Timeout',
    usage: 'z&o!timeout <user> <zeit> [Grund]',
    aliases: ['time-out', 'set-timeout'],
    userPerms: ['ModerateMembers'],
    botPerms: ['ModerateMembers'],
    run: async (client, message, args) => {
        try {
            let time = args[1];
            let reason = args.slice(2).join(' ') || 'Kein Grund angegeben';
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]);
            if (!time || !user) {
                return message.channel.send('Sie müssen einen Nutzer und die Zeit angeben!');
            }
            let milliseconds = ms(time);
            if (user.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return message.channel.send('Sie haben nicht die Berechtigung, diesen Benutzer zu timeouten, da Sie Administrator-Berechtigungen besitzt!');
            }
            else if (user.id === message.guild.ownerId) {
                return message.channel.send('Sie können den Besitzer des Servers nicht timeouten!');
            }
            else if (user.id === client.user.id) {
                return message.channel.send('Ich kann mich selber nicht timeouten!');
            }
            else if (milliseconds > 28 * 24 * 60 * 60 * 1000) {
                return message.channel.send('Das Timeout-Limit beträgt aufgrund von Discord-Einschränkungen 28 Tage!');
            }
            else if (!user.isCommunicationDisabled()) {
                await user.timeout(milliseconds, reason);
                let embed = new EmbedBuilder()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ forceStatic: true }) })
                    .setColor('Blurple')
                    .setTitle('Timeout')
                    .setDescription(`**User:** ${user.user.tag}\n**Zeit:** **<t:${Math.round(parseInt(Date.now() + milliseconds) / 1000)}:f>**\n**Grund:** ${reason}`)
                    .setTimestamp();
                return message.channel.send({ embeds: [embed] });
            } else {
                return message.channel.send(user.user.tag + " hat bereits ein Timeout!")
            }
        } catch(err) {
            console.log(err);
        }
    }
};
