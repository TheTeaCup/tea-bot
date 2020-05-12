const Router = require("express").Router();
const Tea = require("../../Bot/TeaClient.js");
const Quick = require("quick.db");
let Mythical = Tea;
let Website = "https://teabot.mythicalbots.xyz/";

Router.get('/', async(req, res) => {
   let Page = "Home";
   let Query = req.query.q;
   let from = req.query.utm_source
   let Message = null;
   let MaintenanceStuff = 1;
   let MessageDefined = null;
   if(from === "BotBlock") { console.log("User from Bot Block") }
   if(Query === "SUCCESSFULY_LOGGEDOUT") { Message = "You are now logged out.", MessageDefined = 1; };
   if(Query === "SENT_FEEDBACK") { Message = "Your FeedBack was submitted!", MessageDefined = 1; };
  
  let Cert = [];
  let Data = [];
  let Bots = [];
  let New = [];
  
  let bots = Mythical.Servers.get("ids");
  bots.map(Kiro => Bots.push(Kiro));
  
  //console.log(Bots)
  
     Bots.map(Kiro => {
     
     let BotInfo = Mythical.db.get(Kiro);
     let Guild = Mythical.guilds.get(Kiro);
     if(!Guild) { console.log(Kiro) }
     
     let Status = BotInfo.status;
     let desc = BotInfo.summary;
     let Tags = BotInfo.tags;
     //console.log(desc)
     if(Status === "Awaiting Approval")return;
     if(Status === "Inactive")return;
     if(Status === "Disabled")return;
     
     var icon;
     icon = Guild.iconURL;
     if(!icon) icon = "https://i.imgur.com/2otMem9.png";
     if(!desc) { desc = "**No server Description**" };
    
    let html = desc
       
      if(BotInfo.status === "Official") {
        Cert[Cert.length] = {
          id: Kiro,
          name: `${Guild.name}`,
          iconURL: `${icon}`,
          desc: `${html}`,
          tags: `${Tags}`,
          members: Guild.memberCount,
          status: `${Status}`
        };
      };
       
      if(BotInfo.status === "Featured") {
        Data[Data.length] = {
          id: Kiro,
          name: `${Guild.name}`,
          iconURL: `${icon}`,
          desc: `${html}`,
          tags: `${Tags}`,
          members: Guild.memberCount,
          status: `${Status}`
        };
      };
       
   });
  
  let newBots = Mythical.new.get("ids");
  newBots.map(Kiro => {
    
     let BotInfo = Mythical.db.get(Kiro);
     let Guild = Mythical.guilds.get(Kiro);
     
     let Status = BotInfo.status;
     let desc = BotInfo.summary;
     let Tags = BotInfo.tags;
     //console.log(desc)
     if(Status === "Awaiting Approval")return;
     if(Status === "Inactive")return;
     if(Status === "Disabled")return;
     
     var icon;
     icon = Guild.iconURL;
     if(!icon) icon = "https://i.imgur.com/2otMem9.png";
     if(!desc) { desc = "**No server Description**" };
     
    let html = desc
    
        New[New.length] = {
          id: Kiro,
          name: `${Guild.name}`,
          iconURL: `${icon}`,
          desc: `${html}`,
          tags: `${Tags}`,
          members: Guild.memberCount,
          status: `${Status}`
        };
    
    });
  
  if(Data.length === 0) { Data = null };
  if(Cert.length === 0) { Cert = null };
  if(New.length === 0) { New = null };
  
  res.render(process.cwd() + '/src/Web/Views/index.ejs', { user:req.isAuthenticated() ? req.user : null, Mythical, Page, path: req.path, MessageDefined, Message , Cert, Data, New });
});


Router.post("/", async (req, res) => {
  let Bot = req.body.q;
  if (!Bot) Bot = "";
  res.redirect("/bots/search?q=" + Bot);
});

