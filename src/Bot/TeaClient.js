const Discord = require("discord.js");

/**
 * Create our client
 */
const Bumper = new Discord.Client({
  disabledEvents: [
    "CHANNEL_PINS_UPDATE",
    "RELATIONSHIP_ADD",
    "RELATIONSHIP_REMOVE",
    "TYPING_START"
  ],
  messageCacheMaxSize: 100,
  messageCacheLifetime: 240,
  messageSweepInterval: 300,
  fetchAllMembers: true
});

let Mythical = Bumper;
/**
 * Require external files that Bumper needs.
 */
require("./Handlers/EventHandler.js")(Bumper);
require("./Handlers/CommandHandler.js")(Bumper);
require("./Handlers/FunctionHandler.js")(Bumper);

Bumper.Developers = ["338192747754160138" /* Tea Cup#9999 */];
Bumper.Staff = ["338192747754160138" /* Tea Cup#9999 */];
Bumper.Website = "https://teacup.glitch.me";

require("./Data/Database.js")(Bumper);
Bumper.Commands = new Discord.Collection();
Bumper.Aliases = new Discord.Collection();

Bumper.Color = "#DAF7A6";
Bumper.ErrorColor = 0xf64465;

/* Levling Database */

let Koala = Bumper;
const Quick = require("quick.db");
const fs = require("fs");
const ms = require("ms");

const points = new Quick.table("POINTS");
const levels = new Quick.table("LEVELS");
const xpl = new Quick.table("TOTAL_POINTS");
const cooldown = require("./Data/cooldown.js");

Koala.on("message", async message => {
  // eslint-disable-line
  if (message.author.bot) return undefined;
  if (message.channel.type != "text") return;

  let lvling = await Quick.fetch(`leveling_${message.guild.id}`);
  if (!lvling) return;

  let user = message.author.id;

  let xpAdd = Math.floor(Math.random() * 7) + 8;

  levels.fetch(`${message.guild.id}_${message.author.id}`).then(i => {
    if (i == null || i === 0)
      levels.set(`${message.guild.id}_${message.author.id}`, 1);
  });

  points.fetch(`${message.guild.id}_${message.author.id}`).then(i => {
    if (i == null) points.set(`${message.guild.id}_${message.author.id}`, 0);
  });

  xpl.fetch(`${message.guild.id}_${message.author.id}`).then(i => {
    if (i == null) xpl.set(`${message.guild.id}_${message.author.id}`, 0);
  });

  if (!cooldown.is(user.id)) {
    if (message.author.id !== "338192747754160138") {
      cooldown.add(user.id);
    }
    points.add(`${message.guild.id}_${message.author.id}`, xpAdd);
    xpl.add(`${message.guild.id}_${message.author.id}`, xpAdd);
    setTimeout(() => {
      cooldown.remove(user.id);
    }, 1000 * 60);
  }
  points.fetch(`${message.guild.id}_${message.author.id}`).then(p => {
    levels.fetch(`${message.guild.id}_${message.author.id}`).then(async l => {
      var xpReq = l * 300;
      if (p >= xpReq) {
        levels.add(`${message.guild.id}_${message.author.id}`, 1);
        points.set(`${message.guild.id}_${message.author.id}`, 0);
        levels
          .fetch(`${message.guild.id}_${message.author.id}`, {
            target: ".data"
          })
          .then(async lvl => {
            let up = new Discord.RichEmbed()
              .setTitle("Level Up!")
              .setDescription("You have just leveled to level **" + lvl + "**")
              .setColor(Koala.Color);

            if (message.guild.id === "521651468131106817") {
              message.author.send(up);
            } else {
              let lvlChannel = await Quick.fetch(
                `levelingChannel_${message.guild.id}`
              );
              if (lvlChannel) {
                let chan = message.guild.channels.find("name", lvlChannel);
                if (!chan) return;
                let lvlup = new Discord.RichEmbed()
                  .setTitle("Level Up!")
                  .setDescription(
                    `${message.author.tag} Just Leveled up to level **${lvl}**`
                  )
                  .setColro(Koala.Color);
                chan.send(lvlup).then(message => {
                  let time = "10s";

                  setTimeout(() => {
                    message.delete();
                  }, ms(time));
                });
              } else {
                message.channel.send(up).then(message => {
                  let time = "10s";

                  setTimeout(() => {
                    message.delete();
                  }, ms(time));
                });
              }
            }
          });
      }
    });
  });
});

Mythical.on("suggestionSubmit", async req => {
  let Kiro = req.isAuthenticated() ? req.user : null;
  let suggestion = req.body.suggestion;
  Mythical.fetchUser(Kiro.id).then(User => {
    let SuggestionEmbed = new Discord.RichEmbed()
      .setColor(Mythical.Color)
      .setTitle("Suggestion Submission")
      .setThumbnail(User.avatarURL)
      .addField("User", `${User.tag}(${User.id})`)
      .addField("Suggestion", `${suggestion}`);
    Mythical.channels.get("663422630824509473").send(SuggestionEmbed);
  });
});

Mythical.on("suggestionBug", async req => {
  let Kiro = req.isAuthenticated() ? req.user : null;
  let Bug = req.body.bug;
  Mythical.fetchUser(Kiro.id).then(User => {
    let BugEmbed = new Discord.RichEmbed()
      .setColor(Mythical.Color)
      .setTitle("Bug Submission")
      .setThumbnail(User.avatarURL)
      .addField("User", `${User.tag}(${User.id})`)
      .addField("Bug", `${Bug}`);
    Mythical.channels.get("663422630824509473").send(BugEmbed);
  });
});

Koala.on("guildMemberAdd", async member => {
  Quick.fetch(`autoRole_${member.guild.id}`).then(k => {
    if (k === null) return;

    const autoRole = member.guild.roles.find("name", k);
    if (!autoRole) return;
    if (member.bot) return;
    member.addRole(autoRole, "Auto-Role").catch(console.error);
  });
});

Koala.on("guildMemberAdd", async member => {
  if (member.guild.id === "662738753374257203") {
    const autoRole = member.guild.roles.find("name", "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬");
    if (!autoRole) return;
    if (member.bot) return;
    member.addRole(autoRole, "Auto-Role").catch(console.error);
  }
});

const queue = new Map()
const {  GOOGLE_API_KEY } = "xxxxx"
const YouTube = require('simple-youtube-api')
const ytdl = require('ytdl-core')
const youtube = new YouTube("AIzaSyC_f85BFLDFxhrPe7xw5EP1p7lKnlpe64g")
let client = Koala;
const utils = require('./Handlers/Utils');
  
Koala.queue = new Map() // Music Queue
Koala.votes = new Map(); // Vote Skip
Koala.youtube = new YouTube("AIzaSyC_f85BFLDFxhrPe7xw5EP1p7lKnlpe64g");

require('./TeaMusic')(Koala, utils, ytdl);
//const messageHandler = require('./messageHandler.js');
//const dscord = require("./ADBot.js");

module.exports = Bumper;
