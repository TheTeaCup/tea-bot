const Discord = require("discord.js");
const Quick = require("quick.db");

module.exports.run = async (Koala, message, args) => { // eslint-disable-line no-unused-vars 
  if (!message.member.hasPermission("BAN_MEMBERS")) {
    return message.channel.send("You don't have the \`Ban Members\` permission.");
  };
  
  const Target = message.mentions.members.first() || message.guild.members.get(args[0]);
  
  if (!Target) {
    return message.channel.send("Please enter one of the following: \`[ Mention | ID ]\`");
  };
  
  let Reason = args.slice(1).join(" ");
  if (!Reason) { Reason = "None Provided"; };
   
  if (!message.channel.permissionsFor(Koala.user).has("BAN_MEMBERS")) {
    return message.channel.send("I don't have the \`Ban Members\` permission.");
  };
  
  try{
    Target.ban().then((member) => {
      const banEmbed = new Discord.RichEmbed()
      .setTitle("Koala Log")
      .setColor(Koala.Color)
      .addField("User", `**${member.user.tag}**`, true)
      .addField("Staff Member", `**${message.author.tag}**`, true)
      .addField("Reason", `**${Reason}**`)
      .setFooter("User has been banned.")

      Quick.fetch(`Mlog_${message.guild.id}`).then(k => {
        if(k === null){ return; };
      
        const Channel = message.guild.channels.get(`${k}`);
      
        message.channel.send(`Successfully \`banned\` ${member.user.tag}.`);
        Channel.send(banEmbed)
      });
    }).catch(() => {
      return message.channel.send("This user cannot be \`Banned\`.");
    });
  } catch(e){
    return message.channel.send("Please supply a valid \`[Mention | ID]\`.");
  };
};

exports.help = {
  name: "ban",
  description: "Ban a member using Koala.",
  usage: "k!Ban"
};

exports.conf = {
  Aliases: [ "ban" ]
};