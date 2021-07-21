import { useState } from "react";
import { Grid, Button, Typography, makeStyles, Paper } from "@material-ui/core";
import axios from "axios";
import { Redirect } from "react-router-dom";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";

import isAuth from "../lib/isAuth";
import apiList from "../lib/apiList";


const useStyles = makeStyles((theme) => ({
    body: {
      padding: "60px 60px",
    },
    inputBox: {
      width: "300px",
    },
    submitButton: {
      width: "300px",
    },
}));

const Login = (props) => {
    const classes = useStyles();
  
    const [loggedin, setLoggedin] = useState(isAuth());
  
    const [loginDetails, setLoginDetails] = useState({
      email: "",
      password: "",
    });

    const [inputErrorHandler, setInputErrorHandler] = useState({
        email: {
          error: false,
          message: "",
        },
        password: {
          error: false,
          message: "",
        },
    });

    const handleInput = (key, value) => {
        setLoginDetails({
          ...loginDetails,
          [key]: value,
        });
    };

    const handleInputError = (key, status, message) => {
        setInputErrorHandler({
          ...inputErrorHandler,
          [key]: {
            error: status,
            message: message,
          },
        });
    }

    const refreshPage = () => {
        window.location.reload();
      }

    const handleLogin = () => {

        const verified = !Object.keys(inputErrorHandler).some((obj) => {
            return inputErrorHandler[obj].error;
        });

        if (verified) {
            axios.post(apiList.login, loginDetails).then((response) => {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("type", response.data.type);

                setLoggedin(isAuth());
                refreshPage();
            }).catch((error) => {
            });
        }

    };

    return loggedin ? (
        <Redirect to="/home" />
    )   :   (
        <Paper elevation={3} className={classes.body}>
            <Grid container direction="column" spacing={4} alignItems="center">
                <Grid item>
                    <Typography variant="h3" component="h2">
                        Login
                    </Typography>
                </Grid>
                <Grid item>
                    <EmailInput
                        label="Email"
                        value={loginDetails.email}
                        onChange={(event) => handleInput("email", event.target.value)}
                        inputErrorHandler={inputErrorHandler}
                        handleInputError={handleInputError}
                        className={classes.inputBox}
                    />
                </Grid>
                <Grid item>
                    <PasswordInput
                        label="Password"
                        value={loginDetails.password}
                        onChange={(event) => handleInput("password", event.target.value)}
                        className={classes.inputBox}
                    />
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleLogin()}
                        className={classes.submitButton}
                    >
                        Login
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Login;