const Discord = require('discord.js')

module.exports = {
    name: 'howgay',
    description: 'Gibt einen Prozentsatz aus wie schwul jemand ist (Dient nur zum Spaß ;))',
    aliases: ['hg'],
    usage: "w&p!howgay (optional: Member)",
    run: async (client, message, args) => {
        try{
            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if(!member) {
                let fetching = await client.users.fetch(args[0]);
                if (!fetching) {
                        let member = message.member;
                    }
                let embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setThumbnail(fetching.displayAvatarURL({dynamic: true}))
                    .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true})})
                    .setDescription(`🏳️‍🌈 ${fetching.tag} ist ${Math.floor(Math.random() * 100)}% Schwul 🏳️‍🌈`)
                    .setFooter({text: `${Date.now() - message.createdTimestamp} ms`, iconURL: message.member.displayAvatarURL({dynamic: true})})
                    .setTimestamp()
                    return message.channel.send({embeds: [embed]})
            }
            let embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
            	.setThumbnail(member.user.displayAvatarURL({dynamic: true}))
                .setAuthor({name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL({dynamic: true})})
                .setDescription(`🏳️‍🌈 ${member.user.tag} ist ${Math.floor(Math.random() * 100)}% Schwul 🏳️‍🌈`)
                .setFooter({text: `${Date.now() - message.createdTimestamp} ms`, iconURL: message.member.displayAvatarURL({dynamic: true})})
                .setTimestamp()
                return message.channel.send({embeds: [embed]})
        } catch(err) {
            console.log(err);
            return;
        }
    }
};
