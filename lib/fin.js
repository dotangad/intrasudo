const fin = false;

module.exports = () => (_, res, next) => {
  if (fin) {
    res.render("fin");
  } else {
    next();
  }
};
