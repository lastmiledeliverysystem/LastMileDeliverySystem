const mongoose = require('mongoose');

const orders = new mongoose.Schema({
  //salesOrderNumber: mongoose.Schema.Types.ObjectId,
  //robotId: mongoose.Schema.Types.ObjectId,
  date: String,
  status: {
    type: String,
    required: true,
  },
  items: {
    //_id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: true,
    },
    description: String,
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    imageName: {
      type: String,
      required: true,
    },
  },

  //customerId:  mongoose.Schema.Types.ObjectId,
  //{ type: mongoose.Schema.Types.ObjectId, refPath: < customerID Tablem >, required: true },
  discountAmount: Number,
  discount: Number,
  shippingCharge: Number,
  total: Number,
  notes: String,
  address: [{
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
  }],
  shippmentDate: {
    type: String,
    required: false,
  },
  deliveryDate: {
    type: String,
    required: false,
  },
  trackingPassword: {
    type: String,
    required: true,
    match: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  //paymentId: mongoose.Schema.Types.ObjectId,
  //vendorId:  mongoose.Schema.Types.ObjectId

});
const Orders = mongoose.model('Orders', orders);
module.exports = Orders;
