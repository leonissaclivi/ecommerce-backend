const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express()
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5174',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization','token'],
  };

app.use(cors(corsOptions));



mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB connected");
})
.catch(err=>console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World')
})

const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const cartRouter = require('./routes/cartRoutes')
app.use('/api/auth',userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);

const port = process.env.PORT;


app.listen(port, (console.log(`server is running on port ${port}`)
))