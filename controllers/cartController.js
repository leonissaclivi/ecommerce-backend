const users = require('../models/UserModel');
const mongoose = require('mongoose');

const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        console.log("request recieved");


        const userData = await users.findOne({ _id: userId });
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }
        let cartData = await userData.cartData || {};
        if (cartData[itemId]) {
            cartData[itemId] += 1
        } else {
            cartData[itemId] = 1
        }
        userData.cartData = cartData;
        console.log(cartData);
        
        userData.markModified('cartData')

        //test
       
        await userData.save();
        // await users.findByIdAndUpdate(userId, { cartData })
        return res.json({ success: true, message: "Added to cart" })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })

    }
}


const updateCart = async (req, res) => {
    try {
        const { userId, itemId, quantity } = req.body;
        const userData = await users.findById(userId);
        let cartData = await userData.cartData || {};

        cartData[itemId] = quantity
        userData.cartData = cartData
        userData.markModified('cartData');
        await userData.save();
        // await users.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Cart Updated" })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;
        
        const userData = await users.findById(userId);
        let cartData = await userData.cartData || {};

        res.json({ success: true, cartData });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

module.exports = { addToCart, updateCart, getUserCart }