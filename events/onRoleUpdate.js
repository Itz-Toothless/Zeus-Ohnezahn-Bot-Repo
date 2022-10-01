const { EmbedBuilder, AuditLogEvent, PermissionsBitField } = require('discord.js');
const client = require('..');
const roles = require('../schema/Roles');

client.on('roleUpdate', async (oldRole, newRole) => {
    try {
        const data = await roles.findOne({
            GuildID: oldRole.guild.id,
        });
        if (!data) return;
        const channel = client.channels.cache.get(data.ChannelID);
        if (!client.guilds.cache.get(oldRole.guild.id).members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
            if (oldRole.name !== newRole.name) {
                const roleNameChange = new EmbedBuilder()
                    .setColor('Blurple')
                    .setTitle('Rollen-Update')
                    .setDescription(`${newRole} wurde aktualisiert!\nAlter Rollen-Name: ${oldRole.name}\n\nNeuer Rollen-Name: ${newRole.name}`)
                    .setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${client.user.displayAvatarURL({ dynamic: true })} ` })
                    .setTimestamp();
                return await channel.send({ embeds: [roleNameChange] });
            } else if (oldRole.hexColor !== newRole.hexColor) {
                const roleColorChangeWithoutMod = new EmbedBuilder()
                    .setColor('Blurple')
                    .setTitle('Rollen-Update')
                    .setDescription(`${newRole.id} wurde aktualisiert!\nAlte Rollen-Farbe: ${oldRole.hexColor}\n\nNeue Rollen-Farbe: ${newRole.hexColor}`)
                    .setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${client.user.displayAvatarURL({ dynamic: true })} ` })
                    .setTimestamp();
                return await channel.send({ embeds: [roleColorChangeWithoutMod] });
            }
        };
        const log = await oldRole.guild.fetchAuditLogs({
            type: AuditLogEvent.RoleUpdate
        });
        const member = newRole.guild.members.resolve(log.entries.first().executor)
        if (oldRole.name !== newRole.name) {
            const roleNameChangeWithMod = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle('Rollen-Update')
                .setDescription(`${newRole.id} wurde von ${member.user} aktualisiert!\nAlter Rollen-Name: ${oldRole.name}\n\nNeuer Rollen-Name: ${newRole.name}`)
                .setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${client.user.displayAvatarURL({ dynamic: true })} ` })
                .setTimestamp();
            return await channel.send({ embeds: [roleNameChangeWithMod] });
        } else if (oldRole.hexColor !== newRole.hexColor) {
            const roleColorChangeWithMod = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle('Rollen-Update')
                .setDescription(`${newRole.id} wurde von ${member.user} aktualisiert!\nAlte Rollen-Farbe: ${oldRole.hexColor}\n\nNeue Rollen-Farbe: ${newRole.hexColor}`)
                .setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${client.user.displayAvatarURL({ dynamic: true })} ` })
                .setTimestamp();
            return await channel.send({ embeds: [roleColorChangeWithMod] });
        }
    } catch (err) {
        console.log(err);
    }
});
