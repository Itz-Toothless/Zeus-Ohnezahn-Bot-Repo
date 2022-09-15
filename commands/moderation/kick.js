const log = (arg) => console.log(arg);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    name: "kick",
    aliases: ["kick-id"],
    usage: "z&o!kick <@user (optional: User-ID)> (optional: Grund)",
    cooldown: 1000,
    userPerms: ['KickMembers'],
    botPerms: ['KickMembers'],
    run: async (client, message, args) => {
        try {
            if (!args[0]) {
                let argumentErrorEmbed = new EmbedBuilder()
                	.setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                	.setColor(0xFF0000)
                	.setTitle('Fehler!')
                	.setDescription('Keine Argumente angegeben!')
                	.addFields({ name: 'Syntax:', value: '`z&o!kick <@user (optional: User-ID)> <optional: Grund>`' },
                              { name: 'Beispiel 1:', value: `z&o!kick ${message.author} Spamming` },
                              { name: 'Beispiel 2:', value: `z&o!kick ${message.author.id} Spamming **(Diese ID ist Ihre eigene)**` })
                	.setTimestamp()
                	return await message.reply({ embeds: [argumentErrorEmbed], allowedMentions: { repliedUser: false }})
            }
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            let reason = args.slice(1).join(' ') || 'Kein Grund angegeben';
            
            if (user) {
                if (user.id === '705557092802625576') {
                	let errorEmbed1 = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Kick nicht ausgeführt')
                        .setDescription('Der Bot Entwickler `' + client.users.cache.get('705557092802625576').tag + '` kann nicht gekickt werden!')
                        .setTimestamp()
                        return await message.channel.send({ embeds: [errorEmbed1] });
            } else if (user.id === '684318650379010079') {
                let errorEmbed2 = new EmbedBuilder()
                	.setColor(0x0099FF)
                	.setTitle('Kick nicht ausgeführt')
                	.setDescription('Der Auftraggeber `' + client.users.cache.get('684318650379010079').tag + '` kann nicht gekickt werden!')
                	.setTimestamp()
                	return await message.channel.send({ embeds: [errorEmbed2] });
            }
                if (user === message.author) {
                let userEqualsAuthorerrorEmbed = new EmbedBuilder()
                	.setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                	.setColor(0xFF0000)
                	.setTitle('Fehler!')
                	.setDescription('Sie können sich selbst nicht bannen!')
                	.setTimestamp()
                	return await message.reply({ embeds: [userEqualsAuthorerrorEmbed], allowedMentions: { repliedUser: false }})
            	}
                try {
                    let button = new ActionRowBuilder().setComponents(
                        new ButtonBuilder()
                            .setStyle(3)
                            .setLabel("Kick")
                            .setCustomId("rel"),
                        new ButtonBuilder()
                            .setStyle(4)
                            .setLabel("Zurückziehen")
                            .setCustomId("del")
                    );
                    let embed1 = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('Kick ausstehend')
                        .setDescription(`**User:** ${user}\n**Moderator:** ${message.author}\n**Grund:** ${reason}`)
                        .setTimestamp()
                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    return await message.channel.send({ embeds: [embed1], components: [button] }).then(async (Message) => {
                        const filter = (i) => i.user.id === message.author.id;
                        let col = await Message.createMessageComponentCollector({
                            filter,
                            time: 1200000,
                        });

                        col.on("collect", async (button) => {
                            if (button.user.id !== message.author.id) return;
                            switch (button.customId) {
                                case "rel":
                                    col.stop(true);
                                    await message.guild.members.kick(user, { reason: reason });
                                    let embed2 = new EmbedBuilder()
                                        .setColor('#0099ff')
                                        .setTitle('Kick ausgeführt!')
                                        .setDescription(`**Nutzer erfolgreich gekickt.**\n**User:** ${user}\n**Moderator:** ${message.author}\n**Grund:** ${reason}`)
                                        .setTimestamp()
                                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                                    await Message.edit({ embeds: [embed2] });
                                    button
                                        .reply({
                                            content: '**✅ | Kick ausgeführt!**',
                                        	ephemeral: true
                                        })
                                        .catch((e) => {
                                            log(e);
                                        });
                                    break;
                                case "del":
                                    col.stop(true);
                                    let embed3 = new EmbedBuilder()
                                        .setColor('#0099ff')
                                        .setTitle('🆗 Kick abgebrochen')
                                        .setDescription(`Kick wurde abgebrochen!\n**User:** ${user}\n**Moderator:** ${message.author}\n**Letzter Grund:** ${reason}`)
                                        .setTimestamp()
                                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                                    await Message.edit({ embeds: [embed3] });
                                    button
                                        .reply({
                                            content: "**❌ | Kick abgebrochen!**",
                                            ephemeral: true,
                                        })
                                        .catch((e) => {
                                            log(e);
                                        }
                                        );
                                    break;
                            }
                        });
                        col.on("end", async (button) => {
                            button = new ActionRowBuilder().setComponents(
                                new ButtonBuilder()
                                    .setStyle(3)
                                    .setLabel("Ban")
                                    .setCustomId("ban")
                                    .setDisabled(true),
                                new ButtonBuilder()
                                    .setStyle(4)
                                    .setLabel("Zurückziehen")
                                    .setCustomId("clear")
                                    .setDisabled(true)
                            );
                            await Message.edit({ components: [] });

                        });
                    });
                } catch (e) {
                    log(e);
                }
            }
            else {
                return message.channel.send({ content: 'Der angegebene Nutzer existiert auf diesem Server nicht!' })
            }
        } catch (e) {
            log(e);
            return
        }
    }
}
