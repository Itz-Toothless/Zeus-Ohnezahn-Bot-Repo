const { ApplicationCommandType, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'information',
    description: 'Zeigt Informationen über eine angegebene Kategorie',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'user',
            description: 'Infos über einen Nutzer',
            type: 1,
            options: [{
                name: 'user',
                description: 'Der Nutzer',
                type: 6,
                required: false
            }]
        },
        {
            name: 'kanal',
            description: 'Infos über einen Kanal',
            type: 1,
            options: [{
                name: 'kanal',
                description: 'Der Kanal',
                type: 7,
                required: true
            }]
        },
        {
            name: 'rolle',
            description: 'Infos über eine Rolle',
            type: 1,
            options: [{
                name: 'rolle',
                description: 'Die Rolle',
                type: 8,
                required: true
            }]
        },
        {
            name: 'server',
            description: 'Infos über den Server',
            type: 1
        }
    ],
    run: async (client, interaction) => {
        try {
            switch (interaction.options._subcommand) {
                case 'user':
                    let member = interaction.options.getMember('user') || interaction.member
                    var roles = member.roles.cache.map(r => r).join(', ').replace('@everyone', '').split('');
                    roles.pop();
                    roles.pop();
                    var authorRoles = roles.join('')
                    const userinfoEmbed = new EmbedBuilder()
                        .setAuthor({ name: `${member.user.tag}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                        .setColor('Blue')
                        .setTitle('User Info')
                        .addFields(
                            { name: 'Tag:', value: `${member.user.tag}`, inline: true },
                            { name: 'ID:', value: `${member.id}`, inline: true },
                            { name: 'Bot?', value: `${member.user.bot ? "✅" : "❌"}`, inline: true },
                            { name: 'Erstellt am:', value: `**<t:${Math.round(parseInt(member.user.createdTimestamp) / 1000)}:F>**`, inline: true },
                            { name: 'Beigetreten am:', value: `**<t:${Math.round(parseInt(member.joinedTimestamp) / 1000)}:F>**`, inline: true },
                            { name: 'Rollen:', value: `${authorRoles ? authorRoles : 'Keine Rollen gefunden!'}`, inline: false },
                            { name: 'Admin?:', value: `${member.permissions.has(PermissionsBitField.Flags.Administrator) ? "✅" : "❌"}`, inline: true }
                        )
                        .setTimestamp();
                    return interaction.reply({ embeds: [userinfoEmbed] });
                case 'server':
                    let server = interaction.guild
                    let owner = server.ownerId
                    let theOwner = await interaction.guild.members.fetch(owner)
                    let verifLevels = ["Kein Verifizierungs-Level", "Niedriges Verifizierungs-Level", "Mittleres Verifizierungs-Level", "Hohes Verifizierungs-Level", "Höchstes Verifizierungs-Level"];
                    let verif = verifLevels[server.verificationLevel]
                    let serverEmbed = new EmbedBuilder()
                        .setColor(0x7289DA)
                        .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.member.displayAvatarURL({ dynamic: true })}` })
                        .setTitle('Server Info')
                        .setThumbnail(`${server.iconURL({ dynamic: true })}`)
                        .addFields({ name: 'Server Name:', value: `${server.name}`, inline: true },
                            { name: 'Server ID:', value: `${server.id}`, inline: true },
                            { name: 'Server Inhaber:', value: `${theOwner.user.tag}\n${theOwner.id}`, inline: true },
                            { name: 'Server erstellt am:', value: `**<t:${Math.round(parseInt(server.createdTimestamp) / 1000)}:F>**`, inline: true },
                            { name: 'Server Region:', value: `${server.preferredLocale}`, inline: true },
                            { name: 'Server Verifikations-Level:', value: `${verif}`, inline: true })
                        .setTimestamp()
                        .setFooter({ text: 'Made with ❤️ by Itz_Toothless#8135', iconURL: client.user.displayAvatarURL({ dynamic: true }) });
                    return await interaction.reply({ embeds: [serverEmbed] });
                case 'rolle':
                    let role = interaction.options.getRole('rolle')
                    if (!role) {
                        return await interaction.reply({ content: "Bitte erwähne eine existierende Rolle!", ephemeral: true })
                    }
                    let roleEmbed = new EmbedBuilder()
                        .setColor(0x7289DA)
                        .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                        .setTitle('Rollen Info')
                        .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
                        .addFields({ name: 'Name:', value: `${role.name}`, inline: true },
                            { name: 'ID:', value: `${role.id}`, inline: true },
                            { name: 'Rollen Farbe', value: `${role.hexColor}`, inline: true },
                            { name: 'Position:', value: `${role.position}`, inline: true },
                            { name: 'Pingbar:', value: `${role.mentionable ? "<a:yes:1009852362845868092>" : "<a:no:1009852394898718784>"}`, inline: true },
                            { name: 'Sichtbar:', value: `${role.hoist ? "<a:yes:1009852362845868092>" : "<a:no:1009852394898718784>"}`, inline: true },
                            { name: 'Erstellt am:', value: `<t:${Math.round(parseInt(role.createdTimestamp) / 1000)}:F>`, inline: true })
                        .setFooter({ text: `Made with ❤️ by Itz_Toothless#8135`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                        .setTimestamp();
                    return await interaction.reply({ embeds: [roleEmbed] });
                case 'kanal':
                    let channel = interaction.options.getChannel('kanal')
                    if (!channel) {
                        return await interaction.reply({ content: "Ich finde den Kanal " + channel + " nicht!", ephemeral: true })
                    }
                    function channelType(channel) {
                        switch (channel.type) {
                            case 0:
                                return "Text Kanal";
                            case 2:
                                return "Sprach Kanal";
                            case 4:
                                return "Kategorie";
                            case 5:
                                return "Neuigkeiten";
                            case 15:
                                return "Themenstrang";
                            case 1:
                                return "Direktnachricht";
                            case 3:
                                return "Gruppen-Direktnachricht";
                            case 14:
                                return "Verzeichnis";
                            case 10:
                                return "Neuigkeiten-Themenstrang";
                            case 11:
                                return "Öffentlicher Themenstrang";
                            case 12:
                                return "Privater Themenstrang";
                            case 13:
                                return "Bühnen-Sprachkanal";
                        }
                    }
                    let channelEmbed = new EmbedBuilder()
                        .setColor(0x7289DA)
                        .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                        .setTitle('Kanal Info')
                        .setThumbnail(`${client.user.displayAvatarURL({ dynamic: true })}`)
                        .addFields({ name: 'Name:', value: `${channel.name}`, inline: true },
                            { name: 'ID:', value: `${channel.id}`, inline: true },
                            { name: 'Typ:', value: `${channelType(channel)}`, inline: true },
                            { name: 'Position:', value: `${channel.position || "0"}`, inline: true },
                            { name: 'NSFW?:', value: `${channel.nsfw ? "<a:yes:1009852362845868092>" : "<a:no:1009852394898718784>"}`, inline: true },
                            { name: 'Erstellt am:', value: `**<t:${Math.round(parseInt(channel.createdTimestamp) / 1000)}:F>**`, inline: true })
                        .setFooter({ text: `Made with ❤️ by Itz_Toothless#8135`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                        .setTimestamp();
                    return await interaction.reply({ embeds: [channelEmbed] });
            }

        } catch (err) {
            console.log(err)
        }
    }
};
