const mongoose = require('mongoose');

const orders = new mongoose.Schema({
  salesOrderNumber: mongoose.Schema.Types.ObjectId,
  robotId: mongoose.Schema.Types.ObjectId,
  date: Date,
  status: {
    type: String,
    required: true,
  },
  quantity: Number,
  itemId: mongoose.Schema.Types.ObjectId,
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'customers', required: true },
  discountAmount: Number,
  discount: Number,
  shippingCharge: Number,
  total: Number,
  notes: String,
  address: {
    lat: Number,
    mag: Number,
  },
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
