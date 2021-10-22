const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const router = express.Router()
const mongoose = require('mongoose')

//Banco de Dados
mongoose.connect(process.env.CONNECTION_STRING);

//Models
const Product = require('./models/product');
const Customer = require("./models/customer");
const Order = require("./models/order");


//Body Parser
app.use(bodyParser.json({
    limit: "5mb"
}));
app.use(bodyParser.urlencoded({ extended: false }));

//CORS
app.use(function (res, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});

//Rotas
const index = require('./routes/index')
const productRoute = require('./routes/productRoute')
const customerRoute = require('./routes/customerRoute')
const orderRoute = require('./routes/orderRoute')


app.use('/', index)
app.use('/products', productRoute)
app.use('/customers', customerRoute)
app.use('/orders', orderRoute)

module.exports = app;