Router.get('/servers', async(req, res) => {
   let Page = "Servers";
   let Data = [];
   let Feat = [];
   let Cert = [];
   let Bots = [];
   let pColor = "grey";
   let presence =  "offline";
   
   let bots = Mythical.Servers.get("ids");
   bots.map(Kiro => Bots.push(Kiro));
  
   Bots.map(Kiro => {
     
     let BotInfo = Mythical.db.get(Kiro);
     let Guild = Mythical.guilds.get(Kiro);
     
     let Status = BotInfo.status;
     let desc = BotInfo.summary;
     let Tags = BotInfo.tags;
    // console.log(desc)
     if(Status === "Awaiting Approval")return;
     if(Status === "Inactive")return;
     if(Status === "Disabled")return; 
     
     var icon;
     icon = Guild.iconURL;
     if(!icon) icon = "https://i.imgur.com/2otMem9.png";
     
   
    let html = desc
 
        Data[Data.length] = {
          id: Kiro,
          name: `${Guild.name}`,
          iconURL: `${icon}`,
          desc: `${html}`,
          tags: `${Tags}`,
          members: Guild.memberCount,
          status: `${Status}`
        };
   });
  
  if(Data.length === 0) { Data = null };
  
  res.render(process.cwd() + '/src/Web/Views/servers.ejs', {user:req.isAuthenticated() ? req.user : null, Mythical, Page, Data, Cert, Feat, path: req.path });
});

Router.get("/remove", checkAuth, async (req, res) => {
  let Query = req.query.q;

  if (Mythical.Developers.includes(req.user.id)) {
    Mythical.new.remove("id", `${Query}`);
    res.redirect("/");
  } else {
    return res.render(process.cwd() + "/src/Web/Views/401.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      req
    });
  }
});

Router.get("/shuffle", checkAuth, async (req, res) => {
  if (Mythical.Developers.includes(req.user.id)) {
    let Bots = Mythical.Bots.get("ids");
    Mythical.emit("shuffle", Bots);

    res.redirect("/");
  } else {
    return res.render(process.cwd() + "/src/Web/Views/401.ejs", {
      Mythical,
      user: req.isAuthenticated() ? req.user : null,
      req
    });
  }
});

/**
 * Social Media handles
 */
Router.get("/twitter", (req, res) => {
  res.redirect("https://twitter.com/MythicalBotList");
});

Router.get("/login", (req, res) => {
  let redirect = req.query.redirect;
  if (!redirect) redirect = "/me";
  //console.log(redirect)
  res.redirect(
    "https://discordapp.com/api/oauth2/authorize?client_id=634391677972512778&redirect_uri=https%3A%2F%2Fteabot.mythicalbots.xyz%2Fapi%2Fcallback&response_type=code&scope=identify%20guilds&prompt=none&state=" +
      redirect
  );
});

Router.get("/logout", function(req, res) {
  req.session.destroy(() => {
    req.logout();
    //     req.flash('success_msg', 'You are logged out');
    res.redirect("/");
  });
});

Router.get("/feedback", async (req, res) => {
  let Page = "Feedback";
  let ErrorMessage = null;
  let Error = req.query.error;
  if (Error === "not_msg") ErrorMessage = "no_message";
  res.render(process.cwd() + "/src/Web/Views/feedback.ejs", {
    user: req.isAuthenticated() ? req.user : null,
    Mythical,
    Page,
    ErrorMessage,
    path: req.path
  });
});

Router.get("/terms-of-service", async (req, res) => {
  let Page = "TermsOfService";
  let ErrorMessage = null;
  let Error = req.query.error;
  if (Error === "not_msg") ErrorMessage = "no_message";
  res.render(process.cwd() + "/src/Web/Views/tos.ejs", {
    user: req.isAuthenticated() ? req.user : null,
    Mythical,
    Page,
    ErrorMessage,
    path: req.path
  });
});

Router.post("/feedback/post/suggestion", checkAuth, async (req, res) => {
  if (req.body.suggestion) {
    Mythical.emit("suggestionSubmit", req);

    res.redirect("/?q=SENT_FEEDBACK");
  } else {
    res.redirect("/feedback?error=not_msg");
  }
});

Router.post("/feedback/post/bug", checkAuth, async (req, res) => {
  if (req.body.bug) {
    Mythical.emit("suggestionBug", req);

    res.redirect("/?q=SENT_FEEDBACK");
  } else {
    res.redirect("/feedback?error=not_msg");
  }
});

Router.get("/search", async (req, res) => {
  let Page = "Search";
  res.render(process.cwd() + "/src/Web/Views/search.ejs", {
    user: req.isAuthenticated() ? req.user : null,
    Mythical,
    Page,
    path: req.path
  });
});

