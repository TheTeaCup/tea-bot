const Discord = require("discord.js");
const Quick = require("quick.db");

module.exports = (Koala, guild, member) => {
  Quick.fetch(`auditLog_${guild.id}`).then(async i => {
    if (i === null) return undefined;

    let Channel = guild.channels.find("name", i);
    if (!Channel) return console.log(`[guildBanRemove Error] Couldn't find channel in ${guild.name}`);

    const UnbanEmbed = new Discord.RichEmbed()
      .setTitle("Koala - Log")
      .setColor(Koala.Color)
      .setDescription(`Unbanned User: **${member}**\nID: **${member.id}**`);

    Channel.send(UnbanEmbed);
  });
};
