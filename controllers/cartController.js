const users = require('../models/UserModel');
const mongoose = require('mongoose');
const Product = require('../models/ProductModel');

const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.body;
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
        const userId = req.user.id;
        const { itemId, quantity } = req.body;
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
      const userId = req.user.id;
      const userData = await users.findById(userId);
      const cartData = userData.cartData || {};
  
      const enrichedCart = [];
  
      
      for (const itemId in cartData) {
        const product = await Product.findById(itemId);
        if (product) {
          enrichedCart.push({
            itemId,
            name: product.name,
            price: product.price,
            image: product.image[0], 
            quantity: cartData[itemId],
            total: product.price * cartData[itemId],
          });
        }
      }
  
      return res.json({ success: true, cart: enrichedCart });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
    }
  };
  

module.exports = { addToCart, updateCart, getUserCart }