const jwt = require("jsonwebtoken");
const models = require("../../models");

module.exports = [
    async (req, res, next) => {
        try {
            const e = new Error("Invalid token");
            e.statusCode = 400;

            if (!req.query.token) {
                throw e;
            }

            const { role, email } = jwt.verify(
                decodeURIComponent(req.query.token),
                process.env.SECRET
            );

            if (role !== "emailverify") {
                throw e;
            }

            let user = await models.User.findOne({ where: { email: email } });
            if (!user || user.emailVerified) {
                throw e;
            }

            user = await models.User.update(
                {
                    emailVerified: true,
                },
                {
                    where: {
                        email: email,
                    },
                }
            );

            if (user) {
                return req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }

                    return res.status(200).redirect("/play");
                });
            }

            // if (user.approved) {
            //     // Login and send to dashboard
            //     return req.login(school, (err) => {
            //         if (err) return next(err);

            //         return res.redirect("/dashboard");
            //     });
            // }

            // return res.render("auth/email-verify", { title: "Email verified" });
        } catch (e) {
            return next(e);
        }
    },
];
