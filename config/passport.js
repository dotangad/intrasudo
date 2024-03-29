const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { Op } = require("sequelize");
const models = require("../models");
const randomWords = require("random-words");

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async function (_accessToken, _refreshToken, profile, done) {
      try {
        const photo = profile.photos[profile.photos.length - 1].value;
        const email = profile.emails[0].value;

        const match = profile.displayName.match(/(\d+) ?([A-Z])$/m);
        let class_, section;
        if (match && match[1] && match[2]) {
          class_ = match[1];
          section = match[2];
        }

        const user = await models.User.findOne({
          where: { googleId: profile.id },
        });

        if (!user) {
          const currentLevelId = await models.Level.findOne({
            attributes: ["id"],
            where: {
              id: {
                [Op.gt]: 0,
              },
            },
            order: [["id", "ASC"]],
          });

          const newUser = await models.User.create({
            name: profile.displayName,
            googleId: profile.id,
            email,
            photo,
            points: 0,
            class: class_,
            section,
            currentLevelId: currentLevelId.id,
          });

          return done(null, newUser, "Registered");
        }

        if (photo !== user.photo) {
          user.photo = photo;
          await user.save();
        }

        return done(null, user, "Logged in");
      } catch (err) {
        console.error(err);
        done(err);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.dataValues.id);
});

passport.deserializeUser(function (id, done) {
  models.User.findOne({ where: { id } })
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
