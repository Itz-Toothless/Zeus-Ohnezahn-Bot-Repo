'use strict';
const { evaluate } = require('mathjs');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'math',
    description: 'Löse eine Mathe-Aufgabe',
    usage: 'z&o!math <Aufgabe> (Beispiel: z&o!math 2 * 5 / 4)',
    cooldown: 3000,
    botPerms: [],
    userPerms: [],
    run: async (client, message, args) => {
        try {
            if (!args) {
                return message.reply({ content: 'Bitte gebe eine Aufgabe an!\nBeispiel: **`2 * 5 / 4`**', allowedMentions: { repliedUser: false } });
            }
            let output = evaluate(args.join(' ')).toFixed(2);
            if (output === Infinity || NaN) {
                output = 'Keine Nummer!'
            }
            let embed = new EmbedBuilder()
                .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ forceStatic: false })}` })
                .setTitle('Mathe-Aufgabe')
            	.setColor('Random')
                .addFields({ name: 'Eingabe', value: `${args.join(' ')}` },
                    { name: 'Ausgabe', value: `${output}` })
                .setTimestamp();
            return message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.log(err);
        }
    }
};
