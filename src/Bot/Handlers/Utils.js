let disc;
let b;
let conf;
let msg;
let a;
let g;
const Discord = require("discord.js");

module.exports = {
  load: (discord, bot, config, message, args, guild) => {
    disc = discord;
    b = bot;
    conf = config;
    msg = message;
    a = args;
    g = guild;
  },

  timed_msg: (string, time) => {
    return msg.channel.send(string).then(msg => msg.delete(time));
  },

  no_perm: error => {
    let embed = new Discord.RichEmbed()
      .setColor("#d30000")
      .setAuthor(
        "ERROR: Insufficient Permissions!",
        "https://cdn.discordapp.com/avatars/453601455698608139/878faa09c16a0a3ee67d77459bb80c82.png?size=2048"
      )
      .setThumbnail(
        "https://cdn.discordapp.com/avatars/453601455698608139/878faa09c16a0a3ee67d77459bb80c82.png?size=2048"
      )
      .setDescription(error)
      .setFooter("Insufficient Permissions!");

    return embed;
  },

  cmd_fail: (error, syntax) => {
    let embed = new Discord.RichEmbed()
      .setColor("#8e0000")
      .setAuthor(
        "ERROR: WRONG SYNTAX",
        "https://cdn.discordapp.com/avatars/453601455698608139/878faa09c16a0a3ee67d77459bb80c82.png?size=2048"
      )
      .setThumbnail(
        "https://cdn.discordapp.com/avatars/453601455698608139/878faa09c16a0a3ee67d77459bb80c82.png?size=2048"
      )
      .setDescription(error)
      .setFooter(syntax);
    return embed;
  }
};