Router.get("/verification", checkAuth, async (req, res) => {
  let Page = "Verify";
  let user = req.isAuthenticated() ? req.user : null;

  Mythical.users.fetch(user.id).then(User => {
    if (Mythical.userBots.has(user.id)) {
      const bots = Mythical.userBots.get(user.id, "UserBotIDs");
      res.render(process.cwd() + "/src/Web/Views/Forms/verification.ejs", {
        user: req.isAuthenticated() ? req.user : null,
        Mythical,
        Page,
        path: req.path,
        user: User,
        bots
      });
    } else {
      res.redirect("/bots/new");
    }
  });
});

Router.post("/verification", checkAuth, async (req, res) => {
  let user = req.isAuthenticated() ? req.user : null;
  Mythical.users.fetch(user.id).then(async User => {
    try {
      await User.send(
        "Thanks for applying for verification! You should get something back in the next ~48 hrs"
      );
    } catch (e) {
      console.log("Failed to DM user.");
    }

    Mythical.channels
      .get("542888302643118095")
      .send({
        embed: {
          color: 7506394,
          fields: [
            {
              name: "Bot / Owner",
              value: "<@" + req.body.bot + "> / <@" + req.user.id + ">"
            },
            {
              name: "Does your bot post server count to our API?",
              value: req.body.server_count
            },
            {
              name: "Is your bot online 24/7 other than short maintenance?",
              value: req.body.online
            },
            {
              name: "Is your bot original code and not a fork of another bot?",
              value: req.body.original_code
            },
            {
              name: "What is your bot's main feature?",
              value: req.body.features
            }
          ]
        }
      })
      .then(m => {
        m.react("✅");
        m.react("❌");
      });

    Mythical.channels
      .get("521463061412839428")
      .send(
        `**-** [**\`Owner\`**: <@${user.id}>] ${
          Mythical.users.get(req.body.bot).tag
        } **\`(${
          req.body.bot
        })\`** has just applied for verification. \n [ **<${Website}bot/${
          req.body.bot
        }>** ]`
      );

    res.redirect("/me");
  });
});

Router.get("/docs", async (req, res) => {
  let Page = "Docs";

  res.render(process.cwd() + "/src/Web/Views/docs.ejs", {
    user: req.isAuthenticated() ? req.user : null,
    Mythical,
    Page,
    path: req.path
  });
});

Router.get("/404", async (req, res) => {
  let user = req.isAuthenticated() ? req.user : null;
  let id;

  if (user === null) {
    id = 1;
  }

  if (user) {
    id = user.id;
  }

  let issue = req.query.error;

  if (issue === "NOT_ADMIN") {
    issue = "You do not have perms.";
  }
  if (issue === "PLEASE_ENTER_A_ID") {
    issue = "Please enter a ID to search";
  }
  if (issue === "NO_SESSION") {
    issue = "You arent logged in.";
  }
  if (issue === "NO_ID") {
    issue = "Please enter a ID to search";
  }
  if (issue === "NOT_BOT") {
    issue = "Please give a BOT ID.";
  }
  if (issue === "BOT_NOT_IN_SERVER") {
    issue = "Please invite the bot to MBL Main";
  }
  if (issue === "BOT_NOT_FOUND") {
    issue = "Bot was not found.";
  }
  if (issue === "NOT_OWNER") {
    issue = "Your not the owner of this bot.";
  }
  if (issue === "NO_OWNER") {
    issue = "The bot has no owner.";
  }
  if (issue === "404") {
    issue = "Page Not Found.";
  }

  if (!issue) issue = "Page Not Found.";
  // console.log(issue);
  res.render(process.cwd() + "/src/Web/Views/404.ejs", {
    Mythical,
    user: req.isAuthenticated() ? req.user : null,
    issue,
    Website,
    path: req.path
  });
});

Router.get("/testing", async (req, res) => {
  let Page = "Test";

  res.render(process.cwd() + "/src/Web/Views/testing.ejs", {
    user: req.isAuthenticated() ? req.user : null,
    Mythical,
    Page,
    path: req.path
  });
});

Router.get("/ads.txt", async (req, res) => {
  res.sendFile(process.cwd() + "/ads.txt");
});

Router.get("/tos", async (req, res) => {
  res.redirect("/terms-of-service");
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
