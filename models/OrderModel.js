const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: 'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number }
    // user : {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    // products:[{
    //     product : {type:mongoose.Schema.Types.ObjectId, ref:'Product'},
    //     quantity : {type:Number, default:1},
    //     price : {type:Number}
    // }],

})

module.exports = mongoose.model('Order', orderSchema)