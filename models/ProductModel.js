const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name : {type:String, required:true},
    description : {type:String, required:true},
    image:{type:Array, required:true},
    price : {type:Number, required:true},
    category : {type:String, required:true},
    stock : {type:Number}
})

module.exports = mongoose.model('Product',productSchema)