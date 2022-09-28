const { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const modChannelModal = require('../../schema/ModModal');
const channelModal = require('../../schema/ChannelModal');
const userLeaveSchema = require('../../schema/UserLeave');
const editedMessageLogs = require('../../schema/EditedMessageLogs');
const deletedMessageLogs = require('../../schema/DeletedMessageLogs');
const updateModal = require('../../schema/MemberRoleUpdates');
const roles = require('../../schema/Roles');

module.exports = {
    name: 'setup',
    description: 'Setzt die Kanäle für bestimmte Aktionen!',
    type: ApplicationCommandType.ChatInput,
    userPerms: ['ManageGuild'],
    botPerms: [],
    options: [
        {
            name: 'moderation',
            description: 'Setzt den Moderations-Kanal',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'kanal',
                description: 'Der Kanal',
                type: ApplicationCommandOptionType.Channel,
                required: true
            }]
        },
        {
            name: 'willkommen',
            description: 'Setzt den Willkommen-Kanal',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'kanal',
                description: 'Der Kanal',
                type: ApplicationCommandOptionType.Channel,
                required: true
            }]
        },
        {
            name: 'verlassen',
            description: 'Setzt den Verlassen-Kanal',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'kanal',
                description: 'Der Kanal',
                type: ApplicationCommandOptionType.Channel,
                required: true
            }]
        },
        {
            name: 'nachrichten-editierungen',
            description: 'Setzt den Nachrichten-Editierungs Kanal',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'kanal',
                description: 'Der Kanal',
                type: ApplicationCommandOptionType.Channel,
                required: true
            }]
        },
        {
            name: 'nachrichten-löschungen',
            description: 'Setzt den Nachrichten-Löschungs Kanal',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'kanal',
                description: 'Der Kanal',
                type: ApplicationCommandOptionType.Channel,
                required: true
            }]
        },
        {
            name: 'user-updates',
            description: 'Setzt den Nutzer-Aktualisierungs-Kanal',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'kanal',
                description: 'Der Kanal',
                type: ApplicationCommandOptionType.Channel,
                required: true
            }]
        },
        {
            name: 'role-updates',
            description: 'Setzt den Rollen-Aktualisierungs-Kanal',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'kanal',
                description: 'Der Kanal',
                type: ApplicationCommandOptionType.Channel,
                required: true
            }]
        }
    ],
    run: async (client, interaction) => {
        try {
            switch (interaction.options._subcommand) {
                case 'moderation':
                    var channel = interaction.options.getChannel('kanal');
                    if (!channel) {
                        var noChannelEmbed = new EmbedBuilder()
                            .setColor('Random')
                            .setTitle('Kein Kanal!')
                            .setDescription('Bitte geben Sie einen existierenden Kanal an!')
                            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                            .setTimestamp()
                        return await interaction.reply({ embeds: [noChannelEmbed], ephemeral: true, fetchReply: true })
                    }
                    var data = await modChannelModal.findOne({
                        GuildID: interaction.guild.id,
                    });
                    if (!data) {
                        data = new modChannelModal({
                            GuildID: interaction.guild.id,
                            ChannelID: channel.id,
                        });
                        data.save();
                        return await interaction.reply({ content: 'Der neue Moderations-Log Kanal ist nun <#' + channel.id + '>', ephemeral: true, fetchReply: true });
                    } else {
                        await modChannelModal.deleteOne({
                            GuildID: interaction.guild.id,
                        });
                        var newData = new modChannelModal({
                            GuildID: interaction.guild.id,
                            ChannelID: channel.id
                        });
                        newData.save();
                        await interaction.reply({ content: 'Der neue Moderations-Log Kanal ist nun <#' + channel.id + '>', ephemeral: true, fetchReply: true });
                    }
                    break;
                case 'willkommen':
                    channel = interaction.options.getChannel('kanal');
                    if (!channel) {
                        noChannelEmbed = new EmbedBuilder()
                            .setColor('Random')
                            .setTitle('Kein Kanal!')
                            .setDescription('Bitte geben Sie einen existierenden Kanal an!')
                            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                            .setTimestamp()
                        return await interaction.reply({ embeds: [noChannelEmbed], ephemeral: true, fetchReply: true })
                    }
                    data = await channelModal.findOne({
                        GuildID: interaction.guild.id,
                    });
                    if (!data) {
                        data = new channelModal({
                            GuildID: interaction.guild.id,
                            ChannelID: channel.id,
                        });
                        data.save();
                        return await interaction.reply({ content: 'Der neue Willkommens-Log Kanal ist nun <#' + channel.id + '>', ephemeral: true, fetchReply: true });
                    } else {
                        await channelModal.deleteOne({
                            GuildID: interaction.guild.id,
                        });
                        newData = new channelModal({
                            GuildID: interaction.guild.id,
                            ChannelID: channel.id
                        });
                        newData.save();
                        await interaction.reply({ content: 'Der neue Willkommens-Log Kanal ist nun <#' + channel.id + '>', ephemeral: true, fetchReply: true });
                    }
                    break;
                case 'verlassen':
                    channel = interaction.options.getChannel('kanal');
                    if (!channel) {
                        noChannelEmbed = new EmbedBuilder()
                            .setColor('Random')
                            .setTitle('Kein Kanal!')
                            .setDescription('Bitte geben Sie einen existierenden Kanal an!')
                            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                            .setTimestamp()
                        return await interaction.reply({ embeds: [noChannelEmbed], ephemeral: true, fetchReply: true })
                    }
                    data = await userLeaveSchema.findOne({
                        GuildID: interaction.guild.id,
                    });
                    if (!data) {
                        data = new userLeaveSchema({
                            GuildID: interaction.guild.id,
                            ChannelID: channel.id,
                        });
                        data.save();
                        return await interaction.reply({ content: 'Der neue Verlassen-Log Kanal ist nun <#' + channel.id + '>', ephemeral: true, fetchReply: true });
                    } else {
                        await userLeaveSchema.deleteOne({
                            GuildID: interaction.guild.id,
                        });
                        newData = new userLeaveSchema({
                            GuildID: interaction.guild.id,
                            ChannelID: channel.id
                        });
                        newData.save();
                        await interaction.reply({ content: 'Der neue Verlassen-Log Kanal ist nun <#' + channel.id + '>', ephemeral: true, fetchReply: true });
                    }
                    break;
                case 'nachrichten-editierungen':
                    channel = interaction.options.getChannel('kanal');
                    if (!channel) {
                        noChannelEmbed = new EmbedBuilder()
                            .setColor('Random')
                            .setTitle('Kein Kanal!')
                            .setDescription('Bitte geben Sie einen existierenden Kanal an!')
                            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                            .setTimestamp()
                        return await interaction.reply({ embeds: [noChannelEmbed], ephemeral: true, fetchReply: true })
                    }
                    data = await editedMessageLogs.findOne({
                        GuildID: interaction.guild.id,
                    });
                    if (!data) {
                        data = new editedMessageLogs({
                            GuildID: interaction.guild.id,
                            ChannelID: channel.id,
                        });
                        data.save();
                        return await interaction.reply({ content: 'Der Nachrichten-Editierungs-Kanal wurde zu <#' + channel + '> gesetzt!', ephemeral: true, fetchReply: true });
                    } else {
                        await editedMessageLogs.deleteOne({
                            GuildID: interaction.guild.id,
                        });
                        newData = new editedMessageLogs({
                            GuildID: interaction.guild.id,
                            ChannelID: channel.id
                        });
                        newData.save();
                        await interaction.reply({ content: 'Der Nachrichten-Editierungs-Kanal wurde zu <#' + channel + '> gesetzt!', ephemeral: true, fetchReply: true });
                    }
                    break;
                case 'nachrichten-löschungen':
                    channel = interaction.options.getChannel('kanal');
                    if (!channel) {
                        noChannelEmbed = new EmbedBuilder()
                            .setColor('Random')
                            .setTitle('Kein Kanal!')
                            .setDescription('Bitte geben Sie einen gültigen Kanal an!')
                            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                            .setTimestamp()
                        return await interaction.reply({ embeds: [noChannelEmbed], ephemeral: true, fetchReply: true })
                    }
                    data = await deletedMessageLogs.findOne({
                        GuildID: interaction.guild.id,
                    });
                    if (!data) {
                        data = new deletedMessageLogs({
                            GuildID: interaction.guild.id,
                            ChannelID: channel.id,
                        });
                        data.save();
                        return await interaction.reply({ content: 'Der Nachrichten-Löschung-Kanal wurde zu <#' + channel + '> gesetzt!', ephemeral: true, fetchReply: true });
                    } else {
                        await deletedMessageLogs.deleteOne({
                            GuildID: interaction.guild.id,
                        });
                        newData = new deletedMessageLogs({
                            GuildID: interaction.guild.id,
                            ChannelID: channel.id
                        });
                        newData.save();
                        await interaction.reply({ content: 'Der Nachrichten-Löschung-Kanal wurde zu <#' + channel + '> gesetzt!', ephemeral: true, fetchReply: true });
                    }
                    break;
                case 'user-updates':
                    channel = interaction.options.getChannel('kanal');
                    if (!channel) {
                        let noChannelEmbed = new EmbedBuilder()
                            .setColor('Random')
                            .setTitle('Kein Kanal!')
                            .setDescription('Bitte geben Sie einen gültigen Kanal an!')
                            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: `${interaction.author.displayAvatarURL({ dynamic: true })}` })
                            .setTimestamp()
                        return await interaction.reply({ embeds: [noChannelEmbed] })
                    }
                    data = await updateModal.findOne({
                        GuildID: interaction.guild.id,
                    });
                    if (!data) {
                        data = new updateModal({
                            GuildID: interaction.guild.id,
                            ChannelID: channel.id,
                        });
                        data.save();
                        interaction.reply('Der neue Nutzer-Update-Log Kanal ist nun <#' + channel.id + '>');
                    } else {
                        await updateModal.deleteOne({
                            GuildID: interaction.guild.id,
                        });
                        let newData = new updateModal({
                            GuildID: interaction.guild.id,
                            ChannelID: channel.id
                        });
                        newData.save();
                        interaction.reply('Der neue Nutzer-Update-Log Kanal ist nun <#' + channel.id + '>');
                    }
                    break;
                case 'role-updates':
                    let channel = interaction.options.getChannel('kanal');
                    if (!channel) {
                        let noChannelEmbed = new EmbedBuilder()
                            .setColor('Random')
                            .setTitle('Kein Kanal!')
                            .setDescription('Bitte geben Sie einen gültigen Kanal an!')
                            .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                            .setTimestamp()
                        return await interaction.reply({ embeds: [noChannelEmbed], ephemeral: true, fetchReply: true })
                    }
                    data = await roles.findOne({
                        GuildID: interaction.guild.id,
                    });
                    if (!data) {
                        data = new roles({
                            GuildID: interaction.guild.id,
                            ChannelID: channel.id,
                        });
                        data.save();
                        return await interaction.reply({ content: 'Der neue Rollen-Log Kanal ist nun <#' + channel.id + '>', ephemeral: true, fetchReply: true });
                    } else {
                        await roles.deleteOne({
                            GuildID: interaction.guild.id,
                        });
                        let newData = new roles({
                            GuildID: interaction.guild.id,
                            ChannelID: channel.id
                        });
                        newData.save();
                        return await interaction.reply({ content: 'Der neue Rollen-Log Kanal ist nun <#' + channel.id + '>', ephemeral: true, fetchReply: true });
                    }
                default:
                    return;
            }
        } catch (err) {
            console.log(err);
        }
    }
};
