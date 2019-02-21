const express = require('express');
const _ = require('lodash');
const url = require('url');

const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');

const Joi = BaseJoi.extend(Extension);
Joi.objectId = require('joi-objectid')(Joi);

const Orders = require('../Models/Orders');

const router = express.Router();


const schema = Joi.object().keys({
  // paymentId: Joi.objectId(),
  vendorId: Joi.objectId(),
  salesOrderNumber: Joi.objectId(),
  robotId: Joi.objectId(),
  customerId: Joi.objectId(),
  date: Joi.date().format('DD-MM-YYYY'),
  status: Joi.string().required(),
  items: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    quantity: Joi.string().required(),
    unit: Joi.string().required(),
    imageName: Joi.string().required(),
  }),
  discountAmount: Joi.number(),
  discount: Joi.number(),
  shippingCharge: Joi.number(),
  total: Joi.number().required(),
  notes: Joi.string(),
  address: Joi.object().keys({
    address1: Joi.string().required(),
    address2: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    zip: Joi.string().required(),
  }),
  shippmentDate: Joi.date().format('DD-MM-YYYY'),
  trackingPassword: Joi.string().regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/).required(),
  deliveryDate: Joi.date().format('DD-MM-YYYY'),
  paymentMethod: Joi.string().required(),

});

const createOrder = async (order) => {
  try {
    const { date, status, items, discountAmount, discount, shippingCharge, total, notes, address,
      shippmentDate, deliveryDate, trackingPassword, paymentMethod } = order;
    const result = Joi.validate(order, schema);
    if (result.error) {
      return ({
        err: true,
        data: result.error.details[0].message,
      });
    }
    const newOrder = await Orders.create({
      date,
      status,
      items,
      discountAmount,
      discount,
      shippingCharge,
      total,
      notes,
      address,
      shippmentDate,
      deliveryDate,
      trackingPassword,
      paymentMethod,
    });
    return ({
      err: false,
      data: newOrder,
    });
  } catch (err) {
    throw err;
  }
};


// get all orders from DB
router.get('/', async (req, res) => {
  try {
    const orders = await Orders.find({});
    if (_.isEmpty(orders)) return res.send('No orders');
    return res.send(orders);
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
    const order = await Orders.find({}).skip((pageNumber - 1) * pageSize).limit(pageSize);
    if (_.isEmpty(order)) return res.send('No orders');
    return res.send(order);
  } catch (err) {
    throw err;
  }
});

// Sorting
router.get('/sort', async (req, res) => {
  try {
    const orders = await Orders.find().sort({ date: 1 });
    if (_.isEmpty(orders)) return res.send('No orders');
    return res.send(orders);
  } catch (err) {
    throw err;
  }
});

// Filtering
router.get('/filter', async (req, res) => {
  try {
    const order = await Orders.find({})
      .select({ date: 1, status: 1 });
    if (_.isEmpty(order)) return res.send('No orders');
    return res.send(order);
  } catch (err) {
    throw err;
  }
});
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationSchema = Joi.objectId().required();
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('Order ID is not Valid! ');
    const order = await Orders.findById(id);
    if (_.isEmpty(order)) return res.send('Order is not found');
    return res.send(order);
  } catch (err) {
    throw err;
  }
});

router.post('/', async (req, res) => {
  try {
    const result = await createOrder(req.body);
    return (result.err) ? res.status(400).send(result.data) : res.send(result.data);
  } catch (err) {
    throw err;
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status, items, address, deliveryDate } = req.body;
    const { id } = req.params;
    const order = { status, items, address, deliveryDate };
    // Validate ID
    const idValidationSchema = Joi.objectId().required();
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('Order ID is not Valid! ');
    // Search and update
    const updatedOrder = await Orders.findByIdAndUpdate(id, order);
    if (_.isEmpty(updatedOrder)) return res.status(404).send('Order is not found');
    const result = Joi.validate(req.body, schema);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    return res.send(order);
  } catch (err) {
    throw err;
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationSchema = Joi.objectId().required();
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('Order ID is not Valid! ');
    const order = await Orders.findByIdAndDelete(id);
    if (!order) return res.status(400).send('Order is not found');
    return res.send(order);
  } catch (err) {
    throw err;
  }
});


module.exports = router;
