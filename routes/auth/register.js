const router = require("express").Router();
const yup = require("yup");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const { client } = require("../../lib/prisma");
const { Op } = require("sequelize");
const models = require("../../models");
const { against } = require("../../lib/validation");
const { sendPasswordVerificationMail } = require("../../lib/email");
const { unauthenticated } = require("../../lib/auth");
const comingSoon = require("../../lib/coming-soon");

router.get("/", unauthenticated(), (req, res) =>
  res.render("auth/register", { title: "Register", csrfToken: req.csrfToken(), error:null })
);

router.post(
  "/",
  unauthenticated(),
  against(
    yup.object().shape({
      name: yup.string().required("Name is required"),
      username: yup.string().required("Username is required"),
      institution: yup.string().required("Institution name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      password: yup
        .string()
        .min(8, "Password must be between 8 and 24 characters")
        .max(24, "Password must be between 8 and 24 characters")
        .required("Password is required"),
      passwordconf: yup
        .string()
        .oneOf([yup.ref("password")], "Password and confirmation must match")
        .required("Password is required")
        .min(8, "Password must be between 8 and 24 characters")
        .max(24, "Password must be between 8 and 24 characters"),
    }),
    ({ req, res, errors }) =>
      res.render("auth/register", {
        title: "Register",
        error: errors[0],
        csrfToken: req.csrfToken(),
        ...req.body,
      })
  ),
  async (req, res) => {
    try {
    console.log(req.body);
      const hash = await bcrypt.hash(
        req.body.password,
        parseInt(process.env.BCRYPT_SALT_ROUND) || 14
      );

      const currentLevelId = await models.Level.findOne({
        attributes: ["id"],
        where: {
          id: {
            [Op.gt]: 0,
          },
        },
        order: [["id", "ASC"]],
      });

      await models.User.create({
          email: req.body.email,
          username: req.body.username,
          name: req.body.name,
          institution: req.body.institution,
          password: hash,
          currentLevelId: currentLevelId.id,
      });

      const token = jwt.sign(
        {
          role: "emailverify",
          email: req.body.email,
        },
        process.env.SECRET
      );
      const verificationURL =
        `${req.protocol}://${req.get("host")}/auth/verify` +
        `?token=${encodeURIComponent(token)}`;

      sendPasswordVerificationMail(req.body.email, verificationURL);

      // Success template
      res.render("auth/regsuccess", { title: "Thank you!" });
    } catch (e) {
        console.log('**************');
        console.log(e.errors)
      if (e.errors != undefined ) {
        if (e.errors[0].message === "users.username must be unique") {
          return res.render("auth/register", {
              title: "Register",
              error: "The username is already taken",
              csrfToken: req.csrfToken(),
              ...req.body,
            });
        } else if (e.errors[0].message === "users.email must be unique") {
          return res.render("auth/register", {
              title: "Register",
              error: "The email is already registered",
              csrfToken: req.csrfToken(),
              ...req.body,
            });
        }
      }

      console.log(e);
      return false;
      return res.render("auth/register", {
        title: "Register",
        error: "Internal Server Error",
        csrfToken: req.csrfToken(),
        ...req.body,
      });
    }
  }
);

module.exports = router;