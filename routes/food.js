const foodController = require("../controllers/food")
const router = require("express").Router()

router.get("/", foodController.fetchAllFoods)

router.post("/",foodController.addFood)

module.exports = router