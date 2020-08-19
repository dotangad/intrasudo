const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { Op } = require("sequelize");
const models = require("../models");
const crypto = require("crypto");

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV !== "production"
          ? "http://localhost:3143/auth/google/callback"
          : "https://intra.sudocrypt.com/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const photo = profile.photos[profile.photos.length - 1].value;
        const email = profile.emails[0].value;

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
            email: email,
            photo: photo,
            username: crypto.randomBytes(10).toString("hex"),
            points: 0,
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
