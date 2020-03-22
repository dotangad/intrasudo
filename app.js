const express = require("express");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const helmet = require("helmet");
const compression = require("compression");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);
const crypto = require("crypto");
const path = require("path");
const cors = require("cors");
const routes = require("./routes");

const client = redis.createClient(process.env.REDIS_URL);
const app = express();

// Views and static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// Middleware
app.use(logger("dev"));
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, "react_build")));
app.use(
  session({
    store: new RedisStore({ client }),
    secret: process.env.SECRET || crypto.randomBytes(20).toString("hex"),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true
    }
  })
);

// Passport
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// Add auth info to template locals
app.use((req, res, next) => {
  res.locals.authenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

app.use("/", routes);

app.get("*", (req, res) => res.render("404"));

app.use((err, req, res, next) => {
  console.log(err);

  // Set statusCode to 500 if it isn't already there
  err.statusCode = err.statusCode || 500;
  err.message = err.message || err.name || "Internal Server Error";
  err.code = err.code || err.name || "500_INTERNAL_SERVER_ERR";

  // TODO: turn this into a template
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    code: err.code,
    details: err.details
  });
  return;
});

module.exports = app;
