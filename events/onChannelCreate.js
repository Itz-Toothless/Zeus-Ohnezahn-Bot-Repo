'use strict'
const channelModal = require('../schema/ChannelModal');
const client = require('..');
const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js');

client.on('channelCreate', async (channel) => {
    try {
        const data = await channelModal.findOne({
            GuildID: channel.guild.id,
        });
        if (!data) return;
        const channelSend = client.channels.cache.get(data.ChannelID);
        if (!client.guilds.cache.get(channel.guild.id).members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
            const channelCreationWithoutAuditPerms = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle('Ein Kanal wurde erstellt')
                .addFields({ name: 'Name:', value: `${channel.name}` },
                    { name: 'ID:', value: `${channel.id}` },
                    { name: 'Erstellt am:', value: '<t:' + Math.round(parseInt(channel.createdTimestamp) / 1000) + ':F>' },
                    { name: 'Kategorie', value: `${channel.parent ? channel.parent : 'Keine Kategorie gefunden!'}` })
                .setTimestamp();
            return await channelSend.send({ embeds: [channelCreationWithoutAuditPerms] });
        }
        const log = await channel.guild.fetchAuditLogs({
            type: AuditLogEvent.ChannelCreate
        });
        const member = channel.guild.members.resolve(log.entries.first().executor)
        const channelCreationWithAuditPerms = new EmbedBuilder()
            .setColor('Blurple')
            .setTitle('Ein Kanal wurde gelöscht')
            .addFields({ name: 'Name:', value: `${channel.name}` },
                { name: 'ID:', value: `${channel.id}` },
                { name: 'Erstellt von:', value: `${member}` },
                { name: 'Erstellt am:', value: '<t:' + Math.round(parseInt(channel.createdTimestamp) / 1000) + ':F>' },
                { name: 'Kategorie', value: `${channel.parent ? channel.parent : 'Keine Kategorie gefunden!'}` })
            .setTimestamp();
        return await channelSend.send({ embeds: [channelCreationWithAuditPerms] });
    } catch (err) {
        console.log(err);
    }
});
