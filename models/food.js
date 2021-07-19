const mongoose = require("mongoose");

module.exports = mongoose.model('Food',new mongoose.Schema({
    name: String,
    description:String,
    isFeatured:{
        type:Boolean,
        default:false
    }
}))