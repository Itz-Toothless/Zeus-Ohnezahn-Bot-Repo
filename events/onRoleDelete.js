const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js');
const client = require('..');
const roles = require('../schema/Roles');

client.on('roleDelete', async (role) => {
    try {
        const data = await roles.findOne({
            GuildID: role.guild.id,
        });
        if (!data) return;
        const channel = client.channels.cache.get(data.ChannelID);
        if (!client.guilds.cache.get(role.guild.id).members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
            const roleDeletedWithoutMember = new EmbedBuilder()
                .setColor('Blurple')
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                .setTitle('Rolle gelöscht!')
                .addFields({ name: 'Rollen-Name:', value: `${role.name}`, inline: true },
                    { name: 'Rollen-ID:', value: `${role.id}` },
                    { name: 'Gelöscht von: ', value: 'Nutzer nicht gefunden!' })
                .setTimestamp();
            return await channel.send({ embeds: [roleDeletedWithoutMember] });
        }
        const log = await role.guild.fetchAuditLogs({
            type: AuditLogEvent.RoleDelete
        });
        const member = role.guild.members.resolve(log.entries.first().executor)
        const roleDeletedWithMember = new EmbedBuilder()
            .setColor('Blurple')
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
            .setTitle('Rolle gelöscht!')
            .addFields({ name: 'Rollen-Name:', value: `${role.name}`, inline: true },
                { name: 'Rollen-ID:', value: `${role.id}` },
                { name: 'Gelöscht von: ', value: `${member.user}` })
            .setTimestamp();
        return await channel.send({ embeds: [roleDeletedWithMember] });
    } catch (err) {
        console.log(err);
    }
});
