'use strict'
const log = (arg) => console.log(arg);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "ban",
    aliases: ["ban-id"],
    usage: "z&o!ban <@user (optional: User-ID)> <optional: Grund>",
    cooldown: 1000,
    userPerms: ['BanMembers'],
    botPerms: ['BanMembers'],
    run: async (client, message, args) => {
        try {
                const bannedUsers = await message.guild.bans.fetch();
                let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
                let reason = args.slice(1).join(' ') || 'Kein Grund angegeben';
                if (user) {
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
                            .setAuthor({ name: `${message.user.tag}`, iconURL: `${message.user.displayAvatarURL({ forceStatic: true })}` })
                            .setTitle('Bann nicht ausgeführt')
                            .setDescription(`${user.tag} ist bereits gebannt!`)
                            .setTimestamp()
                        return await message.reply({ embeds: [banned], allowedMentions: { repliedUser: false } })
                    }
                    if (PermissionFlagsBits.UseExternalEmojis) {
                        var button = new ActionRowBuilder().setComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Success)
                                .setLabel("Bann")
                                .setCustomId("rel")
                                .setEmoji('<a:yea:1035575891604021258>'),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Danger)
                                .setLabel("Zurückziehen")
                                .setCustomId("del")
                                .setEmoji('<a:nope:1035575700440219668>')
                        );
                    } else {
                        button = new ActionRowBuilder().setComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Success)
                                .setLabel("Bann")
                                .setCustomId("rel"),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Danger)
                                .setLabel("Zurückziehen")
                                .setCustomId("del")
                        );
                    }
                    try {
                        let embed1 = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle('Bann ausstehend')
                            .setDescription(`**User:** <@${user.id}>\n**Moderator:** <@${message.author.id}>\n**Grund:** ${reason}`)
                            .setTimestamp()
                            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ forceStatic: true }) })
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
                                        await message.guild.members.ban(user.id, { reason: reason, deleteMessageSeconds: 60 * 60 * 24 * 7 });
                                        let embed2 = new EmbedBuilder()
                                            .setColor(0x00ff00)
                                            .setTitle('🔨 Bann ausgeführt!')
                                            .setDescription(`**Nutzer erfolgreich gebannt.**\n**User:** ${user.id}\n**Moderator:** ${message.author.id}\n**Grund:** ${reason}`)
                                            .setTimestamp()
                                            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ forceStatic: true }) })
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
                                            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ forceStatic: true }) })
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
                            col.on("end", async () => {
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
                            if (bannedUsers.has(fetchedUser.id)) {
                                let banned = new EmbedBuilder()
                                    .setColor(0xff2200)
                                    .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ forceStatic: true })}` })
                                    .setTitle('Bann nicht ausgeführt!')
                                    .setDescription(`${fetchedUser.tag} ist bereits gebannt!`)
                                    .setTimestamp()
                                return await message.reply({ embeds: [banned], allowedMentions: { repliedUser: false } })
                            }
                            if (PermissionFlagsBits.UseExternalEmojis) {
                                button = new ActionRowBuilder().setComponents(
                                    new ButtonBuilder()
                                        .setStyle(ButtonStyle.Success)
                                        .setLabel("Bann")
                                        .setCustomId("rel")
                                        .setEmoji('<a:yea:1035575891604021258>'),
                                    new ButtonBuilder()
                                        .setStyle(ButtonStyle.Danger)
                                        .setLabel("Zurückziehen")
                                        .setCustomId("del")
                                        .setEmoji('<a:nope:1035575700440219668>')
                                );
                            } else {
                                button = new ActionRowBuilder().setComponents(
                                    new ButtonBuilder()
                                        .setStyle(ButtonStyle.Success)
                                        .setLabel("Bann")
                                        .setCustomId("rel"),
                                    new ButtonBuilder()
                                        .setStyle(ButtonStyle.Danger)
                                        .setLabel("Zurückziehen")
                                        .setCustomId("del")
                                );
                            }
                            let embed1 = new EmbedBuilder()
                                .setColor('Random')
                                .setTitle('Bann ausstehend')
                                .setDescription(`**User:** ${fetchedUser}\n**Moderator:** ${message.author}\n**Grund:** ${reason}`)
                                .setTimestamp()
                                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ forceStatic: true }) })
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
                                                .setColor('Green')
                                                .setTitle('🔨 Bann ausgeführt!')
                                                .setDescription(`**Nutzer erfolgreich gebannt.**\n**User:** ${fetchedUser}\n**Moderator:** ${message.author}\n**Grund:** ${reason}`)
                                                .setTimestamp()
                                                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ forceStatic: true }) })
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
                                                .setColor('Red')
                                                .setTitle('❌ Abgebrochen')
                                                .setDescription(`Bann wurde abgebrochen!\n**User:** ${fetchedUser}\n**Moderator:** ${message.author}\n**Letzter Grund:** ${reason}`)
                                                .setTimestamp()
                                                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ forceStatic: true }) })
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
                            let errorEmbed = new EmbedBuilder()
                            .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ forceStatic: true })}` })
                            .setColor('Random')
                            .setTitle('Fehler aufgetreten!')
                            .setDescription('**Sie müssen einen Nutzer angeben!**')
                            .addFields({ name: 'Syntax:', value: '`z&o!ban (@Nutzer / Nutzer-ID) <optional: Grund>`' },
                                { name: 'Beispiel 1:', value: `z&o!ban ${message.author} Spamming **(Dies sind Sie selbst)**` },
                                { name: 'Beispiel 2:', value: `z&o!ban ${message.author.id} Spamming **(Dies sind Sie selbst)**` })
                            .setTimestamp()
                            return message.channel.send({ embeds: [errorEmbed] });
                            log(e)
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
