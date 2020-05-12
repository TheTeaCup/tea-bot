const Router = require("express").Router();
const markdownIt = require("markdown-it");
const ms = require("parse-ms");
const Discord = require("discord.js");
let Mythical = require("../../Bot/TeaClient.js");
let Website = "https://teabot.mythicalbots.xyz/";
const Quick = require("quick.db");

Router.get("/:ID", async (req, res) => {
  let UpV = null;
  let hr = req.query.h;
  let min = req.query.m;

  let ID = req.params.ID;
  if (!ID)
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });

  if (isNaN(ID)) {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }
  let guild = Mythical.db.get(`${ID}`); //Fetch our info on the guild.
  if (!guild) {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }
  let Guild = Mythical.guilds.get(`${ID}`); //Fetch Discord info on the guild.
  if (!Guild) {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }
  let ShortDesc = guild.summary;
  let LongDesc = await Quick.fetch(`description_${ID}`);
  let LastBump = null;

  if (Mythical.lastBump.has(ID)) {
    LastBump = Mythical.lastBump.get(ID, "last");
  }

  let owner = guild.owner;
  let Status = guild.status;
  let Tags = guild.tags;
  let timeObj;

  let Allowed = [];
  Allowed.push(owner);
  Mythical.Staff.map(k => Allowed.push(k));

  if (!LongDesc) {
    LongDesc = "**No server Description**";
  }
  if (LastBump === null) {
    timeObj = "Never Bumped";
  } else {
    timeObj = ms(Date.now() - LastBump);
  }
  let html;

   if (LongDesc)
          html = markdownIt({
            html: true,
            linkify: true,
            typographer: true,
            breaks: false
          }).render(LongDesc);

  Mythical.fetchUser(owner).then(Owner => {
    res.render(process.cwd() + "/src/Web/Views/server.ejs", {
      user: req.isAuthenticated() ? req.user : null,
      Mythical,
      Guild,
      html,
      ShortDesc,
      timeObj,
      website: guild.website,
      Tags,
      Status,
      Owner,
      Allowed,
      UpV,
      min,
      hr
    }); //sends the visitor to the servers page
  });
});

Router.get("/:ID/bump", checkAuth, async (req, res) => {
  let ID = req.params.ID;
  if (!ID)
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  let Option = "enabled";

  if (isNaN(ID)) {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }

  let Bots = [];
  let bots = Mythical.Servers.get("ids");
  bots.map(Kiro => Bots.push(Kiro));

  if (Bots.includes(ID)) {
    //  Mythical.lastBump.set(ID, Date.now(), "last");
    let lastDaily = null;

    if (Mythical.lastBump.has(ID)) {
      lastDaily = Mythical.lastBump.get(ID, "last");
    }

    let cooldown = 1.08e7;

    if (lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0) {
      let timeObj = ms(cooldown - (Date.now() - lastDaily));
      res.redirect(`/server/${ID}?h=${timeObj.hours}&m=${timeObj.minutes}`);
    } else {
      Mythical.lastBump.set(ID, Date.now(), "last");

      let Bumps = Mythical.bumps.get(ID, "bumps");
      let BumpCount = Bumps + 1;
      Mythical.bumps.set(ID, BumpCount, "bumps");
      res.redirect(`/server/${ID}?q=UPV`);

      let Bump = "";
      if (Mythical.bumps.has(req.user.id)) {
        Bump = Mythical.bumps.get(req.user.id, "bumps");
      }
      let BC = Bump + 1;
      console.log(BC);
      Mythical.bumps.set(req.user.id, BC, "bumps");
    }
  } else {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }
});

