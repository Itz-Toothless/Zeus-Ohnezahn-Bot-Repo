const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'binary',
    description: 'Decodiert eine Zeichenkette aus Binär-Code (Bestehend aus Nullen und Einsen)\n\nBeispiel: ```as\n01001000 01100001 01101100 01101100 01101111 00101100 00100000 01110111 01101001 01100101 00100000 01100111 01100101 01101000 01110100 00100000 01100101 01110011 00100000 01100100 01101001 01110010 00100000 01110011 01101111 00111111 00100000 00111010 01000100\n```',
    aliases: ['bin'],
    usage: 'z&o!binary <Binär-Code>',
    userPerms: [],
    botPerms: [],
    run: async (client, message, args) => {
        try {
            var num;
            let input = args.join(' ');
            if (!input) {
                return message.reply({ content: 'Bitte gebe Binär-Code bestehend aus Nullen und Einsen an!', allowedMentions: { repliedUser: false } });
            } else if (isNaN(num = parseInt(input, 2))) {
                return message.reply({ content: 'Bitte gebe nur Nullen und Einsen an!', allowedMentions: { repliedUser: false } });
            }
            const res = input.split(' ').map(b => parseInt(b, 2)).map(num => String.fromCharCode(num)).join('');
            const binaryEmbed = new EmbedBuilder()
                .setColor('Blurple')
                .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTitle('Konvertierung')
                .setDescription(`**Text:**\n\`\`\`as\n${input}\n\`\`\`\n**Ausgabe:**\n\`\`\`as\n${res}\`\`\``)
                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
            return message.reply({ embeds: [binaryEmbed], allowedMentions: { repliedUser: false } });
        } catch (err) {
            console.log(err);
        }
    }
};
