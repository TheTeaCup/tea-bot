const Discord = require("discord.js");
const Quick = require("quick.db");

exports.run = async (Bumper, message, args) => {
  // eslint-disable-line no-unused-vars
try {
  
  let prefix = await Quick.fetch(`prefix_${message.guild.id}`);
  if (!prefix) prefix = "t!";
  let Prefix = prefix;
  if (!args[0]) {
    let HelpEmbed = new Discord.RichEmbed()
      .setColor(Bumper.Color)
      .setAuthor("Tea Bot Help Menu")
      .setDescription(`Hi! I\'m Tea, I can help you grow your server & more.

**__COMMAND LIST__**

**\`${prefix}help\`**: What your seeing now
**\`${prefix}bump\`**: Bump this server
**\`${prefix}bumps\`**: View you\'re server bumps
**\`${prefix}page\`**: View this server online
**\`${prefix}settings\`**: Change your server *(Admin Only)*
**\`${prefix}partner-config\`**: Setup the servers partner info *(Admin Only)*
**\`${prefix}short-description\`**: Set the servers short desc *(Admin Only)*
**\`${Prefix}Ban\`**: Remove a user from your server *(Admin Only)*
**\`${Prefix}ClearWarnings\`** Clear a users warnings *(Admin Only)*
**\`${Prefix}Kick\`** Remove a user temporary from your server *(Admin Only)*
**\`${Prefix}Mute\`** Stop a user from talking *(Admin Only)*
**\`${Prefix}Purge\`** Clear messages *(Admin Only)*
**\`${Prefix}Warn\`** Warn a user *(Admin Only)*
**\`${Prefix}Warns\`** See how many warnings someone has
**\`${Prefix}AutoRole\`** Give Your new member(s) roles *(Admin Only)*

Economy - **\`${Prefix}Help Economy\`**
Music - **\`${Prefix}Help Music\`**

  `);
   return message.channel.send(HelpEmbed);
  }
  
  if (args[0].toLowerCase() === "economy") {
    const economyEmbed = new Discord.RichEmbed()
      .setTitle("Tea Commands")
      .setColor(Bumper.Color)
      .addField(
        "Economy Commands",
        `**${Prefix}**Balance\n**${Prefix}**Daily\n**${Prefix}**Pay\n**${Prefix}**Mine`
      );

    return message.channel.send(economyEmbed);
  }

if (args[0].toLowerCase() === "music") {
    const economyEmbed = new Discord.RichEmbed()
      .setTitle("Tea Commands")
      .setColor(Bumper.Color)
      .addField(
        "Music Commands",
        `**${Prefix}Play SongName/URL**\n**${Prefix}NowPlaying**\n**${Prefix}Skip**`
      );

    return message.channel.send(economyEmbed);
  }
  
} catch (e) {
  return message.channel.send("This bot requires permissions to send embeds, please give the permissions needed for it to work.")
}
};

exports.help = {
  name: "help",
  description: "Get help with the bot",
  usage: "b!Help"
};

exports.conf = {
  Aliases: [] // No Aliases.
};
