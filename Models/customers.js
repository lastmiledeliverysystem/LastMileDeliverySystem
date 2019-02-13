const mongoose = require ('mongoose');

const customers = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  fName: {type:String, required: true},
  lName: {type:String, required: true},
  phone: {type:Number, required: true},
  birthDate: Date,
  imageURL: String,
  address: [{
    address1: {type:String, required: true},
    address2: {type:String, required: true},
    state: {type:String, required: true},
    city: {type:String, required: true},
    zip: {type:String, required: true}
  }]
});
const Customers = mongoose.model('Customers', customers);

Customers.create({fName: "maha", lName: 'Mohammed', phone: "1234", birthDate:"", imageURL: "" ,
address:[{address1:"egypt", address2:"tanta", state:"tanta", city:"ta", zip:"t"}] }, (err)=> {
  if (err) console.log("error");
});

module.exports = Customers; 




