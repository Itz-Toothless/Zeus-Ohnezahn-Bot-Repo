const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'string',
    description: 'Konvertiert eine Zeichenkette zu Binär-Code (Bestehend aus Nullen und Einsen)\n\nBeispiel: ```as\nHallo Welt\n```',
    aliases: ['str'],
    usage: 'z&o!string <Zeichen>',
    userPerms: [],
    botPerms: [],
    run: async (client, message, args) => {
        try {
            var num
            let input = args.join(' ');
            if (!input) {
                return message.reply({ content: 'Bitte gebe etwas an!' });
            }
            const outputStr = input.split('').map(c => c.charCodeAt(0).toString(2)).join(' ');
            const toBinaryEmbed = new EmbedBuilder()
                .setColor('Blurple')
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTitle('Konvertierung')
                .setDescription(`> **Eingabe:**\n\`\`\`as\n${input}\n\`\`\`\n> **Ausgabe:**\n\`\`\`as\n${outputStr}\n\`\`\``)
                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
            return message.channel.send({ embeds: [toBinaryEmbed], allowedMentions: { repliedUser: false } });
        } catch (err) {
            console.log(err);
        }
    }
};
