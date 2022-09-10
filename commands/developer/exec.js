const { EmbedBuilder } = require('discord.js');
const { exec } = require('child_process');

module.exports = {
    name: 'exec',
    description: 'Führt Kommandozeilen-Befehle aus (Typ: Linux Debian)',
    aliases: ['exec_command', 'exec_cmd', 'execute_command', 'execute_cmd', 'run'],
    usage: 'ds!exec <command>',
    run: async (client, msg, args) => {
        try{
            if (msg.author.id !== '705557092802625576') {
                msg.channel.send('Dieses Kommando ist nur für den Entwickler ' + client.users.cache.get('705557092802625576').tag + ' bestimmt!');
                return;
            }
            if (args.length < 1) {
                msg.channel.send('Welche Argumente soll ich ausführen?');
                return;
            }
            exec(args.join(' '), (error, stdout, stderr) => {
                if (stdout > 4096) {
                    let embed = new EmbedBuilder()
                    .setAuthor({ name: `${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({dynamic: true})})
                    .setColor('Red')
                    .setTitle('Fehler aufgetreten!')
                    .setThumbnail(msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`**Eingabe:** \`\`\`js\n${args.join(' ')}\n\`\`\`\n**Ausgabe:**\`\`\`js\nAusgabe ist zu lang!\n\`\`\``)
                    .setTimestamp();
                    return msg.reply({embeds: [embed]});
                }
                if (!error) {
                    let embed = new EmbedBuilder()
                    .setAuthor({ name: `${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({dynamic: true})})
                    .setColor('Blue')
                    .setTitle('Kommando ausgeführt!')
                    .setThumbnail(msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`**Eingabe:** \`\`\`js\n${args.join(' ')}\n\`\`\`\n**Ausgabe:**\`\`\`js\n${stdout}\n\`\`\``)
                    .setTimestamp();
                    return msg.reply({embeds: [embed]});
                }  else {
                    console.log(stderr)
                    let embed = new EmbedBuilder()
                    .setAuthor({ name: `${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({dynamic: true})})
                    .setColor('Red')
                    .setTitle('Fehler aufgetreten!')
                    .setThumbnail(msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`**Eingabe:** \`\`\`js\n${args.join(' ')}\n\`\`\`\n**Ausgabe:**\`\`\`js\n${error}\n\`\`\``)
                    .setTimestamp();
                    return msg.reply({embeds: [embed]});
                }
            });
        } catch(error) {
            console.log(error);
        }
    }
};
