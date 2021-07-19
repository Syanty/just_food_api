const Food = require("../models/food")

module.exports = {
    async fetchAllFoods(req, res) {
        await Food.find().then(foods => {
            res.status(200).send(foods)
        })
    },
    async addFood(req, res) {
        await new Food(req.body).save().then(food => {
            res.status(201).send(food)
        })
    }
}