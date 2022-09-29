const userLeaveSchema = require('../../schema/UserLeave');

module.exports = {
    name: 'set-leave-channel',
    aliases: ['slc', 'set-leave-c'],
    description: 'Legt den Verlassen-Kanal fest',
    usage: 'z&o!set-leave-channel <#channel / channel-id>',
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
            let data = await userLeaveSchema.findOne({
                GuildID: message.guild.id,
            });
            if (!data) {
                data = new userLeaveSchema({
                    GuildID: message.guild.id,
                    ChannelID: channel.id,
                });
                data.save();
                message.channel.send('Nachrichten-Kanal wurde zu <#' + channel + '> gesetzt!');
            } else {
                await userLeaveSchema.deleteOne({
                    GuildID: message.guild.id,
                });
                let newData = new userLeaveSchema({
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
