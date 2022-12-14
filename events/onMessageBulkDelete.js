const client = require('..');
const deletedMessageLogs = require('../schema/DeletedMessageLogs');
const Buffer = require('buffer').Buffer;
client.on('messageDeleteBulk', async (messages, channel) => {
    try {
        if (messages.partial) {
            return;
        };
        let guildId = messages.map(message => message.guildId);
        let theMessages = messages.map(message => message);
        
        const data = await deletedMessageLogs.findOne({
            GuildID: guildId,
        });
        if (!data) return;
        let chan = client.channels.cache.get(data.ChannelID);
        let messageArray = [];
        messages.forEach((message) => {
            if (!message.author.bot) return messageArray.push(`\n${message.content}\n${message.author.tag} (User ID: ${message.author.id} - Nachrichten-ID: ${message.id}) | ${message.createdAt.toLocaleString('de-DE')}`);
        });
        messageArray = messageArray.join("\n").split("\n").reverse().join("\n");
        let file = Buffer.from(messageArray);
        chan.send({ content: `${messages.size} Nachrichten wurden in ${channel} gelöscht`, files: [{ attachment: file, name: `${channel.name}.txt` }] });
    } catch (err) {
        console.log(err);
    }
});
