const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'ping',
    description: "Gibt die jetzige Latenz des Bots aus",
    usage: 'w&p!ping',
    cooldown: 3000,
    userPerms: [],
    botPerms: [],
    run: async (client, message, args) => {
        try {
            const msg = await message.reply({ content: 'Pinging...' })
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                .setTitle('Ping')
                .setDescription(`🏓 Pong! Latenz beträgt: **${Math.round(client.ws.ping)} ms**`)
                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag })
            	.setTimestamp()
            await msg.edit({ content: '', embeds: [embed] });
        } catch (err) {
            console.log(err);
        }
    }
};
