const express = require('express');
const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Vendor = require('../Models/Vendor');
const { createUser } = require('../Controllers/UsersController');

const router = express.Router();

const idValidationSchema = Joi.objectId().required();

const adressSchema = Joi.object()
  .keys({
    address1: Joi.string(),
    address2: Joi.string(),
    state: Joi.string(),
    city: Joi.string(),
    zip: Joi.string(),
  })

const vendorSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
    .required(),
  name: Joi.string().required(),
  category: Joi.string().required(),
  phone: Joi.number().required(),
  vendorType: Joi.string().required(),
  imageURL: Joi.string().required(),
  address: adressSchema,
});

router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find({});
    if (_.isEmpty(vendors)) return res.send('No vendors!');
    return res.send(vendors);
  } catch (err) {
    throw err;
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
    // const pageSize = 1;
    let skipObj = 1;
    let limitObj = 1;
    const product = NaN;

    if (queryStr.includes('sortBy')) {
      const { sortBy } = req.query;
      sortObj[sortBy] = 1;
    }
    if (queryStr.includes('pageNumber')) {
      let { pageNumber, pageSize } = req.query;
      pageNumber = parseInt(pageNumber);
      // pageSize = parseInt(pageSize);
      skipObj = (pageNumber - 1) * pageSize;
      limitObj = parseInt(pageSize);
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
    const pageCount = await Vendor.count(filterObj) / parseInt(req.query.pageSize);
    vendor = await Vendor.find(filterObj).sort(sortObj).select(selectObj).skip(skipObj)
.limit(limitObj);
    // const pageCount = vendor.length/pageSize;
    if (_.isEmpty(vendor)) return res.send('No Vendors');
    return res.send({ vendor, pageCount });
  } catch (err) {
    throw err;
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('Vendor ID is not Valid!');
    const vendor = await Vendor.findById(id);
    if (_.isEmpty(vendor)) return res.send('Vendor not found!');
    return res.send(vendor);
  } catch (err) {
    throw err;
  }
});
router.post('/', async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      category,
      phone,
      vendorType,
      imageURL,
      address,
    } = req.body; 
    // const vendorProducts = await Products.create({vendorProducts:[]})
    const result = Joi.validate(req.body, vendorSchema);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    let vendor = await Vendor.findOne({ name: req.body.name });
    if (vendor) return res.status(400).send('Duplicated name!');
    vendor = await Vendor.create({
      name,
      category,
      phone,
      vendorType,
      imageURL,
      address,
    });
    const user = {
      email,
      password,
      permission: {
        id: vendor.id,
        role: 'Vendor',
      },
      isVendor: true,
      isCustomer: false,
    };
    const newUser = await createUser(user);
    return newUser.err ? res.status(400).send(newUser.data) : res.send(vendor);
  } catch (err) {
    throw err;

  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email,
      password,
      name,
      category,
      phone,
      vendorType,
      imageURL,
      address,
    } = req.body;
    // validating ID
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('Vendor ID is not Valid!');
    // Validating Vendor data
    const result = Joi.validate(req.body, vendorSchema);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    const vendor = {
      name,
      category,
      phone,
      vendorType,
      imageURL,
      address,
    };
    const user = {
      email,
      password,
      permission: {
        id: vendor.id,
        role: 'Vendor',
      },
    };
    const updatedVendor = await Vendor.findByIdAndUpdate(id, vendor);
    if (_.isEmpty(updatedVendor)) return res.status(400).send('Vendor not found!');
    // TODO: Update User info
    return res.send(vendor);
  } catch (err) {
    throw err;
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('Vendor ID is not Valid!');
    const vendor = await Vendor.findByIdAndDelete(id);
    if (_.isEmpty(vendor)) return res.status(400).send('Vendor not found!');
    return res.send(vendor);
  } catch (err) {
    throw err;
  }
});
module.exports = router;
