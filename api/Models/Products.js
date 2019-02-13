const mongoose = require('mongoose');

const products = new mongoose.Schema({
  vendorProducts: [{
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    rate: { type: Number, required: true },
    price: { type: Number, required: true },
    specs: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: String,
    sku: String,
    barCode: String,
    productId: Number,
    options: {
      image: { type: String, required: true },
      color: { type: String, required: true },
      size: { type: String, required: true },
    },
  },
  ],
});
const Products = mongoose.model('Products', products);

module.exports = Products;
