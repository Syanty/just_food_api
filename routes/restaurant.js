const restaurantController = require("../controllers/restaurant")
const { models } = require("mongoose")
const router = require("express").Router()

/* other routes goes here */
router.use("/featured", require("../global/featured")(models.Restaurant))



/* crud routes */
router.use('/', require('../global/crud')(models.Restaurant))

module.exports = router