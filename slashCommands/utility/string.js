const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: 'string',
    description: 'Encodiert eine Zeichenkette aus Binär-Code',
    aliases: ['str'],
    usage: 'z&o!string <Zeichen>',
    options: [{
        name: 'zeichen',
        description: 'Die Zeichenkette',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    userPerms: [],
    botPerms: [],
    run: async (client, interaction) => {
        try {
            let input = interaction.options.getString('zeichen');
            if (!input) {
                return interaction.reply({ content: 'Bitte gebe etwas an!', ephemeral: true });
            }
            const outputStr = input.split('').map(c => c.charCodeAt(0).toString(2)).join(' ');
            const toBinaryEmbed = new EmbedBuilder()
                .setColor('Blurple')
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTitle('Konvertierung')
                .setDescription(`> **Eingabe:**\n${input}\n\n> **Ausgabe:**\n\`\`\`as\n${outputStr}\n\`\`\``)
                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
            await interaction.deferReply();
            await wait(3000);
            return await interaction.editReply({ embeds: [toBinaryEmbed], allowedMentions: { repliedUser: false } });
        } catch (err) {
            console.log(err);
        }
    }
};
