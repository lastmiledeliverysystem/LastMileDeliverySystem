const express = require('express');
const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const UserInterest = require('../Models/UserInterest');

const router = express.Router();

const idValidationSchema = Joi.objectId().required();

const userInterestSchema = Joi.object()
  .keys({
    customerId: Joi.string()
      .objectId()
      .required(),
    favorite: Joi.object(),
    wishlist: Joi.array().items(Joi.object()),
  })
  .required();

router.get('/', async (req, res) => {
  try {
    const userInterest = await UserInterest.find({});
    if (_.isEmpty(userInterest)) return res.send('No User Interests!');
    return res.send(userInterest);
  } catch (err) {
    throw err;
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('Vendor ID is not Valid!');
    const userInterest = await UserInterest.findById(id);
    if (_.isEmpty(vendor)) return res.send('Vendor not found!');
    return res.send(vendor);
  } catch (err) {
    throw err;
  }
});
