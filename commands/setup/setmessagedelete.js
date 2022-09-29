const deletedMessageLogs = require('../../schema/DeletedMessageLogs');

module.exports = {
    name: 'set-delete-channel',
    aliases: ['sdc', 'set-delete-c'],
    description: 'Legt den Nachricht-Löschung-Kanal fest',
    usage: 'z&o!set-delete-channel <#channel / channel-id>',
    userPerms: ['ManageGuild'],
    botPerms: [],
    run: async (client, message, args) => {
        try {
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
            if (!channel) {
                let noChannelEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('Kein Kanal!')
                    .setDescription('Bitte geben Sie einen gültigen Kanal an!')
                    .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                    .setTimestamp()
                return await message.channel.send({ embeds: [noChannelEmbed] })
            }
            let data = await deletedMessageLogs.findOne({
                GuildID: message.guild.id,
            });
            if (!data) {
                data = new deletedMessageLogs({
                    GuildID: message.guild.id,
                    ChannelID: channel.id,
                });
                data.save();
                return message.channel.send('Nachricht-Löschung-Kanal wurde zu <#' + channel + '> gesetzt!');
            } else {
                await deletedMessageLogs.deleteOne({
                    GuildID: message.guild.id,
                });
                let newData = new deletedMessageLogs({
                    GuildID: message.guild.id,
                    ChannelID: channel.id
                });
                newData.save();
                return message.channel.send('Nachricht-Löschung-Kanal wurde zu <#' + channel + '> gesetzt!');
            }
        } catch (err) {
            console.log(err);
        }
    }
};
