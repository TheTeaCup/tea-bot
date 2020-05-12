const Router = require("express").Router();
const passport = require("passport");
let Developers = ["338192747754160138", "488659939170975744"];
const Bumper = require("../../Bot/TeaClient.js");
const Quick = require("quick.db");
const JsSearch = require("js-search");
let Mythical = Bumper;

/**
 * Main API route
 */

Router.get(
  "/callback",
  passport.authenticate("discord", { failureRedirect: "/404" }),
  (req, res) => {
    console.log(req.user);
    //console.log(`Testing: ` + req.query.state);
    //addUser(req.user);
    if (Bumper.Developers.includes(req.user.id)) {
      req.session.isAdmin = true;
    } else {
      req.session.isAdmin = false;
    }
    res.redirect("/me");

    /* let UserLoginEmbed = new Discord.MessageEmbed()
      .setColor(Mythical.Color)
      .setThumbnail(
        `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.gif`
      )
      .setDescription(
        `${req.user.username}#${req.user.discriminator} Just logged in!`
      );*/
    //Mythical.channels.get("595314158958805003").send(UserLoginEmbed)
  }
);

Router.get("/undefined", (req, res) => {
  res.redirect("/me");
});

Router.get("/s/:ID/recent-remove", (req, res) => {
  let guild = Bumper.guilds.get(req.params.ID);
  if (!guild) return console.log("Server not found");
  Bumper.recent.remove("recent", guild.id);
  res.redirect("/bumped");
});

Router.get("/servers/search", (req, res) => {
  let bots = Mythical.Servers.get("ids");
  let Bots = [];

  bots.map(Kiro => {
    let Bumps = Mythical.bumps.get(Kiro, "bumps");
    let data = Mythical.db.get(Kiro);

    let ServerInfo = {
      id: Kiro,
      name: data.name,
      longDesc: data.longDesc,
      summary: data.summary,
      website: data.website,
      createdTimestamp: data.createdTimestamp,
      lastEdited: data.lastEdited,
      lastBump: data.lastBump,
      status: data.status,
      invite: data.invite,
      owner: data.owner,
      tags: data.tags,
      bumps: `${Bumps}`
    };

    Bots.push(ServerInfo);
  });

  var search = new JsSearch.Search("id");
  search.addIndex("id");
  search.addIndex("name");
  search.addIndex("owner");
  search.addIndex("tags");

  let botArray = [];

  Object.keys(Bots).forEach(key => {
    botArray[botArray.length] = Bots[key];
  });

  search.addDocuments(botArray);
  res.send(search.search(req.query.q));
});

Router.get("/server/:ID/icon", async (req, res) => {
  let ID = req.params.ID;
  if (!ID) return res.send({ error: "Please give a bot ID" });

  if (isNaN(ID)) {
    return res.send({ error: "'id' must be a snowflake" });
  }

  let icon = "";
  let Guild = Mythical.guilds.get(ID);
  if (!Guild) {
    icon = "https://i.imgur.com/2otMem9.png";
  }
  if (Guild) {
    icon = Guild.iconURL;
  }

  return res.redirect(`${icon}`);
});

module.exports = Router;
