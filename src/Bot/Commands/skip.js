const Discord = require("discord.js");
const Quick = require("quick.db");
const utils = require("../Handlers/Utils");


module.exports.run = async (Koala, message, args) => {
  // eslint-disable-line no-unused-vars

  let bot = Koala;
  let discord = Discord;
  let prefix = await Quick.fetch(`prefix_${message.guild.id}`);
  if (!prefix) {
    prefix = "t!";
  }

  let queue = bot.queue.get(message.guild.id);
  let votes = bot.votes.get(message.guild.id);
  if (!message.member.voiceChannel)
    return message.channel.send(
      `${message.author}, please join a voice channel to run this command!`
    ); //[message.delete(), utils.timed_msg(utils.cmd_fail(`${message.author}, please join a voice channel to run this command!`, `${config.prefix}skip`), 5000)];
  if (!queue) return message.channel.send("💡 No musics are being played."); //[message.delete(), utils.timed_msg('💡 No musics are being played.', 5000)];

  //  if(!message.member.roles.some(r=>["Music Admins", "Premium User"].includes(r.name)) ) {
  if (votes.voters.includes(message.author.id))
    return message.channel.send(
      `💡 ${message.author}, you have already voted! **${votes.votes}/3** votes`
    ); //[message.delete(), utils.timed_msg(utils.cmd_fail(`💡 ${message.author}, you have already voted! **${votes.votes}/3** votes`, `${config.prefix}skip`), 5000)];

  votes.votes++;
  votes.voters.push(message.author.id);
  message.channel.send(
    `a:TeaMusic:663461754533183501> ${message.author}, you have voted to skip! **${votes.votes}/3** votes`
  );

  if (votes.votes > 3) return queue.connection.dispatcher.end();
  //  } else return queue.connection.dispatcher.end();
};

exports.help = {
  name: "search",
  description: "Allows you to change Koala's Prefix",
  usage: "k!search"
};

exports.conf = {
  Aliases: []
};