Router.get("/:ID/edit", checkAuth, async (req, res) => {
  let ID = req.params.ID;
  if (!ID)
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });

  if (isNaN(ID)) {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }

  let Bots = [];
  let bots = Mythical.Servers.get("ids");
  bots.map(Kiro => Bots.push(Kiro));

  //  console.log(Bots)

  if (Bots.includes(ID)) {
    let BotInfo = Mythical.db.get(ID);
    console.log(BotInfo)
    let Allowed = [];
    Allowed.push(BotInfo.owner);
    Mythical.Staff.map(k => Allowed.push(k));

    if (Allowed.includes(req.user.id)) {
      let Guild = Mythical.guilds.get(ID);
      if (!Guild)
        return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
          Mythical,
          user: req.isAuthenticated() ? req.user : null,
          path: req.path
        });
      let Page = "Edit";

      //console.log(auth)

      let Status = BotInfo.status;
      let Tags = BotInfo.tags;
      let shortdesc = BotInfo.summary;
      let Web = BotInfo.website;
      let Invite = BotInfo.invite;
      let Desc = await Quick.fetch(`description_${ID}`);
      console.log(BotInfo);

      let slotOne;
      let slotTwo;
      let slotThree;
      let slotFour;
      let slotFive;

      if (Tags) {
        slotOne = Tags[0];
        slotTwo = Tags[1];
        slotThree = Tags[2];
        slotFour = Tags[3];
        slotFive = Tags[4];
      }

      res.render(process.cwd() + "/src/Web/Views/Forms/edit.ejs", {
        Mythical,
        Page,
        user: req.isAuthenticated() ? req.user : null,
        Website,
        Guild,
        Tags,
        Status,
        Web,
        Invite,
        shortdesc,
        Desc,
        slotOne,
        slotTwo,
        slotThree,
        slotFour,
        slotFive,
        path: req.path
      });
    } else {
      return res.render(process.cwd() + "/src/Web/Views/401.ejs", {
        Mythical,
        user: req.isAuthenticated() ? req.user : null,
        path: req.path,
        req
      });
    }
  } else {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }
});

Router.post("/:ID/edit", checkAuth, async (req, res) => {
  let ID = req.params.ID;
  if (!ID) return res.redirect("/404");

  if (isNaN(ID)) {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }

  let Bots = [];
  let bots = Mythical.Servers.get("ids");
  bots.map(Kiro => Bots.push(Kiro));

  if (Bots.includes(ID)) {
    let BotInfo = Mythical.db.get(ID);

    let Guild = Mythical.guilds.get(ID);
    if (!Guild)
      return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
        Mythical,
        user: req.isAuthenticated() ? req.user : null,
        path: req.path
      });

    let data = req.body;
    console.log(data);

    let Tags = [];

    if (data.tag1) {
      Tags.push(data.tag1);
    }
    if (data.tag2) {
      Tags.push(data.tag2);
    }
    if (data.tag3) {
      Tags.push(data.tag3);
    }
    if (data.tag4) {
      Tags.push(data.tag4);
    }
    if (data.tag5) {
      Tags.push(data.tag5);
    }

    let Info = Mythical.db.get(ID);
    if (Info.tags.length > 5) {
      console.log("More thank 5 tags!");
    }

    let Data = {
      id: Guild.id,
      name: Guild.name,
      longDesc: data.fulldesc || "**No server Description**",
      summary: data.desc,
      website: "",
      createdTimestamp: Info.createdTimestamp,
      lastEdited: Date.now(),
      lastBump: Info.lastBump,
      status: Info.status,
      invite: data.discjoin || "",
      owner: Guild.owner.id,
      tags: Tags || ""
    };

    Mythical.db.set(ID, Data);
    
    Quick.set(`description_${ID}`,data.fulldesc);
    res.redirect("/server/" + Guild.id);
    Mythical.channels
      .get("662739876495753216")
      .send(
        `**-** **\`${Mythical.users.get(req.user.id).tag}\`** has just edited ${
          Guild.name
        } **\`(${Guild.id})\`** \n [ **<${Website}server/${Guild.id}>** ]`
      );
  } else {
    res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }
});

/* START OF APPROVE STUFF */

