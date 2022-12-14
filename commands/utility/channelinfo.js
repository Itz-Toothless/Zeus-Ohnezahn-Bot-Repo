'use strict'
const { EmbedBuilder } = require('discord.js');
const blacklistModal = require('../../schema/BlackListModal');

module.exports = {
    name: 'channelinfo',
    description: 'Zeigt die Kanalinfo an',
    usage: 'z&o!channelinfo <Kanal / ID>',
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
                        .setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${client.users.cache.get('705557092802625576').avatarURL({ forceStatic: true })} ` })
                        .setTimestamp()
                    return await message.reply({ embeds: [blackListEmbed] });
                }
                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
                if (!channel) {
                    return await message.reply({ content: "Ich finde den Kanal " + channel + " nicht!", ephemeral: true })
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
                    .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ forceStatic: true })}` })
                    .setTitle('Kanal Info')
                    .setThumbnail(`${client.user.displayAvatarURL({ forceStatic: true })}`)
                    .addFields({ name: 'Name:', value: `${channel.name}`, inline: true },
                        { name: 'ID:', value: `${channel.id}`, inline: true },
                        { name: 'Typ:', value: `${channelType(channel)}`, inline: true },
                        { name: 'Position:', value: `${channel.position || "0"}`, inline: true },
                        { name: 'NSFW?:', value: `${channel.nsfw ? "<a:yes:1009852362845868092>" : "<a:no:1009852394898718784>"}`, inline: true },
                        { name: 'Erstellt am:', value: `**<t:${Math.round(parseInt(channel.createdTimestamp) / 1000)}:F>**`, inline: true })
                    .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                    .setTimestamp();
                return await message.reply({ embeds: [channelEmbed] });
            });
        } catch (err) {
            console.log(err);
        }
    }
};
