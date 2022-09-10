const Discord = require('discord.js');
const { inspect } = require('util');

module.exports = {
    name: 'eval',
    description: '(Dev only) Evaluates JavaScript Code.',
    usage: 'z&o!!eval <code>',
    aliases: ['ev'],
    userPerms: [],
    botPerms: [],
    run: async (client, msg, args) => {
        try {
            let command = args.join(' ');
            if (msg.author.id !== '705557092802625576') {
                msg.channel.send('Dieses Kommando ist nur für den Entwickler ' + client.users.cache.get('705557092802625576').tag + ' bestimmt!');
                return;
            }
            if (args.length < 1) {
                msg.channel.send('Wo ist der Code den ich ausführen soll? 🤔');
                return;
            }
            if (command.includes('.token') || command.includes('.TOKEN')) {
                msg.channel.send('📛 Sie können keine Befehle ausführen, die `.token` beinhalten!');
                return;
            }
            let evaled = eval(command);
            let type = typeof evaled;
            let typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
            let embed = new Discord.EmbedBuilder()
                .setColor("Blue")
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setAuthor({ name: `${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(`**Ausgabe:**\`\`\`js\n${inspect(evaled, { depth: 2 })}\`\`\`\n**Eingabe:** \`\`\`js\n${command}\n\`\`\``)
                .setTitle('Ausgewerteter Code')
                .addFields(
                    { name: 'Typ:', value: `\`\`\`js\n${typeCapitalized}\n\`\`\``, inline: false }, { name: "Zeit:", value: `\`\`\`js\n${Date.now() - msg.createdTimestamp}ms\n\`\`\``, inline: false })
                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
            return msg.reply({ embeds: [embed] });
        } catch (error) {
            let embed = new Discord.EmbedBuilder()
                .setAuthor({ name: `${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
                .setColor('Red')
                .setTitle('Fehler aufgetreten!')
                .setDescription(`\`\`\`js\n${error.stack}\n\`\`\``)
                .setTimestamp();
            msg.reply({ embeds: [embed] });
            return;
        }
    }
};
