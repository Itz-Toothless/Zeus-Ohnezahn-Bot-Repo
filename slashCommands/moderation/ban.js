const { ApplicationCommandType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')
const log = (arg) => console.log(arg);
module.exports = {
    name: 'ban',
    description: 'Bannt jemanden vom Server',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'user',
            description: 'Bannt einen Nutzer',
            type: 1,
            options: [{
                name: 'user',
                description: 'Der Nutzer',
                type: 6,
                required: true
            },
            {
                name: 'grund',
                description: 'Der Grund für den Bann',
                type: 3,
                required: true
            }]
        },
        {
            name: 'id',
            description: 'Bannt eine Nutzer ID',
            type: 1,
            options: [{
                name: 'id',
                description: 'Die Nutzer ID',
                type: 3,
                required: true
            },
            {
                name: 'grund',
                description: 'Der Grund für den Bann',
                type: 3,
                required: true
            }]
        }
    ],
    run: async (client, interaction) => {
        try {
            const bannedUsers = await interaction.guild.bans.fetch();
            switch (interaction.options._subcommand) {
                case 'user':
                    const user = interaction.options.getMember('user');
                    const reason = interaction.options.getString('grund') || 'Kein Grund angegeben';
                    if (user) {
                        if (user.id === '705557092802625576') {
                            let errorEmbed1 = new EmbedBuilder()
                                .setColor(0xFF0000)
                                .setTitle('Bann nicht ausgeführt')
                                .setDescription('Der Bot-Entwickler `' + client.users.cache.get('705557092802625576').tag + '` kann nicht gebannt werden!')
                                .setTimestamp()
                            return await interaction.channel.send({ embeds: [errorEmbed1] });
                        } else if (user.id === '684318650379010079') {
                            let errorEmbed2 = new EmbedBuilder()
                                .setColor(0xFF0000)
                                .setTitle('Bann nicht ausgeführt')
                                .setDescription('Der Auftraggeber `' + client.users.cache.get('684318650379010079').tag + '` kann nicht gebannt werden!')
                                .setTimestamp()
                            return await interaction.channel.send({ embeds: [errorEmbed2] });
                        }
                        if (interaction.member.roles.highest.comparePositionTo(user.roles.highest.id) <= 0) {
                            await interaction.reply({ content: "Du kannst niemanden bannen, der eine höhere Rolle hat!", allowedMentions: { repliedUser: false } })
                            return
                        }
                        if (interaction.guild.members.me.roles.highest.comparePositionTo(user.roles.highest.id) <= 0) {
                            await interaction.reply({ content: "Ich kann niemanden bannen, der eine höhere Rolle hat als ich!", allowedMentions: { repliedUser: false } })
                            return
                        }
                        if (!user.bannable) {
                            await interaction.reply({ content: "Ich kann `" + user.tag + "` nicht bannen weil meine Berechtigungen unzureichend sind!", allowedMentions: { repliedUser: false } })
                            return
                        }
                        if (bannedUsers.has(user.id)) {
                            let banned = new EmbedBuilder()
                                .setColor(0xff2200)
                                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                                .setTitle('Bann nicht ausgeführt')
                                .setDescription(`${user.tag} ist bereits gebannt!`)
                                .setTimestamp()
                            return await interaction.reply({ embeds: [banned], allowedMentions: { repliedUser: false } })
                        }

                        try {
                            let button = new ActionRowBuilder().addComponents(
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
                                .setDescription(`**User:** <@${user.id}>\n**Moderator:** <@${interaction.user.id}>\n**Grund:** ${reason}`)
                                .setTimestamp()
                                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                            return await interaction.reply({ embeds: [embed1], allowedMentions: { repliedUser: false }, components: [button], ephemeral: true }).then(async () => {
                                const filter = i => i.user.id === interaction.user.id;

                                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

                                collector.on("collect", async button => {
                                    switch (button.customId) {
                                        case "rel":
                                            collector.stop(true);
                                            await interaction.guild.members.ban(user.id, { reason: reason });
                                            let embed2 = new EmbedBuilder()
                                                .setColor(0x00ff00)
                                                .setTitle('🔨 Bann ausgeführt!')
                                                .setDescription(`**Nutzer erfolgreich gebannt.**\n**User:** ${user.user.tag}\n**Moderator:** ${interaction.user.tag}\n**Grund:** ${reason}`)
                                                .setTimestamp()
                                                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                                            await button.update({ embeds: [embed2], components: [] });
                                            break;
                                        case "del":
                                            collector.stop(true);
                                            let embed3 = new EmbedBuilder()
                                                .setColor(0xff0000)
                                                .setTitle('🆗 Abgebrochen')
                                                .setDescription(`Bann wurde abgebrochen!\n**User:** ${user.user.tag}\n**Moderator:** ${interaction.user.tag}\n**Grund:** ${reason}`)
                                                .setTimestamp()
                                                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                                            await button.update({ embeds: [embed3], components: [] });
                                            break;
                                    }
                                });
                            });
                        } catch (e) {
                            log(e);
                        }
                    }
                    break;
                case 'id':
                    const userId = interaction.options.getString('id');
                    const banReason = interaction.options.getString('grund') || 'Kein Grund angegeben';
                    await client.users.fetch(userId).then(async (fetchedUser) => {
                        if (fetchedUser.id === '705557092802625576') {
                            let errorEmbed1 = new EmbedBuilder()
                                .setColor(0xFF0000)
                                .setTitle('Bann nicht ausgeführt')
                                .setDescription('Der Bot Entwickler `' + client.users.cache.get('705557092802625576').tag + '` kann nicht gebannt werden!')
                                .setTimestamp()
                            return await interaction.reply({ embeds: [errorEmbed1], ephemeral: true });
                        } else if (fetchedUser.id === '684318650379010079') {
                            let errorEmbed2 = new EmbedBuilder()
                                .setColor(0xFF0000)
                                .setTitle('Bann nicht ausgeführt')
                                .setDescription('Der Auftraggeber `' + client.users.cache.get('684318650379010079').tag + '` kann nicht gebannt werden!')
                                .setTimestamp()
                            return await interaction.reply({ embeds: [errorEmbed2], allowedMentions: { repliedUser: false }, ephemeral: true });
                        }
                        if (bannedUsers.has(fetchedUser.id)) {
                            let banned = new EmbedBuilder()
                                .setColor(0xff2200)
                                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                                .setTitle('Bann nicht ausgeführt!')
                                .setDescription(`${fetchedUser.tag} ist bereits gebannt!`)
                                .setTimestamp()
                            return await interaction.reply({ embeds: [banned], allowedMentions: { repliedUser: false }, ephemeral: true })
                        }
                        try {
                            let button = new ActionRowBuilder().addComponents(
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
                                .setDescription(`**User:** <@${fetchedUser.id}>\n**Moderator:** <@${interaction.user.id}>\n**Grund:** ${banReason}`)
                                .setTimestamp()
                                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                            return await interaction.reply({ embeds: [embed1], allowedMentions: { repliedUser: false }, components: [button], ephemeral: true }).then(async () => {
                                const filter = i => i.user.id === interaction.user.id;

                                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

                                collector.on("collect", async button => {
                                    switch (button.customId) {
                                        case "rel":
                                            collector.stop(true);
                                            await interaction.guild.members.ban(fetchedUser.id, { reason: banReason });
                                            let embed2 = new EmbedBuilder()
                                                .setColor(0x00ff00)
                                                .setTitle('🔨 Bann ausgeführt!')
                                                .setDescription(`**Nutzer erfolgreich gebannt.**\n**User:** ${fetchedUser.tag}\n**Moderator:** ${interaction.user.tag}\n**Grund:** ${banReason}`)
                                                .setTimestamp()
                                                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                                            await button.update({ embeds: [embed2], components: [] });
                                            break;
                                        case "del":
                                            collector.stop(true);
                                            let embed3 = new EmbedBuilder()
                                                .setColor(0xff0000)
                                                .setTitle('🆗 Abgebrochen')
                                                .setDescription(`Bann wurde abgebrochen!\n**User:** ${fetchedUser.tag}\n**Moderator:** ${interaction.user.tag}\n**Grund:** ${banReason}`)
                                                .setTimestamp()
                                                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                                            await button.update({ embeds: [embed3], components: [] });
                                            break;
                                    }
                                });
                            });
                        } catch (e) {
                            log(e);
                        }
                    });
            }
        } catch (err) {
            log(err);
        }
    }
};
