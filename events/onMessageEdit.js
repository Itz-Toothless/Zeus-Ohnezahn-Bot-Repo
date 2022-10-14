const { EmbedBuilder } = require('discord.js');
const client = require('..');
const editedMessageLogs = require('../schema/EditedMessageLogs')

client.on('messageUpdate', async (oldMessage, newMessage) => {
    try {
        if (oldMessage.partial) {
            return;
        }
        const data = await editedMessageLogs.findOne({
            GuildID: newMessage.guild.id,
        });
        if (!data) return;
        let channel = client.channels.cache.get(data.ChannelID);
        if (oldMessage.content === newMessage.content) return;
        if (!newMessage.author.bot) {
            let arr = [];
            let AttachmentCount = 0;
            if (newMessage.attachments.size >= 1) {
                try {
                    newMessage.attachments.forEach((attachments) => {
                        AttachmentCount += 1;
                        arr.push(`[Anhang ${AttachmentCount}](${attachments.url})`);
                    });
                } catch (err) {
                    console.log(err);
                }
            }
            let Original, Edited;
            if (oldMessage.content.length > 1024) {
                Original = oldMessage.content;
            } else {
                Original = oldMessage.content.substring(oldMessage.content.length - 1020) + '...';
            }
            if (newMessage.content.length < 1024) {
                Edited = newMessage.content;
            } else {
                Edited = newMessage.content.substring(newMessage.content.length - 1020) + '...';
            }
            if (newMessage.attachments.size >= 1) {
                const logEmbedWithAttachments = new EmbedBuilder()
                    .setAuthor({ name: 'Nachricht editiert', iconURL: 'https://media.discordapp.net/attachments/506838906872922145/603643138854354944/messageupdate.png' })
                    .setColor('Random')
                    .setDescription(`**User:** ${newMessage.author}\n**Kanal:** ${newMessage.channel} \`[#${newMessage.channel.name}]\``)
                    .addFields({ name: 'Bevor:', value: `${Original}`, inline: false }, 
                               { name: 'Jetzt:', value: `${Edited}`, inline: false },
                               { name: `${newMessage.attachments.size >= 1 ? 'Anhang' : 'Anhänge'} `, value: `${arr.join('\n')} ` })
                    .setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${newMessage.author.displayAvatarURL({ dynamic: true })} ` })
                    .setTimestamp();
                return await channel.send({ embeds: [logEmbedWithAttachments] });
            } else {
                const logEmbedWithoutAttachments = new EmbedBuilder()
                    .setAuthor({ name: 'Nachricht editiert', iconURL: 'https://media.discordapp.net/attachments/506838906872922145/603643138854354944/messageupdate.png' })
                    .setColor('Random')
                    .setDescription(`**User:** ${newMessage.author}\n**Kanal:** ${newMessage.channel} \`[#${newMessage.channel.name}]\``)
                    .addFields({ name: 'Bevor:', value: `${Original}`, inline: false }, 
                               { name: 'Jetzt:', value: `${Edited}`, inline: false })
                    .setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${newMessage.author.displayAvatarURL({ dynamic: true })} ` })
                    .setTimestamp();
                return await channel.send({ embeds: [logEmbedWithoutAttachments] });
            }
        }
    } catch (err) {
        console.log(err);
    }
});
