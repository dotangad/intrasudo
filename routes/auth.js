const router = require("express").Router();
const asyncH = require("express-async-handler");
const passport = require("passport");
const { authenticated } = require("../lib/auth");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    if (req.user.username) {
      res.redirect("/");
    } else {
      res.redirect("/auth/initial");
    }
  }
);

router.get("/initial", authenticated(), (req, res) =>
  res.render("initial", {
    err: false,
    phone: req.user.phone || "",
    username: req.user.username,
    sction: req.user.section || "",
    clss: req.user.class || "",
  })
);

router.post(
  "/initial",
  authenticated(),
  function validation(req, res, next) {
    function fillBody(body) {
      body.phone = body.phone || "";
      body.username = body.username || req.user.username;
      body.clss = body.clss || "";
      body.sction = body.sction || "";
      return body;
    }

    // Phone
    if (!/^\d{10}$/.test(req.body.phone)) {
      res.locals.err = "The phone number you entered is invalid";
      return res.render("initial", fillBody(req.body));
    }

    // Username
    if (!/^[a-zA-Z0-9]+$/.test(req.body.username)) {
      res.locals.err = "Your username must only consist of letters and numbers";
      return res.render("initial", fillBody(req.body));
    }

    // Class
    const cl = parseInt(req.body.clss);
    if (!cl || cl > 12 || cl < 6) {
      res.locals.err = "Your class must be between VI and XII";
      return res.render("initial", fillBody(req.body));
    }

    // Section
    if (!/^[A-Z]{1}$/.test(req.body.sction)) {
      res.locals.err = "Your section is incorrect";
      return res.render("initial", fillBody(req.body));
    }

    return next();
  },
  asyncH(async (req, res, next) => {
    try {
      req.user.phone = req.body.phone;
      req.user.username = req.body.username;
      req.user.class = req.body.clss;
      req.user.section = req.body.sction;
      await req.user.save();
      res.redirect("/play");
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError") {
        res.locals.err = "This username is already in use";
        return res.render("initial", { ...req.body, clss: req.body.class });
      } else {
        res.locals.err = "An error occurred";
        return res.render("initial", { ...req.body, clss: req.body.class });
      }
    }
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
