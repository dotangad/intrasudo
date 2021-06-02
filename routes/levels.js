const router = require("express").Router();
const asyncH = require("express-async-handler");
const models = require("../models");
const { authenticated, admin, csrfGetToken } = require("../lib/auth");

router.use(authenticated());
router.use(admin());

router.get(
  "/",
  asyncH(async (req, res, next) => {
    try {
      const levels = await models.Level.findAll();
      res.render("levels", { levels });
    } catch (e) {
      next(e);
    }
  })
);

router.post(
  "/new",
  asyncH(async (req, res, next) => {
    try {
      await models.Level.create(req.body);
      res.redirect("/levels/");
    } catch (e) {
      next(e);
    }
  })
);

router.post(
  "/delete",
  asyncH(async (req, res, next) => {
    try {
      console.log("aksjdlakjsd");
      console.log(req.body);
      await models.Level.destroy({ where: { id: parseInt(req.body.id) } });
      return res.redirect("/levels");
    } catch (e) {
      next(e);
    }
  })
);

router.get(
  "/:levelId",
  asyncH(async (req, res, next) => {
    try {
      const level = await models.Level.findOne({
        where: { id: req.params.levelId },
      });

      if (!level) {
        res.redirect("/levels");
      }

      res.render("level", {
        level: level.dataValues,
        levelNo: req.query.l || "_",
      });
    } catch (e) {
      next(e);
    }
  })
);

router.post(
  "/:levelId",
  asyncH(async (req, res, next) => {
    try {
      await models.Level.update(
        {
          question: req.body.question,
          sourceHint: req.body.sourceHint,
          answer: req.body.answer,
          points: req.body.points,
        },
        {
          where: { id: req.params.levelId },
          limit: 1,
        }
      );

      return res.redirect("/levels");
    } catch (e) {
      next(e);
    }
  })
);

module.exports = router;
