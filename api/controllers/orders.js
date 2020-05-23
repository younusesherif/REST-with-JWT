const mongoose = require('mongoose');
const Order = require('../models/order');
const Product =require('../models/product');


exports.get_all=(req,res,next)=>{
    Order
    .find()
    .select("product quantity _id")
    .populate('product','name')
    .exec()
    .then(result=>{
        const response={
            count:result.length,
            product:result.map(resul =>{
                return {
                _id:resul._id,
                product:resul.product,
                quantity:resul.quantity,
                request:{
                    type:'GET',
                    url:'http://localhost:3000/orders/'+resul._id
                }
            }
            })
        }
        res.status(200).json(response);
    })
    .catch(err=>{
        res.status(500).json({
            message:{
                error:err       
            }
        })
    });
}
exports.post_all=(req,res,next)=>{
    Product
    .findById(req.body.productID)
    .exec()
    .then(result=>{
        if(!result){
            return res.status(404).json({
                message:"invalid product ID"
            })
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity:req.body.quantity,
            product:req.body.productID
        });
        return order.save()
    })
    .then(result=>{
        res.status(200).json({
            message:"order placed",
            orderDetail:result,
            request:{
                type:'GET',
                url:"http://localhost:3000/order/"+result._id
            }
        });
    })
    .catch(err=>{
            res.status(500).json({
                message:"product not found",
                error:err
            })
    })
};

exports.get_one=(req,res,next)=>{
    Order.findById(req.params.orderID)
    .populate('product')    
    .exec()
    .then(result=>{
        if(!result)
        {
            return res.status(404).json({
                message:"order not found"
            })
        }
        res.status(200).json({
            order:result,
            request:{
                type:'GET',
                url:'http://localhost:3000/orders'
            }
        })
    })
    .catch(err=>{
        res.status(200).json({
            message:"order deleted",
            result:err
        })
    })
};

exports.delete_one=(req,res,next)=>{
    Order.remove({_id:req.params.orderID})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:"order deleted",
            result:result
        })
    })
    .catch(err=>{
        res.status(500).json({
        error:err
    })
    })
    
};