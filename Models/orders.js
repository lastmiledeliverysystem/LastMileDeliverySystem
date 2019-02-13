const mongoose = require ('mongoose');


 
const orders = new mongoose.Schema({
  //salesOrderNumber: mongoose.Schema.Types.ObjectId,
  //robotId: mongoose.Schema.Types.ObjectId,
  date: Date,
  status : {type: String, required: true},
  shippmentDate: {type: Date, required: false},
  //customerId:  mongoose.Schema.Types.ObjectId,
  discountAmount: Number,
  discount: Number,
  items: {
    //_id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    description: String,
    quantity:{type: Number, required: true},
    unit: {type: String, required: true},
    imageName: {type: String, required: true}
  },
  shippingCharge: Number,
  total: Number,
  notes: String,
  address: [{
    address1: {type:String, required: true},
    address2: {type:String, required: true},
    state: {type:String, required: true},
    city: {type:String, required: true},
    zip: {type:String, required: true}
  }],
  deliveryDate: {type: Date, required: false},
  trackingPassword: String,
  paymentMethod: {type: String, required: true},
  //paymentId: mongoose.Schema.Types.ObjectId,
  //vendorId:  mongoose.Schema.Types.ObjectId

});
const Orders = mongoose.model('Orders', orders);

Orders.create({status: "shipped" ,
items:{name:'rawan',description:'koways',quantity:2,unit:'kg',imageName:'mmmm'},
address:[{address1:"egypt", address2:"tanta", state:"tanta", city:"ta", zip:"t"}] ,
deliveryDate :"7.23.2018",
paymentMethod:'card'}, (err)=> {
  if (err) console.log("error");
});
module.exports = Orders; 

