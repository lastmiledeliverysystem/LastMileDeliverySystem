const express = require('express');
const url = require('url');
const _ = require('lodash');
const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

const Users = require('../Models/Users');

const router = express.Router();
const schema = Joi.object().keys({

  email: Joi.string().email().required(),
  password: Joi.string().regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/).required(),
  permission: Joi.object().keys({
    id: Joi.objectId().required(),
    role: Joi.string().required(),
  }),

});

const createUser = async (user) => {
  try {
    const { email, password, permission } = user;
    const result = Joi.validate(user, schema);
    if (result.error) {
      return ({
        err: true,
        data: result.error.details[0].message,
      });
    }
    const newUser = await Users.create({
      email,
      password,
      permission,
    });
    return ({
      err: false,
      data: newUser,
    });
  } catch (err) {
    throw err;
  }
};


// get all users from DB
router.get('/', async (req, res) => {
  try {
    const users = await Users.find({});
    if (_.isEmpty(users)) return res.send('No users');
    return res.send(users);
  } catch (err) {
    throw err;
  }
});
// Pagination
router.get('/paging?pageNumber=1&pageSize=1/', async (req, res) => {
//   try {
//     const user = await Users.find().skip(1).limit(1);
//     if (_.isEmpty(user)) return res.send('No users');
//     return res.send(user);
//   } catch (err) {
//     throw err;
//   }
// });
  try {
    const q = url.parse('/paging/?pageNumber=1&pageSize=1', true);
    const queryData = q.query; // returns an object: { year: 2017, month: 'february' }
    const { pageNumber, pageSize } = queryData;
    const user = await Users.paginate({}, { page: pageNumber, limit: pageSize }, (err, result) => {
      if (_.isEmpty(user)) return res.send('No users');
      return result.pages;
    });
  } catch (err) {
    throw err;
  }
});
// Sorting
router.get('/sort/', async (req, res) => {
  try {
    const user = await Users.find({}).sort({ email: 1 });
    if (_.isEmpty(user)) return res.send('No users');
    return res.send(user);
  } catch (err) {
    throw err;
  }
});


// Filtering
router.get('/filter/', async (req, res) => {
  try {
    const user = await Users.find({})
      .select({ email: 1 });
    if (_.isEmpty(user)) return res.send('No users');
    return res.send(user);
  } catch (err) {
    throw err;
  }
});
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationSchema = Joi.objectId().required();
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('Customer ID is not Valid! ');
    const user = await Users.findById(id);
    if (_.isEmpty(user)) return res.send('User not found');
    return res.send(user);
  } catch (err) {
    throw err;
  }
});


router.post('/', async (req, res) => {
  try {
    const result = await createUser(req.body);
    if (!result.err) {
      return res.send(result.data);
    }
  } catch (err) {
    return res.send('Duplicated email');
    // throw err;
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { email, password, permission } = req.body;
    const { id } = req.params;
    const user = { email, password, permission };
    // Validate ID
    const idValidationSchema = Joi.objectId().required();
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('Customer ID is not Valid! ');
    // Search and update
    const updatedUser = await Users.findByIdAndUpdate(id, user);
    if (_.isEmpty(updatedUser)) return res.status(404).send('User not found');
    const result = Joi.validate(req.body, schema);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    return res.send(user);
  } catch (err) {
    throw err;
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationSchema = Joi.objectId().required();
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('Customer ID is not Valid! ');
    const user = await Users.findByIdAndDelete(id);
    if (!user) return res.status(400).send('Error');
    return res.send(user);
  } catch (err) {
    throw err;
  }
});


module.exports = { router, createUser };
