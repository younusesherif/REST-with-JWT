const mongoose = require('mongoose');
const Product =require('../models/product');

exports.get_all=(req,res,next)=>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(result=>{
        const response={
            count:result.length,
            product:result.map(resul =>{
                return {
                name:resul.name,
                price:resul.price,
                _id:resul._id,
                productImage:resul.productImage,
                request:{
                    type:'GET',
                    url:'http://localhost:3000/products/'+resul._id
                }
            }
            })
        }
            res.status(200).json(response);
    })
    .catch(err=>console.log(err))
}

exports.post_one=(req,res,next)=>{
    console.log(req.file)
   const product =new Product({
       _id: new mongoose.Types.ObjectId(),
       name: req.body.name,
       price:req.body.price,
       productImage:req.file.path
   });
   product
   .save()
   .then(result=>{
       console.log(result);
       res.status(200).json({
            message:"created Product successfully",
            CreatedProduct:{
                name:result.name,
                price:result.price,
                _id:result._id,
                request:{
                    type:'GET',
                    url:'http://localhost:3000/products/'+result._id
                }
            }
        });
   })
   .catch(err => {
       console.log(err);
       res.status(500).json(err);
   });
};

exports.get_one=(req,res,next)=>{
    const id = req.params.productID; 
    Product.findById(id)
    //selecting certain rows
    .select('name price _id productImage')
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message:"product",
            product:result,
            request:{
                type:'GET',
                url:'http://localhost:3000/products'
            }
        });
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.update_one=(req,res,next)=>{
    const id = req.params.productID;
    //Dynamic changing whithout changing another variables in the data
    const updateops={};
    for(const ops of req.body){
        updateops[ops.propname]=ops.value;
    }
    Product.update({_id:id},{$set:updateops})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'product updated',
            request:{
                tpye:'GET',
                url:'http://localhost:3000/products/'+id
            }
        });
    })
    .catch(err=>console.log(err));
}
exports.delete_one=(req,res,next)=>{
    const id = req.params.productID;
    Product.remove({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'product deleted',
            request:{
                tpye:'GET',
                url:'http://localhost:3000/products/'+id
            }
        });
    })
    .catch(err=>console.log(err));
}