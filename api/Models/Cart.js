const mongoose = require('mongoose');

const cart = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  cartItems: [mongoose.Schema.Types.ObjectId],
});
const Cart = mongoose.model('Cart', cart);

module.exports = Cart;
