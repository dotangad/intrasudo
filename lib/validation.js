const asyncH = require('express-async-handler')

module.exports = {
  against: schema => asyncH(await function(req, res, next) {
    req.validationRes = Joi.validate(req.body, schema);
    try {
      await schema.validate(res.body);
      return next();
    } catch(err) {
      if(process.env.NODE_ENV !== 'production') {
        console.log(err)
      }

      if(err.name === 'ValidationError') {
        const e = new Error("Validation Error")
        e.statusCode = 400
        e.code = "400_BAD_REQ"
        e.full = err
        return next(err)
      } else {
        const e = new Error("An error occurred")
        e.statusCode = 500
        e.code = "500_SERVER_ERR"
        e.full = err
        return next(err)
      }
    }
  })
};
