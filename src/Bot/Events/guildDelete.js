const Discord = require("discord.js");
const db = require("quick.db");
//var send = require("quick.hook");
const Quick = require("quick.db");

module.exports = async (Bumper, guild) => {
  let Mythical = Bumper;
  const logsServerLeave2 = Bumper.channels.get("662739876495753216");
  console.log(
    `The bot has been left ${guild.name}, Owned by ${guild.owner.user.tag}`
  );
  const embed = new Discord.RichEmbed()
    .setColor(Bumper.Color)
    .setAuthor(
      `I have left ${guild.name}`,
      "https://images-ext-1.discordapp.net/external/qBdcbDveLYsigBBmlqmQVyoRoxv--WLu0d_M3YkWiow/https/dlnbots.github.io/images/leave.png"
    )
    .setThumbnail(guild.iconURL)
    .addField(`${guild.name}`, `I am now in \`${Bumper.guilds.size}\``)
    .setTimestamp()
    .setFooter(`Bumper © Koala Dev 2018-2020`);

  db.delete(`bumps_${guild.id}`);
  logsServerLeave2.setTopic(
    `Bot Stats: Users ${Bumper.users.size} || Guilds ${Bumper.guilds.size}`
  );
  logsServerLeave2.send(embed);
  await Bumper.desc.remove(guild.id);
  await Bumper.hidden.remove("hide", guild.id);
  await Bumper.officalServers.remove("Offical", guild.id);
  Quick.delete(`description_${guild.id}`);
  Quick.delete(`pChannel_${guild.id}`);
  Quick.delete(`banner_${guild.id}`);
  Quick.delete(`hex_${guild.id}`);

  Mythical.db.remove(guild.id);
  Mythical.Servers.remove("ids", guild.id);
  Mythical.bumps.set(guild.id, 0, "bumps"); //Couldnt figure out how to remove it so set there server back to '0'
  Mythical.new.remove("ids", guild.id);
};
