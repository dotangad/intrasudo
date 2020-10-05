const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { Strategy: LocalStrategy } = require("passport-local");
const { Op } = require("sequelize");
const models = require("../models");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await models.User.findOne({
          where: { email },
        });
        if (!user) {
          return done("Your account could not be found", null);
        }
        console.log(email)
        console.log(`Hello ******* ${password} - ${user.password}`)
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log(passwordMatch)
        if (passwordMatch) {
          console.log("hello again ***")
          return done(null, user);
        }

        return done("Incorrect password");
      } catch (e) {
        done(e);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, [!!user.password, user.email]);
});

passport.deserializeUser(function (email, done) {
  models.User.findOne({ where: { email } })
    .then((user) => {
      if (!user) {
        const err = new Error("User does not exist, please login again");
        err.statusCode = 400;
        return done(err, null);
      } else {
        return done(null, user);
      }
    })
    .catch(done);
});
