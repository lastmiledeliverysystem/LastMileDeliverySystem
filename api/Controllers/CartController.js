const express = require('express');
const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Cart = require('../Models/Cart');
const auth = require('../../middleware/auth');

const router = express.Router();

const idValidationSchema = Joi.objectId().required();

router.get('/', auth,async (req, res) => {
  try {
    const carts = await Cart.find({});
    if (_.isEmpty(carts)) return res.send('No Carts found');
    return res.send(carts);
  } catch (err) {
    res.send(err)
  }
});

router.get('/userCart', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId: res.locals.user.id });
    if (_.isEmpty(cart)) return res.send('no cart found for this user');
    return res.send(cart.cartItems);
  } catch (err) {
    res.send(err)
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('ProductList ID is not Valid! ');
    const cart = await Cart.findById(id);
    if (_.isEmpty(cart)) return ('no Cart found');
    return res.send(cart);
  } catch (err) {
    res.send(err)
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { itemId } = req.body;
    
    const customerId = res.locals.user.id;
    console.log(itemId, customerId);
    // const customerId = '5cbb2e3fe00e9f2a31dd2045';
    // const result = Joi.validate(itemId, idValidationSchema);
    // if (result.error) return res.status(400).send(result.error.details[0].message);

    // find user's cart that matches the customerID in session
    const userCart = await Cart.findOne({ customerId });
    if (_.isEmpty(userCart)) return ('no Cart found');
    // append item in items list
    const newCartItems = userCart.cartItems;
    newCartItems.push(itemId);
    console.log("here");
    
    const updatedCart = await Cart.findOneAndUpdate({ customerId }, { cartItems: newCartItems });
    if (_.isEmpty(updatedCart)) return res.status(404).send('User not found');
    return res.send(updatedCart);
  } catch (err) {
    res.status(400).send(err)
  }
});

router.delete('/', async (req, res) => {
  try {
    const { itemId } = req.body;
    const customerId = '5cbb2e3fe00e9f2a31dd2045';
    const result = Joi.validate(itemId, idValidationSchema);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    // find user's cart that matches the customerID in session
    const userCart = await Cart.findOne({ customerId });
    if (_.isEmpty(userCart)) return ('no Cart found');
    const CartItems = userCart.cartItems;
    const newCartItems = CartItems.filter(value => value.itemId != itemId);
    const updatedCart = await Cart.findOneAndUpdate({ customerId }, { cartItems: newCartItems });
    if (_.isEmpty(updatedCart)) return res.status(404).send('User not found');
    return res.send(updatedCart);
  } catch (err) {
    res.send(err)
  }
});
module.exports = router;
