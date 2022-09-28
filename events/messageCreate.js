const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js')
const ms = require('ms');
const client = require('..');
const config = require('../config.json');

const cooldown = new Collection();

client.on('messageCreate', async message => {
    try {
        if (message.author.bot || message.channel.type === "dm") return;
        let prefixes = ["z&o!", "z&O!", "Z&o!", "<@1017497741871554591>", "<@!1017497741871554591>"]
        let prefixChoose = ""
        prefixes.forEach((prefix) => {
            if (message.content.startsWith(prefix)) {
                prefixChoose = prefix;
            }
        });

        if (!message.guild) return;

        if (!prefixChoose) return;
        let args = message.content.slice(prefixChoose.length).trim().split(/ +/g);
        let command = args.shift().toLowerCase();

        let cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases?.includes(command));

        if (cmd) {
            if (cmd.cooldown) {
                if (cooldown.has(`${cmd.name}${message.author.id}`)) return message.channel.send({ content: config.messages["COOLDOWN_MESSAGE"].replace('<duration>', ms(cooldown.get(`${cmd.name}${message.author.id}`) - Date.now(), { long: true })) });
                if (cmd.userPerms || cmd.botPerms) {
                    if (!message.member.permissions.has(PermissionsBitField.resolve(cmd.userPerms || []))) {
                        const userPerms = new EmbedBuilder()
                            .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                            .setDescription(`🚫 ${message.author}, Sie haben nicht die \`${cmd.userPerms}\` Berechtigung um diese Aktion auszuführen!`)
                            .setColor('Red')
                            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag })
                        return message.reply({ embeds: [userPerms] })
                    }
                    if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(cmd.botPerms || []))) {
                        const botPerms = new EmbedBuilder()
                            .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                            .setDescription(`🚫 ${message.author}, Ich habe nicht die \`${cmd.botPerms}\` Berechtigung um diese Aktion auszuführen!`)
                            .setColor('Red')
                            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag })
                        return message.reply({ embeds: [botPerms] })
                    }
                }

                try {
                    await cmd.run(client, message, args)
                    cooldown.set(`${cmd.name}${message.author.id}`, Date.now() + cmd.cooldown)
                    setTimeout(() => {
                        cooldown.delete(`${cmd.name}${message.author.id}`)
                    }, cmd.cooldown);
                } catch (err) {
                    console.log(err)
                    return message.reply({ content: 'Ein Fehler ist aufgetreten!' })

                }
            } else {
                if (cmd.userPerms || cmd.botPerms) {
                    if (!message.member.permissions.has(PermissionsBitField.resolve(cmd.userPerms || []))) {
                        const userPerms = new EmbedBuilder()
                            .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                            .setDescription(`🚫 ${message.author}, Sie haben nicht die \`${cmd.userPerms}\` Berechtigung um diese Aktion auszuführen!`)
                            .setColor('Red')
                            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag })
                        return message.reply({ embeds: [userPerms] })
                    }
                    if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(cmd.botPerms || []))) {
                        const botPerms = new EmbedBuilder()
                            .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                            .setDescription(`🚫 ${message.author}, Ich habe nicht die \`${cmd.botPerms}\` Berechtigung um diese Aktion auszuführen!`)
                            .setColor('Red')
                            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag })
                        return message.reply({ embeds: [botPerms], replied_user: false })
                    }
                }
                try {
                    await cmd.run(client, message, args)
                } catch (err) {
                    console.log(err)
                    return message.reply({ content: 'Ein Fehler ist aufgetreten!' })
                }
            }
        }
    } catch (err) {
        console.log(err);
        return message.reply({ content: 'Ein Fehler ist aufgetreten!' })
    }
});
