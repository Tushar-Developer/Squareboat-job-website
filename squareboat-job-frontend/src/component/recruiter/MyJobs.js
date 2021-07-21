import { useState, useEffect } from "react";
import { Button, Grid, IconButton, InputAdornment, makeStyles, Paper, TextField, Typography, Modal } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";

import apiList from "../../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  button: {
    width: "100%",
    height: "100%",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
}));

const JobTile = (props) => {
    const classes = useStyles();
    let history = useHistory();
    const { job, getData } = props;
  
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [jobDetails, setJobDetails] = useState(job);
  
  
    const handleClick = (location) => {
      history.push(location);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleCloseUpdate = () => {
      setOpenUpdate(false);
    };
  
    const handleDelete = () => {
      axios
        .delete(`${apiList.jobs}/${job._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          getData();
          handleClose();
        })
        .catch((error) => {
          handleClose();
        });
    };
  
    const handleJobUpdate = () => {
      axios.put(`${apiList.jobs}/${job._id}`, jobDetails, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          getData();
          handleCloseUpdate();
        })
        .catch((error) => {
          handleCloseUpdate();
        });
    };
    
    return (
      <Paper className={classes.jobTileOuter} elevation={3}>
        <Grid container>
          <Grid container item xs={9} spacing={1} direction="column">
            <Grid item>
              <Typography variant="h5">{job.title}</Typography>
            </Grid>
            <Grid item>Role : {job.jobType}</Grid>
            <Grid item>Salary : &#8377; {job.salary} per month</Grid>
            <Grid item>Description : {job.description} </Grid>
          </Grid>
          <Grid item container direction="column" xs={3}>
            <Grid item xs>
              <Button
                variant="contained"
                color="primary"
                className={classes.statusBlock}
                onClick={() => handleClick(`/job/applications/${job._id}`)}
              >
                View Applications
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const MyJobs = (props) => {
    const [jobs, setJobs] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchOptions, setSearchOptions] = useState({
      query: "",
      jobType: {
        fullTime: false,
        partTime: false,
        wfh: false,
      },
      salary: [0, 100],
      description: ""
    });
  
    useEffect(() => {
      getData();
    }, []);
  
    const getData = () => {
      let searchParams = [`myjobs=1`];
      if (searchOptions.query !== "") {
        searchParams = [...searchParams, `q=${searchOptions.query}`];
      }

      const queryString = searchParams.join("&");
      let address = apiList.jobs;
      if (queryString !== "") {
        address = `${address}?${queryString}`;
      }
  
      axios.get(address, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then((response) => {
          setJobs(response.data);
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
          style={{ padding: "30px", minHeight: "93vh" }}
        >
          <Grid
            item
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item xs>
              <Typography variant="h2">My Jobs</Typography>
            </Grid>
            <Grid item xs>
              <TextField
                label="Search Jobs"
                value={searchOptions.query}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    query: event.target.value,
                  })
                }
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    getData();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton onClick={() => getData()}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                style={{ width: "500px" }}
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <IconButton onClick={() => setFilterOpen(true)}>
                <FilterListIcon />
              </IconButton>
            </Grid>
          </Grid>
  
          <Grid
            container
            item
            xs
            direction="column"
            alignItems="stretch"
            justify="center"
          >
            {jobs.length > 0 ? (
              jobs.map((job) => {
                return <JobTile job={job} getData={getData} />;
              })
            ) : (
              <Typography variant="h5" style={{ textAlign: "center" }}>
                No jobs found
              </Typography>
            )}
          </Grid>
        </Grid>
      </>
    );
  };

export default MyJobs;
