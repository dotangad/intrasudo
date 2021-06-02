const router = require("express").Router();
const asyncH = require("express-async-handler");
const { Op } = require("sequelize");
const models = require("../models");
const { authenticated, discordVerified } = require("../lib/auth");
const comingSoon = require("../lib/coming-soon");
const fin = require("../lib/fin");

// async function points(level) {
// const solvePos =
// (await models.Attempt.count({
// where: { LevelId: level.id, attempt: level.answer },
// })) + 1;
//
// return level.points + level.points / solvePos;
// }

async function points(level) {
  return level.points;
}

async function getNextLevel(currentLevelId) {
  const level = await models.Level.findOne({
    where: {
      id: {
        [Op.gt]: currentLevelId,
      },
    },
  });

  return level;
}

async function redirectIfFinished(req, res, next) {
  if (req.user.finished) {
    res.redirect("/play/fin");
  } else {
    next();
  }
}

function redirectIfNotRegistered(req, res, next) {
  if (!req.user.username) {
    return res.redirect("/auth/initial");
  }

  return next();
}

const getCurrentLevel = asyncH(async (req, res, next) => {
  req.currentLevel = await models.Level.findOne({
    where: { id: req.user.currentLevelId },
  });

  res.locals.levelNo =
    (await models.Level.count({
      where: {
        id: {
          [Op.lte]: req.currentLevel.id,
        },
      },
    })) - 1;

  next();
});

router.use(fin());
router.use(authenticated());
router.use(discordVerified());
router.use(comingSoon());

router.get(
  "/",
  redirectIfNotRegistered,
  getCurrentLevel,
  redirectIfFinished,
  asyncH(async (req, res, next) => {
    try {
      return res.render("play", {
        question: req.currentLevel.question,
        sourceHint: req.currentLevel.sourceHint,
        id: req.currentLevel.id,
        error: false,
      });
    } catch (e) {
      res.locals.error = "An error occurred";
      res.render("play", {
        question: "",
        sourceHint: "",
        id: "Error",
      });
    }
  })
);

router.post(
  "/",
  redirectIfNotRegistered,
  getCurrentLevel,
  redirectIfFinished,
  function validation(req, res, next) {
    if (!req.body.answer || req.body.answer === "") {
      res.locals.error = "Answer can not be empty";
      return res.render("play", {
        question: req.currentLevel.question,
        sourceHint: req.currentLevel.sourceHint,
        id: req.currentLevel.id,
      });
    }
    if (!/^[a-z0-9]+$/.test(req.body.answer)) {
      res.locals.error =
        "Answer must only consist of numbers and lowercase letters.";
      return res.render("play", {
        question: req.currentLevel.question,
        sourceHint: req.currentLevel.sourceHint,
        id: req.currentLevel.id,
      });
    }
    return next();
  },
  asyncH(async (req, res, next) => {
    try {
      // Log user lastMoveTime
      req.user.lastMoveTime = new Date();

      // Log attempt
      const attempt = {
        attempt: req.body.answer,
        UserId: req.user.id,
        LevelId: req.user.currentLevelId,
        correct: false,
      };

      // Checking mechanism
      if (req.currentLevel.answer === req.body.answer) {
        const greatestLevelId = await models.Level.findOne({
          attributes: ["id"],
          order: [["id", "DESC"]],
        });

        // If we're at the last level
        if (req.user.currentLevelId === greatestLevelId.dataValues.id) {
          req.user.points += await points(req.currentLevel);
          req.user.finished = true;
          res.redirect("/play/fin");
        } else {
          const nextLevel = await getNextLevel(req.currentLevel.id);

          req.user.points += await points(req.currentLevel);

          if (nextLevel) {
            req.session.currentLevel = nextLevel;
            req.session.currentLevelNo += 1;
            req.user.currentLevelId = nextLevel.id;
          }

          attempt.correct = true;
          res.redirect("/play");
        }
      } else {
        res.locals.error = "Incorrect answer";

        res.render("play", {
          question: req.currentLevel.question,
          sourceHint: req.currentLevel.sourceHint,
          id: req.currentLevel.id,
        });
      }

      await req.user.save();
      await models.Attempt.create(attempt);
    } catch (e) {
      return next(e);
    }
  })
);

router.get(
  "/fin",
  redirectIfNotRegistered,
  asyncH(async function verifyFinished(req, res, next) {
    if (req.user.finished) {
      return next();
    }

    return res.redirect("/play");
  }),
  (req, res, next) => res.render("finished")
);

module.exports = router;
