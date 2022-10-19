'use strict';
const { EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'admins',
    description: 'Zeigt alle Admins des Servers und die Rollen, die denen die Administrator Berechtigung geben',
    aliases: ['admin-list'],
    cooldown: 5000,
    usage: 'z&o!admin-list',
    userPerms: ['Administrator'],
    botPerms: [],
    run: async (client, message, args) => {
        try {
            const list = client.guilds.cache.get('1009195382426832906')
            const members = await list.members.fetch();
            let arr = [];
            members.forEach((member) => {
                var rolesAdmin = member.roles.cache.map(r => r).filter(r => r.permissions.has(PermissionsBitField.Flags.Administrator) !== false).join(', ').replace('@everyone', '');
                if (rolesAdmin) {
                    arr.push(`**Nutzer:** ${member.user} - **Rollen:** ${rolesAdmin}`);
                }
            });
            let adminEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Admin Liste')
                .setDescription(`${arr.join('\n')}`)
                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
            return await message.reply({ embeds: [adminEmbed], allowedMentions: { repliedUser: false } });
        } catch (err) {
            console.log(err);
        }
    }
};
