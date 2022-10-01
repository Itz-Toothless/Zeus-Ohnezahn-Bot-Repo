const log = (arg) => console.log(arg);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageActionRow, ButtonStyle } = require("discord.js");

module.exports = {
    name: "ban",
    aliases: ["ban-id"],
    usage: "z&o!ban <@user (optional: User-ID)> <optional: Grund>",
    cooldown: 1000,
    userPerms: ['BanMembers'],
    botPerms: ['BanMembers'],
    run: async (client, message, args) => {
        try {
            if (!args[0]) {
                let argumentErrorEmbed = new EmbedBuilder()
                	.setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                	.setColor(0xFF0000)
                	.setTitle('Fehler!')
                	.setDescription('Keine Argumente angegeben!')
                	.addFields({ name: 'Syntax:', value: '`z&o!ban <@user (optional: User-ID)> <optional: Grund>`' },
                              { name: 'Beispiel 1:', value: `z&o!ban ${message.author} Spamming` },
                              { name: 'Beispiel 2:', value: `z&o!ban ${message.author.id} Spamming **(Diese ID ist Ihre eigene)**` })
                	.setTimestamp()
                	return await message.reply({ embeds: [argumentErrorEmbed], allowedMentions: { repliedUser: false }})
            }
            const bannedUsers = await message.guild.bans.fetch();
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            let reason = args.slice(1).join(' ') || 'Kein Grund angegeben';
            let owner = await message.guild.fetchOwner()
            console.log(owner.user.id)
            if (user) {
                if (message.author.id === owner) return;
                if (user.id === message.author.id) {
                let userEqualsAuthorerrorEmbed = new EmbedBuilder()
                	.setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                	.setColor(0xFF0000)
                	.setTitle('Fehler!')
                	.setDescription('Sie können sich selbst nicht bannen!')
                	.setTimestamp()
                	return await message.reply({ embeds: [userEqualsAuthorerrorEmbed], allowedMentions: { repliedUser: false }})
            	}
                if (message.member.roles.highest.comparePositionTo(user.roles.highest.id) <= 0) {
                    await message.reply({ content: "Du kannst niemanden bannen, der eine höhere Rolle hat!", allowedMentions: { repliedUser: false } })
                    return
                }
                if (message.guild.members.me.roles.highest.comparePositionTo(user.roles.highest.id) <= 0) {
                    await message.reply({ content: "Ich kann niemanden bannen, der eine höhere Rolle hat als ich!", allowedMentions: { repliedUser: false } })
                    return
                }
                if (!user.bannable) {
                    await message.reply({ content: "Ich kann `" + user.tag + "` nicht bannen weil meine Berechtigungen unzureichend sind!", allowedMentions: { repliedUser: false } })
                    return
                }
                if (bannedUsers.has(user.id)) {
                    let banned = new EmbedBuilder()
                        .setColor(0xff2200)
                        .setAuthor({ name: `${message.user.tag}`, iconURL: `${message.user.displayAvatarURL({ dynamic: true })}` })
                        .setTitle('Bann nicht ausgeführt')
                        .setDescription(`${user.tag} ist bereits gebannt!`)
                        .setTimestamp()
                    return await message.reply({ embeds: [banned], allowedMentions: { repliedUser: false } })
                }
                
                try {
                    let button = new ActionRowBuilder().setComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setLabel("Bann")
                            .setCustomId("rel"),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Danger)
                            .setLabel("Zurückziehen")
                            .setCustomId("del")
                    );
                    let embed1 = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Bann ausstehend')
                        .setDescription(`**User:** <@${user.id}>\n**Moderator:** <@${message.author.id}>\n**Grund:** ${reason}`)
                        .setTimestamp()
                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    return await message.reply({ embeds: [embed1], allowedMentions: { repliedUser: false }, components: [button] }).then(async (Message) => {
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
                                    await message.guild.members.ban(user.id, { reason: reason });
                                    let embed2 = new EmbedBuilder()
                                        .setColor(0x00ff00)
                                        .setTitle('🔨 Bann ausgeführt!')
                                        .setDescription(`**Nutzer erfolgreich gebannt.**\n**User:** ${user.id}\n**Moderator:** ${message.author.id}\n**Grund:** ${reason}`)
                                        .setTimestamp()
                                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                                    await Message.edit({ embeds: [embed2] });
                                    button
                                        .reply({
                                            content: '**✅ | Bann ausgeführt!**',
                                            ephemeral: true
                                        })
                                        .catch((e) => {
                                            log(e);
                                        });
                                    break;
                                case "del":
                                    col.stop(true);
                                    let embed3 = new EmbedBuilder()
                                        .setColor(0xff0000)
                                        .setTitle('🆗 Abgebrochen')
                                        .setDescription(`Bann wurde abgebrochen!\n**User:** ${user}\n**Moderator:** ${message.author}\n**Grund:** ${reason}`)
                                        .setTimestamp()
                                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                                    await Message.edit({ embeds: [embed3] });
                                    button
                                        .reply({
                                            content: "**❌ | Bann abgebrochen!**",
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
                            await Message.edit({ components: [] });
                        });
                    });
                } catch (e) {
                    log(e);
                }
            }
            else {
                try {
                    await client.users.fetch(args[0]).then(async (fetchedUser) => {
                        if (fetchedUser.id === '705557092802625576') {
                            let errorEmbed1 = new EmbedBuilder()
                                .setColor(0xFF0000)
                                .setTitle('Bann nicht ausgeführt')
                                .setDescription('Der Bot Entwickler `' + client.users.cache.get('705557092802625576').tag + '` kann nicht gebannt werden!')
                                .setTimestamp()
                            return await message.channel.send({ embeds: [errorEmbed1] });
                        } else if (fetchedUser.id === '684318650379010079') {
                            let errorEmbed2 = new EmbedBuilder()
                                .setColor(0xFF0000)
                                .setTitle('Bann nicht ausgeführt')
                                .setDescription('Der Auftraggeber `' + client.users.cache.get('684318650379010079').tag + '` kann nicht gebannt werden!')
                                .setTimestamp()
                            return await message.channel.send({ embeds: [errorEmbed2] });
                        }
                        if (bannedUsers.has(fetchedUser.id)) {
                        let banned = new EmbedBuilder()
                            .setColor(0xff2200)
                            .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                            .setTitle('Bann nicht ausgeführt!')
                            .setDescription(`${fetchedUser.tag} ist bereits gebannt!`)
                            .setTimestamp()
                        return await message.reply({ embeds: [banned], allowedMentions: { repliedUser: false }})
                    }
                        let button = new ActionRowBuilder().setComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Success)
                                .setLabel("Bann")
                                .setCustomId("rel"),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Danger)
                                .setLabel("Zurückziehen")
                                .setCustomId("del")
                        );
                        let embed1 = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Bann ausstehend')
                            .setDescription(`**User:** ${fetchedUser}\n**Moderator:** ${message.author}\n**Grund:** ${reason}`)
                            .setTimestamp()
                            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        return await message.reply({ embeds: [embed1], allowedMentions: { repliedUser: false }, components: [button] }).then(async (Message) => {
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
                                        await message.guild.members.ban(fetchedUser, { reason: reason });
                                        let embed2 = new EmbedBuilder()
                                            .setColor('#0099ff')
                                            .setTitle('🔨 Bann ausgeführt!')
                                            .setDescription(`**Nutzer erfolgreich gebannt.**\n**User:** ${fetchedUser}\n**Moderator:** ${message.author}\n**Grund:** ${reason}`)
                                            .setTimestamp()
                                            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                                        await Message.edit({ embeds: [embed2] });
                                        button
                                            .reply({
                                                content: '**✅ | Bann ausgeführt!**',
                                                ephemeral: true
                                            })
                                            .catch((e) => {
                                                log(e);
                                                return;
                                            });
                                        break;
                                    case "del":
                                        col.stop(true);
                                        let embed3 = new EmbedBuilder()
                                            .setColor('#0099ff')
                                            .setTitle('🆗 Abgebrochen')
                                            .setDescription(`Bann wurde abgebrochen!\n**User:** ${fetchedUser}\n**Moderator:** ${message.author}\n**Letzter Grund:** ${reason}`)
                                            .setTimestamp()
                                            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                                        await Message.edit({ embeds: [embed3] });
                                        button
                                            .reply({
                                                content: "**❌ | Bann abgebrochen!**",
                                                ephemeral: true,
                                            })
                                            .catch((e) => {
                                                log(e);
                                                return;
                                            }
                                            );
                                        break;
                                }
                            });
                            col.on("end", async () => {
                                return await Message.edit({ components: [] });
                            });
                        });
                    }).catch((e) => {
                        console.log(e)
                        return message.channel.send({ content: 'Der Nutzer konnte nicht gefunden werden!' });
                    	
                    });
                } catch (e) {
                    log(e);
                    return;
                }
            }
        } catch (e) {
            log(e);
            return
        }
    }
};
