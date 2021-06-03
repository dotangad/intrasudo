const router = require("express").Router();
const asyncH = require("express-async-handler");
const moment = require("moment");
const models = require("../models");
const { authenticated, admin } = require("../lib/auth");
const levelNo = require("../lib/level-no");

const toggleUserProp = (prop) => [
  authenticated(),
  admin(),
  asyncH(async (req, res, next) => {
    try {
      const user = await models.User.findOne({
        where: { username: req.body.username },
      });
      if (!user) {
        return res.redirect("/leaderboard");
      }

      user[prop] = !user[prop];
      await user.save();

      return res.redirect(`/users/${user.username}`);
    } catch (e) {
      return next(e);
    }
  }),
];

const roman = {
  6: "VI",
  7: "VII",
  8: "VIII",
  9: "IX",
  10: "X",
  11: "XI",
  12: "XII",
};

router.post("/dq", ...toggleUserProp("disqualified"));
router.post("/exunite", ...toggleUserProp("exunite"));
router.post("/admin", ...toggleUserProp("admin"));

router.get(
  "/:username",
  asyncH(async (req, res, next) => {
    try {
      const user = await models.User.findOne({
        where: { username: req.params.username },
      });

      if (!user) {
        return res.redirect("/leaderboard");
      }

      let attempts = [];
      if (req.user && req.user.admin) {
        attempts = (
          await models.Attempt.findAll({
            where: {
              UserId: user.id,
            },
            order: [["createdAt", "DESC"]],
            include: [
              { model: models.Level, attributes: ["question", "answer"] },
            ],
          })
        ).map((a) => {
          const time = new Date(a.createdAt);
          const istTimestamp = time.getTime() + 5.5 * 60 * 60 * 1000;
          const istTime = new Date(istTimestamp);
          return {
            ...a.dataValues,
            date: istTime.toLocaleDateString("hi-IN"),
            time: istTime.toLocaleTimeString("hi-IN"),
            level: a.Level.question,
            correct: a.Level.answer,
          };
        });
      }

      res.render("user", {
        dUser: {
          ...user.dataValues,
          class: roman[user.class],
        },
        levelNo: (await levelNo(user.currentLevelId)) - 1,
        lastMoveTime: user.lastMoveTime
          ? moment(user.lastMoveTime, "Do MMMM YYYY").fromNow()
          : null,
        attempts,
      });
    } catch (e) {
      return next(e);
    }
  })
);

module.exports = router;
