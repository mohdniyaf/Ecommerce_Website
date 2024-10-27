const mongoose = require("mongoose")
const Schema = mongoose.Schema;



const categorySchema = new Schema({
    categoryName : {
        type:String,
        trim:"true",
        uppercase:"true",
        unique: true

    },
    active:{
        type:Boolean,
        default:true
    }
})

const category = mongoose.model("category",categorySchema)

module.exports = category;