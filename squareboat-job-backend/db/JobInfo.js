const mongoose = require("mongoose");

let schema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    },
    title: {
    type: String,
    required: true,
    },
    salary: {
    type: Number,
    validate: [
        {
        validator: Number.isInteger,
        msg: "Salary should be an Integer",
        },
        {
        validator: function (value) {
            return value >= 0;
        },
        msg: "Salary should be greater than 0",
        },
    ],
    },
    jobType: {
    type: String,
    required: true,
    },
});

module.exports = mongoose.model("jobInfo", schema);