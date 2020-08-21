const fin = process.env.FIN === "true";

module.exports = () => (_, res, next) => {
  if (fin) {
    res.render("fin");
  } else {
    next();
  }
};
