module.exports = {
  authenticated: () => (req, res, next) => {
    if (res.locals.authenticated) {
      return next();
    }
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    err.code = "401_UNAUTHORIZED";
    return next(err);
  },
  unauthenticated: () => (req, res, next) => {
    if (!res.locals.authenticated) {
      return next();
    }
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    err.code = "401_UNAUTHORIZED";
    return next(err);
  },
  exunite: () => (req, rex, next) => {
    if (req.user.exunite) {
      return next();
    }
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    err.code = "401_UNAUTHORIZED";
    return next(err);
  },
  admin: () => (req, rex, next) => {
    if (req.user.admin) {
      return next();
    }
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    err.code = "401_UNAUTHORIZED";
    return next(err);
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
