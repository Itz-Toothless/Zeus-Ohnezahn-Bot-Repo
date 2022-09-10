const log = (arg) => console.log(arg);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, MessageActionRow, ButtonStyle } = require("discord.js");

module.exports = {
    name: "ban",
    aliases: ["ban-id"],
    usage: "w&p!ban <userid> <reason>",
	cooldown: 1000,
    userPerms: ['BanMembers'],
    botPerms: ['BanMembers'],
    run: async (client, message, args) => {
        try {
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            let reason = args.slice(1).join(' ') || 'Kein Grund angegeben';
            if(user) {
                try{
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
                        button = new ActionRowBuilder().setComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Success)
                                .setLabel("Ban")
                                .setCustomId("ban")
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setStyle("DANGER")
                                .setLabel("Zurückziehen")
                                .setCustomId("clear")
                                .setDisabled(true)
                        );
                        await Message.edit({ components: [button] });

                    });
                });
                } catch(e) {
                    log(e);
                }
        }
            else {
                try {
                    user = await client.users.fetch(args[0]).then(async (fetchedUser) => {
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
                        col.on("end", async (button) => {
                            button = new ActionRowBuilder().setComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Success)
                                    .setLabel("Bann")
                                    .setCustomId("rel")
                                    .setDisabled(true),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Danger)
                       				.setLabel("Zurückziehen")
                        			.setCustomId("del")
                                    .setDisabled(true)
                            );
                            return await Message.edit({ components: [button] });

                        });
                    });
                }).catch(() => {
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
