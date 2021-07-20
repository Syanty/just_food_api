const { models } = require("mongoose")
const userController = require("../controllers/user")
const router = require("express").Router()

/* other routes here */

/* crud routes */
router.use('/', require('../global/crud')(models.User))

/* routes here gets invalid */



module.exports = router