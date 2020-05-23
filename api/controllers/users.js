const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup=(req,res)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length>=1){
            res.status(409).json({
                message:"mail exist"
            })
        }
        else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    res.status(501).json({
                        message:err
                    })
                }
                else{
                    const user = new User({
                        _id:mongoose.Types.ObjectId(),
                        email:req.body.email,
                        password:hash
                    })
                    user.save()
                    .then(result=>{
                        console.log(result)
                        res.status(201).json({
                            message:"user created"
                        })
                    })
                    .catch(err=>{
                        res.status(501).json({
                            message:err
                        });
                    })
                }
            })
        }
    })
    .catch(err=>{
        res.status(501).json({
            message:err
        });
    })
}

exports.login=(req,res)=>{
    User.find({email:req.body.email})
    .exec()
    .then(result=>{
        if(result<1)
        {
            return res.status(401).json({
                message:"auth failed"
            })
        }
        else{
           bcrypt.compare(req.body.password,result[0].password,(err,response)=>{
                if(err){
                    return res.status(401).json({
                        message:"auth failed"
                    })
                }
                if(response){
                    const token = jwt.sign({
                        email:result[0].email,
                        userid:result[0]._id
                    },
                    "secret",
                    {
                        expiresIn:"1h"
                    }
                    )
                    return res.status(200).json({
                        message:"auth successful",
                        token: token
                    })
                }
                res.status(201).json({
                    message:"auth failed"
                })
           })
        }
    })
    .catch(err=>{
        res.status(501).json({
            error:err
        })
    })
}

exports.delete=(req,res,next)=>{
    User.remove({email:req.params.userid})
    .exec()
    .then(result=>{
        res.status(501).json({
            message:"user deleted"
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
}