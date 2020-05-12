const Discord = require("discord.js");
const Quick = require("quick.db");

module.exports.run = async (Koala, message, args) => { // eslint-disable-line no-unused-vars
  const Konah = Koala.emojis.get("456305427236257804");
  const KoHelp = Koala.emojis.get("456211147406835713");
  
    let prefix = await Quick.fetch(`prefix_${message.guild.id}`);
    if(!prefix)prefix = "t!";
  
  let lvl;
  let lvlChan;
  let lvling = await Quick.fetch(`leveling_${message.guild.id}`);
  if(!lvling) lvl = `\`${prefix}rank-settings lvl enable\` **-** Enable leveling for your server.`;
  if(lvling) lvl = `Leveling is enabled To Disbled: \`${prefix}rank-settings lvl disable\``;
  
  let lvlChannel = await Quick.fetch(`levelingChannel_${message.guild.id}`);
  if(!lvlChannel) { lvlChan = `\`${prefix}rank-settings lvl-log <levelChanel>\`` }
  if(lvlChannel) {
    
     let channel = message.guild.channels.find("name", lvlChannel)
   
   if(!channel) {
     Quick.delete(`levelingChannel_${message.guild.id}`);
     lvlChan = `\`${prefix}rank-settings lvl-log <channelName>\` **-** By default it is posted in the same channel as the users message `;
   };
    lvlChan = `Level Log: \`${channel.name}\` To remove: \`${prefix}rank-settings lvl-log delete\``
    
  };
  
    if(!args[0]) {
    let errorEmbed = new Discord.RichEmbed()
    .setColor(Koala.Color)
    .setTitle("Rank Settings")
    .addField("Leveling", `${lvl}`)
    .addField("Leveling Channel", `${lvlChan}`)
   
   return message.channel.send(errorEmbed);
  };
  
   if(args[0]) {
  
  if (Koala.Developers.includes(message.author.id)) { } else {
    
  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("<:konah:456305427236257804> **| You don't have `ADMINISTRATOR` perms.**");
    };
  };
  
     if(args[0] === "lvl-log") {
    
    let channelName = args[1];
    if(!channelName)return message.channel.send(`Please give a channel name.\n Ex: \`leveling-log\``);
    
    if(channelName === "delete") {
      Quick.delete(`levelingChannel_${message.guild.id}`);
      return message.channel.send(`lvl-log has been reset. `);
    };
    
    let channel = message.guild.channels.find("name", channelName);
    if(!channel)return message.channel.send(`Channel Name: \`${channelName}\` Was not found in this server.`);
    
    Quick.set(`levelingChannel_${message.guild.id}`, channel.name);
    message.channel.send(`Setting lvl-log to \`${channel.name}\`. `);
    
  };
    
  if(args[0] === "lvl") {
     
    let option = args[1];
    if(!option)return message.channel.send(`Please do \`${prefix}settings lvl [Disable / Enable]\`.`);
    
    if(option === "disable") {
      Quick.delete(`leveling_${message.guild.id}`);
      return message.channel.send(`Disabled Leveling for your server.`);
    };
    
    Quick.set(`leveling_${message.guild.id}`, 122);
    return message.channel.send(`Leveling is now Enabled.`);
  };
  
};

exports.help = {
  name: "rank-settings",
  description: "Allows you to delete a certain amount of messages.",
  usage: "k!rank-settings"
};

exports.conf = {
  Aliases: [  ]
};