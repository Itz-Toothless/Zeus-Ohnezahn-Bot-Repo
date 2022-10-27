'use strict';
const db = require('../../schema/warns')
const { EmbedBuilder } = require('discord.js');
const blacklistModal = require('../../schema/BlackListModal');

module.exports = {
    name: 'removewarn',
    description: 'Löscht eine Verwarnung eines Nutzers',
    usage: '/removewarn <@Mitglied> [grund]',
    cooldown: 3000,
    userPerms: ['ModerateMembers'],
    botPerms: [],
    options: [
        {
            name: 'user',
            description: 'Der Nutzer dessen Verwarnungen entfernt werden sollen',
            type: 6,
            required: true,
        }, {
            name: 'anzahl',
            description: 'Die Anzahl an Verwarnungen die entfernt werden sollen',
            type: 4,
            required: true
        }
    ],
    run: async (client, interaction) => {
        try {
            blacklistModal.findOne({ UserID: interaction.user.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    let blackListEmbed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('Keine Berechtigung!')
                        .setDescription(`Sie dürfen diesen Bot nicht nutzen!\nAusgesetzt seit: <t:${data.BlackListTimestamp}:F>`)
                        .setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${client.users.cache.get('705557092802625576').avatarURL({ dynamic: true })} ` })
                        .setTimestamp()
                    return await interaction.reply({ embeds: [blackListEmbed], ephemeral: true });
                }
            });
            const user = interaction.options.getMember('user');
            const howMany = interaction.options.getInteger('anzahl');
            if (!user) return interaction.reply({ content: 'Der angegebene Nutzer konnte nicht gefunden werden!', ephemeral: true, fetchReply: true });
            db.findOne({ guildId: interaction.guild.id, userId: user.user.id }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                    return await interaction.reply({ content: 'Diese Person hat entweder keine Verwarnungen oder die Anzahl ist zu hoch!', ephemeral: true, fetchReply: true });
                }
                let number = parseInt(howMany) - 1
                data.content.splice(number, 1)
                data.save()
                let deletedWarns = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                    .setColor('Blurple')
                    .setDescription(`Eine Verwarnung wurde von ${user.user.tag} entfernt!` ? `Eine Verwarnung wurde von ${user.user.tag} entfernt!` : `${user.user.tag} hat keine Verwarnungen!`)
                    .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: client.users.cache.get('705557092802625576').displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
                return interaction.reply({ embeds: [deletedWarns], fetchReply: true });
            });
        } catch (err) {
            interaction.reply({ content: 'Ein Fehler ist aufgetreten!', ephemeral: true, fetchReply: true });
            console.log(err);
        }
    }
};
