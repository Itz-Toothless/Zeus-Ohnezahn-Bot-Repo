const { EmbedBuilder } = require('discord.js');
const modModal = require('../schema/ModModal');
const client = require('../index')

client.on('guildBanRemove', async (ban) => {
    const data = await modModal.findOne({
        GuildID: ban.guild.id,
    });

    let channel = client.channels.cache.get(data.ChannelID);

    let UnBanEmbed = new EmbedBuilder()
        .setColor('#FF2200')
        .setTitle('Nutzer entbannt!')
        .setDescription(`${ban.user.tag} wurde aus dem Server entbannt!`)
        .setTimestamp();
    return channel.send({ embeds: [UnBanEmbed] });
});
