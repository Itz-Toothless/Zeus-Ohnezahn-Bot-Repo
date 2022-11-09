'use strict';
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const process = require("process");
const { loadavg } = require('os');
const blacklistModal = require('../../schema/BlackListModal');

module.exports = {
    name: 'about',
    description: "Zeigt Informationen über den Bot",
    usage: '/about',
    cooldown: 3000,
    userPerms: [],
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
                    return await interaction.reply({ embeds: [blackListEmbed] });
                }
                try {
                    let uptime = Math.round(parseInt(client.readyTimestamp) / 1000) - 60
                    let created = Math.round(parseInt(client.user.createdTimestamp) / 1000);
                    let up = `${process.platform.charAt(0).toUpperCase() + process.platform.slice(1)}`
                    let button = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setLabel("Aktualisieren")
                            .setCustomId("rel"))
                    let embed = new EmbedBuilder()
                        .setColor('Random')
                        .setTimestamp()
                        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                        .setTitle(client.user.username)
                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        .setDescription(`
                > **Server: \`${client.guilds.cache.size}\`**
                > **Nutzer: \`${Math.ceil(client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString("tr-TR"))}\`**
                > **Kanäle: \`${client.channels.cache.size}\`**
                > **Nachrichten Kommandos: \`${client.commands.size - 7}\`**
                > **Slash Kommandos: \`${client.slashCommands.size}\`**
                > **Onlinezeit: <t:${uptime}:R>**
                > **Erstellt: <t:${created}:F>**
                > **Node.js Version: \`${process.version}\`**
                > **Discord.js: \`v${require('discord.js').version}\`**
                > **Betriebssystem: \`${up}\`**
                > **CPU: \`${loadavg()[0]}%\`**
                > **RAM: \`${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB\`**
            `)
                        .addFields({ name: "Einladungs-Link", value: `**[Fügt mich eurem Server hinzu](https://discord.com/api/oauth2/userize?client_id=1017497741871554591&permissions=1503738047638&scope=bot%20applications.commands)**` })
                    return await interaction.reply({ embeds: [embed], components: [button], ephemeral: true }).then(async () => {
                        const filter = i => i.user.id === interaction.user.id;
                        const col = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
                        col.on('collect', async (button) => {
                            if (button.member.id !== interaction.member.id) return;
                            if(button.customId === 'rel') {
                                    let embedd = new EmbedBuilder()
                                        .setColor("Random")
                                        .setTimestamp()
                                        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                        .setTitle(client.user.username)
                                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                                        .setDescription(`
                            > **Server: \`${client.guilds.cache.size}\`**
                            > **Nutzer: \`${Math.ceil(client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString("tr-TR"))}\`**
                            > **Kanäle: \`${client.channels.cache.size}\`**
                            > **Nachrichten Kommandos: \`${client.commands.size - 1}\`**
                            > **Slash Kommandos: \`${client.slashCommands.size}\`**
                            > **Onlinezeit: <t:${uptime}:R>**
                            > **Erstellt: <t:${created}:F>**
                            > **Node.js Version: \`${process.version}\`**
                            > **Discord.js: \`v${require('discord.js').version}\`**
                            > **Betriebssystem: \`${up}\`**
                            > **CPU: \`${loadavg()[0]}%\`**
                            > **RAM: \`${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB\`**
                        `)
                                        .addFields({ name: "Einladungs-Link", value: `**[Fügt mich eurem Server hinzu](https://discord.com/api/oauth2/userize?client_id=1017497741871554591&permissions=1503738047638&scope=bot%20applications.commands)**` })
                                    await button.update({ embeds: [embedd], fetchReply: true });
                            }
                        });
                        col.on('end', async() => {
                            return;
                        });
                    }).catch((err) => {
                        console.log(err);
                    });
                } catch (err) {
                    console.log(err);
                }
            });
        } catch (e) {
            console.log(e)
        }
    },
};
