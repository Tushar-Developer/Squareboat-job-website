const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//Connect to db
mongoose.connect("mongodb://localhost:27017/squareboatJobDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((response) => console.log("Database Connection Established."))
.catch((error) => console.log(error));

const app = express();
const portNo = 5000;


//using Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use("/authorize", require("./routes/authorizeRoutes"));
app.use("/api", require("./routes/apiRoutes")); //for all differernt routed after login.

app.listen(portNo, () => {
    console.log('Server running on Port: ',portNo);
});