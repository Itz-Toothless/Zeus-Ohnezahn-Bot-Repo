'use strict';
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const process = require("process");
const { loadavg } = require('os');

module.exports = {
    name: 'static',
    description: "Zeigt Informationen über den Bot",
    aliases: ["statistics", "i", "stats", "about", "botinfo", "info"],
    usage: 'z&o!about',
    cooldown: 3000,
    userPerms: [],
    botPerms: [],
    run: async (client, message) => {
        try {
            let uptime = Math.round(parseInt(client.readyTimestamp) / 1000) - 56;
            let created = Math.round(parseInt(client.user.createdTimestamp) / 1000);
            let up = `${process.platform.charAt(0).toUpperCase() + process.platform.slice(1)}`
            let button = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Success)
                    .setLabel("Aktualisieren")
                    .setCustomId("rel"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel("Löschen")
                    .setCustomId("del"))

            let embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTimestamp()
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(client.user.username)
                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
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
                .addFields({ name: "Einladungs-Link", value: `**[Fügt mich eurem Server hinzu](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=1084516334400)**` })
            message.channel.send({ embeds: [embed], components: [button] }).then(async Message => {

                let filter = i => i.user.id === message.author.id
                let col = await Message.createMessageComponentCollector({ filter, time: 1200000 });

                col.on('collect', async (button) => {
                    if (button.user.id !== message.author.id) return

                    switch (button.customId) {
                        case 'rel':
                            let embedd = new EmbedBuilder()
                                .setColor("Blurple")
                                .setTimestamp()
                                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                .setTitle(client.user.username)
                                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
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
                                .addFields({ name: "Einladungs-Link", value: `**[Fügt mich eurem Server hinzu](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=1084516334400)**` })

                            await Message.edit({ embeds: [embedd] })
                            button.reply({ content: "> **✅ Bot Statistiken aktualisiert**", ephemeral: true }).catch(e => { });
                            break;
                        case 'del':
                            col.stop(true)
                            await message.delete().catch(e => { });
                            await Message.delete().catch(e => { });
                            button.reply({ content: "> **✅ Bot Statistiken gelöscht**", ephemeral: true }).catch(e => { });
                            break

                    }
                })
                col.on('end', async (button) => {

                    button = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setLabel("Aktualisieren")
                            .setCustomId("rel")
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Danger)
                            .setLabel("Löschen")
                            .setCustomId("del")
                            .setDisabled(true))

                    let embedd = new EmbedBuilder()
                        .setColor("Blurple")
                        .setTimestamp()
                        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                        .setTitle(client.user.username)
                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
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
                        .addFields({ name: "Einladungs-Link", value: `**[Fügt mich eurem Server hinzu](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=1084516334400)**` })

                    await Message.edit({ embeds: [embedd], components: [button] })
                })
            }).catch(e => { console.log(e) });
        } catch (e) {
            console.log(e)
        }
    },
};
