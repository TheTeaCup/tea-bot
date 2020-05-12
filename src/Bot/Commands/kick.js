const Discord = require("discord.js");
const Quick = require("quick.db");

module.exports.run = async (Koala, message, args) => { // eslint-disable-line no-unused-vars
  if(!message.member.hasPermission("KICK_MEMBERS")){
    return message.channel.send("You don't have the \`Kick Members\` permission.");
  };
  
  const Target = message.mentions.members.first() || message.guild.members.get(args[0]);
  
  if (!Target){
    return message.channel.send("Please enter one of the following: \`[ Mention | ID ]\`");
  };
  
  let Reason = args.slice(1).join(" ");
  if (!Reason){ Reason = "None Provided"; };
   
  if (!message.channel.permissionsFor(Koala.user).has("KICK_MEMBERS")){
    return message.channel.send("I don't have the \`Kick Members\` permission.");
  };
  
  try{
    Target.kick().then((member) => {
      const kickEmbed = new Discord.RichEmbed()
      .setTitle("Koala Log")
      .setColor(Koala.Color)
      .addField("User", `**${member.user.tag}**`, true)
      .addField("Staff Member", `**${message.author.tag}**`, true)
      .addField("Reason", `**${Reason}**`)
      .setFooter("User has been kicked.")

      Quick.fetch(`Mlog_${message.guild.id}`).then(k => {
        if (k === null) { return; };
      
        const Channel = message.guild.channels.get(`${k}`)
      
        message.channel.send(`Successfully \`Kicked\` ${member.user.tag}.`);
        Channel.send(kickEmbed)
      });
    }).catch(() => {
      return message.channel.send("This user cannot be \`kicked\`.");
    });
  } catch(e){
    return message.channel.send("Please supply a valid \`[Mention | ID]\`.");
  };
};

exports.help = {
  name: "kick",
  description: "Kick a member using Koala.",
  usage: "k!Kick"
};

exports.conf = {
  Aliases: []
};