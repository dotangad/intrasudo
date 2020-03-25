const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const models = require("../models");
const crypto = require("crypto");

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: "http://localhost:3143/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      models.User.findOne({ where: { googleId: profile.id } })
        .then(user => {
          const photo = profile.photos[profile.photos.length - 1].value;
          const email = profile.emails[0].value;
          if (!user) {
            return models.User.create({
              name: profile.displayName,
              googleId: profile.id,
              email: email,
              photo: photo,
              username: crypto.randomBytes(10).toString("hex"),
              points: 0,
              currentLevelId: 1
            });
          } else {
            if (photo !== user.photo) {
              user.photo = photo;
              user.save();
            }
            done(null, user, "Logged in");
            return "done";
          }
        })
        .then(user => {
          if (user !== "done") {
            done(null, user, "Registered");
          }
        })
        .catch(done);
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.dataValues.id);
});

passport.deserializeUser(function(id, done) {
  models.User.findOne({ where: { id } })
    .then(user => {
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
