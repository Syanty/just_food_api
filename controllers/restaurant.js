const Restaurant = require("../models/restaurant")

module.exports = {
    async fetchAllrestaurants(req, res) {
        await Restaurant.find().then(restaurants => {
            res.status(200).send(restaurants)
        })
    },

    async addRestaurant(req, res) {
        await new Restaurant(req.body).save().then(restaurant => {
            res.status(201).send(restaurant)
        })
    }
}