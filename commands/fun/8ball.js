const Discord = require('discord.js')

module.exports = {
    name: '8ball',
    description: 'Gibt dir eine zufällige Antwort auf deine Frage.',
    aliases: ['8b'],
    usage: "z&o!8ball <question>",
    run: async (client, msg, args) => {
        try {
            let answers = ['Es ist sicher.', 'Es ist so entschieden.', 'Ohne Zweifel.', 'Ja - definitiv.', 'Darauf können Sie sich verlassen.', 'So, wie ich es sehe, ja.', 'Höchstwahrscheinlich.', 'Der Ausblick ist gut.', 'Ja.', 'Die Zeichen deuten auf ja.', 'Antworten dunstig, versuchen Sie es erneut.', 'Fragen Sie bitte später nochmal.', 'Das sage ich Ihnen lieber nicht jetzt.', 'Ich kann das jetzt nicht vorhersagen.', 'Konzentrieren Sie sich und fragen Sie erneut!', 'Verlassen Sie sich nicht darauf.', 'Meine Antwort lautet nein.', 'Meine Quellen sagen nein.', 'Sieht nicht so gut aus.', 'Sehr zweifelhaft.'];
            let answer = answers[Math.floor(Math.random() * answers.length)];
            let content = msg.content.replace('z&o!8ball ', '').replace('z&o!8b ', '');
            let answerEmbed = new Discord.EmbedBuilder()
                .setColor('#0099ff')
                .setAuthor({ name: `${msg.author.tag}`, iconURL: 'https://www.scentswarmers.com/wp-content/uploads/2017/09/rahome8ballisofw17-800x800.png' })
                .setTitle('8-Ball')
                .setDescription(`> ${content}\n${answer}`)
                .setTimestamp();
            return msg.channel.send({ embeds: [answerEmbed] });
        } catch (err) { console.log(err) }
    }
};
