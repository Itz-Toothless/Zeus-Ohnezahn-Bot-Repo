const fs = require('fs');

module.exports = {
    name: 'reload',
    description: 'Reloads a command',
    usage: 'z&o!reload <Kommando>',
    userPerms: [],
    botPerms: [],
    run: async (client, message, args) => {
        if (!message.author.id === '705557092802625576') {
            return message.reply({ content: 'Dieses Kommando ist nur für den Entwickler ' + client.users.cache.get('705557092802625576').tag + ' bestimmt!', allowedMentions: { repliedUser: false  }})
        }
        if (!args[0]) {
            return message.reply({ content: 'Bitte gebe ein Kommando an' });
        }
        const commandName = args[0].toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) {
            return message.reply('Bitte gebe ein Kommando an, welcher existent ist!');
        }

        const commandFolders = fs.readdirSync('./commands');
        const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));

        delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

        try {
            const newCommand = require(`../${folderName}/${command.name}.js`);
            client.commands.set(newCommand.name, newCommand);
            return message.reply({ content: `Das Kommando \`${newCommand.name}\` wurde neu geladen!`, allowedMentions: { repliedUser: false  } });
        } catch (error) {
            console.error(error);
            return message.channel.send(`Ein Fehler ist beim Versuch, \`${command.name}\` neu zu laden, aufgetreten:\n\`${error.message}\``);
        }
    },
};
