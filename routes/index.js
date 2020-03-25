const router = require("express").Router();
const auth = require("./auth");
const levels = require("./levels");
const play = require("./play");
const leaderboard = require("./leaderboard");
const users = require("./users");

router.get("/", (req, res) =>
  res.render("index", {
    title: req.isAuthenticated() ? "Instructions" : "Sign in"
  })
);

router.use("/auth", auth);
router.use("/levels", levels);
router.use("/play", play);
router.use("/leaderboard", leaderboard);
router.use("/users", users);

module.exports = router;
