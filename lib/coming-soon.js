const enabled = true;

module.exports = () => (_, res, next) => {
  if (enabled) {
    res.render("coming-soon");
  } else {
    next();
  }
};
