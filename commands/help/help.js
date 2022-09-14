const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Zeigt Infos über die jetzigen Kommandos',
    usage: 'z&o!help',
    aliases: ['h'],
    cooldown: 3000,
    userPerms: [],
    botPerms: [],
    run: async(client, message, args) => {
        try {
            switch (args[0]) {
                case 'commands' || 'cmds':
                    let commands = client.commands.map(cmd => `${cmd.name} - ${cmd.description ? cmd.description : 'Keine Beschreibung angegeben'}`).join('\n');
                    let commandsEmbed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('Kommandos')
                        .setDescription(`${commands}`)
                        .setFooter({ text: 'z&o!help command [commandname] für Kommando-Infos' })
                        .setTimestamp();
                    return message.channel.send({ embeds: [commandsEmbed] });
                case 'aliases':
                    let aliases = [];
                    client.commands.forEach(cmd => {
                        if (cmd.aliases) {
                            for (let i = 0; i < cmd.aliases.length; i++) {
                                aliases.push(`${cmd.name} - ${cmd.aliases[i]}`);
                            }
                        }
                        else {
                            aliases.push(`${cmd.name} - Kein Alias gefunden`);
                        }
                    });
                    let aliasesEmbed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('Kommando-Aliasse')
                        .setDescription(aliases.join('\n'))
                        .setFooter({ text: 'z&o!help command [commandname] für Kommando-Infos' })
                        .setTimestamp();
                    return message.channel.send({ embeds: [aliasesEmbed] });
                case 'command' || 'cmd':
                    let commandName = args[1];
                    let command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases?.includes(command));
                    if (!command) return message.channel.send('Dieses Kommando existiert nicht!');
                    let commandEmbed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle(`${command.name}`)
                        .setDescription(`${command.description}`)
                        .addFields(
                            { name: 'Nutzung:', value: `${command.usage}` },
                            { name: 'Aliasse:', value: `${command.aliases ? command.aliases.join(', ') : 'None'}` })
                        .setFooter({ text: 'z&o!help command [commandname] für Kommando-Infos' })
                        .setTimestamp();
                    return message.channel.send({ embeds: [commandEmbed] });
                default:
                    let helpEmbed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('Hilfe')
                        .setDescription('Hier sind alle Kommandos')
                        .addFields({ name: 'Kommandos', value: 'z&o!help commands' },
                                   { name: 'Aliasse', value: 'z&o!help aliases' })
                        .setFooter({ text: 'z&o!help command [commandname] für Kommando-Infos' })
                        .setTimestamp();
                    return message.channel.send({ embeds: [helpEmbed] });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
