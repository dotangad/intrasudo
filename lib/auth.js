module.exports = {
  check: admin => (req, res, next) => {
    if (!req.isAuthenticated()) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      err.code = "401_UNAUTHORIZED";
      done(null, user.dataValues.id);
      return next(err);
    }

    if (admin && !req.user.isAdmin) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      err.code = "403_UNAUTHORIZED";
      return next(err);
    }

    if (!admin && req.user.isAdmin) {
      const err = new Error("Unauthorized");
      err.statusCode = 403;
      err.code = "403_UNAUTHORIZED";
      return next(err);
    }

    return next();
  },
  ensure: (attribute, equal, msg) => (req, res, next) => {
    if (!(req.user.school[attribute] === equal)) {
      const err = new Error(msg);
      err.statusCode = 403;
      err.code = `403_${attribute.toUpperCase()}`;
      return next(err);
    }

    return next();
  }
};
