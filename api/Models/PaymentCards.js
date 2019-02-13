const mongoose = require('mongoose');

const paymentCards = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  cards: Array,
});

const PaymentCards = mongoose.model('PaymentCards', paymentCards);

module.exports = PaymentCards;
