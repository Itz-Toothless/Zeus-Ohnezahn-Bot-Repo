'use strict';
const db = require('../../schema/warns');
const { EmbedBuilder } = require('discord.js');
const blacklistModal = require('../../schema/BlackListModal');

module.exports = {
    name: 'warn',
    description: 'Verwarnt einen Nutzer',
    usage: '/warn <@Mitglied> [grund]',
    userPerms: ['ModerateMembers'],
    botPerms: [],
    cooldown: 3000,
    options: [
        {
            name: 'user',
            description: 'Der Nutzer der verwarnt werden soll',
            type: 6,
            required: true,
        }, {
            name: 'grund',
            description: 'Der Grund für die Verwarnung',
            type: 3,
            required: true
        }
    ],
    run: async (client, interaction) => {
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
        const reason = interaction.options.getString('grund');
        if (user.user.bot) {
            return interaction.reply({ content: 'Bots können nicht verwarnt werden!', ephemeral: true, fetchReply: true });
        }
        if (!user) return interaction.reply('Der angegebene Nutzer konnte nicht gefunden werden!', { ephemeral: true, fetchReply: true });
        db.findOne({ guildId: interaction.guild.id, userId: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                data = new db({
                    guildId: interaction.guild.id,
                    userId: user.user.id,
                    content: [
                        {
                            moderator: interaction.user.id,
                            reason: reason,
                            timestamp: Math.round(parseInt(Date.now() / 1000)),
                        }
                    ]
                })
            } else {
                const obj = {
                    moderator: interaction.user.id,
                    reason: reason,
                    timestamp: Math.round(parseInt(Date.now() / 1000)),
                }
                data.content.push(obj)
            }
            data.save()
        });
        try {
            let punishmentDM = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTitle('Verwarnt!')
                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: client.users.cache.get('705557092802625576').displayAvatarURL({ dynamic: true }) })
                .setDescription(`Sie wurden auf dem Server ${interaction.guild.name} verwarnt!\nGrund: ${reason}`)
                .setColor('Red')
            user.send({ embeds: [punishmentDM] });
        } catch (err) {
            console.log(err);
        }
        let channelMessage = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
            .setTitle('Verwarnung ausgestellt!')
            .setDescription(`Du hast ${user} verwarnt!\nGrund: ${reason}`)
            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: client.users.cache.get('705557092802625576').displayAvatarURL({ dynamic: true }) })
            .setColor('Blurple')
        return interaction.reply({ embeds: [channelMessage] })
    }
};
