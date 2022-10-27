'use strict';
const { ApplicationCommandType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const log = (arg) => console.log(arg);
const blacklistModal = require('../../schema/BlackListModal');

module.exports = {
    name: 'kick',
    description: 'Kickt jemanden vom Server',
    type: ApplicationCommandType.ChatInput,
    userPerms: ['KickMembers'],
    botPerms: ['KickMembers'],
    options: [
        {
            name: 'user',
            description: 'Kickt einen Nutzer',
            type: 1,
            options: [{
                name: 'user',
                description: 'Der Nutzer',
                type: 6,
                required: true
            },
            {
                name: 'grund',
                description: 'Der Grund für den Kick',
                type: 3,
                required: true
            }]
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
            const reason = interaction.options.getString('grund') || 'Kein Grund angegeben';
            if (user) {
                if (interaction.member.roles.highest.comparePositionTo(user.roles.highest.id) <= 0) {
                    await interaction.reply({ content: "Du kannst niemanden kicken, der eine höhere Rolle hat!", allowedMentions: { repliedUser: false } })
                    return
                }
                if (interaction.guild.members.me.roles.highest.comparePositionTo(user.roles.highest.id) <= 0) {
                    await interaction.reply({ content: "Ich kann niemanden kicken, der eine höhere Rolle hat als ich!", allowedMentions: { repliedUser: false } })
                    return
                }
                if (!user.kickable) {
                    await interaction.reply({ content: "Ich kann `" + user.tag + "` nicht kicken weil meine Berechtigungen unzureichend sind!", allowedMentions: { repliedUser: false }, ephemeral: true })
                    return
                }
                try {
                    let button = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setLabel("Kick")
                            .setCustomId("rel"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Danger)
                            .setLabel("Zurückziehen")
                            .setCustomId("del")
                    );
                    let embed1 = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Kick ausstehend')
                        .setDescription(`**User:** ${user}\n**Moderator:** ${interaction.user}\n**Grund:** ${reason}`)
                        .setTimestamp()
                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    return await interaction.reply({ embeds: [embed1], allowedMentions: { repliedUser: false }, components: [button], ephemeral: true }).then(async () => {
                        const filter = i => i.user.id === interaction.user.id;

                        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

                        collector.on("collect", async button => {
                            switch (button.customId) {
                                case "rel":
                                    collector.stop(true);
                                    await user.kick(`Austeller: ${interaction.user.tag} - ${reason}`);
                                    let embed2 = new EmbedBuilder()
                                        .setColor(0x00ff00)
                                        .setTitle('🔨 Kick ausgeführt!')
                                        .setDescription(`**Nutzer erfolgreich gekickt.**\n**User:** ${user.user}\n**Moderator:** ${interaction.user}\n**Grund:** ${reason}`)
                                        .setTimestamp()
                                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                                    await button.update({ embeds: [embed2], components: [], fetchReply: true });
                                    break;
                                case "del":
                                    collector.stop(true);
                                    let embed3 = new EmbedBuilder()
                                        .setColor(0xff0000)
                                        .setTitle('🆗 Abgebrochen')
                                        .setDescription(`Kick wurde abgebrochen!\n**User:** ${user.user}\n**Moderator:** ${interaction.user}\n**Grund:** ${reason}`)
                                        .setTimestamp()
                                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                                    await button.update({ embeds: [embed3], components: [], fetchReply: true });
                                    break;
                            }
                        });
                    });
                } catch (e) {
                    log(e);
                }
            } else {
                let errorEmbedForNoID = new EmbedBuilder()
                    .setColor('Red')
                    .setAuthor({ name: `${interaction.author.tag}`, iconURL: `${interaction.author.displayAvatarURL({ dynamic: true })}` })
                    .setTitle('Fehler aufgetreten!')
                    .setDescription('Sie dürfen nur einen User angeben!')
                    .addFields({ name: 'Syntax:', value: '`/kick user User <optional: Grund>`' },
                        { name: 'Beispiel:', value: `/kick user ${interaction.author} Spamming **(Dies sind Sie selbst)**` })
                    .setTimestamp()
                return await interaction.reply({ embeds: [errorEmbedForNoID], ephemeral: true, allowedMentions: { repliedUser: false } });
            }
        } catch (err) {
            console.log(err);
        }
    }
};
