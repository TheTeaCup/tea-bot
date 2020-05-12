const Discord = require("discord.js");
const Quick = require("quick.db");
const utils = require("../Handlers/Utils");

module.exports.run = async (Koala, message, args) => {
  // eslint-disable-line no-unused-vars

  let bot = Koala;
  let msg = message;

  let prefix = await Quick.fetch(`prefix_${message.guild.id}`);
  if (!prefix) {
    prefix = "t!";
  }

  const serverQueue = bot.queue.get(msg.guild.id);
  let command = msg.content.toLowerCase().split(" ")[0];
  command = command.slice(prefix.length);
  //console.log(serverQueue.musics[0]);
  if (!serverQueue) return msg.channel.send("💡 There is nothing playing");
  const duration =
    serverQueue.musics[0].duration.minutes * 60000 +
    (serverQueue.musics[0].duration.seconds % 60000) * 1000;
  const persentase = serverQueue.connection.dispatcher.time / duration;
  const curentDurationMinute =
    Math.floor(serverQueue.connection.dispatcher.time / 60000) < 10
      ? `0${Math.floor(serverQueue.connection.dispatcher.time / 60000)}`
      : Math.floor(serverQueue.connection.dispatcher.time / 60000);
  const currentDurationSeconds =
    Math.floor((serverQueue.connection.dispatcher.time % 60000) / 1000) < 10
      ? `0${Math.floor(
          (serverQueue.connection.dispatcher.time % 60000) / 1000
        )}`
      : Math.floor((serverQueue.connection.dispatcher.time % 60000) / 1000);
  const endDurationMinute =
    serverQueue.musics[0].duration.minutes < 10
      ? `0${serverQueue.musics[0].duration.minutes}`
      : serverQueue.musics[0].duration.minutes;
  const endDurationSeconds =
    serverQueue.musics[0].duration.seconds < 10
      ? `0${serverQueue.musics[0].duration.seconds}`
      : serverQueue.musics[0].duration.seconds;

  const emb = new Discord.RichEmbed()
    .setColor(bot.Color)
    .setAuthor(
      bot.users.get(serverQueue.musics[0].author).tag,
      bot.users.get(serverQueue.musics[0].author).avatarURL
    )
    .setTitle(serverQueue.musics[0].title)
    .setURL(serverQueue.musics[0].url)
    .setThumbnail(serverQueue.musics[0].thumbnail)
    .setDescription(
      `▶ ${progressBar(
        persentase
      )} \`[${curentDurationMinute}:${currentDurationSeconds} - ${endDurationMinute}:${endDurationSeconds}]\`🔊`
    );

  return msg.channel.send({ embed: emb });
};

exports.help = {
  name: "nowplaying",
  description: "Allows you to change Koala's Prefix",
  usage: "k!np"
};

exports.conf = {
  Aliases: ["np"]
};

function progressBar(percent) {
  let num = Math.floor(percent * 12);
  if (num === 1) {
    return "🔘▬▬▬▬▬▬▬▬▬▬▬";
  } else if (num === 2) {
    return "▬🔘▬▬▬▬▬▬▬▬▬▬";
  } else if (num === 3) {
    return "▬▬🔘▬▬▬▬▬▬▬▬▬";
  } else if (num === 4) {
    return "▬▬▬🔘▬▬▬▬▬▬▬▬";
  } else if (num === 5) {
    return "▬▬▬▬🔘▬▬▬▬▬▬▬";
  } else if (num === 6) {
    return "▬▬▬▬▬🔘▬▬▬▬▬▬";
  } else if (num === 7) {
    return "▬▬▬▬▬▬🔘▬▬▬▬▬";
  } else if (num === 8) {
    return "▬▬▬▬▬▬▬🔘▬▬▬▬";
  } else if (num === 9) {
    return "▬▬▬▬▬▬▬▬🔘▬▬▬";
  } else if (num === 10) {
    return "▬▬▬▬▬▬▬▬▬🔘▬▬";
  } else if (num === 11) {
    return "▬▬▬▬▬▬▬▬▬▬🔘▬";
  } else if (num === 12) {
    return "▬▬▬▬▬▬▬▬▬▬▬🔘";
  } else {
    return "🔘▬▬▬▬▬▬▬▬▬▬▬";
  }
}
