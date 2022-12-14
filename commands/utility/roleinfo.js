'use strict'
const { EmbedBuilder } = require('discord.js');
const blacklistModal = require('../../schema/BlackListModal');

module.exports = {
    name: 'roleinfo',
    description: 'Rollen-Info',
    usage: 'z&o!roleinfo <role>',
    aliases: ['rinfo', 'r-info', 'rollen-info', 'rolleninfo'],
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
                let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
                if (!role) {
                    return await message.reply({ content: "Bitte erwähne eine existierende Rolle!", ephemeral: true })
                }
                let roleEmbed = new EmbedBuilder()
                    .setColor('Blurple')
                    .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ forceStatic: true })}` })
                    .setTitle('Rollen Info')
                    .setThumbnail(`${client.user.displayAvatarURL({ forceStatic: true })}`)
                    .addFields({ name: 'Name:', value: `${role.name}`, inline: true },
                        { name: 'ID:', value: `${role.id}`, inline: true },
                        { name: 'Rollen Farbe', value: `${role.hexColor}`, inline: true },
                        { name: 'Position:', value: `${role.position}`, inline: true },
                        { name: 'Pingbar:', value: `${role.mentionable ? "<a:yes:1009852362845868092>" : "<a:no:1009852394898718784>"}`, inline: true },
                        { name: 'Sichtbar:', value: `${role.hoist ? "<a:yes:1009852362845868092>" : "<a:no:1009852394898718784>"}`, inline: true },
                        { name: 'Erstellt am:', value: `<t:${Math.round(parseInt(role.createdTimestamp) / 1000)}:F>`, inline: true })
                    .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: `${client.user.displayAvatarURL({ forceStatic: true })}` })
                    .setTimestamp();
                return await message.reply({ embeds: [roleEmbed] });
            });
        } catch (err) {
            console.log(err);
        }
    }
};
