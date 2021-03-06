const express = require('express');
const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Customer = require('../Models/Customer');
const { createUser } = require('../Controllers/UsersController');
const Cart = require('../Models/Cart');

const router = express.Router();

const idValidationSchema = Joi.objectId().required();
const adressSchema = Joi.object()
  .keys({
    address1: Joi.string().required(),
    address2: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    zip: Joi.string().required()
  })
  .required();
const customerSchema = Joi.object().keys({
  fName: Joi.string().required(),
  lName: Joi.string().required(),
  phone: Joi.string().required(),
  birthDate: Joi.date().required(),
  imageURL: Joi.string(),
  address: adressSchema,
  cart: Joi.objectId(),
});
// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find({});
    if (_.isEmpty(customers)) return res.send('No Customers yet!');
    res.send(customers);
  } catch (err) {
    throw err;
  }
});

// Pagination
router.get('/paging', async (req, res) => {
  try {
    let { pageNumber, pageSize } = req.query;
    pageNumber = parseInt(pageNumber);
    pageSize = parseInt(pageSize);
    const customer = await Customer.find({}).skip((pageNumber - 1) * pageSize).limit(pageSize);
    if (_.isEmpty(customer)) return res.send('No customers');
    return res.send(customer);
  } catch (err) {
    throw err;
  }
});

// Sorting
router.get('/sort', async (req, res) => {
  try {
    const customer = await Customer.find({}).sort({ fName: 1 });
    if (_.isEmpty(customer)) return res.send('No customers');
    return res.send(customer);
  } catch (err) {
    throw err;
  }
});

// Filtering
router.get('/filter', async (req, res) => {
  try {
    const customer = await Customer.find({})
      .select({ fName: 1 });
    if (_.isEmpty(customer)) return res.send('No customers');
    return res.send(customer);
  } catch (err) {
    throw err;
  }
});
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('Customer ID is not Valid!');
    const customer = await Customer.findById(id);
    if (_.isEmpty(customer)) return res.send('Customer Not Found!');
    return res.send(customer);
  } catch (err) {
    throw err;
  }
});

// POST new customer
router.post('/', async (req, res) => {
  try {
    const {
      email,
      password,
      fName,
      lName,
      phone,
      birthDate,
      imageURL,
      address,
    } = req.body;
    const customer = {
      fName, lName, phone, birthDate, imageURL, address,
    };
    const customerValidationResult = Joi.validate(customer, customerSchema);
    if (customerValidationResult.error) {
      return res
        .status(400)
        .send(customerValidationResult.error.details[0].message);
    }
    const newCustomer = await Customer.create(customer);
    const newUser = await createUser({
      email,
      password,
      permission: { id: newCustomer.id, role: 'customer' },
      isCustomer: true,
      isVendor: false,
    });
    const newCart = {
      customerId: newCustomer.id,
      cartItems: [],
    };
    await Cart.create(newCart);
    return newUser.err
      ? res.status(400).send(newUser.data)
      : res.send(newUser.data);
  } catch (err) {
    throw err;
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) return res.status(400).send('Error');
    return res.send(customer);
  } catch (err) {
    throw err;
  }
});

module.exports = router;
