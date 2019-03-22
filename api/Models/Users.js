const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

const users = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    match: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
  },
  permission: {
    id: { type: mongoose.Schema.Types.ObjectId, refPath: 'permission.role', required: true },
    role: { type: String, required: true },
  },
  isVendor: Boolean,
  isCustomer: Boolean,
  logoutToken: String,
});

users.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isVendor: this.isVendor, isCustomer: this.isCustomer }, config.get('jwtPrivateKey'));

  return token;
};

const Users = mongoose.model('Users', users);

module.exports = Users;
