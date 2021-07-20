const mongoose = require("mongoose");

const express = require("express");
const jwtAuth = require("../lib/jwtAuth");

const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const JobInfo = require("../db/JobInfo");
const JobApplication = require("../db/JobApplication");

const router = express.Router();

// Create new Job
router.post("/jobs", jwtAuth, (request, response) => {
    const user = request.user;

    if (user.type != "recruiter") {
        response.status(401).json({
            message: "Only Recuiters can add Jobs.",
        });
        return;
    }

    const body = request.body;

    let jobInfo = new JobInfo({
        userId: user._id,
        title: data.title,
        salary: data.salary,
        jobType: data.jobType,
    });

    jobInfo.save().then(() => {
        response.json({message: "Job created."})
    }).catch((error) => {
        response.status(400).json(error);
    });
});

// fetch all jobs
router.get("/jobs", jwtAuth, (request, response) => {
    let user = request.user;
    let findJobs = {};

    // to fetch jobs posted by a particular recruiter
    if (user.type === "recruiter" && req.query.myjobs) {
        findJobs = {
        ...findJobs,
        userId: user._id,
        };
    }

    if (request.query.q) {
        findJobs = {
            ...findJobs,
            title: {
                $regex: new RegExp(req.query.q, "i"),
            },
        };
    }


    console.log('findJobs get --',findJobs);

    let arr = [
        {
        $lookup: { // left outer join
            from: "recruiterinfos",
            localField: "userId",
            foreignField: "userId",
            as: "recruiter",
        },
        },
        { $unwind: "$recruiter" },  //duplicate each document 1 on 1 element
        { $match: findJobs }, //pass only those documents that match conds 
    ];

    console.log('arr -- ',arr);

    JobInfo.aggregate(arr).then((jobPosts) => {
        if(!jobPosts) {
            response.status(404).json({
                message: "No Jobs available."
            });
            return;
        }
        response.json(jobPosts);
    }).catch((error) => {
        response.status(400).json(err);
    });
});

// fetch one particular job
router.get("/jobs/:id", jwtAuth, (request, response) => {
    JobInfo.findOne({_id: request.params.id}).then((job) =>{
        if (!job) {
            response.status(400).json({
                message: "Job closed/present."
            });
            return;
        }
        response.json(job);
    }).catch((error) => {
        response.status(400).json(error);
    });
});

// to update info of a particular job
//router.put("/jobs/:id", jwtAuth, (req, res) =>{});

// to delete a job
// router.delete("/jobs/:id", jwtAuth, (req, res) => {});

//Crud for jobs complete.

////////////////////////// Users op//////////////////////////

// get user's personal details
//router.get("/user", jwtAuth, (req, res) => {});

// get user details from id
// router.get("/user/:id", jwtAuth, (req, res) => {});

////////////////////////// JobApplication op//////////////////////////

// apply for a job [todo: test: done]
router.post("/jobs/:id/applications", jwtAuth, (request, response) => {
    const user = request.user;
    if (user.type != "applicant") {
        response.status(401).json({
        message: "Only Applicants can apply for a job",
      });
      return;
    }

    const body = request.body;
    const jobId = request.params.id;

    JobApplication.findOne({
        userId: user._id,
        jobId: jobId,
        status: {
        $nin: ["accepted"],
        },
    }).then((appliedApplication) => {
        console.log('appliedApplication -- ',appliedApplication);

        if (!appliedApplication) {
            response.status(400).jsom({
                message: "Already applied for this Job."
            });
            return;
        }

        JobInfo.findOne({_id: jobId}).then((job) => {
            if (!job) {
                response.status(404).json({
                    message: "Job not available."
                });
                return;
            }
            // JobApplication.countDocuments({
            //     jobId: jobId,
            //     status: {
            //         $nin: ["rejected"],
            //     },
            // }).then((activeApplicationCount) => {
            //     if ()
            // })
        })


    })
});