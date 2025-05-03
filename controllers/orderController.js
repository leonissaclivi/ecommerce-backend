const Order = require('../models/OrderModel')
const User = require('../models/UserModel')

// using Cash on Delivery

const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId);

        const { items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new Order(orderData);
        await newOrder.save()

        await User.findByIdAndUpdate(userId, { cartData: {} })
        return res.json({ success: true, message: "Order placed" })

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })


    }
}


// Using stripe

const placeOrderStripe = async (req, res) => {

}



// All orders for admin

const allOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}




// User orders

const userOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ userId })
        res.json({ success: true, orders })
    } catch (error) {
        return res.json({ suceess: false, message: error.message })
    }
}

// Update order status

const updateStatus = async (req, res) => {

}

module.exports = { placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus }