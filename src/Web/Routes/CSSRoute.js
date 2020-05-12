const Router = require("express").Router();

/**
 * CSS Files
 */
Router.get("/dark_index.css", (req, res) =>
  res.sendFile(process.cwd() + "/src/Web/Views/CSS/dark_index.css")
);
Router.get("/light_index.css", (req, res) =>
  res.sendFile(process.cwd() + "/src/Web/Views/CSS/light_index.css")
);
Router.get("/newbot.css", (req, res) =>
  res.sendFile(process.cwd() + "/src/Web/Views/CSS/newbot.css")
);
Router.get("/bot.css", (req, res) =>
  res.sendFile(process.cwd() + "/src/Web/Views/CSS/bot.css")
);
Router.get("/bots.css", (req, res) =>
  res.sendFile(process.cwd() + "/src/Web/Views/CSS/bots.css")
);
Router.get("/text-fonts.css", (req, res) =>
  res.sendFile(process.cwd() + "/src/Web/Views/CSS/text-fonts.css")
);
Router.get("/new-bot.css", (req, res) =>
  res.sendFile(process.cwd() + "/src/Web/Views/CSS/newBot.css")
);
Router.get("/form.css", (req, res) =>
  res.sendFile(process.cwd() + "/src/Web/Views/CSS/form.css")
);
Router.get("/codemirror.css", (req, res) =>
  res.sendFile(process.cwd() + "/src/Web/Views/CSS/codemirror.css")
);
Router.get("/3024-night.css", (req, res) =>
  res.sendFile(process.cwd() + "/src/Web/Views/CSS/3024-night.css")
);
Router.get("/page.css", (req, res) =>
  res.sendFile(process.cwd() + "/src/Web/Views/CSS/page.css")
);

Router.get("/", (req, res) =>
  res.send(
    `You're not allowed here! Support Server: https://discord.gg/NmNB7CK Back: <a href="https://mythicalbots.xyz"><div class=""><h1>Go Back</h1></div></a>`
  )
);

module.exports = Router;
