const mongoose = require('mongoose');

const orders = new mongoose.Schema({
  salesOrderNumber: mongoose.Schema.Types.ObjectId,
  robotId: mongoose.Schema.Types.ObjectId,
  date: Date,
  status: {
    type: String,
    required: true,
  },
  items: {
    id: mongoose.Schema.Types.ObjectId,
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

  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'customers', required: true },
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
    type: Date,
    required: false,
  },
  deliveryDate: {
    type: Date,
    required: false,
  },
  trackingPassword: {
    type: String,
    required: true,
    match: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
  },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'vendors', required: true },
  // paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'paymentcards', required: true },
  paymentMethod: {
    type: String,
    required: true,
  },

});
const Orders = mongoose.model('Orders', orders);
module.exports = Orders;
