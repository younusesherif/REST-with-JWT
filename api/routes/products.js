const express = require('express');
const router = express.Router();
const multer = require('multer');

const productcontroller = require('../controllers/products');

const checkauth = require('../middleware/chechauth');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
});     
const fileFilter  = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    {
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}
const upload = multer({
    storage:storage,
    limits:{
    fileSize:1024*1024*5
    },
    fileFilter:fileFilter
});

router.get('/',productcontroller.get_all);

router.post('/',checkauth,upload.single('productImage'),productcontroller.post_one);

router.get('/:productID',productcontroller.get_one);

router.patch('/:productID',checkauth,productcontroller.update_one);

router.delete('/:productID',checkauth,productcontroller.delete_one)

module.exports = router;