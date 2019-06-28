const mongoose = require('mongoose');

const products = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  rate: Number,
  price: { type: Number, required: true },
  specs: { type: String},
  quantity: { type: Number, required: true },
  unit: String,
  sku: String,
  barCode: String,
  // productId: Number,
  vendorId: mongoose.Schema.Types.ObjectId,
  image: { type: String, required: true },
});
const Products = mongoose.model('Products', products);

module.exports = Products;
