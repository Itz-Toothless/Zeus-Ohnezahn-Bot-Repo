const Buffer = require('buffer').Buffer;
module.exports = {
    name: 'banlist',
    description: 'Zeigt die Ban-Liste des Servers',
    aliases: ['ban-list'],
    usage: '/banlist',
    userPerms: ['BanMembers'],
    botPerms: ['BanMembers'],
    run: async (client, interaction) => {
        try {
            async function getBanList(guild) {
                let banArray = [];
               const banList = await guild.bans.fetch();
               if (!banList) return interaction.channel.send('Bisher sind keine Nutzer gebannt!')
            banList.forEach((ban) => {
                banArray.push(`${ban.user.tag} - (Grund: ${ban.reason}) - (ID: ${ban.user.id})`);
            });
        let banFileArray = banArray.sort().join('\n');
        let file = Buffer.from(banFileArray);
        return interaction.reply({ content: 'Hier ist die aktuelle Ban-Liste!\nErstellt am: <t:' + Math.round(parseInt(interaction.createdTimestamp) / 1000) + ':f>', files: [{ attachment: file, name: `Ban-Liste.txt` }], ephemeral: true });
              }
        // The response is ephemeral for the sake of preventing channel flodding
            getBanList(interaction.guild);
        } catch(err) {
            console.log(err);
        }
    }
}
