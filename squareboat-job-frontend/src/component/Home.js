import { useState } from "react";
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
      console.log(job._id);
      axios.post(`${apiList.jobs}/${job._id}/applications`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
          console.log(error.response);
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
            <Grid item>Posted By : {job.recruiter.name}</Grid>
          </Grid>

          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
            //   onClick={() => {
            //   }}
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
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px" }}
              onClick={() => handleApply()}
            >
              Submit
            </Button>
          </Paper>
        </Modal>
      </Paper>
    );
};

// Filter op
// const FilterPopup = (props) => {
//     const classes = useStyles();
//     const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
//     return (
//       <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
//         <Paper
//           style={{
//             padding: "50px",
//             outline: "none",
//             minWidth: "50%",
//           }}
//         >
//           <Grid container direction="column" alignItems="center" spacing={3}>
//             <Grid container item alignItems="center">
//               <Grid item xs={3}>
//                 Salary
//               </Grid>
//               <Grid item xs={9}>
//                 <Slider
//                   valueLabelDisplay="auto"
//                   valueLabelFormat={(value) => {
//                     return value * (100000 / 100);
//                   }}
//                   marks={[
//                     { value: 0, label: "0" },
//                     { value: 100, label: "100000" },
//                   ]}
//                   value={searchOptions.salary}
//                   onChange={(event, value) =>
//                     setSearchOptions({
//                       ...searchOptions,
//                       salary: value,
//                     })
//                   }
//                 />
//               </Grid>
//             </Grid>
//             <Grid container item alignItems="center">
//               <Grid item xs={3}>
//                 Sort
//               </Grid>
//               <Grid item container direction="row" xs={9}>
//                 <Grid
//                   item
//                   container
//                   xs={4}
//                   justify="space-around"
//                   alignItems="center"
//                   style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
//                 >
//                   <Grid item>
//                     <Checkbox
//                       name="salary"
//                       checked={searchOptions.sort.salary.status}
//                       onChange={(event) =>
//                         setSearchOptions({
//                           ...searchOptions,
//                           sort: {
//                             ...searchOptions.sort,
//                             salary: {
//                               ...searchOptions.sort.salary,
//                               status: event.target.checked,
//                             },
//                           },
//                         })
//                       }
//                       id="salary"
//                     />
//                   </Grid>
//                   <Grid item>
//                     <label for="salary">
//                       <Typography>Salary</Typography>
//                     </label>
//                   </Grid>
//                   <Grid item>
//                     <IconButton
//                       disabled={!searchOptions.sort.salary.status}
//                       onClick={() => {
//                         setSearchOptions({
//                           ...searchOptions,
//                           sort: {
//                             ...searchOptions.sort,
//                             salary: {
//                               ...searchOptions.sort.salary,
//                               desc: !searchOptions.sort.salary.desc,
//                             },
//                           },
//                         });
//                       }}
//                     >
//                       {searchOptions.sort.salary.desc ? (
//                         <ArrowDownwardIcon />
//                       ) : (
//                         <ArrowUpwardIcon />
//                       )}
//                     </IconButton>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </Grid>
  
//             <Grid item>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 style={{ padding: "10px 50px" }}
//                 onClick={() => getData()}
//               >
//                 Apply
//               </Button>
//             </Grid>
//           </Grid>
//         </Paper>
//       </Modal>
//     );
//   };

const Home = (props) => {
    const [jobs, setJobs] = useState([]);
    const [searchOptions, setSearchOptions] = useState({ query: "" });
  
    const getData = () => {
      let searchParams = [];
      if (searchOptions.query !== "") {
        searchParams = [...searchParams, `q=${searchOptions.query}`];
      }

      searchParams = [...searchParams];
      const queryString = searchParams.join("&");
      console.log(queryString);
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
            console.log(response.data);
            setJobs(response.data);
        })
        .catch((error) => {
            console.log(error.response.data);
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
            {/* <Grid item>
              <IconButton onClick={() => setFilterOpen(true)}>
                <FilterListIcon />
              </IconButton>
            </Grid> */}
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
