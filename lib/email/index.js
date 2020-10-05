const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_SENDER_USERNAME,
    pass: process.env.NODEMAILER_SENDER_PASSWORD,
  },
});

function sendPasswordVerificationMail(to, url) {
  return transporter.sendMail({
    to,
    from: process.env.NODEMAILER_SENDER_EMAIL,
    subject: "Please Verify Your Email",
    html: require("./templates/email-verification")({ url }),
  });
}

function sendRegApprovedMail(to, emailVerified, url) {
  return transporter.sendMail({
    to,
    from: process.env.NODEMAILER_SENDER_EMAIL,
    subject: "Exun 2020 Registration Request Approved",
    html: emailVerified
      ? require("./templates/approved-verified")({ url })
      : require("./templates/approved")({ url }),
  });
}

module.exports = {
  transporter,
  sendPasswordVerificationMail,
  sendRegApprovedMail,
};