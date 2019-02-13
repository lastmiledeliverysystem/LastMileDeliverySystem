const mongoose = require ('mongoose');




const products = new mongoose.Schema({
vendorProducts :[{
    name: {type:String, required: true},
    category: {type:String, required: true },
    description: {type:String, required: true },
    rate: {type:Number, required: true },
    price: {type:Number, required: true },
    specs: {type:String, required: true },
    quantity:{type: Number, required: true },
    unit:String,
    sku: String,
    barCode: String,
    options: {
      image: {type:String, required: true },
      color: {type:String, required: true },
      size: {type:String, required: true }
    },
    productId: Number
    }]
});
const Products = mongoose.model('Products',products);

Products.create({vendorProducts:[{name: "Maha", category: "Pharmacy", description:"asdf", rate: 4, price: 50, specs:"asdf", 
quantity: 4, unit: "123", sku:"123", barCode: "1234", options: {image:"1234", color:"foshia", size:"1234"}}]},
 (err)=> {
  if (err) console.log("error");
});
module.exports = Products; 
 


