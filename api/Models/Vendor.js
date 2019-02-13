
const mongoose = require('mongoose');

<<<<<<< HEAD
const vendors = new mongoose.Schema({
  vendorId: mongoose.Schema.Types.ObjectId,
  name: {
    type: String, required: true,
  },
  category: {
    type: String, required: true,
  },
  phone: {
    type: Number, required: true,
  },
  type: String,
  imageURL: String,
  address: [{
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
  }],
  vendorProduct: {
    type: String, required: true,
  },

});
const Vendors = mongoose.model('Vendors', vendors);

module.exports = Vendors;
=======
const vendor = new mongoose.Schema({
  vendorId: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  category: { type: String, required: true },
  phone: { type: Number, required: true },
  type: String,
  imageURL: String,
  address: [{
    address1: { type: String, required: true },
    address2: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
  }],
  vendorProduct: { type: String, required: true },
});
const Vendor = mongoose.model('Vendor', vendor);

module.exports = Vendor;
>>>>>>> 5b9d7a6301b4f4ea4d2b7be607908ce8344e6b4f
