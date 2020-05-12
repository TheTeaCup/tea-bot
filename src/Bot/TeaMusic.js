module.exports = (Koala, utils, ytdl, config) => {

Koala.play = (guild, music) => {
        let queue = Koala.queue.get(guild.id);
        let votes = Koala.votes.get(guild.id)
        if (!music) {
            queue.voiceChannel.leave();
            Koala.queue.delete(guild.id);
            Koala.votes.delete(guild.id);
            return queue.textChannel.send(`<a:TeaMusic:663461754533183501> Music playback has ended`);
        }

        let dispatcher = queue.connection.playStream(ytdl(music.url))
            .on('end', () => {
                queue.musics.shift();
                votes.votes = 0;
                votes.voters = [];
                setTimeout(() => {
                    Koala.play(guild, queue.musics[0]);
                }, 250);
            })
            .on('error', err => console.error(err));
        dispatcher.setVolumeLogarithmic(100 / 100);

        queue.textChannel.send(`<a:TeaMusic:663461754533183501> **${music.title}** is now being played`);
};
  
 Koala.handleVideo = async (video, message, vc, playlist = false) => {
        let queue = Koala.queue.get(message.guild.id);
        //console.log(video)
        let music = {
            id: video.id,
            title: video.title,
            url: `https://www.youtube.com/watch?v=${video.id}`,
            duration: video.duration,
            author: message.author.id
        };

        if (!queue) {
            let queueConstruct = {
                textChannel: message.channel,
                voiceChannel: vc,
                connection: null,
                musics: [],
                volume: 100,
                playing: true
            };
            let voteConstruct = {
                votes: 0,
                voters: []
            };

            Koala.queue.set(message.guild.id, queueConstruct);
            Koala.votes.set(message.guild.id, voteConstruct)
            queueConstruct.musics.push(music);

            try {
                var connection = await vc.join();
                queueConstruct.connection = connection;
                Koala.play(message.guild, queueConstruct.musics[0]);
            } catch (err) {
                Koala.queue.delete(message.guild.id);
                console.error(`I could not join your voice channel: ${err}`);
            }
        } else {
            queue.musics.push(music);
            if (playlist) return;
            else return message.channel.send(`<a:TeaMusic:663461754533183501> **${music.title}** has been added to queue`);
        }
        return;
    }
};