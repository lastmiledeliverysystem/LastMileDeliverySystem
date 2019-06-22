const express = require('express');
const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Products = require('../Models/Products');

const router = express.Router();
const auth = require('../../middleware/auth');
const isVendor = require('../../middleware/isVendor');

const productSchema = Joi.object().keys({
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
  vendorId: Joi.objectId(),
  options: Joi.object().keys({
    image: Joi.string().required(),
    color: Joi.string().required(),
    size: Joi.string().required(),
  }),
});


router.get('/', async (req, res) => {
  try {
    const product = await Products.find({});
    if (_.isEmpty(product)) return ('no product found');
    return res.send(product);
  } catch (err) {
    res.send(err)
  }
});
// all options
router.get('/search', async (req, res) => {
  try {
    const str = req.query;
    const queryStr = Object.keys(str);
    // console.log(queryStr);
    const sortObj = {};
    const filterObj = {};
    const selectObj = {};
    //const pageSize = 1;
    let skipObj = 1;
    let limitObj = 1;
    let product = NaN;

    if (queryStr.includes('sortBy')) {
      const { sortBy } = req.query;
      sortObj[sortBy] = 1;
    }
    if (queryStr.includes('pageNumber')) {
      let { pageNumber, pageSize } = req.query;
      pageNumber = parseInt(pageNumber);
      pageSize = parseInt(pageSize);
      skipObj = (pageNumber - 1) * pageSize;
      limitObj = pageSize;
    }
    if (queryStr.includes('selectBy')) {
      const { selectBy } = req.query;
      selectObj[selectBy] = 1;
    }
    if (queryStr.includes('filterBy')) {
      const { filterBy, value } = req.query;
      if (_.isArray(filterBy)) {
        for (let index = 0; index < filterBy.length; index++) {
          filterObj[filterBy[index]] = value[index];
        }
      } else {
        filterObj[filterBy] = value;
      }
      console.log(filterObj);
    }
    const pageCount = await Products.count(filterObj) / parseInt(req.query.pageSize);
    product = await Products.find(filterObj).sort(sortObj).select(selectObj).skip(skipObj).limit(limitObj);    
    if (_.isEmpty(product)) return res.send('No products');
    return res.send({ product, pageCount });
    
  } catch (err) {
    res.send(err)
  }
});

router.post('/list', async (req, res) => {
  try {
    const { ids } = req.body;
    console.log(ids);
    // const idValidationSchema = Joi.objectId().required();
    // const idValidationResult = Joi.validate(id, idValidationSchema);
    // if (idValidationResult.error) return res.status(400).send('ProductList ID is not Valid! ');
    // const productsList = [];
    
    let product = await Products.find({'_id': { $in: ids}}).select('-options');
    if (_.isEmpty(product)) return ('no product found');
    return res.send(product);
  } catch (err) {
    res.send(err)
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationSchema = Joi.objectId().required();
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('ProductList ID is not Valid! ');
    const product = await Products.find({ vendorId: id });
    if (_.isEmpty(product)) return ('no product found');
    return res.send(product);
  } catch (err) {
    res.send(err)
  }
});

router.get('/product/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationSchema = Joi.objectId().required();
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('ProductList ID is not Valid! ');
    const product = await Products.find({ _id: id });
    if (_.isEmpty(product)) return ('no product found');
    return res.send(product);
  } catch (err) {
    res.send(err)
  }
});




// router.post('/', [auth, isVendor], async (req, res) => {
router.post('/', async (req, res) => {
try {
    const product = req.body;
    console.log(product);
    const productValidationResult = Joi.validate(product, productSchema);
    if (productValidationResult.error) { return res.status(400).send(productValidationResult.error.details[0].message);}
    const newProduct = await Products.create(product);
    return res.send(newProduct);
  } catch (err) {
    res.send(err)
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
    res.send(err)
  }
});
module.exports = router;
