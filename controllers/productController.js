const ProductModel = require('../models/ProductModel');
const products = require('../models/ProductModel');
const cloudinary = require('cloudinary').v2
const dotenv = require('dotenv').config();
console.log(process.env.CLOUDINARY_SECRET_KEY);


cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_SECRET_KEY
})

const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                try {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url
                } catch (error) {
                    console.error("Cloudinary upload error:",error.message)
                }
            })
        )

        const productData = {
            name,
            description,
            price:Number(price),
            category,
            stock:Number(stock),
            image:imagesUrl,
            date:Date.now()
        }

        console.log(productData);

        const product = new products(productData);
        await product.save()
        
        res.json({success:true, message:"Product added"})


    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const listProducts = async (req, res) => {
    try {
        const products = await ProductModel.find({});
        res.json({success:true,products})
    } catch (error) {
        res.json({success:false, message:error.message});
    }
}

const removeProducts = async (req, res) => {
    try {
        await ProductModel.findByIdAndDelete(req.body.id);
        res.json({success:true, messsage:"Product removed"});
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

const singleProduct = async (req, res) => {
    try {
        const {productId} = req.body;
        const product = await ProductModel.findById(productId);
        res.json({success:true, product});

    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

module.exports = { addProduct, listProducts, removeProducts, singleProduct }