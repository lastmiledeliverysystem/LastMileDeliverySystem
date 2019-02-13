const mongoose = require('mongoose');

const customers = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  phone: { type: Number, required: true },
  birthDate: Date,
  imageURL: String,
  address: [{
    address1: { type: String, required: true },
    address2: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
  },
  ],
});
const Customers = mongoose.model('Customers', customers);

module.exports = Customers;
