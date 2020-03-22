const sg = require("@sendgrid/mail");
const yup = require("yup");
sg.setApiKey(process.env.SG_KEY);

module.exports = function Mail(subject, from) {
  this.from = from || { email: "exun@dpsrkp.net", name: "Exun Clan" };
  this.subject = subject;
  this.to = [];
  this.attachments = [];
  if (!this.subject) {
    throw new Error("Subject is missing or undefined");
  }

  this.validateEmail = email => {
    const emailSchema = yup.object().shape({
      email: yup
        .string()
        .email()
        .required()
    });

    return emailSchema.isValid({ email });
  };

  this.addTo = email => {
    if (!this.validateEmail(email)) {
      throw new Error("Invalid email");
    } else {
      this.to.push(email);
    }
  };

  // https://github.com/sendgrid/sendgrid-nodejs/blob/master/use-cases/attachments.md
  this.addAttachment = attachment => this.attachments.push(attachment);

  this.content = html => {
    this.html = `Greetings!

    ${html}
    
    <p>Regards,<br>
    Exun Clan,<br>
    The Computer Science Club of Delhi Public School, R.K. Puram</p>`;
    this.text = html.replace(/<\/?[^>]+\/?>/g, "").trim();
  };

  this.send = () => {
    return sg.send(
      {
        from: this.from,
        subject: this.subject,
        to: this.to,
        html: this.html,
        text: this.text,
        attachments: this.attachments
      },
      (err, data) => {
        if (err) {
          throw err;
        }

        return data;
      }
    );
  };
};
