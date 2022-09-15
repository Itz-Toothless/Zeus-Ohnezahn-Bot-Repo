const { EmbedBuilder } = require("discord.js");
const process = require("process");
const { loadavg } = require('os');

module.exports = {
    name: 'about',
    description: "Zeigt Informationen über den Bot",
    usage: 'w&p!about',
    cooldown: 3000,
    userPerms: [],
    botPerms: [],
    run: async (client, interaction) => {
        try {
            let uptime = Math.round(parseInt(client.readyTimestamp) / 1000) - 54;
            let created = Math.round(parseInt(client.user.createdTimestamp) / 1000);
            let up = `${process.platform.charAt(0).toUpperCase() + process.platform.slice(1)}`
            let embed = new EmbedBuilder()
                .setColor("Blue")
                .setTimestamp()
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(client.user.username)
                .setFooter({ text: 'Programmiert von ' + client.users.cache.get('705557092802625576').tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`
				> **Entwickler:** <@705557092802625576>
                > **Server: \`${client.guilds.cache.size}\`**
                > **Nutzer: \`${Math.ceil(client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString("tr-TR"))}\`**
                > **Kanäle: \`${client.channels.cache.size}\`**
                > **Nachrichten Kommandos: \`${client.commands.size - 1}\`**
                > **Slash Kommandos: \`${client.slashCommands.size}\`**
                > **Onlinezeit: <t:${uptime}:R>**
                > **Erstellt: <t:${created}:F>**
                > **Node.js Version: \`${process.version}\`**
                > **Discord.js: \`v${require('discord.js').version}\`**
                > **Betriebssystem des Servers: \`${up}\`**
                > **CPU: \`${loadavg()[0]}%\`**
                > **RAM: \`${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB\`**
                Lade mich mit [**diesem**](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=1084516334400) Link auf deinem Server ein
            `)
            return interaction.reply({ embeds: [embed] })
        } catch (e) {
            console.log(e)
        }
    }
};
