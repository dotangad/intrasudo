const router = require("express").Router();
const asyncH = require("express-async-handler");
const { Op } = require("sequelize");
const models = require("../models");
const { authenticated, exunite } = require("../lib/auth");
const levelNo = require("../lib/level-no");
const comingSoon = require("../lib/coming-soon");

const roman = {
  6: "VI",
  7: "VII",
  8: "VII",
  9: "IX",
  10: "X",
  11: "XI",
  12: "XII",
};

router.get(
  "/",
  comingSoon(),
  asyncH(async (_, res, next) => {
    try {
      const users = await fetchUsers(false);

      res.render("leaderboard", { users, exun: false });
    } catch (e) {
      return next(e);
    }
  })
);

router.get(
  "/exun",
  authenticated(),
  exunite(),
  comingSoon(),
  asyncH(async (req, res, next) => {
    try {
      const users = await fetchUsers(true);

      res.render("leaderboard", { users, exun: true });
    } catch (e) {
      return next(e);
    }
  })
);

async function fetchUsers(exunOnly) {
  const attributes = [
    "name",
    "class",
    "section",
    "photo",
    "points",
    "currentLevelId",
    "username",
    "disqualified",
    "admin",
    "exunite",
    "finished",
  ];
  const order = [["points", "DESC"]];
  const where = { admin: false };

  let users = [];
  if (exunOnly) {
    users = await models.User.findAll({
      attributes,
      order,
      where: { ...where, exunite: true },
    });
  } else {
    users = await models.User.findAll({
      attributes,
      order,
      where,
    });
  }

  return await Promise.all(
    users.map(async (user) => {
      return {
        ...user.dataValues,
        class: roman[user.class],
        levelNo: await levelNo(user.currentLevelId),
      };
    })
  );
}

module.exports = router;
