'use strict'
const { EmbedBuilder } = require('discord.js');
const blacklistModal = require('../../schema/BlackListModal');

module.exports = {
    name: 'serverinfo',
    description: 'Zeigt Information über den Server an',
    aliases: ['s-info', 'server-info', 'si', 'server-i'],
    usage: 'z&o!serverinfo',
    botPerms: [],
    userPerms: [],
    run: async (client, message, args) => {
        try {
            blacklistModal.findOne({ UserID: message.author.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    let blackListEmbed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('Keine Berechtigung!')
                        .setDescription(`Sie dürfen diesen Bot nicht nutzen!\nAusgesetzt seit: <t:${data.BlackListTimestamp}:F>`)
                        .setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${client.users.cache.get('705557092802625576').avatarURL({ dynamic: true })} ` })
                        .setTimestamp()
                    return await message.reply({ embeds: [blackListEmbed] });
                }
                let server = message.guild
                let owner = server.ownerId
                let theOwner = await message.guild.members.fetch(owner)
                let verifLevels = ["Kein Verifizierungs-Level", "Niedriges Verifizierungs-Level", "Mittleres Verifizierungs-Level", "Hohes Verifizierungs-Level", "Höchstes Verifizierungs-Level"];
                let verif = verifLevels[server.verificationLevel]
                let serverEmbed = new EmbedBuilder()
                    .setColor('Blurple')
                    .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ forceStatic: true })}` })
                    .setTitle('Server Info')
                    .setThumbnail(`${server.iconURL({ forceStatic: true })}`)
                    .addFields({ name: 'Server Name:', value: `${server.name}`, inline: true },
                        { name: 'Server ID:', value: `${server.id}`, inline: true },
                        { name: 'Server Inhaber:', value: `${theOwner.user.tag}\n${theOwner.id}`, inline: true },
                        { name: 'Server erstellt am:', value: `**<t:${Math.round(parseInt(server.createdTimestamp) / 1000)}:F>**`, inline: true },
                        { name: 'Server Region:', value: `${server.preferredLocale}`, inline: true },
                        { name: 'Server Verifikations-Level:', value: `${verif}`, inline: true })
                    .setTimestamp()
                    .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: client.user.displayAvatarURL({ forceStatic: true }) });
                return await message.reply({ embeds: [serverEmbed] });
            });
        } catch (err) {
            console.log(err);
        }
    }
};
