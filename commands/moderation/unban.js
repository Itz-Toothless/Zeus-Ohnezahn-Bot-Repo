const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const log = (arg) => console.log(arg);
module.exports = {
    name: 'unban',
    description: 'Unbans a user from the server.',
    usage: 'z&o!unban <User-ID> (optional: Grund)',
    cooldown: 1000,
    userPerms: ['BanMembers'],
    botPerms: ['BanMembers'],
    run: async (client, message, args) => {
        const id = args[0];
        let reason = args.slice(1).join(" ")
        if (!reason) reason = 'Kein Grund angegeben'
        await client.users.fetch(id).then(async (user) => {
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
                const bans = await message.guild.bans.fetch();
                if (bans.size == 0) {
                    let banSizeError = new EmbedBuilder()
                        .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                        .setColor('Random')
                        .setTitle('Keine Bans!')
                        .setDescription('Auf diesem Server ist keiner gebannt!')
                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: client.users.cache.get('705557092802625576').displayAvatarURL({ dynamic: true }) })
                        .setTimestamp()
                    return await message.reply({ embeds: [banSizeError], allowedMentions: { repliedUser: false } })
                }
                let bUser = bans.find(b => b.user.id == id);
                if (!bUser) {
                    let userErrorEmbed = new EmbedBuilder()
                        .setColor('Random')
                        .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                        .setTitle('Entbannung nicht ausgeführt!')
                        .setDescription('Der Nutzer ist nicht gebannt!')
                        .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: client.users.cache.get('705557092802625576').displayAvatarURL({ dynamic: true }) })
                        .setTimestamp();
                    return await message.reply({ embeds: [userErrorEmbed], allowedMentions: { repliedUser: false } })
                }
                let embed1 = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Entbannung ausstehend')
                    .setDescription(`**User:** <@${user.id}>\n**Moderator:** <@${message.author.id}>\n**Grund:** ${reason}`)
                    .setTimestamp()
                    .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: client.users.cache.get('705557092802625576').displayAvatarURL({ dynamic: true }) })
                return await message.reply({ embeds: [embed1], allowedMentions: { repliedUser: false }, components: [button] }).then(async (Message) => {
                    const filter = (i) => i.user.id === message.author.id;
                    let col = await Message.createMessageComponentCollector({ filter, time: 1200000 });
                    col.on("collect", async (button) => {
                        if (button.user.id !== message.author.id) return;
                        switch (button.customId) {
                            case "rel":
                                col.stop(true);
                                await message.guild.bans.remove(user.id, reason);
                                let embed2 = new EmbedBuilder()
                                    .setColor(0x00ff00)
                                    .setTitle('🔨 Entbannung ausgeführt!')
                                    .setDescription(`**Nutzer erfolgreich entbannt.**\n**User:** ${user}\n**Moderator:** ${message.author}\n**Grund:** ${reason}`)
                                    .setTimestamp()
                                    .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: client.users.cache.get('705557092802625576').displayAvatarURL({ dynamic: true }) })
                                await Message.edit({ embeds: [embed2] });
                                button.reply({ content: '**✅ | Entbannung von ' + user + ' ausgeführt!**', ephemeral: true })
                                    .catch((e) => { log(e) });
                                break;
                            case "del":
                                col.stop(true);
                                let embed3 = new EmbedBuilder()
                                    .setColor(0xff0000)
                                    .setTitle('🆗 Abgebrochen')
                                    .setDescription(`Entbannung wurde abgebrochen!\n**User:** ${user}\n**Moderator:** ${message.author}\n**Grund:** ${reason}`)
                                    .setTimestamp()
                                    .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: client.users.cache.get('705557092802625576').displayAvatarURL({ dynamic: true }) })
                                await Message.edit({ embeds: [embed3] });
                                button.reply({ content: "**❌ | Entbannung abgebrochen!**", ephemeral: true })
                                    .catch((e) => { log(e) });
                                break;
                        }
                    });
                    col.on("end", async () => {
                        await Message.edit({ components: [] });
                    });
                });
            } catch (e) { log(e) }
        }).catch((err) => { log(err) })
    }
};
