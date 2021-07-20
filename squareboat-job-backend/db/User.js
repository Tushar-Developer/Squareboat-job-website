const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("mongoose-type-email");

let schema = new mongoose.Schema({
    email: {
        type: mongoose.SchemaTypes.Email,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["recruiter", "applicant"],
      required: true,
    },
});

//Password
schema.pre("save", function (next) {
    let user = this;

    //user data is modified or not
    if (!user.isModified("password")) {
        return next();
    }

    bcrypt.hash(user.password, 10, (error, hash) => {
        if (error) return next(error);

        user.password = hash;
        next();
    });
});

//Password verify
schema.methods.login = function(password) {
    let user = this;
    
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (error, result) => {
            if (error) reject(error);

            if (result) resolve();
            else reject();
        });
    });
};

module.exports = mongoose.model("UserAuthorize", schema);