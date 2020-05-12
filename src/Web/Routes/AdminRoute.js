const Router = require('express').Router();
const ms = require('parse-ms');
const Mythical = require('../../Bot/TeaClient.js');
//const Shuffle = require('../../Bot/Handlers/Shuffler.js');
let Website = "https://teabot.mythicalbots.xyz";

Router.get('/', checkAuth, async(req, res) => {
  
  let Page = "Admin";
  let pColor = "grey";
  let presence =  "offline";
  let Data = [];
  let feat = [];
  let use = []
  let other = [];
  let Bots = [];
    if (Mythical.Developers.includes(req.user.id)) { 
      
     Mythical.fetchUser(req.user.id).then(async User => {
        
      var member =  Mythical.guilds.get('521461252317249537').members.get(User.id);
      if(!member) { pColor = "grey", presence =  "offline"; };
      if(member) {
      presence =  member.presence.status;
      
      if (presence) {
        if (presence === 'offline') {
          presence = "Offline";
          pColor = 'grey';
        } else if (presence === 'online') {
          presence = "Online";
          pColor = '#43B581';
        } else if (presence === 'dnd') {
          presence = "DND";
          pColor = '#F04747';
        } else if (presence === 'streaming') {
          presence = "Streaming";
          pColor = 'purple';
        } else if (presence === 'idle') {
          presence = "Idle";
          pColor = '#FAA61A';
        } else {
          pColor = 'grey',
          presence = 'Not Available';
        };
      };
     };
        
  Mythical.guilds.map(g=> Bots.push(g.id))
        
        Bots.map(Kiro => {
          
      let Info = Mythical.db.get(Kiro);
      let Guild = Mythical.guilds.get(Kiro);
      let Status = Info.status || "N/A"
      let desc = Info.summary || "N/A"
      let Tags = Info.tags || "N/A"
      let name = Info.name || "N/A"
          
     var icon;
     icon = Guild.iconURL
     if(!icon) icon = "https://i.imgur.com/2otMem9.png";
    
    let html = desc
          
          
      if(Info.status === "Awaiting Approval") {
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
          
    if(Info.status === "Featured") {
        feat[feat.length] = {
          id: Kiro,
          name: `${Guild.name}`,
          iconURL: `${icon}`,
          desc: `${html}`,
          tags: `${Tags}`,
          members: Guild.memberCount,
          status: `${Status}`
        };
      };
          
        other[other.length] = {
          id: Kiro,
          name: `${Guild.name}`,
          iconURL: `${icon}`,
          desc: `${html}`,
          tags: `${Tags}`,
          members: Guild.memberCount,
          status: `${Status}`
        };
          
  });
        
        //Staff
        
        let Users = [];
        let users = Mythical.Staff.map(Kiro => Users.push(Kiro));
        Users.map(Kiro => {
      var member =  Mythical.guilds.get('521461252317249537').members.get(Kiro);
      if(!member) { pColor = "grey", presence =  "offline"; };
      if(member) {
      presence =  member.presence.status;
      
    if (presence) {
      if (presence === 'offline') {
          presence = "Offline";
          pColor = 'offline';
        } else if (presence === 'online') {
          presence = "Online";
          pColor = 'online';
        } else if (presence === 'dnd') {
          presence = "DND";
          pColor = 'dnd';
        } else if (presence === 'streaming') {
          presence = "Streaming";
          pColor = 'streaming';
        } else if (presence === 'idle') {
          presence = "Idle";
          pColor = 'idle';
        } else {
          pColor = 'offline',
          presence = 'Not Available';
        };
      };
     };
          
          
    });
        //console.log(Data)
       res.render(process.cwd() + '/src/Web/Views/admin.ejs', { Mythical, Page, user: req.isAuthenticated() ? req.user : null, Website, User, presence, pColor, Data, feat, use, other });
      
      }).catch(console.error);
    } else {
      return res.render(process.cwd() + '/src/Web/Views/401.ejs', { Mythical, user: req.isAuthenticated() ? req.user : null, path: req.path, req  })
    };
});

Router.get('/restart', checkAuth, async(req, res) => {

    if (Mythical.Developers.includes(req.user.id)) { 
      res.redirect("/?q=restarting");
      await process.exit()
    } else {
      return res.render(process.cwd() + '/src/Web/Views/401.ejs', { Mythical, user: req.isAuthenticated() ? req.user : null, path: req.path, req  })
    };
});

module.exports = Router;

/*
 * Authorization check, if not authorized return them to the login page.
 */
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  } else {
    req.session.backURL = req.url

    res.redirect('/login?redirect=/me');
  }
}