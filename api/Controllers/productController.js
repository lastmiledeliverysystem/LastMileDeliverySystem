const express = require('express');
const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Products = require('../Models/Products');
const router = express.Router();

const productSchema =Joi.object().keys({
    vendorProducts:Joi.array().items(Joi.object().keys({
        name: Joi.string().required(),
        category:Joi.string().required(),
        description:Joi.string().required(),
        rate:Joi.number().required(),
        price:Joi.number().required(),
        specs:Joi.string().required(),
        quantity:Joi.number().required(),
        unit:Joi.string().required(),
        sku:Joi.string().required(),
        barCode:Joi.string().required(),
        productId:Joi.number().required(),
        options:Joi.object().keys({
            image:Joi.string().required(),
            color:Joi.string().required(),
            size:Joi.string().required(),
        }),
    }))
}) 


router.get('/',async(req,res)=>{
    try{
        const product = await Products.find({})
        if( _.isEmpty(product)) return('no product found');
        return res.send(product);
    } catch(err){
        throw err;
    }
});

router.get('/:id',async(req,res)=>{
    try{
        const { id } = req.params;
        const idValidationSchema = Joi.objectId().required();
        const idValidationResult = Joi.validate(id, idValidationSchema);
        if (idValidationResult.error) return res.status(400).send('Product ID is not Valid! ');
        const product = await Products.findById(id)
        if( _.isEmpty(product)) return('no product found');
        return res.send(product);
    } catch(err){
        throw err;
    }
});

router.post('/',async(req,res)=>{

    try {
        const {vendorProducts} = req.body;
        const productValidationResult = Joi.validate({vendorProducts},productSchema);
        if (productValidationResult.error)
        return res.status(400).send(productValidationResult.error.details[0].message);
        const product = await Products.create({
            vendorProducts
        })    
        
        return res.send(product)
    } catch (err) {
    throw err;
  }      
});

router.delete('/:id',async(req,res)=>{
    try{
        const { id } = req.params;
        const idValidationSchema = Joi.objectId().required();
        const idValidationResult = Joi.validate(id, idValidationSchema);
        if (idValidationResult.error) return res.status(400).send('Product ID is not Valid! ');
        const product = await Products.findByIdAndDelete(id)
        return res.send(product);
    } catch(err){
        throw err;
    }
});




module.exports = router;