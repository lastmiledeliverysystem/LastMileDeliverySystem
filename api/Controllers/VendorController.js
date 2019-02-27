const express = require('express');
const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Vendor = require('../Models/Vendor');
const { creatUser } = require('../Controllers/UsersController');

const router = express.Router();

const idValidationSchema = Joi.objectId().required();

const adressSchema = Joi.object()
  .keys({
    address1: Joi.string().required(),
    address2: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    zip: Joi.string().required(),
  })
  .required();

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
  vendorType: Joi.strip().required(),
  imageURL: Joi.string().required(),
  address: adressSchema,
  vendorProduct: Joi.string().required(),
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
// Pagination
router.get('/paging', async (req, res) => {
  try {
    let { pageNumber, pageSize } = req.query;
    pageNumber = parseInt(pageNumber);
    pageSize = parseInt(pageSize);
    const vendors = await Vendor.find({}).skip((pageNumber - 1) * pageSize).limit(pageSize);
    if (_.isEmpty(vendors)) return res.send('No vendors');
    return res.send(vendors);
  } catch (err) {
    throw err;
  }
});

// Sorting
router.get('/sort', async (req, res) => {
  try {
    const vendors = await Vendor.find({}).sort({ name: 1 });
    if (_.isEmpty(vendors)) return res.send('No vendors');
    return res.send(vendors);
  } catch (err) {
    throw err;
  }
});

// Filtering
router.get('/filter', async (req, res) => {
  try {
    const vendors = await Vendor.find({})
      .select({ name: 1 });
    if (_.isEmpty(vendors)) return res.send('No vendors');
    return res.send(vendors);
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
      vendorProduct,
    } = req.body;
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
      vendorProduct,
    });
    const user = {
      email,
      password,
      permission: {
        id: vendor.id,
        role: 'Vendor',
      },
    };
    const newUser = await creatUser(user);
    return newUser.err ? res.status(400).send(newUser.data) : res.send(vendor);
  } catch (err) {
    //throw err;
    return res.send('Duplicated vendor name');
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
      vendorProduct,
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
      vendorProduct,
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
