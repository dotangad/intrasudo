const router = require("express").Router();

router.use("/register", require("./register"));
router.use("/login", require("./login"));
// router.use("/admin", require("./admin"));
// router.use("/initial", require("./initial"));
// router.get("/verify", ...require("./email-verify"));

router.get("/me", (req, res) =>
  res.json({ isAuthenticated: req.isAuthenticated(), user: req.user })
);
router.get("/verify", ...require("./email-verify"));

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

module.exports = router;