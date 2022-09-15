const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    name: 'ping',
    description: "Gibt die jetzige Latenz des Bots aus",
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    run: async (client, interaction) => {
        try{
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setAuthor({ name: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
                .setTitle('Ping')
                .setDescription(`🏓 Pong! Latenz beträgt: **${Math.round(client.ws.ping)} ms**`)
            	.setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag })
            	.setTimestamp()
            await interaction.deferReply({ ephemeral: true });
            await wait(500);
            await interaction.followUp({ embeds: [embed], ephemeral: true });
        } catch(err) {
            console.log(err)
        }
    }
};
