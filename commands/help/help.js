'use strict';
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Zeigt Infos über die jetzigen Kommandos',
    usage: 'z&o!help',
    aliases: ['h'],
    cooldown: 3000,
    userPerms: [],
    botPerms: [],
    run: async (client, message, args) => {
        try {
            switch (args[0]) {
                case 'commands' || 'cmds':
                    let commands = `help - Zeigt Infos über die jetzigen Kommandos
                    about - Zeigt Informationen über den Bot
					admin-list - Zeigt alle Admins des Servers und die Rollen, die denen die Administrator Berechtigung geben
                    ping - Gibt die jetzige Latenz des Bots aus
                    meme - Holen Sie sich ein zufälliges Meme
                    ban - Bannt eine Person
                    unban - Entbannt eine Person
                    kick - Kickt eine Person
                    warn - Verwarnt eine Person
                    deletewarns - Löscht alle Verwarnungen eines Nutzers
                    removewarn - Löscht eine Verwarnung eines Nutzers
                    checkwarns - Zeigt die Verwarnungen eines Nutzers an
                    set-mod-channel - Legt den Moderations-Kanal fest
                    set-welcome-channel - Legt den Willkommens-Kanal fest
                    set-leave-channel - Legt den Verlassen-Kanal fest
					`
                    let commandsEmbed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('Kommandos')
                        .setDescription(`${commands}`)
                        .setFooter({ text: 'z&o!help command [commandname] für Kommando-Infos' })
                        .setTimestamp();
                    return message.channel.send({ embeds: [commandsEmbed] });
                case 'aliases':
                    let aliases = `binary - bin
                    string - str
                    help - h
                    about - stats
                    ping - p
                    admins - admin-list
                    meme - memes
                    ban - ban-id
                    kick - kick-id
                    unban - Kein Alias gefunden
                    userinfo - user, u-info, uinfo, user-info, user, u-info, uinfo
                    warn - warn-user
                    deletewarns - del-warns, rm-all-warns
                    warnings - checkwarns
                    set-mod-channel - smc, set-moderation-c
                    set-welcome-channel - swc, set-welcome-c
                    set-leave-channel - slc, set-leave-c
                    `
                    let aliasesEmbed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('Kommando-Aliasse')
                        .setDescription(aliases)
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
                            { name: 'Aliasse:', value: `${command.aliases ? command.aliases.join(', ') : 'Kein Alias gefunden!'}` })
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
};
