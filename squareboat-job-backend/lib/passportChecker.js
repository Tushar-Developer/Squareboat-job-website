const passport = require("passport");
const Strategy = require("passport-local").Strategy;

const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require("../db/User");
const authKeys = require("./authKeys");

const filterJsonData = (jsonObj, filterKeys) => {
    const filteredJson = {};
    Object.keys(jsonObj).forEach((key) => {
        if (filterKeys.indexOf(key) === -1) {
            filteredJson[key] = jsonObj[key];
        }
    });
    return filteredJson;
};

passport.use(
    new Strategy(
        {
            usernameField: "email",
            passReqToCallback: true,
        },
        (request, email, password, done, response) => {
            User.findOne({email: email}, (error, user) => {
                if (error) {
                    return done(error);
                }
                if (!user) {
                    return done(null, false, {
                        message: "User not present.",
                    });
                }

                user.login(password).then(() => {
                    user["_doc"] = filterJsonData(user["_doc"], ["password", "__v"]);
                    return done(null, user);
                }).catch((error) => {
                    return done(error, false, {
                        message: "Wrong Email/Password.",
                    });
                });
            });
        }
    )
);

passport.use(
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: authKeys.jwtSecretKey,
    },
    (jwtPayload, done) => {
        User.findById(jwtPayload._id).then((user) => {
            console.log(Object.keys('jwtPayload-- ',jwtPayload));
            if (!user) {
                return done(null, false, {
                    message: "JWT Token expired/not present",
                });
            }
            user["_doc"] = filterJsonData(user["_doc"], ["password", "__v"]);
            return done (null, user);
        }).catch((error) => {
            return done(error, false, {
                message: "Incorrect JWT Token",
            });
        });
    }
    )
);

module.exports = passport;