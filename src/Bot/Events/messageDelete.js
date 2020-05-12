const Discord = require("discord.js");
const Quick = require("quick.db");

module.exports = async (Koala, message) => {
  Quick.fetch(`auditLog_${message.guild.id}`).then(async i => {
    if (i === null) return undefined;
console.log(i)
    let Channel = message.guild.channels.find("name", i);
    if (!Channel) return console.log(`[Audit-Log Error] Couldn't find channel in ${message.guild.name}`);

    let embed = new Discord.RichEmbed()
      .addField(
        `Message Deleted in #${message.channel.name}.`,
        `${message.author.username}: ${message.content}`
      )
      .setTitle("tea - Log")
      .setColor(Koala.Color);
    Channel.send(embed);
  });
};
