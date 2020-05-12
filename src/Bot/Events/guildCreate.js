const Discord = require("discord.js");
//var send = require("quick.hook");

module.exports = async (Bumper, guild) => {
  console.log(
    `The bot just joined to ${guild.name}, Owned by ${guild.owner.user.tag}`
  );
  const logsServerJoin2 = Bumper.channels.get("662739876495753216");
  let a = "Welcome!";

  const embed = new Discord.RichEmbed()
    .setColor(Bumper.Color)
    .setAuthor(
      `i Joined ${guild.name}`,
      "https://images-ext-1.discordapp.net/external/3vb7X0yysUyIs3XxOs6s0X-gB6PH8PG80rFbv_7iQeI/https/dlnbots.github.io/images/join.png"
    )
    .setThumbnail(guild.iconURL)
    //.setURL("https://bumperbot.ml/info/" + guild.id )
    .addField(`${guild.name}`, `I am now in \`${Bumper.guilds.size}\``)
    .addField(
      "Member Info",
      `**Total Users Count:** \`${guild.memberCount}\`\n\n**Member Count:** \`${
        guild.members.filter(member => !member.user.bot).size
      }\`\n**Bot Count:** \`${
        guild.members.filter(member => member.user.bot).size
      }\``,
      true
    )
    .addField(
      "Server Info",
      `**Owner:** \`${guild.owner.user.tag}\`\n**Host Region:** \`${guild.region}\`\n**Verification Level:** \`${guild.verificationLevel}\`\n**Server ID:** \`${guild.id}\``,
      true
    )
    .setTimestamp();
  //.setFooter(`Tea Bot © TeaCup 2019`, Bumper.users.get("453601455698608139").avatarURL)
  logsServerJoin2.setTopic(
    `Bot Stats: Users ${Bumper.users.size} || Guilds ${Bumper.guilds.size}`
  );

  logsServerJoin2.send(embed);
  let Mythical = Bumper

  Bumper.desc.set(guild.id, "gg", "desc");
  
      let Data = {
          id: guild.id,
          name: guild.name || '',
          longDesc: '',
          summary: '',
          website: '',
          createdTimestamp: Date.now(),
          lastEdited: Date.now(),
          lastBump: '',
          status: 'Awaiting Approval',
          invite: '',
          owner: guild.owner.id,
          tags: ''
        };
  
await  Mythical.db.set(guild.id, Data);
await  Mythical.bumps.set(guild.id, 0, "bumps");
 await Bumper.Servers.push("ids", guild.id)
 await Mythical.lastBump.set(guild.id, Date.now(), "last");
 await Mythical.new.push("ids", guild.id);
};
