import { useContext, useState } from "react";
import { Button, Grid, Typography, Modal, Paper, makeStyles, TextField, MenuItem } from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";

import apiList from "../../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // padding: "30px",
  },
}));

const CreateJobs = (props) => {
    const classes = useStyles();
  
    const [jobDetails, setJobDetails] = useState({
      title: "",
      jobType: "Full Time",
      duration: 0,
      salary: 0,
      description: ""
    });
  
    const handleInput = (key, value) => {
      setJobDetails({
        ...jobDetails,
        [key]: value,
      });
    };
  
    const handleUpdate = () => {
      axios.post(apiList.jobs, jobDetails, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then((response) => {
          setJobDetails({
            title: "",
            jobType: "Full Time",
            salary: 0,
            description: ""
          });
        })
        .catch((error) => {
        });
    };
  
    return (
      <>
        <Grid
          container
          item
          direction="column"
          alignItems="center"
          style={{ padding: "30px", minHeight: "93vh", width: "" }}
        >
          <Grid item>
            <Typography variant="h2">Add Job</Typography>
          </Grid>
          <Grid item container xs direction="column" justify="center">
            <Grid item>
              <Paper
                style={{
                  padding: "20px",
                  outline: "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid
                  container
                  direction="column"
                  alignItems="stretch"
                  spacing={3}
                >
                  <Grid item>
                    <TextField
                      label="Title"
                      value={jobDetails.title}
                      onChange={(event) =>
                        handleInput("title", event.target.value)
                      }
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      select
                      label="Job Type"
                      variant="outlined"
                      value={jobDetails.jobType}
                      onChange={(event) => {
                        handleInput("jobType", event.target.value);
                      }}
                      fullWidth
                    >
                      <MenuItem value="Full Time">Full Time</MenuItem>
                      <MenuItem value="Part Time">Part Time</MenuItem>
                      <MenuItem value="Work From Home">Work From Home</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Salary"
                      type="number"
                      variant="outlined"
                      value={jobDetails.salary}
                      onChange={(event) => {
                        handleInput("salary", event.target.value);
                      }}
                      InputProps={{ inputProps: { min: 0 } }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Description"
                      type="string"
                      variant="outlined"
                      value={jobDetails.description}
                      onChange={(event) => {
                        handleInput("description", event.target.value);
                      }}
                      InputProps={{ inputProps: { min: 0 } }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  color="#f0c14b"
                  style={{ padding: "10px 50px", marginTop: "30px" }}
                  onClick={() => handleUpdate()}
                >
                  Create Job
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  };

export default CreateJobs;
