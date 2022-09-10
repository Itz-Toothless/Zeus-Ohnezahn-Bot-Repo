const { EmbedBuilder } = require("discord.js");
const got = require('got');

module.exports = {
    name: 'meme',
    description: 'Get a random meme',
    usage: 'z&o!meme',
    category: 'memes',
    cooldown: 3000,
    userPerms: [],
    botPerms: [],
    aliases: ['memes'],
    run: async (client, message, args) => {
        try {
            function shuffle(array) {
                var currentIndex = array.length, temporaryValue, randomIndex;
                while (0 !== currentIndex) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }
                return array;
            }
            let words = shuffle(['memes', 'cursedcomments'])
            let random = Math.floor(Math.random() * words.length);
            let word = words[random];
            got(`https://www.reddit.com/r/${word}/random/.json`).then(response => {
                let content = JSON.parse(response.body);
                let permalink = content[0].data.children[0].data.permalink;
                let memeURL = `https://www.reddit.com${permalink}`;
                let memeTitle = content[0].data.children[0].data.title;
                let memeDescription = content[0].data.children[0].data.selftext;
                let memeAuthor = content[0].data.children[0].data.author;
                let memeImage = content[0].data.children[0].data.url;
                let upvotes = content[0].data.children[0].data.ups;
                let downvotes = content[0].data.children[0].data.downs;
                let comments = content[0].data.children[0].data.num_comments;
                let uploadedutc = content[0].data.children[0].data.created_utc;
                let memeEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(`${memeTitle}`)
                    .setDescription(`${memeDescription}\n\nHochgeladen am: **<t:${uploadedutc}:F>**`)
                    .setURL(`${memeURL}`)
                    .setImage(`${memeImage}`)
                    .setFooter({ text: `👍 ${upvotes} | 👎 ${downvotes} | 💬 ${comments} | Hochgeladen von: ${memeAuthor}` })
                	.setTimestamp()
                return message.reply({ embeds: [memeEmbed] });
            }).catch(err => {
                console.log(err);
            });
        } catch (e) { console.log(e) }
    }
};
