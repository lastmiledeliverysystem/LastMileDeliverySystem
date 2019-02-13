
const mongoose = require ('mongoose');
 
const vendors = new mongoose.Schema({
  vendorId: mongoose.Schema.Types.ObjectId,
  name: {type:String, required: true},
  category: {type:String, required: true},
  phone: {type:Number, required: true},
  type:String,
  imageURL: String,
  address: [{
    address1: {type:String, required: true},
    address2: {type:String, required: true},
    state: {type:String, required: true},
    city: {type:String, required: true},
    zip: {type:String, required: true}
  }],
  vendorProduct:{type:String, required: true}

});
const Vendors = mongoose.model('Vendors', vendors);

Vendors.create({name: "rawan",category: 'food', phone: "1234", type:"", imageURL: "" ,
address:[{address1:"egypt", address2:"tanta", state:"tanta", city:"ta", zip:"t"}],vendorProduct:"pizza" }, (err)=> {
  if (err) console.log("error");
});
module.exports = Vendors; 





