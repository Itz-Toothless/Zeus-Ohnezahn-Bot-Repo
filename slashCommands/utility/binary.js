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
                return interaction.reply({ content: 'Bitte geben Sie Binär-Code bestehend aus Nullen, Einsen oder Leerzeichen an!', allowedMentions: { repliedUser: false }, ephemeral: true });
            }
            
            // Regex wird verwendet um festzustellen ob der Text nur Nullen, Einsen und Leerzeichen beinhält oder nicht
            // Was Regex ist und wie es funktioniert kann hier nachgelesen werden: https://www.webmasterpro.de/coding/einfuehrung-in-regular-expressions/
            else if (/[^01\s]/.test(input)) {
                return interaction.reply({ content: 'Bitte geben Sie nur Nullen, Einsen oder Leerzeichen an!', allowedMentions: { repliedUser: false }, ephemeral: true });
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
