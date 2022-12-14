'use strict'
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const blacklistModal = require('../../schema/BlackListModal');

module.exports = {
    name: 'help',
    description: 'Zeigt Infos über die jetzigen Kommandos',
    usage: 'z&o!help',
    aliases: ['h'],
    cooldown: 3000,
    userPerms: [],
    botPerms: [],
    run: async (client, message, args) => {
        try {
            blacklistModal.findOne({ UserID: message.author.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    let blackListEmbed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('Keine Berechtigung!')
                        .setDescription(`Sie dürfen diesen Bot nicht nutzen!\nAusgesetzt seit: <t:${data.BlackListTimestamp}:F>`)
                        .setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${client.users.cache.get('705557092802625576').avatarURL({ forceStatic: false })} ` })
                        .setTimestamp()
                    return await message.reply({ embeds: [blackListEmbed] });
                }
                var button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Success)
                        .setLabel("Moderation")
                        .setCustomId("moderation")
                        .setEmoji('🛡️'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Success)
                        .setLabel('Spaß')
                        .setCustomId('fun')
                        .setEmoji('😂'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Success)
                        .setLabel("Einstellungen")
                        .setCustomId("settings")
                        .setEmoji('⚙️'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Success)
                        .setLabel("Verschiedenes")
                        .setCustomId('miscellaneous')
                        .setEmoji('🎲'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setLabel('Löschen')
                        .setCustomId('delete')
                        .setEmoji('🚮')
                );
                let embed = new EmbedBuilder()
                    .setTimestamp()
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ forceStatic: false }) })
                    .setTitle("Hilfe-Liste")
                    .setDescription("Nutzen Sie das Menü um durch die verschiedenen Kommandos von " + client.users.cache.get('1017497741871554591').tag + ' zu navigieren')
                    .setColor("Random")
                	.setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${client.users.cache.get('705557092802625576').avatarURL({ forceStatic: false })} ` })
                return message.reply({ embeds: [embed], components: [button], allowedMentions: { repliedUser: false } }).then(async (Message) => {
                    let col = await Message.createMessageComponentCollector({
                        time: 1200000,
                    });
                    col.on("collect", async (button) => {
                        if (button.member.user.id !== message.author.id) {
                            return await button.reply({ content: 'Diese Interaktion kann nur ' + message.author.tag + ' ausführen!', ephemeral: true });
                        }
                        switch (button.customId) {
                            case 'moderation':
                                embed = new EmbedBuilder()
                                    .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ forceStatic: false }) })
                                    .setTitle("Moderation")
                                    .addFields({ name: 'z&o!ban', value: 'Bannt einen Nutzer vom Server', inline: true },
                                        { name: 'z&o!kick', value: 'Kickt ein Mitglied des Servers', inline: true },
                                        { name: 'z&o!deletewarn', value: 'Löscht alle Verwarnungen eines Nutzers', inline: true },
                                        { name: 'z&o!removewarn', value: 'Löscht eine Verwarnung eines Nutzers', inline: true },
                                        { name: 'z&o!unban', value: 'Entbannt einen Nutzer vom Server', inline: true },
                                        { name: 'z&o!warn', value: 'Verwarnt einen Nutzer', inline: true },
                                        { name: 'z&o!warnings', value: 'Zeigt die Verwarnungen eines Nutzers an', inline: true })
                                    .setColor("Random")
                                	.setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${client.users.cache.get('705557092802625576').avatarURL({ dynamic: true })} ` })
                                    .setTimestamp()
                                return await button.update({ embeds: [embed] })
                            case 'settings':
                                embed = new EmbedBuilder()
                                    .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ forceStatic: false }) })
                                    .setTitle("Einstellungen")
                                    .addFields({ name: 'z&o!set-channel-updates', value: 'Legt den Kanal-Aktualisierungs-Kanal fest', inline: true },
                                        { name: 'z&o!set-user-channel', value: 'Legt den Nutzer-Aktualisierungs-Kanal fest', inline: true },
                                        { name: 'z&o!set-mod-channel', value: 'Legt den Moderations-Kanal fest', inline: true },
                                        { name: 'z&o!set-welcome-channel', value: 'Legt den Willkommens-Kanal fest', inline: true },
                                        { name: 'z&o!set-edit-channel', value: 'Legt den Nachricht-Bearbeitungs-Kanal fest', inline: true },
                                        { name: 'z&o!set-delete-channel', value: 'Legt den Nachricht-Löschung-Kanal fest', inline: true },
                                        { name: 'z&o!set-leave-channel', value: 'Legt den Verlassen-Kanal fest', inline: true })
                                    .setColor("Random")
                                	.setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${client.users.cache.get('705557092802625576').avatarURL({ dynamic: true })} ` })
                                    .setTimestamp()
                                return await button.update({ embeds: [embed] })
                            case 'miscellaneous':
                                embed = new EmbedBuilder()
                                    .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ forceStatic: false }) })
                                    .setTitle("Nützlichkeit")
                                    .addFields({ name: 'z&o!addemoji', value: 'Fügt ein Emoji dem Server hinzu', inline: true },
                                        { name: 'z&o!binary', value: 'Konvertiert Binär-Code zu Lateinischen Buchstaben (Bestehend aus Nullen und Einsen)', inline: true },
                                        { name: 'z&o!channelinfo', value: 'Zeigt die Kanalinfo an', inline: true },
                                        { name: 'z&o!roleinfo', value: 'Zeigt die Rolleninfo an', inline: true },
                                        { name: 'z&o!serverinfo', value: 'Zeigt Information über den Server an', inline: true },
                                        { name: 'z&o!string', value: 'Konvertiert Lateinische Buchstaben zu Binär-Code', inline: true },
                                        { name: 'z&o!userinfo', value: 'Zeigt Informationen für einen Nutzer an.', inline: true })
                                    .setColor("Random")
                                	.setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${client.users.cache.get('705557092802625576').avatarURL({ forceStatic: false })} ` })
                                    .setTimestamp()
                                return await button.update({ embeds: [embed] });
                            case 'fun':
                                embed = new EmbedBuilder()
                                    .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ forceStatic: false }) })
                                    .setTitle("Spaß")
                                    .addFields({ name: 'z&o!8ball', value: 'Gibt Ihnen eine zufällige Antwort auf Ihre Frage.', inline: true },
                                        { name: 'z&o!würfeln', value: 'Würfeln Sie eine Zahl zwischen 1 und 6', inline: true },
                                        { name: 'z&o!howgay', value: 'Gibt einen Prozentsatz an, wie schwul jemand ist (aus rechtlichen Gründen ist es nur zum Spaß)', inline: true })
                                    .setColor("Random")
                                	.setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${client.users.cache.get('705557092802625576').avatarURL({ forceStatic: false })} ` })
                                    .setTimestamp()
                                return await button.update({ embeds: [embed] });
                            case 'delete':
                                col.stop(true);
                                await Message.delete();
                                if (PermissionsBitField.Flags.ManageMessages) {
                                    try {
                                        await message.delete();
                                    } catch(err) {
                                        return;
                                    }
                                } else {
                                    return;
                                }
                            default:
                                break;
                        }
                    });
                });
            });
        } catch (error) {
            console.log(error);
        }
    }
};
