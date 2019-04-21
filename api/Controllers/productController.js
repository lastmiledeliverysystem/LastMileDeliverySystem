const express = require('express');
const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Products = require('../Models/Products');

const router = express.Router();
const auth = require('../../middleware/auth');
const isVendor = require('../../middleware/isVendor');

const productSchema = Joi.object().keys({
  vendorProducts: Joi.array().items(Joi.object().keys({
    name: Joi.string().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    rate: Joi.number().required(),
    price: Joi.number().required(),
    specs: Joi.string().required(),
    quantity: Joi.number().required(),
    unit: Joi.string().required(),
    sku: Joi.string().required(),
    barCode: Joi.string().required(),
    productId: Joi.number().required(),
    options: Joi.object().keys({
      image: Joi.string().required(),
      color: Joi.string().required(),
      size: Joi.string().required(),
    }),
  })),
});


router.get('/', async (req, res) => {
  try {
    const product = await Products.find({});
    if (_.isEmpty(product)) return ('no product found');
    return res.send(product);
  } catch (err) {
    throw err;
  }
});
// all options
router.get('/:id/test', async (req, res) => {
  try {
    const str = req.query;
    const queryStr = Object.keys(str);
    // console.log(queryStr);
    const sortObj = {};
    const filterObj = {};
    let skipObj = {};
    let limitObj = {};
    let product = NaN;

    if (queryStr.includes('sortBy')) {
      const { sortBy } = req.query;
      sortObj[sortBy] = 1;
    }
    if (queryStr.includes('pageNumber')) {
      // const pageSize = 2;
      let { pageNumber, pageSize } = req.query;
      pageNumber = parseInt(pageNumber);
      pageSize = parseInt(pageSize);
      skipObj = (pageNumber - 1) * pageSize;
      limitObj = pageSize;
    }
    if (queryStr.includes('filterBy')) {
      const { filterBy } = req.query;
      filterObj[filterBy] = 1;
    }

    product = await Products.findById(req.params.id);
    console.log(product.vendorProducts.skip(skipObj).limit(limitObj));
    if (_.isEmpty(product)) return res.send('No products');
    return res.send(product);
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
    const product = await Products.find({}).skip((pageNumber - 1) * pageSize).limit(pageSize);
    if (_.isEmpty(product)) return res.send('No products');
    return res.send(product);
  } catch (err) {
    throw err;
  }
});



// Sorting
router.get('/sort', async (req, res) => {
  try {
    const sortObj = {};
    const { sortBy } = req.query;
    sortObj[sortBy] = 1;

    const product = await Products.find({}).sort({ sortObj });
    if (_.isEmpty(product)) return res.send('No products');
    return res.send(product);
  } catch (err) {
    throw err;
  }
});

// Filtering
router.get('/filter', async (req, res) => {
  try {
    const product = await Products.find({})
      .select({ name: 1 });
    if (_.isEmpty(product)) return res.send('No products');
    return res.send(product);
  } catch (err) {
    throw err;
  }
});

router.get('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationSchema = Joi.objectId().required();
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('Product ID is not Valid! ');
    const product = await Products.find({'vendorProducts._id':id},{'vendorProducts.$': 1});
    if (_.isEmpty(product)) return res.send('no product found');
    return res.send(product[0].vendorProducts[0]);
  } catch (err) {
    throw err;
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationSchema = Joi.objectId().required();
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('ProductList ID is not Valid! ');
    const product = await Products.findById(id);
    if (_.isEmpty(product)) return ('no product found');
    return res.send(product);
  } catch (err) {
    throw err;
  }
});

router.post('/', [auth, isVendor], async (req, res) => {
  try {
    const { vendorProducts } = req.body;
    const productValidationResult = Joi.validate({ vendorProducts }, productSchema);
    if (productValidationResult.error) {return res.status(400).send(productValidationResult.error.details[0].message);}
    const product = await Products.create({
      vendorProducts,
    });
    return res.send(product);
  } catch (err) {
    throw err;
  }
});

router.delete('/:id', [auth, isVendor], async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationSchema = Joi.objectId().required();
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('Product ID is not Valid! ');
    const product = await Products.findByIdAndDelete(id);
    return res.send(product);
  } catch (err) {
    throw err;
  }
});
module.exports = router;
