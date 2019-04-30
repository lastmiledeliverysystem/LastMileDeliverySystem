
const mongoose = require('mongoose');

const vendor = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String, required: true,
  },
  phone: {
    type: Number, required: true,
  },
  vendorType: String,
  imageURL: String,
  address: {
    address1: {
      type: String, required: true,
    },
    address2: {
      type: String, required: true,
    },
    state: {
      type: String, required: true,
    },
    city: {
      type: String, required: true,
    },
    zip: {
      type: String, required: true,
    },
  },


});
const Vendor = mongoose.model('Vendor', vendor);

module.exports = Vendor;
