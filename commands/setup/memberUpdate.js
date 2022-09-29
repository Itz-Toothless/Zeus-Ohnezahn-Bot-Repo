const updateModal = require('../../schema/MemberRoleUpdates');

module.exports = {
    name: 'set-member-channel',
    aliases: ['set-member-c'],
    description: 'Legt den Mitglieder-Aktualisierungs-Kanal fest',
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
            let data = await updateModal.findOne({
                GuildID: message.guild.id,
            });
            if (!data) {
                data = new updateModal({
                    GuildID: message.guild.id,
                    ChannelID: channel.id,
                });
                data.save();
                message.channel.send('Der neue Mitglieder-Update-Log Kanal ist nun <#' + channel.id + '>');
            } else {
                await updateModal.deleteOne({
                    GuildID: message.guild.id,
                });
                let newData = new updateModal({
                    GuildID: message.guild.id,
                    ChannelID: channel.id
                });
                newData.save();
                message.channel.send('Der neue Mitglieder-Update-Log Kanal ist nun <#' + channel.id + '>');
            }
        } catch (err) {
            console.log(err);
        }
    }
};
