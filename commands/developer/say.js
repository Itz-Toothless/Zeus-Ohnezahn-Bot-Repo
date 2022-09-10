module.exports = {
    name: "say",
    aliases: ["botsay", "s"],
    description: "(Dev only) Returns a Message",
    run: async (client, message, args) => {
        try {
            if (message.author.id !== '705557092802625576') {
                message.channel.send('Dieses Kommando ist nur für den Entwickler ' + client.users.cache.get('705557092802625576').tag + ' bestimmt!');
                return;
            }
            let sayMessage = args.join(" ");
            message.delete();
            await message.channel.sendTyping();
            await message.channel.send(sayMessage);
        } catch (error) {
            console.log(error);
        }
    }
};
