import { useState, useEffect } from "react";
import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import axios from "axios";

import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
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

const ApplicationTile = (props) => {
    const classes = useStyles();
    const { application } = props;
  
    const colorSet = {
      applied: "#3454D1",
      shortlisted: "#DC851F",
      accepted: "#09BC8A",
      rejected: "#D1345B",
    };
  
    return (
      <Paper className={classes.jobTileOuter} elevation={3}>
        <Grid container>
          <Grid container item xs={9} spacing={1} direction="column">
            <Grid item>
              <Typography variant="h5">{application.jobinfos.title}</Typography>
            </Grid>
            <Grid item>Posted By: {application.recruiter.name}</Grid>
            <Grid item>Salary : &#8377; {application.jobinfos.salary} per month</Grid>
            <Grid item>Description : {application.jobinfos.description}</Grid>
          </Grid>
          <Grid item container direction="column" xs={3}>
            <Grid item xs>
              <Paper
                className={classes.statusBlock}
                style={{
                  background: colorSet[application.status],
                  color: "#ffffff",
                }}
              >
                {application.status}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
};

const Applications = (props) => {
    const [applications, setApplications] = useState([]);
  
    useEffect(() => {
      getData();
    }, []);
  
    const getData = () => {
      axios.get(apiList.applications, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then((response) => {
          setApplications(response.data);
        })
        .catch((error) => {
        });
    };
  
    return (
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid item>
          <Typography variant="h2">Applications</Typography>
        </Grid>
        <Grid
          container
          item
          xs
          direction="column"
          style={{ width: "100%" }}
          alignItems="stretch"
          justify="center"
        >
          {applications.length > 0 ? (
            applications.map((obj) => (
              <Grid item>
                <ApplicationTile application={obj} />
              </Grid>
            ))
          ) : (
            <Typography variant="h5" style={{ textAlign: "center" }}>
              No Applications Found
            </Typography>
          )}
        </Grid>
      </Grid>
    );
  };

export default Applications;
