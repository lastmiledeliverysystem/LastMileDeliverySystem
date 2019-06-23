
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
      type: String, required: false,
    },
    address2: {
      type: String, required: false,
    },
    state: {
      type: String, required: false,
    },
    city: {
      type: String, required: false,
    },
    zip: {
      type: String, required: false,
    },
  },


});
const Vendor = mongoose.model('Vendor', vendor);

module.exports = Vendor;
