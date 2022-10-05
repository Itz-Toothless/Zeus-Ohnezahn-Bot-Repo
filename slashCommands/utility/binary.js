const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: 'binary',
    description: 'Decodiert eine Zeichenkette aus Binär-Code (Bestehend aus Nullen und Einsen)',
    aliases: ['bin'],
    usage: 'z&o!binary <Binär-Code>',
    options: [{
        name: 'binary',
        description: 'Die Binär-Code Zeichenkette',
        type: ApplicationCommandOptionType.String,
        required: true
    }],
    userPerms: [],
    botPerms: [],
    run: async (client, interaction) => {
        try {
            let input = interaction.options.getString('binary');
            if (!input) {
                return interaction.reply({ content: 'Bitte gebe Binär-Code bestehend aus Nullen und Einsen an!', allowedMentions: { repliedUser: false }, ephemeral: true });
            } else if (isNaN(num = parseInt(input, 2))) {
                return interaction.reply({ content: 'Bitte gebe nur Nullen und Einsen an!', allowedMentions: { repliedUser: false }, ephemeral: true });
            }
            const res = input.split(' ').map(b => parseInt(b, 2)).map(num => String.fromCharCode(num)).join('');
            const binaryEmbed = new EmbedBuilder()
                .setColor('Blurple')
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTitle('Konvertierung')
                .setDescription(`> **Eingabe:**\n\`\`\`as\n${input}\n\`\`\`\n> **Ausgabe:**\n${res}`)
                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
            await interaction.deferReply();
            await wait(3000);
            return await interaction.editReply({ embeds: [binaryEmbed], allowedMentions: { repliedUser: false } });
        } catch (err) {
            console.log(err);
        }
    }
};
