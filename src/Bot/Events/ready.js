const MythicalAPI = require("mythical-api");
let API = new MythicalAPI("eN41L0CDvPu6zbhNF7YEeEjOfRbsQ3-2aI.qpKw67NXX5Q5MEz");

module.exports = async(Bumper) => {
  console.log('( Bot ) Connected to Discord.');
  
Bumper.user.setPresence({ game: { name: `WIth my code!`,  type: 1 } });
Bumper.user.setStatus('idle');
  
  API.postStats(Bumper.guilds.size, Bumper.user.id);
  setInterval(function() {
API.postStats(Bumper.guilds.size, Bumper.user.id);
}, 900000);
  
//Dashboard Owner Sync
Bumper.appInfo = await Bumper.fetchApplication();
setInterval( async () => {
Bumper.appInfo = await Bumper.fetchApplication();
}, 60000);
  let Mythical = Bumper;
    require("../../RoleReaction.js")(Mythical);

  
};