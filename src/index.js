const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const strategy = require("passport-discord").Strategy;
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const Quick = require("quick.db");
const app = express();
const MongoStore = require("connect-mongo")(session);
var Server = require("http").createServer(app);
const Tea = require("./Bot/TeaClient.js");

const MainRoute = require("./Web/Routes/MainRoute.js");
const APIRoute = require("./Web/Routes/APIRoute.js");
const CSSRoute = require("./Web/Routes/CSSRoute.js");
const JSRoute = require("./Web/Routes/JSRoute.js");
const MeRoute = require("./Web/Routes/MeRoute.js");
const ASRoute = require("./Web/Routes/Assets.js");
const InfoRoute = require("./Web/Routes/Info.js");
const AdminRoute = require('./Web/Routes/AdminRoute.js');

app.engine("html", require("ejs").renderFile);
app.all("*", checkHttps);

/* Login setup */
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new strategy(
    {
      clientID: "634391677972512778",
      clientSecret: "kFO52z3vJ_L62TwtoPjw5A5P9FTYNSn_",
      callbackURL: "https://teabot.mythicalbots.xyz/api/callback",
      scope: [ 'guilds', 'identify' ]
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        return done(null, profile);
      });
    }
  )
);

app.use(
  session({
    store: new MongoStore({
      url:
        "mongodb://teacup:56836@bumperpremium-shard-00-00-pacps.mongodb.net:27017,bumperpremium-shard-00-01-pacps.mongodb.net:27017,bumperpremium-shard-00-02-pacps.mongodb.net:27017/test?ssl=true&replicaSet=BumperPremium-shard-0&authSource=admin&retryWrites=true"
    }),
    secret: "FROPT",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(helmet({ frameguard: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

/**
 * Routes
 */
app.use("/", MainRoute);
app.use("/api", APIRoute);
app.use("/css", CSSRoute);
app.use("/js", JSRoute);
app.use("/assets", ASRoute);
app.use("/server", InfoRoute);
app.use("/me", MeRoute);
app.use('/admin', AdminRoute);

const votes = require("./Bot/UpVote.js");
app.post("/api/webhooks/dbl", (req, res) => {
  votes(req, res, Tea);
});

app.use(function(err, req, res, next) {
  // treat as 404
  if (
    err.message &&
    (~err.message.indexOf("not found") ||
      ~err.message.indexOf("Cast to ObjectId failed"))
  ) {
    return next();
  }

  console.error(err.stack);

  if (err.stack.includes("ValidationError")) {
    res.status(422).render(process.cwd() + "/src/Web/Views/422.ejs", {
      user: req.isAuthenticated() ? req.user : null,
      Website: "/login"
    });
    return;
  }

  // error page
  res.status(500).render(process.cwd() + "/src/Web/Views/500.ejs", {
    user: req.isAuthenticated() ? req.user : null,
    Website: req.originalUrl,
    status: "500",
    message: err.message
  });
});

// assume 404 since no middleware responded
app.use(function(req, res) {
  const payload = {
    url: req.originalUrl,
    main: `/`,
    mbl: `Mythical Bot List`,
    error: "Not found"
  };
  res.status(404).render(process.cwd() + "/src/Web/Views/404.ejs", {
    Tea,
    user: req.isAuthenticated() ? req.user : null,
    issue: payload.error,
    Website: payload.main
  });
});

/**
 * Let our application listen to a specific port and connect to Discord.
 */
const Listener = Server.listen(process.env.PORT, () => {
  console.log(
    `[ Tea ] Application is listening on port: ${Listener.address().port}.`
  );
});

Tea.login(process.env.TOKEN).catch(err => {
  console.log(
    `[ Tea (Bot) ] Found an error while connecting to Discord.\n${err.stack}`
  );
});

/**
 * Extra functions.
 */
function checkHttps(req, res, next) {
  if (req.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    res.redirect("https://" + req.hostname + req.url);
  }
}
