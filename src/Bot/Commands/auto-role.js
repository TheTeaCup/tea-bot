const Discord = require("discord.js");
const Quick = require("quick.db");

module.exports.run = async (Koala, message, args) => { // eslint-disable-line no-unused-vars  
  let Prefix = await Quick.fetch(`prefix_${message.guild.id}`);
  if (!Prefix) { Prefix = "t!"; };
  
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    return message.channel.send("You don't have the \`Administrator\` permission.");
  };
  
  Quick.fetch(`autoRole_${message.guild.id}`).then(k => {
    if (!args[0]) {
      return message.channel.send(`${Prefix}AutoRole \`[Role Name | Disable ]\``);
    };
    
    if (args[0].toLowerCase() === "disable") {
      if (k === null) {
        return message.channel.send("AutoRole has already been \`Disabled\`.");
      } else {
        return Quick.delete(`autoRole_${message.guild.id}`).then(() => {
          return message.channel.send("AutoRole has successfully been \`disabled\`.");
        });
      };     
    };
    
    const autoRole = message.guild.roles.find("name", args.join(" "));
    
    if (!autoRole) {
      return message.channel.send(`Please supply a valid \`role\`.`);
    };
    
    if (k !== null) {
      return message.channel.send("Only one \`autorole\` can be enabled at a time.");
    };
    
    Quick.set(`autoRole_${message.guild.id}`, args.join(" ").trim()).then(() => {
      const autoRoleEmbed = new Discord.RichEmbed()
      .setTitle("TeaBot - AutoRole")
      .setColor(Koala.Color)
      .setDescription("\`Autorole\` has successfully been \`enabled\`.")
      
      return message.channel.send(autoRoleEmbed);
    });
  });
};

exports.help = {
  name: "autorole",
  description: "Set an AutoRole for Koala.",
  usage: "k!Autorole"
};

exports.conf = {
  Aliases: []
};