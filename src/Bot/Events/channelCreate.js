const Discord = require("discord.js");
const Quick = require("quick.db");

module.exports = async(Koala, channel, message) => {
if (channel.type === "dm") return;
  Quick.fetch(`auditLog_${channel.guild.id}`).then(async (i) => {
    if (i === null) return undefined;
    
    let Channel = channel.guild.channels.find("name", i);
    if (!Channel) return undefined;
    
      let embed = new Discord.RichEmbed()
    .setDescription(`A ${channel.type} channel called \`${channel.name}\` has been created.`)
        .setTitle("Tea - Log")
    .setColor(Koala.Color)
      Channel.send(embed)
  })
  
  
  
}