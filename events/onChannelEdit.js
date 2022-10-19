'use strict';
const log = (arg) => console.log(arg);
const channelModal = require('../schema/ChannelModal');
const client = require('..');
const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js');

client.on('channelUpdate', async (oldChannel, newChannel) => {
    if (oldChannel.isDMBased()) return;
    try {
        let channelEditWithoutAuditPerms, channelEditWithAuditPerms;
        const data = await channelModal.findOne({
            GuildID: oldChannel.guildId,
        });
        if (!data) return;
        const channelSend = client.channels.cache.get(data.ChannelID);
        if (!client.guilds.cache.get(oldChannel.guildId).members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
            if (oldChannel.name !== newChannel.name) {
                channelEditWithoutAuditPerms = new EmbedBuilder()
                    .setColor('Blurple')
                    .setTitle('Ein Kanal wurde verändert')
                    .addFields({ name: 'Kanal-ID:', value: `${newChannel.id}` }, { name: 'Alter Name:', value: `${oldChannel.name}`, inline: true },
                        { name: 'Neuer Name', value: `${newChannel.name}`, inline: true })
                    .setTimestamp()
                return await channelSend.send({ embeds: [channelEditWithoutAuditPerms] });
            } else if (oldChannel.nsfw !== newChannel.nsfw) {
                channelEditWithoutAuditPerms = new EmbedBuilder()
                    .setColor('Blurple')
                    .setTitle('Ein Kanal wurde verändert')
                    .addFields({ name: 'Kanal-ID:', value: `${newChannel.id}` }, { name: 'Alter Name:', value: `${oldChannel.name}`, inline: true },
                        { name: 'Neuer Name', value: `${newChannel.name}`, inline: true })
                    .setTimestamp()
                return await channelSend.send({ embeds: [channelEditWithoutAuditPerms] });
            } else if (oldChannel.topic !== newChannel.topic) {
                channelEditWithoutAuditPerms = new EmbedBuilder()
                    .setColor('Blurple')
                    .setTitle('Ein Kanal wurde verändert')
                    .addFields({ name: 'Kanal-ID:', value: `${newChannel.id}` }, { name: 'Altes Thema:', value: `${oldChannel.topic ? oldChannel.topic : 'Es wurde davor kein Thema gesetzt'}`, inline: true },
                        { name: 'Neuer Name', value: `${newChannel.topic ? newChannel.topic : 'Das Thema wurde zurückgesetzt'}`, inline: true })
                    .setTimestamp()
                return await channelSend.send({ embeds: [channelEditWithoutAuditPerms] });
            } else if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
                channelEditWithoutAuditPerms = new EmbedBuilder()
                    .setColor('Blurple')
                    .setTitle('Ein Kanal wurde verändert')
                    .addFields({ name: 'Kanal-ID:', value: `${newChannel.id}` }, { name: 'Alte Wartezeit:', value: `${oldChannel.rateLimitPerUser ? oldChannel.rateLimitPerUser : 'Es wurde davor keine Wartezeit gesetzt'}`, inline: true },
                        { name: 'Neuer Name', value: `${newChannel.rateLimitPerUser ? newChannel.rateLimitPerUser : 'Es wurde keine Wartezeit gesetzt'}`, inline: true })
                    .setTimestamp()
                return await channelSend.send({ embeds: [channelEditWithoutAuditPerms] });
            } else {
                return;
            }
        } else {
            const log = await oldChannel.guild.fetchAuditLogs({
                type: AuditLogEvent.ChannelDelete
            });
            const member = oldChannel.guild.members.resolve(log.entries.first().executor)
            if (oldChannel.name !== newChannel.name) {
                channelEditWithAuditPerms = new EmbedBuilder()
                    .setColor('Blurple')
                    .setTitle('Ein Kanal wurde verändert')
                    .addFields({ name: 'Kanal-ID:', value: `${newChannel.id}` }, { name: 'Ausgeführt von:', value: `${member.user.tag}` }, { name: 'Alter Name:', value: `${oldChannel.name}`, inline: true },
                        { name: 'Neuer Name:', value: `${newChannel.name}`, inline: true })
                    .setTimestamp()
                return await channelSend.send({ embeds: [channelEditWithAuditPerms] });
            } else if (oldChannel.nsfw !== newChannel.nsfw) {
                channelEditWithAuditPerms = new EmbedBuilder()
                    .setColor('Blurple')
                    .setTitle('Ein Kanal wurde verändert')
                    .addFields({ name: 'Kanal-Name:', value: `${oldChannel.name}`, inline: true }, { name: 'Kanal-ID:', value: `${newChannel.id}` }, { name: 'Ausgeführt von:', value: `${member.user.tag}` }, { name: 'NSFW davor?', value: `${oldChannel.nsfw ? '✅' : '📛'}`, inline: true },
                        { name: 'NSFW jetzt?', value: `${newChannel.nsfw ? '✅' : '📛'}`, inline: true })
                    .setTimestamp()
                return await channelSend.send({ embeds: [channelEditWithAuditPerms] });
            } else if (oldChannel.topic !== newChannel.topic) {
                channelEditWithAuditPerms = new EmbedBuilder()
                    .setColor('Blurple')
                    .setTitle('Ein Kanal wurde verändert')
                    .addFields({ name: 'Kanal-Name:', value: `${oldChannel.name}`, inline: true }, { name: 'Kanal-ID:', value: `${newChannel.id}` }, { name: 'Ausgeführt von:', value: `${member.user.tag}` }, { name: 'Altes Thema:', value: `${oldChannel.topic ? oldChannel.topic : 'Es wurde davor kein Thema gesetzt'}`, inline: true },
                        { name: 'Neues Thema:', value: `${newChannel.topic ? newChannel.topic : 'Das Thema wurde zurückgesetzt'}`, inline: true })
                    .setTimestamp()
                return await channelSend.send({ embeds: [channelEditWithAuditPerms] });
            } else if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
                channelEditWithAuditPerms = new EmbedBuilder()
                    .setColor('Blurple')
                    .setTitle('Ein Kanal wurde verändert')
                    .addFields({ name: 'Kanal-Name:', value: `${oldChannel.name}`, inline: true }, { name: 'Kanal-ID:', value: `${newChannel.id}` }, { name: 'Ausgeführt von:', value: `${member.user.tag}` }, { name: 'Altes Thema:', value: `${oldChannel.rateLimitPerUser ? oldChannel.rateLimitPerUser : 'Es wurde davor kein langsamer Modus eingestellt'}`, inline: true },
                        { name: 'Neuer Name:', value: `${newChannel.rateLimitPerUser ? newChannel.rateLimitPerUser : 'Es wurde kein langsamer Modus eingestellt'}`, inline: true })
                    .setTimestamp()
                return await channelSend.send({ embeds: [channelEditWithAuditPerms] });
            } else {
                return;
            }
        }
    } catch (err) {
        log(err);
    }
});
