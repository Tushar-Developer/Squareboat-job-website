import { useEffect, useState } from "react";
import { Grid, Typography, Paper, makeStyles, TextField } from "@material-ui/core";
import axios from "axios";

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

const Profile = (props) => {
    const classes = useStyles();
  
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
            setProfileDetails(response.data);
        }).catch((error) => {
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
            <Typography variant="h2">Profile</Typography>
          </Grid>
          <Grid item xs style={{ width: "100%" }}>
            <Paper
              style={{
                padding: "20px",
                outline: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                //   width: "60%",
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
                    style={{ width: "100%" }}
                  />
                </Grid>
                <Grid
                  item
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  };

export default Profile;
