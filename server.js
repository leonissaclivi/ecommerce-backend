const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express()
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5174',
  'https://ecommerce-adminpanel-sandy.vercel.app',
  'https://ecommerce-adminpanel-git-main-leon-issac-livis-projects.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  optionsSuccessStatus: 200 
};


app.use(cors(corsOptions));


app.options('*', cors(corsOptions));


// const allowedOrigins = [
//   'http://localhost:5174',
//   'https://ecommerce-adminpanel-sandy.vercel.app/',
//   'https://ecommerce-adminpanel-git-main-leon-issac-livis-projects.vercel.app/'
// ];

// const corsOptions = {
//     origin: allowedOrigins,
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization','token'],
//   };

// app.use(cors(corsOptions));



mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB connected");
})
.catch(err=>console.log(err))

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected to:', mongoose.connection.db.databaseName);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

app.get('/', (req, res) => {
    res.send('Hello World')
})

const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const cartRouter = require('./routes/cartRoutes')
const orderRouter = require('./routes/orderRoutes')
app.use('/api/auth',userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order',orderRouter);

const port = process.env.PORT;


app.listen(port, (console.log(`server is running on port ${port}`)
))