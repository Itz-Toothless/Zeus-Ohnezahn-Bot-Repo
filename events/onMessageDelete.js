const { EmbedBuilder } = require('discord.js');
const client = require('..');
const deletedMessageLogs = require('../schema/DeletedMessageLogs');

client.on('messageDelete', async (message) => {
    try {
        const data = await deletedMessageLogs.findOne({
            GuildID: message.guild.id,
        });
        if (!data) return;
        let channel = client.channels.cache.get(data.ChannelID);
        let deletedMessage = message.content ? message.content : 'Der Nachrichten-Inhalt konnte nicht gefunden werden!';
        if (!message?.author?.bot || !message?.channel?.type === "dm") {
            let arr = [];
            let AttachmentCount = 0;
            if (message?.attachments?.size >= 1) {
                try {
                    message?.attachments?.forEach((attachments) => {
                        AttachmentCount += 1;
                        arr.push(`[Anhang ${AttachmentCount}](${attachments?.url})`);
                    });
                } catch (err) {
                    console.log(err);
                }
            }
            if (message.attachments.size >= 1) {
                const logEmbedWithAttachments = new EmbedBuilder()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                    .setColor('Random')
                    .setDescription(`Eine Nachricht wurde von ${message.author} gelöscht!\nKanal: ${message.channel}\n**Inhalt:** ${deletedMessage}`)
                    .addFields({ name: `${message.attachments.size >= 1 ? 'Anhang' : 'Anhänge'} `, value: `${arr.join('\n')} ` })
                    .setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${message.author.displayAvatarURL({ dynamic: true })} ` })
                    .setTimestamp();
                return await channel.send({ embeds: [logEmbedWithAttachments] });
            } else if (message.partial) {
                return;
            } else {
                const logEmbedWithOutAttachments = new EmbedBuilder()
                    .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
                    .setColor('Random')
                    .setDescription(`Eine Nachricht wurde von ${message.author} gelöscht!\nKanal: ${message.channel}\n**Inhalt:** ${deletedMessage}`)
                    .setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${message.author.displayAvatarURL({ dynamic: true })} ` })
                    .setTimestamp();
                return await channel.send({ embeds: [logEmbedWithOutAttachments] });
            }
        }
    } catch (err) {
        console.log(err);
    }
});
