const Discord = require("discord.js");
const Quick = require("quick.db");

module.exports = (Koala, oldMessage, newMessage) => {
  if (oldMessage.content == newMessage.content) {
    return;
  }
  if (newMessage.author.bot) {
    return;
  }

  if (newMessage.content.size >= 1024) {
    return;
  }

  Quick.fetch(`auditLog_${newMessage.guild.id}`).then(async i => {
    if (i === null) return undefined;

    let Channel = newMessage.guild.channels.find("name", i);
    if (!Channel) return console.log(`[Audit-Log Error] Couldn't find channel in ${newMessage.guild.name}`);

    let embed = new Discord.RichEmbed()
      .setTitle("Tea - Log")
      .setColor(Koala.Color)
      .addField(
        `Message Edited in #${newMessage.channel.name} by ${newMessage.author.username}`,
        `${oldMessage.content} **->** ${newMessage.content}`
      );
    Channel.send(embed);
  });
};
