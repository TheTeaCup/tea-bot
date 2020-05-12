const Discord = require("discord.js");
const Quick = require("quick.db");

module.exports.run = async (Koala, message, args) => { // eslint-disable-line no-unused-vars  
  if(!message.member.hasPermission("MANAGE_MESSAGES")){
    return message.channel.send("You don't have the \`Manage Messages\` permission.");
  };
  
  const Target = message.mentions.members.first() || message.guild.members.get(args[0]);
  if (!Target) {
    return message.channel.send("Please supply a \`Mention\` or an \`ID\`.");
  };
 
  
  const Reason = args.slice(1).join(" ");
  if (!Reason){
    return message.channel.send("Please supply a \`Reason\`.");
  };
  
  Quick.add(`userWarnings_${Target.id}`, 1)
  Quick.push(`warnreasons.${Target.id}`, Reason);
  
  const warnEmbed = new Discord.RichEmbed()
  .setTitle("Koala Log")
  .setColor(Koala.Color)
  .addField("User", `**${Target.user.tag}**`, true)
  .addField("Staff Member", `**${message.author.tag}**`, true)
  .addField("Reason", `**${Reason}**`)
  .setFooter("User has been warned. ")

  Quick.fetch(`Mlog_${message.guild.id}`).then(k => {
    if (k === null) { return; };
      
    const Channel = message.guild.channels.get(`${k}`)
      
    message.channel.send(`Successfully \`warned\` ${Target.user.tag}.`);
    Channel.send(warnEmbed);
  });
};

exports.help = {
  name: "warn",
  description: "Warn a user.",
  usage: "k!Warn"
};

exports.conf = {
  Aliases: [ "w" ] 
};