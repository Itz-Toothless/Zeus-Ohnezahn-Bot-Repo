const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const client = require('..');
const config = require('../config.json');
const prettyMilliseconds = require('pretty-ms')

const cooldown = new Collection();

client.on('interactionCreate', async interaction => {
    const slashCommand = client.slashCommands.get(interaction.commandName);
    if (interaction.type == 4) {
        if (slashCommand.autocomplete) {
            const choices = [];
            await slashCommand.autocomplete(interaction, choices)
        }
    }
    if (!interaction.type == 2) return;

    if (!slashCommand) return client.slashCommands.delete(interaction.commandName);
    try {
        if (slashCommand.cooldown) {
            if (cooldown.has(`slash-${slashCommand.name}${interaction.user.id}`)) return interaction.reply({ content: config.messages["COOLDOWN_MESSAGE"].replace('<duration>', prettyMilliseconds(cooldown.get(`slash-${slashCommand.name}${interaction.user.id}`) - Date.now(),)) })
            if (slashCommand.userPerms || slashCommand.botPerms) {
                if (!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
                    const userPerms = new EmbedBuilder()
                        .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                        .setDescription(`🚫 ${interaction.user}, Sie haben nicht die \`${slashCommand.userPerms}\` Berechtigung um dieses Kommando auszuführen!`)
                        .setColor('Red')
                    return interaction.reply({ embeds: [userPerms], fetchReply: true, ephemeral: true })
                }
                if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
                    const botPerms = new EmbedBuilder()
                        .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                        .setDescription(`🚫 ${interaction.user}, Ich habe nicht die \`${slashCommand.botPerms}\` Berechtigung um dieses Kommando auszuführen!`)
                        .setColor('Red')
                    return interaction.reply({ embeds: [botPerms], fetchReply: true, ephemeral: true })
                }
            }
            try {
                await slashCommand.run(client, interaction);
                cooldown.set(`slash-${slashCommand.name}${interaction.user.id}`, Date.now() + slashCommand.cooldown)
                setTimeout(() => {
                    cooldown.delete(`slash-${slashCommand.name}${interaction.user.id}`)
                }, slashCommand.cooldown)
            } catch (err) {
                console.log(err)
                return interaction.reply({ content: 'Ein Fehler ist aufgetreten', fetchReply: true, ephemeral: true });
            }
        } else {
            if (slashCommand.userPerms || slashCommand.botPerms) {
                if (!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
                    const userPerms = new EmbedBuilder()
                        .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                        .setDescription(`🚫 ${interaction.user}, Sie haben nicht die \`${slashCommand.userPerms}\` Berechtigung um dieses Kommando auszuführen!`)
                        .setColor('Red')
                    return interaction.reply({ embeds: [userPerms], fetchReply: true, ephemeral: true })
                }
                if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
                    const botPerms = new EmbedBuilder()
                        .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                        .setDescription(`🚫 ${interaction.user}, Ich habe nicht die \`${slashCommand.botPerms}\` Berechtigung um dieses Kommando auszuführen!`)
                        .setColor('Red')
                    return interaction.reply({ embeds: [botPerms], fetchReply: true, ephemeral: true })
                }

            }
            try {
                await slashCommand.run(client, interaction);
            } catch (err) {
                console.log(err)
                return interaction.reply({ content: 'Ein Fehler ist aufgetreten', fetchReply: true, ephemeral: true });
            }
        }
    } catch (error) {
        console.log(error);
    }
});