Router.get("/:ID/approve", checkAuth, async (req, res) => {
  let hr = req.query.h;
  let min = req.query.m;

  let ID = req.params.ID;
  if (!ID)
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });

  if (isNaN(ID)) {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }

  let guild = Mythical.db.get(`${ID}`); //Fetch our info on the guild.
  if (!guild) {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }

  let Guild = Mythical.guilds.get(`${ID}`); //Fetch Discord info on the guild.
  if (!Guild) {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }

  let ShortDesc = guild.summary;
  let LongDesc = guild.longDesc;
  let LastBump = guild.lastBump;
  let owner = guild.owner;
  let Status = guild.status;
  let Tags = guild.tags;
  let timeObj;

  let Allowed = [];
  Allowed.push(owner);
  Mythical.Staff.map(k => Allowed.push(k));

  if (!LongDesc) {
    LongDesc = "**No server Description**";
  }
  if (LastBump === null) {
    timeObj = "Never Bumped";
  } else {
    timeObj = ms(Date.now() - LastBump);
  }
  let Info = Mythical.db.get(ID);
  if (Info.status === "Approved") {
    let Data = {
      id: Guild.id,
      name: Guild.name || "",
      longDesc: guild.longDesc || "**No server Description**",
      summary: guild.summary,
      website: "",
      createdTimestamp: guild.createdTimestamp,
      lastEdited: Date.now(),
      lastBump: guild.lastBump,
      status: "Disabled",
      invite: guild.invite || "",
      owner: Guild.owner.id,
      tags: guild.tags || ""
    };

    Mythical.db.set(ID, Data);
    res.redirect("/server/" + Guild.id);
    Mythical.channels
      .get("662739876495753216")
      .send(
        `**-** **\`${
          Mythical.users.get(req.user.id).tag
        }\`** has temporarily disabled ${Guild.name} **\`(${
          Guild.id
        })\`** \n [ **<${Website}server/${Guild.id}>** ]`
      );
  } else {
    let Data = {
      id: Guild.id,
      name: Guild.name || "",
      longDesc: guild.longDesc || "**No server Description**",
      summary: guild.summary,
      website: "",
      createdTimestamp: guild.createdTimestamp,
      lastEdited: Date.now(),
      lastBump: guild.lastBump,
      status: "Approved",
      invite: guild.invite || "",
      owner: Guild.owner.id,
      tags: guild.tags || ""
    };

    Mythical.db.set(ID, Data);
    res.redirect("/server/" + Guild.id);
    Mythical.channels
      .get("662739876495753216")
      .send(
        `**-** **\`${
          Mythical.users.get(req.user.id).tag
        }\`** has just approved ${Guild.name} **\`(${
          Guild.id
        })\`** \n [ **<${Website}server/${Guild.id}>** ]`
      );
  }
}); /* else {
   res.render(process.cwd() + '/src/Web/Views/servernotfound.ejs', { Mythical, user: req.isAuthenticated() ? req.user : null, path: req.path  });
  }; */

/* END OF APPROVE STUFF */

Router.get("/:ID/feature", checkAuth, async (req, res) => {
  let ID = req.params.ID;
  if (!ID) return res.redirect("/404");

  if (isNaN(ID)) {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }

  let Bots = [];
  let bots = Mythical.Servers.get("ids");
  bots.map(Kiro => Bots.push(Kiro));

  if (Bots.includes(ID)) {
    let BotInfo = Mythical.db.get(ID);

    let Guild = Mythical.guilds.get(ID);
    if (!Guild)
      return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
        Mythical,
        user: req.isAuthenticated() ? req.user : null,
        path: req.path
      });

    let Info = Mythical.db.get(ID);
    console.log(Info);

    if (Info.status === "Featured") {
      let Data = {
        id: Guild.id,
        name: Guild.name || "",
        longDesc: Info.longDesc || "**No server Description**",
        summary: Info.summary,
        website: "",
        createdTimestamp: Info.createdTimestamp,
        lastEdited: Date.now(),
        lastBump: Info.lastBump,
        status: "Approved",
        invite: Info.invite || "",
        owner: Guild.owner.id,
        tags: Info.tags || ""
      };

      Mythical.db.set(ID, Data);
      res.redirect("/server/" + Guild.id);
      Mythical.channels
        .get("662739876495753216")
        .send(
          `**-** ${Guild.name} **\`(${Guild.id})\`** is no-longer being featured. \n [ **<${Website}server/${Guild.id}>** ]`
        );
    } else {
      let Data = {
        id: Guild.id,
        name: Guild.name || "",
        longDesc: Info.longDesc || "**No server Description**",
        summary: Info.summary,
        website: "",
        createdTimestamp: Info.createdTimestamp,
        lastEdited: Date.now(),
        lastBump: Info.lastBump,
        status: "Featured",
        invite: Info.invite || "",
        owner: Guild.owner.id,
        tags: Info.tags || ""
      };

      Mythical.db.set(ID, Data);
      res.redirect("/server/" + Guild.id);
      Mythical.channels
        .get("662739876495753216")
        .send(
          `**-** ${Guild.name} **\`(${Guild.id})\`** is now being featured. \n [ **<${Website}server/${Guild.id}>** ]`
        );
    }
  } else {
    res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }
});

