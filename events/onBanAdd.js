const { EmbedBuilder } = require('discord.js');
const modModal = require('../schema/ModModal');
const client = require('../index')

client.on('guildBanAdd', async (ban) => {
    const data = await modModal.findOne({
        GuildID: ban.guild.id,
    });

    let channel = client.channels.cache.get(data.ChannelID);

    let BanEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Nutzer gebannt!')
        .setDescription(`${ban.user.tag} wurde aus dem Server verbannt!\nGrund: ${ban.reason ? ban.reason : 'Es wurde kein Grund gefunden!'}`)
        .setTimestamp();
    return channel.send({ embeds: [BanEmbed] })
});
