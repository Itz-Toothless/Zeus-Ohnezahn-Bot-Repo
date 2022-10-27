'use strict';
const db = require('../../schema/warns');
const { EmbedBuilder } = require('discord.js');
const blacklistModal = require('../../schema/BlackListModal');

module.exports = {
    name: 'warnings',
    description: 'Zeigt die Verwarnungen eines Nutzers an',
    aliases: ['checkwarns'],
    cooldown: 3000,
    options: [{
        name: 'user',
        description: 'Der Nutzer der verwarnt werden soll',
        type: 6,
        required: true,
    },
    ],
    userPerms: ['ModerateMembers'],
    botPerms: [],
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
            if (!user) return interaction.reply('Der angegebene Nutzer konnte nicht gefunden werden!');
            if (user.user.bot) {
                return interaction.reply({ content: 'Bots können keine Verwarnungen haben!', ephemeral: true, fetchReply: true });
            }
            db.findOne({ guildId: interaction.guild.id, userId: user.user.id }, async (err, data) => {
                if (err) throw err;
                let arr = [];
                let count = 0;
                try {
                    data.content.forEach(element => {
                        count += 1;
                        arr.push(`${count}) Moderator: ${interaction.guild.members.cache.get(element.moderator).user.tag}\nGrund: ${element.reason}\n**<t:${element.timestamp}:f>**\n`);
                    });
                } catch (err) {
                    console.log(err);
                };
                let warnList = new EmbedBuilder()
                    .setTitle(`${user.user.tag}'s Verwarnungen`)
                    .setDescription(`${arr.join('\n') ? arr.join('\n') : 'Derzeit hat ' + user.user.tag + ' keine Verwarnungen!'}`)
                    .setColor('Blurple')
                return interaction.reply({ embeds: [warnList] });
            });
        } catch (err) {
            console.log(err);
        }
    }
};
