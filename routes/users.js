const router = require("express").Router();
const asyncH = require("express-async-handler");
const moment = require("moment");
const models = require("../models");
const { authenticated, admin } = require("../lib/auth");
const levelNo = require("../lib/level-no");

const toggleUserProp = prop => [
  authenticated(),
  admin(),
  asyncH(async (req, res, next) => {
    try {
      const user = await models.User.findOne({
        where: { username: req.body.username }
      });
      console.log(req.body.username, user);

      if (!user) {
        return res.redirect("/leaderboard");
      }

      user[prop] = !user[prop];
      await user.save();

      return res.redirect(`/users/${user.username}`);
    } catch (e) {
      return next(e);
    }
  })
];

const roman = {
  6: "VI",
  7: "VII",
  8: "VIII",
  9: "IX",
  10: "X",
  11: "XI",
  12: "XII"
};

router.post("/dq", ...toggleUserProp("disqualified"));
router.post("/exunite", ...toggleUserProp("exunite"));
router.post("/admin", ...toggleUserProp("admin"));

router.get(
  "/:username",
  asyncH(async (req, res, next) => {
    try {
      const user = await models.User.findOne({
        where: { username: req.params.username }
      });

      if (!user) {
        return res.redirect("/leaderboard");
      }

      let attempts = [];
      if (req.user && req.user.admin) {
        attempts = (
          await models.Attempt.findAll({
            where: {
              UserId: req.user.id
            },
            include: [
              { model: models.Level, attributes: ["question", "answer"] }
            ]
          })
        ).map(a => {
          const time = new Date(a.createdAt);
          return {
            ...a.dataValues,
            date: time.toLocaleDateString("hi-IN"),
            time: time.toLocaleTimeString("hi-IN"),
            level: a.Level.question,
            correct: a.Level.answer
          };
        });
      }

      res.render("user", {
        dUser: {
          ...user.dataValues,
          class: roman[user.class]
        },
        levelNo: await levelNo(user.currentLevelId),
        lastMoveTime: moment(user.lastMoveTime, "Do MMMM YYYY").fromNow(),
        attempts
      });
    } catch (e) {
      return next(e);
    }
  })
);

module.exports = router;
