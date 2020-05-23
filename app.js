const express = require('express');
const app = express();
const productRoute = require('./api/routes/products');
const orderRoute = require('./api/routes/orders');
const userrouter = require('./api/routes/users');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const uri = "mongodb+srv://younuse:sherif@cluster0-umi9i.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

app.use('/uploads',express.static('uploads'));

app.use('/users',userrouter);
app.use('/products',productRoute);
app.use('/orders',orderRoute);

app.use((req,res,next)=>{
    const error = new Error('not found');
    error.status=404;
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})
module.exports = app;
