const { models } = require("mongoose")
const foodController = require("../controllers/food")
const router = require("express").Router()


/* other routes goes here */
router.use("/featured", require("../global/featured")(models.Food))



/* crud routes */
router.use('/', require('../global/crud')(models.Food))

/* routes here gets invalid */



module.exports = router