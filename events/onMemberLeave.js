const { EmbedBuilder } = require('discord.js');
const userLeaveSchema = require('../schema/UserLeave');
const client = require('../index')

client.on('guildMemberRemove', async (member) => {
    const data = await userLeaveSchema.findOne({
        GuildID: member.guild.id,
    });

    let channel = client.channels.cache.get(data.ChannelID);

    let LeaveEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Auf wiedersehen!')
        .setDescription(`${member.user.tag} hat den Server verlassen!\nMitglieder insgesamt: ${member.guild.memberCount}`)
        .setTimestamp();
    return await channel.send({ embeds: [LeaveEmbed] })
});
