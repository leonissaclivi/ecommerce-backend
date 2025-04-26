const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const app = express()
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB connected");
})
.catch(err=>console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World')
})

const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes')
app.use('/api/auth',userRouter);
app.use('/api/product', productRouter);

const port = process.env.PORT;


app.listen(port, (console.log(`server is running on port ${port}`)
))