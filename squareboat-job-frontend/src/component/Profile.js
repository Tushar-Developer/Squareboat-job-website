import { useEffect, useState } from "react";
import { Button, Grid, Typography, Paper, makeStyles, TextField } from "@material-ui/core";
import axios from "axios";

import apiList from "../lib/apiList";

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

const Profile = (props) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
  
    const [profileDetails, setProfileDetails] = useState({
      name: "",
    });
  
    const handleInput = (key, value) => {
      setProfileDetails({
        ...profileDetails,
        [key]: value,
      });
    };
  
    useEffect(() => {
      getData();
    }, []);
  
    const getData = () => {
      axios.get(apiList.user, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then((response) => {
          console.log(response.data);
          setProfileDetails(response.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    };
  
    const handleUpdate = () => {  
      let updatedDetails = {
        ...profileDetails
      };
  
      axios.put(apiList.user, updatedDetails, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          getData();
        })
        .catch((error) => {
          console.log(error.response);
        });
      setOpen(false);
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
            <Typography variant="h2">Profile</Typography>
          </Grid>
          <Grid item xs>
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
              <Grid container direction="column" alignItems="stretch" spacing={3}>
                <Grid item>
                  <TextField
                    label="Name"
                    value={profileDetails.name}
                    onChange={(event) => handleInput("name", event.target.value)}
                    className={classes.inputBox}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px", marginTop: "30px" }}
                onClick={() => handleUpdate()}
              >
                Update Details
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  };

export default Profile;