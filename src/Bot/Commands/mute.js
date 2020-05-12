const Discord = require("discord.js");
const Quick = require("quick.db");
const ms = require("ms");

module.exports.run = async (Koala, message, args) => { // eslint-disable-line no-unused-vars
  if (!message.member.hasPermission("MANAGE_MESSAGES")) {
    return message.channel.send("You don't have the \`Manage Messages\` permission.");
  };
  
  const Target = message.mentions.members.first();
  const Reason = args[1];
  const MuteTime = args[2];
  
  if (!Target) {
    return message.channel.send("Please supply a \`Mention\`.");
  };
  
  if (!Reason) {
    return message.channel.send("Please supply a \`Reason\`.");
  };
  
 /* if (!MuteTime) {
    return message.channel.send("Please supply a \`\time\` to mute your target.");
  }; */
  
  if (Target.hasPermission("KICK_MEMBERS")){
    return message.channel.send(`This user cannot be \`muted\`.`);
  };
  
  const MuteRole = message.guild.roles.find("name", "Koala-Muted");
  
  if (!MuteRole) {
    try{
      MuteRole =  message.guild.createRole({
        name: "Koala-Muted",
        color: "#21dae7",
        permissions: []
      });
      
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(MuteRole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    } catch (e) {
      return message.channel.send("Oh no! An error occured, please try again later.");
    };
  };
  
  Target.addRole(MuteRole).then(async (member) => {
    const targetEmbed = new Discord.RichEmbed()
    .setTitle("Koala Log")
    .setColor(Koala.Color)
    .setDescription(`You were \`Muted\` in \`${message.guild.name}\``)
    .addField("User", `**${member.user.tag}**`, true)
    .addField("Staff Member", `**${message.author.tag}**`, true)
    .addField("Reason", `**${Reason}**`)
    
    const muteEmbed = new Discord.RichEmbed()
    .setTitle("Koala Log")
    .setColor(Koala.Color)
    .addField("User", `**${member.user.tag}**`, true)
    .addField("Staff Member", `**${message.author.tag}**`, true)
    .addField("Reason**", `**${Reason}**`)
    .setFooter(`User has been muted for ${MuteTime}.`)
    
    Quick.fetch(`Mlog_${message.guild.id}`).then(k => {
      if (k === null) { return; };
      
      const Channel = message.guild.channels.get(`${k}`);
      
      message.channel.send(`Successfully \`muted\` ${member.user.tag}.`);
      
      Channel.send(muteEmbed);
      Target.send(targetEmbed).catch(() => { return undefined; });
    });
  }).catch(() => {
    return message.channel.send("I need the \`Manage Roles\` permission.");
  });
  
  if(MuteTime) {
  setTimeout(function(){
    Target.removeRole(MuteRole.id);
    return message.channel.send(`\`${Koala.users.get(Target.id).tag}\` has been \`unmuted\`.`);
  }, ms(MuteTime));
}
};

exports.help = {
  name: "mute",
  description: "Allows you to mute a member",
  usage: "k!Mute"
};

exports.conf = {
  Aliases: []
};