const mongoose = require("mongoose");

module.exports = mongoose.model('Restaurant',new mongoose.Schema({
    name: String,
    description:String,
}))