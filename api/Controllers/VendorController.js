const express = require('express');
const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Vendor = require('../Models/Vendor');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find({});
    if (_.isEmpty(vendors)) return res.send('No Vendors');
    return res.send(vendors);
  } catch (err) {
    throw err;
  }
});
module.exports = router;
