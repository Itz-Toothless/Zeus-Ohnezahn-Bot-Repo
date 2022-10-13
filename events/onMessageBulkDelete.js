const client = require('..');
const deletedMessageLogs = require('../schema/DeletedMessageLogs');
const Buffer = require('buffer').Buffer;
client.on('messageDeleteBulk', async (messages, channel) => {
    try {
        let guildId = messages.map(message => message.guildId);
        let theMessages = messages.map(message => message);
        let channelid = messages.map(message => message.channelId);
        if (theMessages.partial) {
            return;
        };
        const data = await deletedMessageLogs.findOne({
            GuildID: guildId,
        });
        if (!data) return;
        let chan = client.channels.cache.get(data.ChannelID);
        let messageArray = [];
        messages.forEach((message) => {
            if (!message.author.bot) return messageArray.push(`\n${message.content}\n${message.author.tag} | ${message.createdAt.toLocaleString('de-DE')}`);
        });
        messageArray = messageArray.join("\n");
        messageArray = messageArray.split("\n").reverse().join("\n");
        let file = Buffer.from(messageArray);
        chan.send({ content: `${messages.size} Nachrichten wurden in ${channel} gelöscht`, files: [{ attachment: file, name: `${channel.name}.txt` }] });
    } catch (err) {
        console.log(err);
    }
});
