const log = (arg) => console.log(arg);
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'Gets information about a user.',
    usage: 'z&o!userinfo <user>',
    aliases: ['user', 'u-info', 'uinfo', 'user-info', ' userinfo', ' user', ' u-info', ' uinfo', ' user-info'],
    run: async (client, msg, args) => {
        try {
            let member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
            if (!args[0]) {
                member = msg.member;
                var roles = member.roles.cache.map(r => r).join(', ').replace('@everyone', '').split('');
                roles.pop();
                roles.pop();
                var authorRoles = roles.join('')
                const authorEmbed = new EmbedBuilder()
                    .setAuthor({ name: `${member.user.tag}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                    .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                    .setColor(0x7289DA)
                    .setTitle('User Info')
                    .addFields(
                        { name: 'Tag:', value: `${member.user.tag}`, inline: true },
                        { name: 'ID:', value: `${member.id}`, inline: true },
                        { name: 'Bot?', value: `${member.user.bot ? "✅" : "❌"}`, inline: true },
                        { name: 'Erstellt am:', value: `**<t:${Math.round(parseInt(member.user.createdTimestamp) / 1000)}:F>**`, inline: true },
                        { name: 'Beigetreten am:', value: `**<t:${Math.round(parseInt(member.joinedTimestamp) / 1000)}:F>**`, inline: true },
                        { name: 'Rollen:', value: `${authorRoles ? authorRoles : 'Keine Rollen gefunden!'}`, inline: false },
                        { name: 'Admin?', value: `${member.permissions.has(PermissionsBitField.Flags.Administrator) ? "✅" : "❌"}`, inline: true }
                    )
                    .setTimestamp();
                return msg.channel.send({ embeds: [authorEmbed] });
            } else if (member) {
                roles = member.roles.cache.map(r => r).join(', ').replace('@everyone', '').split('');
                roles.pop();
                roles.pop();
                var memberRoles = roles.join('')
                var memberEmbed = new EmbedBuilder()
                    .setAuthor({ name: `${member.user.tag}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                    .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                    .setColor(0x7289DA)
                    .setTitle('User Info')
                    .addFields(
                        { name: 'Tag:', value: `${member.user.tag}`, inline: true },
                        { name: 'ID:', value: `${member.id}`, inline: true },
                        { name: 'Bot:', value: `${member.user.bot ? "✅" : "❌"}`, inline: true },
                        { name: 'Erstellt am:', value: `**<t:${Math.round(parseInt(member.user.createdTimestamp) / 1000)}:F>**`, inline: true },
                        { name: 'Beigetreten am:', value: `**<t:${Math.round(parseInt(member.joinedTimestamp) / 1000)}:F>**`, inline: true },
                        { name: 'Rollen:', value: `${memberRoles ? memberRoles : 'Keine Rollen gefunden!'}`, inline: false },
                        { name: 'Admin?', value: `${member.permissions.has(PermissionsBitField.Flags.Administrator) ? "✅" : "❌"}`, inline: true }
                    )
                    .setTimestamp();
                return msg.channel.send({ embeds: [memberEmbed] });
            } else {
                await client.users.fetch(args[0]).then((fetching) => {
                    let userInfo = new EmbedBuilder()
                        .setAuthor({ name: `${fetching.tag}`, iconURL: fetching.displayAvatarURL({ dynamic: true }) })
                        .setColor(0x7289DA)
                        .setThumbnail(fetching.displayAvatarURL({ dynamic: true }))
                        .setTitle('User Info')
                        .addFields(
                            { name: 'Tag', value: `${fetching.tag}`, inline: true },
                            { name: 'ID', value: `${fetching.id}`, inline: true },
                            { name: 'Bot', value: `${fetching.bot ? "✅" : "❌"}`, inline: true },
                            { name: 'Created At', value: `**<t:${Math.round(parseInt(fetching.createdTimestamp) / 1000)}:F>**`, inline: true },
                        )
                        .setTimestamp();
                    return msg.channel.send({ embeds: [userInfo] });
                }).catch((err) => {
                    log(err)
                    return msg.channel.send('Nutzer wurde nicht gefunden! Bitte überprüfen Sie Ihre Eingabe und versuchen es erneut!');
                });
            }
        } catch (err) {
            log(err)
        }
    }
};
