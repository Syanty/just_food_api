const Food = require("../models/food")
const Restaurant = require("../models/restaurant")


module.exports = {
    dynamicSearch(req, res) {
        const filter = { name: { $regex: req.query.name, $options: "i" } }
        const foodPromise = Food.find(filter)
        const restaurantPromise = Restaurant.find(filter)

        Promise.all([foodPromise, restaurantPromise]).then(values => {
            let items = [...values[0], ...values[1]]
            res.status(200).send(items)
        })

    }

}