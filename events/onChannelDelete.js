'use strict';
const channelModal = require('../schema/ChannelModal');
const client = require('..');
const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js');

client.on('channelDelete', async (channel) => {
    try {
        const data = await channelModal.findOne({
            GuildID: channel.guild.id,
        });
        if (!data) return;
        const channelSend = client.channels.cache.get(data.ChannelID);
        if (!client.guilds.cache.get(channel.guild.id).members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
            const channelDeletionWithoutAuditPerms = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle('Ein Kanal wurde gelöscht')
                .setDescription(`Ein Kanal wurde gelöscht`)
                .addFields({ name: 'Name:', value: `${channel.name}` },
                    { name: 'ID:', value: `${channel.id}` },
                    { name: 'Erstellt am:', value: '<t:' + Math.round(parseInt(channel.createdTimestamp) / 1000) + ':F>' })
                .setTimestamp();
            return await channelSend.send({ embeds: [channelDeletionWithoutAuditPerms] });
        }
        const log = await channel.guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelDelete
        });
        const member = channel.guild.members.resolve(log.entries.first().executor)
        const channelDeletionWithAuditPerms = new EmbedBuilder()
            .setColor('Blurple')
            .setTitle('Ein Kanal wurde gelöscht')
            .addFields({ name: 'Name:', value: `${channel.name}` },
                { name: 'ID:', value: `${channel.id}` },
                { name: 'Moderator', value: `${member}` },
                { name: 'Erstellt am:', value: '<t:' + Math.round(parseInt(channel.createdTimestamp) / 1000) + ':F>' })
            .setTimestamp();
        return await channelSend.send({ embeds: [channelDeletionWithAuditPerms] });
    } catch (err) {
        console.log(err);
    }
});
