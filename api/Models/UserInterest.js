const mongoose = require('mongoose');

const userInterest = new mongoose.Schema({

  customerId: mongoose.SchemaTypes.ObjectId,
  favorite: mongoose.SchemaTypes.document,
  wishlist: [{
    item: mongoose.SchemaTypes.document,
  }],


});

module.exports = mongoose.model('UserInterest', userInterest);