Router.get("/:ID/official", checkAuth, async (req, res) => {
  let ID = req.params.ID;
  if (!ID) return res.redirect("/404");

  if (isNaN(ID)) {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }

  let Bots = [];
  let bots = Mythical.Servers.get("ids");
  bots.map(Kiro => Bots.push(Kiro));

  if (Bots.includes(ID)) {
    let BotInfo = Mythical.db.get(ID);

    let Guild = Mythical.guilds.get(ID);
    if (!Guild)
      return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
        Mythical,
        user: req.isAuthenticated() ? req.user : null,
        path: req.path
      });

    let Info = Mythical.db.get(ID);

    if (Info.status === "Official") {
      let Data = {
        id: Guild.id,
        name: Guild.name || "",
        longDesc: Info.longDesc || "**No server Description**",
        summary: Info.summary,
        website: "",
        createdTimestamp: Info.createdTimestamp,
        lastEdited: Date.now(),
        lastBump: Info.lastBump,
        status: "Approved",
        invite: Info.invite || "",
        owner: Guild.owner.id,
        tags: Info.tags || ""
      };

      Mythical.db.set(ID, Data);
      res.redirect("/server/" + Guild.id);
      Mythical.channels
        .get("662739876495753216")
        .send(
          `**-** ${Guild.name} **\`(${Guild.id})\`** is no-longer being recognized as an Official Server. \n [ **<${Website}server/${Guild.id}>** ]`
        );
    } else {
      let Data = {
        id: Guild.id,
        name: Guild.name || "",
        longDesc: Info.longDesc || "**No server Description**",
        summary: Info.summary,
        website: "",
        createdTimestamp: Info.createdTimestamp,
        lastEdited: Date.now(),
        lastBump: Info.lastBump,
        status: "Official",
        invite: Info.invite || "",
        owner: Guild.owner.id,
        tags: Info.tags || ""
      };

      Mythical.db.set(ID, Data);
      res.redirect("/server/" + Guild.id);
      Mythical.channels
        .get("662739876495753216")
        .send(
          `**-** ${Guild.name} **\`(${Guild.id})\`** is now being recognized as an Official Server!. \n [ **<${Website}server/${Guild.id}>** ]`
        );
    }
  } else {
    res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }
});

Router.get("/:ID/removedescs", checkAuth, async (req, res) => {
  let hr = req.query.h;
  let min = req.query.m;

  let ID = req.params.ID;
  if (!ID)
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });

  if (isNaN(ID)) {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }

  let guild = Mythical.db.get(`${ID}`); //Fetch our info on the guild.
  if (!guild) {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }

  let Guild = Mythical.guilds.get(`${ID}`); //Fetch Discord info on the guild.
  if (!Guild) {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }

  let ShortDesc = guild.summary;
  let LongDesc = guild.longDesc;
  let LastBump = guild.lastBump;
  let owner = guild.owner;
  let Status = guild.status;
  let Tags = guild.tags;
  let timeObj;

  let Allowed = [];
  Allowed.push(owner);
  Mythical.Staff.map(k => Allowed.push(k));

  if (!LongDesc) {
    LongDesc = "**No server Description**";
  }
  if (LastBump === null) {
    timeObj = "Never Bumped";
  } else {
    timeObj = ms(Date.now() - LastBump);
  }
  let Info = Mythical.db.get(ID);

  let Data = {
    id: Guild.id,
    name: Guild.name || "",
    longDesc:
      "[- Content Removed Please provide an appropriate description. -]" ||
      "**No server Description**",
    summary:
      "[- Content Removed Please provide an appropriate description. -]" ||
      "**No server Description**",
    website: "",
    createdTimestamp: guild.createdTimestamp,
    lastEdited: Date.now(),
    lastBump: guild.lastBump,
    status: guild.status,
    invite: guild.invite || "",
    owner: Guild.owner.id,
    tags: guild.tags || ""
  };

  Mythical.db.set(ID, Data);
  res.redirect("/server/" + Guild.id);
  Mythical.channels
    .get("662739876495753216")
    .send(
      `**-** **\`[TeaBot]\`** has removed the description & summary for the server ${Guild.name} **\`(${Guild.id})\`** \n [ **<${Website}server/${Guild.id}>** ]`
    );
});

Router.get("/:ID/invite", checkAuth, async (req, res) => {
  let ID = req.params.ID;
  if (!ID)
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  let Option = "enabled";

  if (isNaN(ID)) {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }

  let Bots = [];
  let bots = Mythical.Servers.get("ids");
  bots.map(Kiro => Bots.push(Kiro));

  let Info = Mythical.db.get(ID);

  if (Bots.includes(ID)) {
    let Invite =
      Info.invite ||
      Info.discjoin ||
      "https://teabot.mythicalbots.xyz/server/" + ID + "?q=no_inv";

    res.redirect(`${Invite}`);
  } else {
    return res.render(process.cwd() + "/src/Web/Views/servernotfound.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      path: req.path
    });
  }
});

module.exports = Router;

/*
 * Authorization check, if not authorized return them to the login page.
 */
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.session.backURL = req.url;

    res.redirect("/login?redirect=" + req.url);
  }
}
