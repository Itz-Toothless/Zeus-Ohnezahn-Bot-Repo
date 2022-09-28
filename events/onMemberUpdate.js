const { EmbedBuilder } = require('discord.js');
const updateModal = require('../schema/MemberRoleUpdates');
const client = require('..');

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    try {
        let data = await updateModal.findOne({
            GuildID: oldMember.guild.id
        });
        if (!data) return;
        let channel = client.channels.cache.get(data.ChannelID);
        const oldNick = oldMember.nickname ? oldMember.nickname : oldMember.user.username;
        const newNick = newMember.nickname ? newMember.nickname : newMember.user.username;
        if (oldNick !== newNick) {
            let nicknameEdit = new EmbedBuilder()
                .setThumbnail(`${newMember.user.avatarURL({ dynamic: true })}`)
                .setColor('Blurple')
                .setTitle('Nickname-Update')
                .addFields({ name: 'Alter Nickname:', value: `${oldNick}` },
                    { name: 'Neuer Nickname', value: `${newNick}` })
                .setAuthor({ name: `${newMember.user.tag}`, iconURL: `${newMember.user.avatarURL({ dynamic: true })}` })
                .setTimestamp()
            return channel.send({ embeds: [nicknameEdit] });
        }
        let oldMemberRoles = oldMember.roles.cache.map(r => r).sort((a, b) => b.rawPosition - a.rawPosition).join(', ').replace('@everyone', '').split('');
        oldMemberRoles.pop();
        oldMemberRoles.pop();
        var oldRoles = oldMemberRoles.join('');
        let newMemberRoles = newMember.roles.cache.map(r => r).sort((a, b) => b.rawPosition - a.rawPosition).join(', ').replace('@everyone', '').split('');
        newMemberRoles.pop();
        newMemberRoles.pop();
        var newRoles = newMemberRoles.join('');
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
        if (removedRoles.size > 0) {
            let removedRoleEmbed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle('Rollen-Update')
                .addFields({ name: 'Vorher:', value: `${oldRoles ? oldRoles : 'Dieser Nutzer hatte keine Rollen!'}` },
                    { name: 'Jetzt:', value: `${newRoles ? newRoles : 'Dieser Nutzer hat keine Rollen!'}` }
                )
                .setAuthor({ name: `${newMember.user.tag}`, iconURL: `${newMember.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp()
            return channel.send({ embeds: [removedRoleEmbed] });
        }

        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
        if (addedRoles.size > 0) {
            let addedRoleEmbed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle('Rollen-Update')
                .addFields({ name: 'Vorher:', value: `${oldRoles ? oldRoles : 'Dieser Nutzer hatte keine Rollen!'}` },
                    { name: 'Jetzt:', value: `${newRoles ? newRoles : 'Dieser Nutzer hat keine Rollen!'}` }
                )
                .setAuthor({ name: `${newMember.user.tag}`, iconURL: `${newMember.user.displayAvatarURL({ dynamic: true })}` })
                .setTimestamp()
            return channel.send({ embeds: [addedRoleEmbed] });
        }
    } catch (err) {
        console.log(err);
    }
});
