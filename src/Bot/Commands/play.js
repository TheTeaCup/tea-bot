const Discord = require("discord.js");
const Quick = require("quick.db");
const utils = require("../Handlers/Utils");

module.exports.run = async (Koala, message, args) => { // eslint-disable-line no-unused-vars
 
    let bot = Koala;
    
    let prefix = await Quick.fetch(`prefix_${message.guild.id}`);
    if (!prefix) { prefix = "t!"; };
  
    let VC = message.member.voiceChannel;
    if (!VC) return message.channel.send(`Please join a voice channel.`);

    let url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
    let pl = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/

    let searchString = args.join(' ');
    if (!url || !searchString) return message.channel.send(`${message.author}, please enter a music name or url!`);

    let perms = VC.permissionsFor(message.client.user);
    if (!perms.has('CONNECT')) return message.channel.send(`${message.author}, I do not have permissions to connect to voice channels!`);
    if (!perms.has('SPEAK')) return message.cahnnel.send(`${message.author}, I do not have permissions to speak in a voice channel`);

    if (url.match(pl)) {
        let playlist = await bot.youtube.getPlaylist(url);
        let videos = await playlist.getVideos();

        for (const vid of Object.values(videos)) {
            let video = await bot.youtube.getVideoByID(vid.id)
            await bot.handleVideo(video, message, VC, true)
        }

        return message.channel.send(`<a:TeaMusic:663461754533183501> **${playlist.title}** has been added to queue.`);
    } else {

        try {
            var video = await bot.youtube.getVideo(url);
        } catch (err) {
            if (err) undefined;
            try {
                var vid = await bot.youtube.searchVideos(searchString, 1);
                var video = await bot.youtube.getVideoByID(vid[0].id);
            } catch (err) {
                console.error(err);
                return message.channel.send(`${message.author}, no videos can be found with the argument \`${searchString}\``);
            }
        }
        return bot.handleVideo(video, message, VC);
    }
  
};

exports.help = {
  name: "play",
  description: "Allows you to change Koala's Prefix",
  usage: "k!play"
};

exports.conf = {
  Aliases: [ "join" ]
};