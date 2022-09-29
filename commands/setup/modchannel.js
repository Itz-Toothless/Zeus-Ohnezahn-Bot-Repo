const modChannelModal = require('../../schema/ModModal');

module.exports = {
    name: 'set-mod-channel',
    aliases: ['smc', 'set-moderation-c'],
    description: 'Legt den Moderations-Kanal fest',
    usage: 'z&o!set-mod-channel <#channel / channel-id>',
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
            let data = await modChannelModal.findOne({
                GuildID: message.guild.id,
            });
            if (!data) {
                data = new modChannelModal({
                    GuildID: message.guild.id,
                    ChannelID: channel.id,
                });
                data.save();
                message.channel.send('Der neue Moderations-Log Kanal ist nun <#' + channel.id + '>');
            } else {
                await modChannelModal.deleteOne({
                    GuildID: message.guild.id,
                });
                let newData = new modChannelModal({
                    GuildID: message.guild.id,
                    ChannelID: channel.id
                });
                newData.save();
                message.channel.send('Der neue Moderations-Log Kanal ist nun <#' + channel.id + '>');
            }
        } catch (err) {
            console.log(err);
        }
    }
};
