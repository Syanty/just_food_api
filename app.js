const express = require("express")
const morgan = require("morgan")
const cors = require("cors");
require("dotenv").config()
require("./config/db")
require("./auth/passport-auth");
const authAccountRoutes = require("./routes/auth-account");
const userRoutes = require("./routes/user");
const errorHandler = require("./helpers/error-handler");
const foodRoutes = require("./routes/food")
const restaurantRoutes = require("./routes/restaurant")

const searchController = require("./controllers/search");
const { models } = require("mongoose");

const app = express()

/* middlewares */
//recognize the incoming Request Object as a JSON Object.
app.use(express.json());

//HTTP request logger
app.use(morgan('dev'))
//Cross-Origin Resource Sharing--->to allow or restrict requested resources on a web server
app.use(cors());
app.options("*", cors());



/* routes */

app.get("/", (req, res) => {
    res.status(200).send("ENDPOINTS HOME")
})



const BASE_URI = process.env.BASE_URI





app.get(`${BASE_URI}/search`, searchController.dynamicSearch)
app.use(`${BASE_URI}/foods/`, foodRoutes)
app.use(`${BASE_URI}/restaurants/`, restaurantRoutes)
app.use(`${BASE_URI}/auth`, authAccountRoutes);
app.use(`${BASE_URI}/users`, userRoutes);

// Handle errors.
app.use(errorHandler);


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`);
})