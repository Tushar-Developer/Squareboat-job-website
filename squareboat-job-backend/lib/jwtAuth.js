const passport = require("passport");

const jwtAuth = (request, response, next) => {
    passport.authenticate("jwt", {session: false}, function(error, user, info) {
        if (error)  return next(error);

        if (!user) {
            response.status(401).json(info);
            return;
        }

        request.user = user;
        next();
    })(request, response, next);
};

module.exports = jwtAuth;