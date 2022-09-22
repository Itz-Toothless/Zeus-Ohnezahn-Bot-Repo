const modModal = require('../../schema/ModModal');

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
                channel = message.channel.id
            }
            let data = await modModal.findOne({
                GuildID: message.guild.id,
            });
            if (!data) {
                data = new modModal({
                    GuildID: message.guild.id,
                    ChannelID: channel.id,
                });
                data.save();
                message.channel.send('Fertig!');
            } else {
                await modModal.deleteOne({
                    GuildID: message.guild.id,
                });
                let newData = new modModal({
                    GuildID: message.guild.id,
                    ChannelID: channel.id
                });
                newData.save();
                message.channel.send('Fertig!');
            }
        } catch (err) {
            console.log(err);
        }
    }
};