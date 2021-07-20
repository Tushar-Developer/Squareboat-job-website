const mongoose = require("mongoose");

let schema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "applied",
        "shortlisted",
        "accepted",
        "rejected",
      ],
      default: "applied",
      required: true,
    },
});

module.exports = module.exports = mongoose.model("jobApplication", schema);