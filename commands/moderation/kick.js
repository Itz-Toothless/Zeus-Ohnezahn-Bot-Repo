const log = (arg) => console.log(arg);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "kick",
    aliases: ["kick-id"],
    usage: "z&o!kick <@user (optional: User-ID)> (optional: Grund)",
    cooldown: 1000,
    userPerms: ['KickMembers'],
    botPerms: ['KickMembers'],
    run: async (client, message, args) => {
        try {
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            let reason = args.slice(1).join(' ') || 'Kein Grund angegeben';
            if (user) {
                try {
                    let button = new ActionRowBuilder().setComponents(
                        new ButtonBuilder()
                            .setStyle("SUCCESS")
                            .setLabel("Kick")
                            .setCustomId("rel"),
                        new ButtonBuilder()
                            .setStyle("DANGER")
                            .setLabel("Zurückziehen")
                            .setCustomId("del")
                    );
                    let embed1 = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('Kick ausstehend')
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
                                    await message.guild.members.kick(user, { reason: reason });
                                    let embed2 = new EmbedBuilder()
                                        .setColor('#0099ff')
                                        .setTitle('Kick ausgeführt!')
                                        .setDescription(`**Nutzer erfolgreich gekickt.**\n**User:** <@${user.id}>\n**Moderator:** <@${message.author.id}>\n**Grund:** ${reason}`)
                                        .setTimestamp()
                                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                                    await Message.edit({ embeds: [embed2] });
                                    button
                                        .reply({
                                            content: '**✅ | Kick ausgeführt!**',
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
                                        .setDescription(`Kick wurde abgebrochen!\n**User:** <@${user.mention}>\n**Moderator:** <@${message.author.id}>\n**Letzter Grund:** ${reason}`)
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
