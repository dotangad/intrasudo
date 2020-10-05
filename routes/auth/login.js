const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { unauthenticated } = require("../../lib/auth");
const models = require("../../models");

router.get("/", unauthenticated(), async (req, res, next) => {
  try {
    const e = new Error("Invalid token");
    e.statusCode = 400;

    if (!req.query.token) {
      return res.render("auth/login", {
        title: "Login",
        csrfToken: req.csrfToken(),
        error:null
      });
    }

    const { role, email } = jwt.verify(
      decodeURIComponent(req.query.token),
      process.env.SECRET
    );

    if (role !== "loginpostapproval") {
      throw e;
    }

    let user = await models.User.findOne({ where: { email: email } });
    if (!school) {
      throw e;
    }

    if (!user.emailVerified) {
      const e_ = new Error("Please verify your email");
      e_.statusCode = 400;
      throw e;
    }

    // Login
    req.login(user, err => {
      if (err) {
        return next(err);
      }

      return res.status(200).redirect("/dashboard");
    });
  } catch (e) {
    return next(e);
  }
});

router.post("/", unauthenticated(), (req, res, next) =>
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return res.render("auth/login", {
        title: "Login",
        error: typeof error === "string" ? error : error.message,
        csrfToken: req.csrfToken(),
        ...req.body,
      });
    }

    if (user) {
      return req.logIn(user, err => {
        if (err) {
          return next(err);
        }

        return res.status(200).redirect("/play");
      });
    }

    return res.render("auth/login", {
      title: "Login",
      error: info.message,
      csrfToken: req.csrfToken(),
      ...req.body,
    });
  })(req, res, next)
);

module.exports = router;