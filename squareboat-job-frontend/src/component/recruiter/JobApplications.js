import { useState, useEffect } from "react";
import { Button, Grid, IconButton, makeStyles, Paper, Typography, Modal } from "@material-ui/core";
import { useParams } from "react-router-dom";
import axios from "axios";
import FilterListIcon from "@material-ui/icons/FilterList";

import apiList from "../../lib/apiList";

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
  avatar: {
    width: theme.spacing(17),
    height: theme.spacing(17),
  },
}));

const ApplicationTile = (props) => {
    const classes = useStyles();
    const { application, getData } = props;

    const [open, setOpen] = useState(false);
    
    const handleClose = () => {
      setOpen(false);
    };
  
    const colorSet = {
      applied: "#3454D1",
      shortlisted: "#DC851F",
      accepted: "#09BC8A",
      rejected: "#D1345B",
    };
  
    const updateStatus = (status) => {
      const address = `${apiList.applications}/${application._id}`;
      const statusData = {
        status: status,
      };
      axios.put(address, statusData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then((response) => {
          getData();
        })
        .catch((error) => {
        });
    };
  
    // const buttonSet = {
    //   applied: (
    //     <>
    //       <Grid item xs>
    //         <Button
    //           className={classes.statusBlock}
    //           style={{
    //             background: colorSet["shortlisted"],
    //             color: "#ffffff",
    //           }}
    //           onClick={() => updateStatus("shortlisted")}
    //         >
    //           Shortlist
    //         </Button>
    //       </Grid>
    //       <Grid item xs>
    //         <Button
    //           className={classes.statusBlock}
    //           style={{
    //             background: colorSet["rejected"],
    //             color: "#ffffff",
    //           }}
    //           onClick={() => updateStatus("rejected")}
    //         >
    //           Reject
    //         </Button>
    //       </Grid>
    //     </>
    //   ),
    //   shortlisted: (
    //     <>
    //       <Grid item xs>
    //         <Button
    //           className={classes.statusBlock}
    //           style={{
    //             background: colorSet["accepted"],
    //             color: "#ffffff",
    //           }}
    //           onClick={() => updateStatus("accepted")}
    //         >
    //           Accept
    //         </Button>
    //       </Grid>
    //       <Grid item xs>
    //         <Button
    //           className={classes.statusBlock}
    //           style={{
    //             background: colorSet["rejected"],
    //             color: "#ffffff",
    //           }}
    //           onClick={() => updateStatus("rejected")}
    //         >
    //           Reject
    //         </Button>
    //       </Grid>
    //     </>
    //   ),
    //   rejected: (
    //     <>
    //       <Grid item xs>
    //         <Paper
    //           className={classes.statusBlock}
    //           style={{
    //             background: colorSet["rejected"],
    //             color: "#ffffff",
    //           }}
    //         >
    //           Rejected
    //         </Paper>
    //       </Grid>
    //     </>
    //   ),
    //   accepted: (
    //     <>
    //       <Grid item xs>
    //         <Paper
    //           className={classes.statusBlock}
    //           style={{
    //             background: colorSet["accepted"],
    //             color: "#ffffff",
    //           }}
    //         >
    //           Accepted
    //         </Paper>
    //       </Grid>
    //     </>
    //   ),
    // };
  
    return (
      <Paper className={classes.jobTileOuter} elevation={3}>
        <Grid container>
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
          </Grid>
          <Grid container item xs={7} spacing={1} direction="column">
            <Grid item>
              <Typography variant="h5">
                {application.jobApplicant.name}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container direction="column" xs={3}>
            <Grid item container xs>
              {/* {buttonSet[application.status]} */}
            </Grid>
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
              minWidth: "30%",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px" }}
            >
              Submit
            </Button>
          </Paper>
        </Modal>
      </Paper>
    );
  };

  const JobApplications = (props) => {
    const [applications, setApplications] = useState([]);
    const { jobId } = useParams();
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchOptions, setSearchOptions] = useState({
      status: {
        all: false,
        applied: false,
        shortlisted: false,
      },
    });
  
    useEffect(() => {
      getData();
    }, []);
  
    const getData = () => {
      let searchParams = [];
  
      if (searchOptions.status.rejected) {
        searchParams = [...searchParams, `status=rejected`];
      }
      if (searchOptions.status.applied) {
        searchParams = [...searchParams, `status=applied`];
      }
      if (searchOptions.status.shortlisted) {
        searchParams = [...searchParams, `status=shortlisted`];
      }

      // searchParams = [...searchOptions];
      const queryString = searchParams.join("&");
      let address = `${apiList.applicants}?jobId=${jobId}`;
      if (queryString !== "") {
        address = `${address}&${queryString}`;
      }
    
      axios.get(address, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }).then((response) => {
          setApplications(response.data);
        }).catch((err) => {
          setApplications([]);
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
          <Grid item>
            <Typography variant="h2">Applications</Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={() => setFilterOpen(true)}>
              <FilterListIcon />
            </IconButton>
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
                  <ApplicationTile application={obj} getData={getData} />
                </Grid>
              ))
            ) : (
              <Typography variant="h5" style={{ textAlign: "center" }}>
                No Applications Found
              </Typography>
            )}
          </Grid>
        </Grid>
      </>
    );
  };

export default JobApplications;
