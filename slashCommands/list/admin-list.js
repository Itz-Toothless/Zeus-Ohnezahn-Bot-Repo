const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: 'admin-list',
    description: 'Zeigt alle Admins des Servers und die Rollen, die denen die Administrator Berechtigung geben',
    cooldown: 5000,
    usage: '/admin-list',
    userPerms: ['ManageServer'],
    botPerms: [],
    run: async (client, interaction) => {
        try {
            const list = await client.guilds.fetch(`${interaction.guild.id}`)
            const members = await list.members.fetch();
            let arr = [];
            members.forEach((member) => {
                var rolesAdmin = member.roles.cache.map(r => r).filter(r => r.permissions.has(PermissionsBitField.Flags.Administrator) !== false).join(', ').replace('@everyone', '');
                if (rolesAdmin) {
                    arr.push(`**Nutzer:** ${member.user} - **Rollen:** ${rolesAdmin}`);
                }
            });
            let loadingEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Admin Liste wird geladen...')
                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
            let adminEmbed = new EmbedBuilder()
                .setColor('Random')
                .setTitle('Admin Liste')
                .setDescription(`${arr.join('\n') ? `${arr.join('\n')}` : 'Es sind keine Admins auf diesem Server!'}`)
                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
            await interaction.reply({ embeds: [loadingEmbed], ephemeral: false, allowedMentions: { repliedUser: false }  })
            await wait(1000);
            return await interaction.editReply({ embeds: [adminEmbed] });
        } catch (err) {
            console.log(err);
        }
    }
};
