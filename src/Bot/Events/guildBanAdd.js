const Discord = require("discord.js");
const Quick = require("quick.db");

module.exports = (Koala, guild, member) => {
  Quick.fetch(`auditLog_${guild.id}`).then(async i => {
    if (i === null) return undefined;

    let Channel = guild.channels.find("name", i);
    if (!Channel) return undefined;

    const BanEmbed = new Discord.RichEmbed()
      .setTitle("Tea - Log")
      .setColor(Koala.Color)
      .setDescription(`Banned User: **${member}**\nID: **${member.id}**`);

    Channel.send(BanEmbed);
  });
};
