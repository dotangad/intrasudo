module.exports = {
    against: (schema, errcb) => async (req, res, next) => {
        try {
            await schema.validate(req.body);

            return next();
        } catch (e) {
            errcb({ req, res, next, errors: e.errors });
            return;
        }
    },
};
