const mongoose = require('mongoose');

const orders = new mongoose.Schema({
  salesOrderNumber: mongoose.Schema.Types.ObjectId,
  robotId: mongoose.Schema.Types.ObjectId,
  date: { type: Date, default: +new Date() + 2 * 60 * 60 * 1000 },
  status: {
    type: String,
    required: true,
  },
  quantity: Number,
  itemId: mongoose.Schema.Types.ObjectId,
  customerId: mongoose.Schema.Types.ObjectId,
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
    default: +new Date() + 2.5 * 60 * 60 * 1000,
  },
  deliveryDate: {
    type: Date,
    default: +new Date() + 3 * 60 * 60 * 1000,
  },
  trackingPassword: {
    type: String,
    required: true,
    match: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
  },
  vendorId: mongoose.Schema.Types.ObjectId,
  // paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'paymentcards', required: true },
  paymentMethod: {
    type: String,
    required: true,
  },

});


orders.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if(!this.date) {
      this.date = now
  }
  next();
});

const Orders = mongoose.model('Orders', orders);
module.exports = Orders;
