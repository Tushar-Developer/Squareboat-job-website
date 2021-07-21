import { useState, useEffect } from "react";
import { Button, Grid, IconButton, InputAdornment, makeStyles, Paper, TextField, Typography, Modal } from "@material-ui/core";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";

import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";

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
}));

const JobTile = (props) => {
    const classes = useStyles();
    const { job } = props;

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
      };
  
    const handleApply = () => {
      axios.post(`${apiList.jobs}/${job._id}/applications`,
          {
            test: 'test1',
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ).then((response) => {
            handleClose();
        }).catch((error) => {
          handleClose();
        });
    };
    
    return (
      <Paper className={classes.jobTileOuter} elevation={3}>
        <Grid container>
          <Grid container item xs={9} spacing={1} direction="column">
            <Grid item>
              <Typography variant="h5">{job.title}</Typography>
            </Grid>
            <Grid item>Salary : &#8377; {job.salary} per month</Grid>
            <Grid item>Description : {job.description}</Grid>
            <Grid item>Posted By : {job.recruiter.name}</Grid>
          </Grid>

          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => {
                setOpen(true);
              }}
              disabled={userType() === "recruiter"}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
        <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
          <Paper
            style={{
              padding: "20px",
              outline: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: "50%",
              alignItems: "center",
            }}
          >
            Are you sure you want to Apply?
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px" }}
              onClick={() => handleApply()}
            >
              Apply
            </Button>
          </Paper>
        </Modal>
      </Paper>
    );
};

const Home = (props) => {
    const [jobs, setJobs] = useState([]);
    const [searchOptions, setSearchOptions] = useState({ query: "" });

    useEffect(() => {
      getData();
    }, []);

    const getData = () => {
      let searchParams = [];
      if (searchOptions.query !== "") {
        searchParams = [...searchParams, `q=${searchOptions.query}`];
      }

      searchParams = [...searchParams];
      const queryString = searchParams.join("&");
      let address = apiList.jobs;
      if (queryString !== "") {
        address = `${address}?${queryString}`;
      }
  
      axios.get(address, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then((response) => {
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
              <Typography variant="h2">Jobs</Typography>
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
                return <JobTile job={job} />;
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

export default Home;
