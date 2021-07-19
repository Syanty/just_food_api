const express = require("express")

module.exports = (Collection) => {
    const fetchFeatured = (req, res) => {
        Collection.find({
            isFeatured: true
        }).then(items => {
            res.send(items)
        })
    }

    let router = express.Router()

    router.get("/", fetchFeatured)

    return router

}