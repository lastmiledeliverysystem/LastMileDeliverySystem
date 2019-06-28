const express = require('express');
const _ = require('lodash');
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');

const Joi = BaseJoi.extend(Extension);
Joi.objectId = require('joi-objectid')(Joi);

const Orders = require('../Models/Orders');
const auth = require('../../middleware/auth');

const router = express.Router();


const schema = Joi.object().keys({
  // paymentId: Joi.objectId(),
  vendorId: Joi.objectId(),
  salesOrderNumber: Joi.objectId(),
  robotId: Joi.objectId(),
  customerId: Joi.objectId(),
  items: Joi.array().items(Joi.object({
    name:Joi.string(),
    price:Joi.number(),
    unit:Joi.string(),
    vendorId:Joi.objectId(),
    category:Joi.string(),
    description:Joi.string()
  })),
// items: Joi.,
  date: Joi.date().format('DD-MM-YYYY'),
  status: Joi.string(),
  discountAmount: Joi.number(),
  discount: Joi.number(),
  shippingCharge: Joi.number(),
  total: Joi.number(),
  notes: Joi.string(),
  address: Joi.object().keys({
    lat: Joi.number().required(),
    long: Joi.number().required(),
  }),
  quantity: Joi.number(),
  shippmentDate: Joi.date().format('DD-MM-YYYY'),
  trackingPassword: Joi.string(),
  deliveryDate: Joi.date().format('DD-MM-YYYY'),
  paymentMethod: Joi.string(),

});

const createOrder = async (order, TokencustomerId) => {
  try {
    const customerId = TokencustomerId;
    const oldItems = order.items;
    const items = oldItems.map(p => ({ name:p.name, category:p.category,price:p.price,unit:p.unit,description:p.description,vendorId:p.vendorId}));
    
    const {
      date, status, discountAmount, discount, shippingCharge, total, notes, address,
      shippmentDate, deliveryDate, trackingPassword, paymentMethod, quantity,
    } = order;
    // console.log("order", order);
    const filteredOrder = {
      date,
      status,
      items,
      quantity,
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
      customerId,
    };
    const result = Joi.validate(filteredOrder, schema);
    if (result.error) {
      return ({
        err: true,
        data: result.error.details[0].message,
      });
    }
    const newOrder = await Orders.create(filteredOrder);
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
// router.get('/search', async (req, res) => {
//   try {
//     const str = req.query;
//     const queryStr = Object.keys(str);
//     // console.log(queryStr);
//     const sortObj = {};
//     const filterObj = {};
//     const selectObj = {};
//     //const pageSize = 1;
//     let skipObj = 1;
//     let limitObj = 1;
//     let product = NaN;

//     if (queryStr.includes('sortBy')) {
//       const { sortBy } = req.query;
//       sortObj[sortBy] = 1;
//     }
//     if (queryStr.includes('pageNumber')) {
//       let { pageNumber, pageSize } = req.query;
//       pageNumber = parseInt(pageNumber);
//       pageSize = parseInt(pageSize);
//       skipObj = (pageNumber - 1) * pageSize;
//       limitObj = pageSize;
//     }
//     if (queryStr.includes('selectBy')) {
//       const { selectBy } = req.query;
//       selectObj[selectBy] = 1;
//     }
//     if (queryStr.includes('filterBy')) {
//       const { filterBy, value } = req.query;
//       if (_.isArray(filterBy)) {
//         for (let index = 0; index < filterBy.length; index++) {
//           filterObj[filterBy[index]] = value[index];
//         }
//       } else {
//         filterObj[filterBy] = value;
//       }
//       console.log(filterObj);
//     }
//     const pageCount = await Products.count(filterObj) / parseInt(req.query.pageSize);
//     product = await Products.find(filterObj).sort(sortObj).select(selectObj).skip(skipObj).limit(limitObj);    
//     if (_.isEmpty(product)) return res.send('No products');
//     return res.send({ product, pageCount });
    
//   } catch (err) {
//     res.send(err)
//   }
// });

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

router.post('/', auth, async (req, res) => {
  try {
    const result = await createOrder(req.body, req.user);
    // console.log("request body", req.body);
    return (result.err) ? res.status(400).send(result.data) : res.send(result.data);
  } catch (err) {
    throw err;
  }
});

router.put('/:id', async (req, res) => {
  try {
    const {
      status, items, address, deliveryDate,
    } = req.body;
    const { id } = req.params;
    const order = {
      status, items, address, deliveryDate,
    };
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

// delet item
router.delete('/item/:id', async (req, res) => {
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
