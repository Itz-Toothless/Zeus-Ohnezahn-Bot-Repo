const Discord = require('discord.js');

module.exports = {
    name: 'dice',
    description: 'Rolle einen Würfel!',
    usage: 'z&o!dice',
    userPerms: [],
    botPerms: [],
    run: async (client, msg, args) => {
        try {
            const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
            const rollDice = () => getRandomNumber(1, 6);
            const player1Score = rollDice();
            const player2Score = rollDice();
            let result;
            if (player1Score > player2Score) {
                result = `Du hast eine ${player1Score} gewürfelt und hast die Runde gewonnen!\nIch habe eine ${player2Score} gewürfelt`;
            } else if (player2Score > player1Score) {
                result = `Ich habe eine ${player2Score} gewürfelt und habe die Runde gewonnen!\nDu hast eine ${player1Score} gewürfelt`;
            } else {
                result = "Es ist ein Unentschieden! Wir beide haben eine " + player1Score + ' gewürfelt!';
            }
            const embed = new Discord.EmbedBuilder()
                .setColor('Random')
                .setAuthor({ name: `${msg.author.tag}`, iconURL: `${msg.author.displayAvatarURL()}` })
                .setTitle('🎲')
                .setDescription(result)
                .setFooter({ text: `Programmiert von ${client.users.cache.get('705557092802625576').tag} `, iconURL: `${msg.author.displayAvatarURL()}` })
                .setTimestamp()
            return await msg.reply({ embeds: [embed] });
        } catch (err) {
            console.log(err);
        }
    }
};
