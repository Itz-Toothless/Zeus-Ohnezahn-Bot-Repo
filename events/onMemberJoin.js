const { EmbedBuilder } = require('discord.js');
const channelModal = require('../schema/ChannelModal');
const client = require('../index')

client.on('guildMemberAdd', async (member) => {
    const data = await channelModal.findOne({
        GuildID: member.guild.id,
    });

    let channel = client.channels.cache.get(data.ChannelID);

    let WelcomeEmbed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Willkommen!')
        .setDescription(`${member.user.tag} ist dem Server beigetreten!\nMitglieder insgesamt: ${member.guild.memberCount}`)
        .setTimestamp();
    return channel.send({ embeds: [WelcomeEmbed] })
});
