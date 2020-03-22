const router = require("express").Router();
const auth = require("./auth");

router.get("/", (req, res) =>
  res.render("index", {
    title: req.isAuthenticated() ? "Instructions" : "Sign in"
  })
);

router.use("/auth", auth);

module.exports = router;
