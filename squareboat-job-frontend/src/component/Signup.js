import { useState } from "react";
import { Grid, TextField, Button, Typography, makeStyles, Paper, MenuItem } from "@material-ui/core";
import axios from "axios";
import { Redirect } from "react-router-dom";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
    body: {
      padding: "60px 60px",
    },
    inputBox: {
      width: "400px",
    },
    submitButton: {
      width: "400px",
    },
  }));

  const Login = (props) => {
    const classes = useStyles();
  
    const [loggedin, setLoggedin] = useState(isAuth());
  
    const [signupDetails, setSignupDetails] = useState({
      type: "applicant",
      email: "",
      password: "",
      name: "",
    });

    const [inputErrorHandler, setInputErrorHandler] = useState({
        email: {
          untouched: true,
          required: true,
          error: false,
          message: "",
        },
        password: {
          untouched: true,
          required: true,
          error: false,
          message: "",
        },
        name: {
          untouched: true,
          required: true,
          error: false,
          message: "",
        },
    });

    const handleInput = (key, value) => {
        setSignupDetails({
            ...signupDetails,
            [key]: value,
        });
    };

    const handleInputError = (key, status, message) => {
        setInputErrorHandler({
            ...inputErrorHandler,
            [key]: {
            required: true,
            untouched: false,
            error: status,
            message: message,
            },
        });
    };

    const handleLogin = () => {
        const tmpErrorHandler = {};
        Object.keys(inputErrorHandler).forEach((obj) => {
            if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
                tmpErrorHandler[obj] = {
                    required: true,
                    untouched: false,
                    error: true,
                    message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
                };
            } else {
            tmpErrorHandler[obj] = inputErrorHandler[obj];
            }
        });

        setSignupDetails(signupDetails);

        const verified = !Object.keys(tmpErrorHandler).some((obj) => {
            return tmpErrorHandler[obj].error;
        });

        if (verified) {
            axios.post(apiList.signup, signupDetails).then((response) => {
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("type", response.data.type);
              setLoggedin(isAuth());
              window.location.reload();
            }).catch((error) => {
            });
        }
        else {
            setInputErrorHandler(tmpErrorHandler);
        }
    };

    const handleLoginRecruiter = () => {
        const tmpErrorHandler = {};
        Object.keys(inputErrorHandler).forEach((obj) => {
          if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
            tmpErrorHandler[obj] = {
              required: true,
              untouched: false,
              error: true,
              message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
            };
          } else {
            tmpErrorHandler[obj] = inputErrorHandler[obj];
          }
        });
    
        let updatedDetails = {
          ...signupDetails,
        };
    
        setSignupDetails(updatedDetails);
    
        const verified = !Object.keys(tmpErrorHandler).some((obj) => {
          return tmpErrorHandler[obj].error;
        });
    
    
        if (verified) {
          axios.post(apiList.signup, updatedDetails).then((response) => {
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("type", response.data.type);
              setLoggedin(isAuth());
              window.location.reload();
            })
            .catch((error) => {
            });
        } 
        else {
          setInputErrorHandler(tmpErrorHandler);
        }
    };

    return loggedin ? (
        <Redirect to="/" />
      ) : (
        <Paper elevation={3} className={classes.body}>
          <Grid container direction="column" spacing={4} alignItems="center">
            <Grid item>
              <Typography variant="h3" component="h2">
                Signup
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                select
                label="Category"
                variant="outlined"
                className={classes.inputBox}
                value={signupDetails.type}
                onChange={(event) => {
                  handleInput("type", event.target.value);
                }}
              >
                <MenuItem value="applicant">Applicant</MenuItem>
                <MenuItem value="recruiter">Recruiter</MenuItem>
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                label="Name"
                value={signupDetails.name}
                onChange={(event) => handleInput("name", event.target.value)}
                className={classes.inputBox}
                error={inputErrorHandler.name.error}
                helperText={inputErrorHandler.name.message}
                onBlur={(event) => {
                  if (event.target.value === "") {
                    handleInputError("name", true, "Name is required");
                  } else {
                    handleInputError("name", false, "");
                  }
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <EmailInput
                label="Email"
                value={signupDetails.email}
                onChange={(event) => handleInput("email", event.target.value)}
                inputErrorHandler={inputErrorHandler}
                handleInputError={handleInputError}
                className={classes.inputBox}
                required={true}
              />
            </Grid>
            <Grid item>
              <PasswordInput
                label="Password"
                value={signupDetails.password}
                onChange={(event) => handleInput("password", event.target.value)}
                className={classes.inputBox}
                error={inputErrorHandler.password.error}
                helperText={inputErrorHandler.password.message}
                onBlur={(event) => {
                  if (event.target.value === "") {
                    handleInputError("password", true, "Password is required");
                  } else {
                    handleInputError("password", false, "");
                  }
                }}
              />
            </Grid>
            {signupDetails.type === "applicant" ? (
              <>
              </>
            ) : (
              <>
              </>
            )}
    
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  signupDetails.type === "applicant"
                    ? handleLogin()
                    : handleLoginRecruiter();
                }}
                className={classes.submitButton}
              >
                Signup
              </Button>
            </Grid>
          </Grid>
        </Paper>
      );
}


export default Login;