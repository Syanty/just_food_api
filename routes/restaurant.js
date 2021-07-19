const restaurantController = require("../controllers/restaurant")
const router = require("express").Router()

router.get("/", restaurantController.fetchAllrestaurants)
router.post("/",restaurantController.addRestaurant)

module.exports = router