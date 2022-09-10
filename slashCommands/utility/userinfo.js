const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'Zeigt Informationen über einen angegebenen Nutzer',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'user',
            description: 'Der Nutzer dessen Informationen Sie möchten',
            type: ApplicationCommandOptionType.User,
            required: false
        },
    ],
    /**
      *
      * @param {Client} client
      * @param {CommandInteraction} interaction
      * @param {String[]} args
      */
    run: async (client, interaction, args) => {
        try {
            let member = interaction.options.getMember('user') || interaction.member
            var roles = member.roles.cache.map(r => r).join(', ').replace('@everyone', '').split('');
            roles.pop();
            roles.pop();
            var authorRoles = roles.join('')
            const userinfoEmbed = new EmbedBuilder()
                .setAuthor({ name: `${member.user.tag}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
                .setThumbnail(member.displayAvatarURL({ dynamic: true }))
                .setColor('Blue')
                .setTitle('User Info')
                .addFields(
                    { name: 'Tag:', value: `${member.user.tag}`, inline: true },
                    { name: 'ID:', value: `${member.id}`, inline: true },
                    { name: 'Bot?', value: `${member.user.bot ? "✅" : "❌"}`, inline: true },
                    { name: 'Erstellt am:', value: `**<t:${Math.round(parseInt(member.user.createdTimestamp) / 1000)}:F>**`, inline: true },
                    { name: 'Beigetreten am:', value: `**<t:${Math.round(parseInt(member.joinedTimestamp) / 1000)}:F>**`, inline: true },
                    { name: 'Rollen:', value: `${authorRoles ? authorRoles : 'Keine Rollen gefunden!'}`, inline: false },
                    { name: 'Admin?', value: `${member.permissions.has(PermissionsBitField.Flags.Administrator) ? "✅" : "❌"}`, inline: true }
                )
                .setTimestamp();
            return interaction.reply({ embeds: [userinfoEmbed] });
        } catch (err) {
            console.log(err)
        }
    }
};
