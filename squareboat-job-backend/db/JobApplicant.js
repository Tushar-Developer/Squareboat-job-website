const mongoose = require("mongoose");

let schema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },

});

module.exports = mongoose.model("JobApplicantInfo", schema);