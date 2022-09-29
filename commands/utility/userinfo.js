const log = (arg) => console.log(arg);
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'Gets information about a user.',
    usage: 'z&o!userinfo <user>',
    aliases: ['user', 'u-info', 'uinfo', 'user-info', ' userinfo', ' user', ' u-info', ' uinfo', ' user-info', 'whois'],
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
                    .setColor('Blurple')
                    .setTitle('User Info')
                    .addFields(
                        { name: 'Tag:', value: `${member.user.tag}`, inline: true },
                        { name: 'ID:', value: `${member.id}`, inline: true },
                        { name: 'Bot?', value: `${member.user.bot ? "✅" : "❌"}`, inline: true },
                        { name: 'Erstellt am:', value: `**<t:${Math.round(parseInt(member.user.createdTimestamp) / 1000)}:F>**`, inline: true },
                        { name: 'Beigetreten am:', value: `**<t:${Math.round(parseInt(member.joinedTimestamp) / 1000)}:F>**`, inline: true },
                        { name: 'Admin?', value: `${member.permissions.has(PermissionsBitField.Flags.Administrator) ? "✅" : "❌"}`, inline: true },
                        { name: 'Rollen:', value: `${authorRoles ? authorRoles : 'Keine Rollen gefunden!'}`, inline: false }
                        
                    )
                    .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();
                return msg.reply({ embeds: [authorEmbed], allowedMentions: { repliedUser: false }  });
            } else if (member) {
                roles = member.roles.cache.map(r => r).join(', ').replace('@everyone', '').split('');
                roles.pop();
                roles.pop();
                var memberRoles = roles.join('')
                var memberEmbed = new EmbedBuilder()
                    .setAuthor({ name: `${member.user.tag}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                    .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                    .setColor('Blurple')
                    .setTitle('User Info')
                    .addFields(
                        { name: 'Tag:', value: `${member.user.tag}`, inline: true },
                        { name: 'ID:', value: `${member.id}`, inline: true },
                        { name: 'Bot:', value: `${member.user.bot ? "✅" : "❌"}`, inline: true },
                        { name: 'Erstellt am:', value: `**<t:${Math.round(parseInt(member.user.createdTimestamp) / 1000)}:F>**`, inline: true },
                        { name: 'Beigetreten am:', value: `**<t:${Math.round(parseInt(member.joinedTimestamp) / 1000)}:F>**`, inline: true },
                        { name: 'Admin?', value: `${member.permissions.has(PermissionsBitField.Flags.Administrator) ? "✅" : "❌"}`, inline: true },
                        { name: 'Rollen:', value: `${memberRoles ? memberRoles : 'Keine Rollen gefunden!'}`, inline: false }
                    )
                    .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();
                return msg.reply({ embeds: [memberEmbed], allowedMentions: { repliedUser: false } });
            } else {
                await client.users.fetch(args[0]).then((fetching) => {
                    let userInfo = new EmbedBuilder()
                        .setAuthor({ name: `${fetching.tag}`, iconURL: fetching.displayAvatarURL({ dynamic: true }) })
                        .setColor('Blurple')
                        .setThumbnail(fetching.displayAvatarURL({ dynamic: true }))
                        .setTitle('User Info')
                        .addFields(
                            { name: 'Tag:', value: `${fetching.tag}`, inline: true },
                            { name: 'ID:', value: `${fetching.id}`, inline: true },
                            { name: 'Bot:', value: `${fetching.bot ? "✅" : "❌"}`, inline: true },
                            { name: 'Erstellt am:', value: `**<t:${Math.round(parseInt(fetching.createdTimestamp) / 1000)}:F>**`, inline: true },
                        )
                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp();
                    return msg.reply({ embeds: [userInfo], allowedMentions: { repliedUser: false }  });
                }).catch((err) => {
                    const userInfoErrorEmbed = new EmbedBuilder()
                        .setAuthor({ name: `${msg.author.tag}`, iconURL: `${msg.author.avatarURL({ dynamic: true })}` })
                        .setColor(0xff0000)
                        .setTitle('Ungültige Argumente!')
                        .setDescription('Entweder es wurde:\n1) Kein Nutzer assoziiert zur ID `' + args[0] + '` gefunden oder\n2) Ein interner Fehler ist aufgetreten')
                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: msg.author.avatarURL({ dynamic: true }) })
                        .setTimestamp();
                    return msg.reply({ embeds: [userInfoErrorEmbed], allowedMentions: { repliedUser: false } })
                });
            }
        } catch (err) {
            log(err)
        }
    }
};
