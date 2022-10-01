const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js');
const client = require('..');
const roles = require('../schema/Roles');

client.on('roleCreate', async (role) => {
    try {
        const data = await roles.findOne({
            GuildID: role.guild.id,
        });
        if (!data) return;
        const channel = client.channels.cache.get(data.ChannelID);
        if (!client.guilds.cache.get(role.guild.id).members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
            const roleCreatedWithoutMember = new EmbedBuilder()
                .setColor('Blurple')
                .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
                .setTitle('Rolle erstellt!')
                .addFields({ name: 'Rollen-Name:', value: `${role.name}`, inline: true },
                    { name: 'Rollen-ID:', value: `${role.id}` },
                    { name: 'Erstellt von: ', value: 'Nutzer nicht gefunden!' })
                .setTimestamp();
            return await channel.send({ embeds: [roleCreatedWithoutMember] });
        }
        const log = await role.guild.fetchAuditLogs({
            type: AuditLogEvent.RoleCreate
        })
        const member = role.guild.members.resolve(log.entries.first().executor)
        const roleCreatedWithMember = new EmbedBuilder()
            .setColor('Blurple')
            .setAuthor({ name: `${client.user.tag}`, iconURL: `${client.user.displayAvatarURL({ dynamic: true })}` })
            .setTitle('Rolle erstellt!')
            .addFields({ name: 'Rollen-Name:', value: `${role.name}`, inline: true },
                { name: 'Rollen-ID:', value: `${role.id}` },
                { name: 'Erstellt von: ', value: `${member.user}` })
            .setTimestamp();
        return await channel.send({ embeds: [roleCreatedWithMember] });
    } catch (err) {
        console.log(err);
    }
});
