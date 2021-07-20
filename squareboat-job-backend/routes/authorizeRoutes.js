const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");

const User = require("../db/User");
const Recruiter = require("../db/Recruiter");
const JobApplicant = require("../db/JobApplicant");

const router = express.Router();

router.post("/signUp", (request, response) => {
    const data = request.body;
    console.log('data -- ',data);
    
    if (data) {
        let user = new User({
            email: data.email,
            password: data.password,
            type: data.type,
        });

        // Saving user
        user.save().then(() => {
            const userDetails = user.type == "recruiter" ? new Recruiter({
                userId: user._id,
                name: data.name,
            }) : new JobApplicant({
                userId: user._id,
                name: data.name,
            });

        console.log('userDetails -- ',userDetails);
        userDetails.save().then(() => {
            const token = jwt.sign({_id: user._id}, authKeys.jwtSecretKey);
            console.log('token -- ',token);
            response.json({
                token: token,
                type: user.type,
            });
        }).catch((error) => {
            user.delete().then(() => {
                response.status(400).json(error);
            }).catch((error) => {
                response.json({error: error});
            });
            error;
            });
        }).catch((error) => {
            response.status(400).json(error);
        });
    }
});

router.post("/login", (request, response, next) => {
    passport.authenticate(
        "local",
        {session: false},
        function (error, user, info) {
            if (error) {
                return next(err);
            }

            if (!user) {
                response.status(401).json(info);
                return;
            }

            const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
            response.json({
                token: token,
                type: user.type,
            });
        }
    )(request, response, next);
});

module.exports = router;