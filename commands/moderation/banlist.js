const Buffer = require('buffer').Buffer;
module.exports = {
    name: 'banlist',
    description: 'Zeigt die Ban-Liste des Servers',
    aliases: ['ban-list'],
    usage: 'z&o!banlist <Anzahl>',
    userPerms: ['BanMembers'],
    botPerms: ['BanMembers'],
    run: async (client, message, args) => {
        try {
            async function getBanList(guild) {
                let banArray = [];
               const banList = await guild.bans.fetch();
               if (!banList) return message.channel.send('Bisher sind keine Nutzer gebannt!')
            banList.forEach((ban) => {
                banArray.push(`${ban.user.tag} - (Grund: ${ban.reason}) - (ID: ${ban.user.id})`);
            });
        let banFileArray = banArray.sort().join('\n');
        let file = Buffer.from(banFileArray);
        return message.reply({ content: 'Hier ist die aktuelle Ban-Liste!\nErstellt am: <t:' + Math.round(parseInt(message.createdTimestamp) / 1000) + ':f>', files: [{ attachment: file, name: `Ban-Liste.txt` }] });
              }
            getBanList(message.guild);
        } catch(err) {
            console.log(err);
        }
    }
}
