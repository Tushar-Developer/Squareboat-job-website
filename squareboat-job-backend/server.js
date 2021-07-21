const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passportChecker = require("./lib/passportChecker");

//Connect to db
mongoose.connect("mongodb+srv://tushar:qwerty1234@squareboat-job-website.hj1z6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((response) => console.log("Database Connection Established."))
.catch((error) => console.log(error));

const app = express();

//using Middlewares
app.use(cors());
app.use(express.json());
app.use(passportChecker.initialize());

//Routes
app.use("/authorize", require("./routes/authorizeRoutes"));
app.use("/api", require("./routes/apiRoutes")); //for all differernt routed after login.

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Server running on Port: ',port);
});