const fs = require('fs');

module.exports = {
    name: 'reload',
    description: 'Reloads a command',
    usage: 'z&o!reload <Kommando>',
    userPerms: [],
    botPerms: [],
    run: async (client, message, args) => {
        if (!message.author.id === '705557092802625576') {
            return message.channel.send({ content: 'Dieses Kommando ist nur für den Entwickler ' + client.users.cache.get('705557092802625576').tag + ' bestimmt!' })
        }
        const commandName = args[0].toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return message.channel.send(`There is no command with name or alias \`${commandName ? commandName : 'None'}\`, ${message.author}!`);
        }

        const commandFolders = fs.readdirSync('./commands');
        const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));

        delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

        try {
            const newCommand = require(`../${folderName}/${command.name}.js`);
            client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Command \`${newCommand.name}\` was reloaded!`);
        } catch (error) {
            console.error(error);
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }
    },
};
