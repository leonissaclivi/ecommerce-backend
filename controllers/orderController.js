const Order = require('../models/OrderModel')
const User = require('../models/UserModel')
const dotenv = require('dotenv').config()
const Stripe = require('stripe')

const currency = 'usd'
const deliveryCharge = 5


//gateway initilaise 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)



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
    try {
        const userId = req.user.id;
        console.log(userId);

        const { items, amount, address } = req.body;
        const { origin } = req.headers

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }

        const newOrder = new Order(orderData);
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))
        line_items.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',

        })

        res.json({ success: true, session_url: session.url })

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
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
    try {
        const { orderId, status } = req.body;
        await Order.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: 'Status Updated' })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })

    }
}

module.exports = { placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus }