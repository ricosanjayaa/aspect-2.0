const embed = require('../embeds/embeds');

module.exports = {
    name: 'remove',
    aliases: ['r'],
    utilisation: '{prefix}remove',
    voiceChannel: true,

    async execute(client, message) {
        const queue = client.player.getQueue(message.guild.id);


        if (!queue || !queue.playing) return message.channel.send(`❌ | There is no music currently playing.`);
        if (!queue.tracks[0]) return message.channel.send(`❌ | No music in queue after current.`);


        let nowplay = `Now Playing : ${queue.current.title}\n\n`;
        let queueMsg = '';
        if (queue.tracks.length > 9) {
            for (var i = 0; i <= 9; i++) {
                queueMsg += `${i + 1}. ${queue.tracks[i].title}\n`;
            }
            queueMsg += `and ${queue.tracks.length - 9} other songs`;
        }
        else {
            for (var i = 0; i < queue.tracks.length; i++) {
                queueMsg += `${i + 1}. ${queue.tracks[i].title}\n`;
            }
        }
        const instruction = `Choose a song from **1** to **${queue.tracks.length}** to **remove** or enter others to cancel selection. ⬇️`
        await message.channel.send({ embeds: [embed.Embed_queue("Remove List", nowplay, queueMsg)], content: instruction });


        const collector = message.channel.createMessageCollector({
            time: 10000, // 10s
            errors: ['time'],
            filter: m => m.author.id === message.author.id
        });

        collector.on('collect', async (query) => {

            const index = parseInt(query.content);

            if (!index || index <= 0 || index > queue.tracks.length)
                return message.channel.send(`✅ | Cancelled remove.`) && collector.stop();

            collector.stop();

            queue.remove(index - 1);
            return query.react('👍');
        });

        collector.on('end', (msg, reason) => {
            if (reason === 'time')
                return message.channel.send(`❌ | Song remove time expired`);
        });
    },
};