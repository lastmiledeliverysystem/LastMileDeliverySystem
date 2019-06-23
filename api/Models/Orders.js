const mongoose = require('mongoose');

const orders = new mongoose.Schema({
  salesOrderNumber: mongoose.Schema.Types.ObjectId,
  robotId: mongoose.Schema.Types.ObjectId,
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: false,
  },
  quantity: Number,
  items: [{
    name:String,
    category:String,
    description:String,
    price:Number,
    unit:String,
    vendorId: mongoose.Schema.Types.ObjectId,
    
  }],
  // items: String,
  customerId: { type: mongoose.Schema.Types.ObjectId },
  discountAmount: Number,
  discount: Number,
  shippingCharge: Number,
  total: Number,
  notes: String,
  address: {
    lat: Number,
    long: Number,
  },
  shippmentDate: {
    type: Date,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
    default: Date.now,
  },
  trackingPassword: {
    type: String,
    required: false,
    match: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
  },
  vendorId: { type: mongoose.Schema.Types.ObjectId },
  // paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'paymentcards', required: true },
  paymentMethod: {
    type: String,
    required: false,
  },

});
const Orders = mongoose.model('Orders', orders);
module.exports = Orders;
