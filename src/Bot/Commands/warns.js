const Discord = require("discord.js");
const Quick = require("quick.db");

module.exports.run = async (Koala, message, args) => { // eslint-disable-line no-unused-vars
  const Konah = Koala.emojis.get("456305427236257804");
  
  const Target = message.mentions.members.first() || Koala.users.get(args[0])
  
  if (!Target) {
    return message.channel.send("Please supply a \`Mention\` or an \`ID\`.");
  };
  
  const warnReasons = await Quick.fetch(`warnreasons.${Target.id}`);
  const warnCount = await Quick.fetch(`userWarnings_${Target.id}`);
  
  const warnEmbed = new Discord.RichEmbed()
  .setTitle(`Warnings from ${Koala.users.get(Target.id).tag}`)
  .setColor(Koala.Color)
  .setDescription(`\`Warning Amount:\` ${warnCount}\n\n\`Warnings:\`\n\n${warnReasons.join("\n")}`)
  
  if (warnCount >= 1){
    return message.channel.send(warnEmbed);
  } else{
    return message.channel.send("This user does not have any \`warnings\`.");
  };
};

exports.help = {
  name: "warns",
  description: "Get a users warnings.",
  usage: "k!Warns"
};

exports.conf = {
  Aliases: [ "warnings" ] 
};