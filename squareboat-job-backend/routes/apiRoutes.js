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
        title: body.title,
        salary: body.salary,
        jobType: body.jobType,
        description: body.description
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
    let findParams = {};
    let sortParams = {};

    // to fetch jobs posted by a particular recruiter
    if (user.type === "recruiter" && request.query.myjobs) {
      findParams = {
        ...findParams,
        userId: user._id,
        };
    }

    if (request.query.q) {
      findParams = {
            ...findParams,
            title: {
                $regex: new RegExp(request.query.q, "i"),
            }
        };
    }

      // if (request.query.q) {
      //   findParams = {
      //         ...findParams,
      //         description: {
      //             $regex: new RegExp(request.query.q, "i"),
      //         }
      //     };
      // }

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
        { $match: findParams }, //pass only those documents that match conds
    ];

    JobInfo.aggregate(arr).then((jobPosts) => {
        if(!jobPosts) {
            response.status(404).json({
                message: "No Jobs available."
            });
            return;
        }
        response.json(jobPosts);
    }).catch((error) => {
        response.status(400).json(error);
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

// apply for a job
router.post("/jobs/:id/applications", jwtAuth, (request, response) => {
    const user = request.user;
    if (user.type != "applicant") {
        response.status(401).json({
          message: "Only Applicants can apply for a job",
      });
      return;
    }

    const jobId = request.params.id;

    JobApplication.findOne({
        userId: user._id,
        jobId: jobId,
        status: {
        $nin: ["accepted"],
        },
    }).then((appliedApplication) => {

        if (appliedApplication !== null) {
            response.status(400).json({
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
            JobApplication.countDocuments({
                jobId: jobId,
                status: {
                    $nin: ["rejected"],
                },
            }).then((activeApplicationCount) => {
                JobApplication.countDocuments({
                    userId: user._id,
                    status: {
                      $nin: ["rejected"],
                    },
                }).then((myActiveApplicationCount) => {
                    // if (myActiveApplicationCount > 0) {
                        JobApplication.countDocuments({
                            userId: user._id,
                            status: "accepted",
                        }).then((acceptedJobs) => {
                            if (acceptedJobs === 0) {
                                const jobApplication = new JobApplication({
                                    userId: user._id,
                                    recruiterId: job.userId,
                                    jobId: job._id,
                                    status: "applied",
                                });
                                jobApplication.save().then(() => {
                                    response.json({
                                        message: "Applied Successfully."
                                    });
                                }).catch((error) => {
                                    response.status(400).json(error);
                                });
                            }
                            else {
                                response.status(400).json({
                                    message: "Already applied."
                                });
                            }
                        });
                    // }
                }).catch((error) => {
                    response.status(400).json(error);
                })  
            }).catch((error) => {
                response.status(400).json(error);
            })  
        }).catch((error) => {
            response.status(400).json(error);
        });
    });
});

// recruiter gets applications for a particular job
router.get("/jobs/:id/applications", jwtAuth, (request, response) => {
    const user = request.user;
    if (user.type != "recruiter") {
        response.status(401).json({
        message: "Only Recruiters can view Job Applications.",
      });
      return;
    }
    const jobId = request.params.id;
  
    let findParams = {
        jobId: jobId,
        recruiterId: user._id,
    };
  
    let sortParams = {};
  
    if (request.query.status) {
      findParams = {
        ...findParams,
        status: request.query.status,
      };
    }
  
    JobApplication.find(findParams)
      .sort(sortParams)
      .then((applications) => {
        response.json(applications);
      }).catch((error) => {
        response.status(400).json(error);
      });
  });

// recruiter/applicant gets all his application
router.get("/applications", jwtAuth, (request, response) => {
    const user = request.user;

    JobApplication.aggregate([
        {
            $lookup: {
                from: "jobapplicantinfos",
                localField: "userId",
                foreignField: "userId",
                as: "jobApplicant",
            },
        },
        { $unwind: "$jobApplicant" },
        {
            $lookup: {
                from: "jobinfos",
                localField: "jobId",
                foreignField: "_id",
                as: "jobinfos",
            },
        },
        { $unwind: "$jobinfos" },
        {
            $lookup: {
                from: "recruiterinfos",
                localField: "recruiterId",
                foreignField: "userId",
                as: "recruiter",
            },
        },
        { $unwind: "$recruiter" },
        {
            $match: {
                [user.type === "recruiter" ? "recruiterId" : "userId"]: user._id,
            },
        }
    ]).then((applications) => {
        response.json(applications);
    })
    .catch((error) => {
        response.status(400).json(error);
    });
});

// update status of application: [Applicant: Can cancel, Recruiter: Can do everything]
router.put("/applications/:id", jwtAuth, (request, response) => {
    const user = request.user;
    const id = request.params.id;
    const status = request.body.status;
  
    // "applied", // when a applicant is applied
    // "shortlisted", // when a applicant is shortlisted
    // "accepted", // when a applicant is accepted
    // "rejected", // when a applicant is rejected
  
    if (user.type === "recruiter") {
      if (status === "accepted") {
        // get job id from application
        // compare and if condition is satisfied, then save
  
        JobApplication.findOne({
            _id: id,
            recruiterId: user._id,
        }).then((application) => {
            if (!application) {
                    response.status(404).json({
                    message: "Application not found",
                });
                return;
            }
  
            JobInfo.findOne({
              _id: application.jobId,
              userId: user._id,
            }).then((job) => {
            if (!job) {
                response.status(404).json({
                    message: "Job does not exist",
                });
                return;
            }
  
              JobApplication.countDocuments({
                recruiterId: user._id,
                jobId: job._id,
                status: "accepted",
              }).then((activeApplicationCount) => {
                // accepted
                application.status = status;
                application.save().then(() => {
                    JobApplication.updateMany(
                      {
                        _id: {
                          $ne: application._id,
                        },
                        userId: application.userId,
                        status: {
                          $nin: [
                            "rejected",
                            "accepted",
                          ],
                        },
                      },
                      { multi: true }
                    ).then(() => {
                        if (status === "accepted") {
                          JobInfo.findOneAndUpdate(
                            {
                              _id: job._id,
                              userId: user._id,
                            }
                          ).then(() => {
                              response.json({
                                message: `Application ${status} successfully`,
                              });
                            }).catch((error) => {
                                response.status(400).json(error);
                            });
                        } else {
                            response.json({
                                message: `Application ${status} successfully`,
                          });
                        }
                      })
                      .catch((error) => {
                        response.status(400).json(error);
                      });
                  })
                  .catch((error) => {
                    response.status(400).json(error);
                  });
              });
            });
          })
          .catch((error) => {
            response.status(400).json(error);
          });
      } else {
        JobApplication.findOneAndUpdate(
          {
            _id: id,
            recruiterId: user._id,
            status: {
              $nin: ["rejected"],
            },
          },
          {
            $set: {
              status: status,
            },
          }
        ).then((application) => {
            if (!application) {
                response.status(400).json({
                message: "Application status cannot be updated",
              });
              return;
            }
          }).catch((error) => {
            response.status(400).json(error);
          });
      }
    } 
    else {
        response.status(401).json({
          message: "Only Recruiters can update job status",
        });
      }
  });

// get a list of final applicants for current job : recruiter
// get a list of final applicants for all his jobs : recuiter
router.get("/applicants", jwtAuth, (request, response) => {
    const user = request.user;
    if (user.type === "recruiter") {
      let findParams = {
        recruiterId: user._id,
      };
      if (request.query.jobId) {
        findParams = {
          ...findParams,
          jobId: new mongoose.Types.ObjectId(request.query.jobId),
        };
      }
      if (request.query.status) {
        if (Array.isArray(request.query.status)) {
          findParams = {
            ...findParams,
            status: { $in: request.query.status },
          };
        } else {
          findParams = {
            ...findParams,
            status: request.query.status,
          };
        }
      }

      JobApplication.aggregate([
        {
          $lookup: {
            from: "jobapplicantinfos",
            localField: "userId",
            foreignField: "userId",
            as: "jobApplicant",
          },
        },
        { $unwind: "$jobApplicant" },
        {
          $lookup: {
            from: "jobinfos",
            localField: "jobId",
            foreignField: "_id",
            as: "jobinfos",
          },
        },
        { $unwind: "$jobinfos" },
        { $match: findParams },
      ]).then((applications) => {
          if (applications.length === 0) {
            response.status(404).json({
              message: "No applicants found",
            });
            return;
          }
          response.json(applications);
        })
        .catch((error) => {
            response.status(400).json(error);
        });
    } else {
        response.status(400).json({
        message: "You are not allowed to access applicants list",
      });
    }
  });

module.exports = router;