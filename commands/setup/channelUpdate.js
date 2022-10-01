const channelModal = require('../../schema/ChannelModal');

module.exports = {
    name: 'set-channel-channel',
    aliases: ['scc', 'set-channel-c'],
    description: 'Legt den Kanal-Aktualisierungs-Kanal fest',
    usage: 'z&o!set-channel-channel <#channel / channel-id>',
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
                let channelData = await channelModal.findOne({
                    GuildID: message.guild.id,
                });
                if (!channelData) {
                    channelData = new channelModal({
                        GuildID: message.guild.id,
                        ChannelID: channel.id,
                    });
                    channelData.save();
                    message.channel.send('Der neue Kanal-Update-Log findet nun in ' + channel + ' statt');
                } else {
                    await channelModal.deleteOne({
                        GuildID: message.guild.id,
                    });
                    let newData = new channelModal({
                        GuildID: message.guild.id,
                        ChannelID: channel.id
                    });
                    newData.save();
                    message.channel.send('Der neue Kanal-Update-Log findet nun in ' + channel + ' statt');
                }
            });

        } catch (err) {
            console.log(err);
        }
    }
};
