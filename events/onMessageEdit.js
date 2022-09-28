const { EmbedBuilder } = require('discord.js');
const client = require('..');
const editedMessageLogs = require('../schema/EditedMessageLogs')

client.on('messageUpdate', async (oldMessage, newMessage) => {
    try {
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
            const Original = oldMessage.content ? oldMessage.content : 'None'
            const Edited = newMessage.content ? newMessage.content : 'None'
            if (Original.partial) {
                return;
            } else if (newMessage.attachments.size >= 1) {
                const logEmbedWithAttachments = new EmbedBuilder()
                    .setAuthor({ name: `${newMessage.author.tag}`, iconURL: `${newMessage.author.displayAvatarURL({ dynamic: true })}` })
                    .setColor('Random')
                    .setDescription(`Eine Nachricht wurde von ${newMessage.author} editiert!\nKanal: ${newMessage.channel}\n
                **Original:** ${Original}

                **Editiert zu:** ${Edited}`)
                    .addFields({ name: `${newMessage.attachments.size >= 1 ? 'Anhang' : 'Anhänge'} `, value: `${arr.join('\n')} ` })
                    .setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${newMessage.author.displayAvatarURL({ dynamic: true })} ` })
                    .setTimestamp();
                return await channel.send({ embeds: [logEmbedWithAttachments] });
            } else {
                const logEmbedWithoutAttachments = new EmbedBuilder()
                    .setAuthor({ name: `${newMessage.author.tag}`, iconURL: `${newMessage.author.displayAvatarURL({ dynamic: true })}` })
                    .setColor('Random')
                    .setDescription(`Eine Nachricht wurde von ${newMessage.author} editiert!\nKanal: ${newMessage.channel}\n
                    **Original:** ${Original}
    
                    **Editiert zu:** ${Edited}`)
                    .setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${newMessage.author.displayAvatarURL({ dynamic: true })} ` })
                    .setTimestamp();
                return await channel.send({ embeds: [logEmbedWithoutAttachments] });
            }
        }
    } catch (err) {
        console.log(err);
    }
});
