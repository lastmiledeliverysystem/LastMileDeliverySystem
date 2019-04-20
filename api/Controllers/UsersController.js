// const config = require('config');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('lodash');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Users = require('../Models/Users');
const auth = require('../../middleware/auth');

const router = express.Router();
const schema = Joi.object().keys({

  email: Joi.string().email().required(),
  password: Joi.string().regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/).required(),
  permission: Joi.object().keys({
    id: Joi.objectId().required(),
    role: Joi.string().required(),
  }),
  logoutToken: Joi.string(),
  isCustomer: Joi.boolean(),
  isVendor: Joi.boolean(),

});

const createUser = async (user) => {
  try {
    const { email, password, permission, isVendor, isCustomer } = user;
    const result = Joi.validate(user, schema);
    if (result.error) {
      return ({
        err: true,
        data: result.error.details[0].message,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const encrypted = await bcrypt.hash(password, salt);
    const newUser = await Users.create({
      email,
      password: encrypted,
      permission,
      isVendor,
      isCustomer,
    });

    return ({
      err: false,
      data: newUser,
      id: newUser.id,
    });
  } catch (err) {
    throw err;
  }
};

router.get('/me', auth, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select('-password');
    return res.send(user);
  } catch (err) {
    throw err;
  }
});

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
router.get('/paging', async (req, res) => {
  try {
    let { pageNumber, pageSize } = req.query;
    pageNumber = parseInt(pageNumber);
    pageSize = parseInt(pageSize);
    const user = await Users.find({}).skip((pageNumber - 1) * pageSize).limit(pageSize);
    if (_.isEmpty(user)) return res.send('No users');
    return res.send(user);
  } catch (err) {
    throw err;
  }
});

// Sorting
router.get('/sort', async (req, res) => {
  try {
    const user = await Users.find({}).sort({ email: 1 });
    if (_.isEmpty(user)) return res.send('No users');
    return res.send(user);
  } catch (err) {
    throw err;
  }
});

// Filtering
router.get('/filter', async (req, res) => {
  try {
    const user = await Users.find({})
      .select({ email: 1 });
    if (_.isEmpty(user)) return res.send('No users');
    return res.send(user);
  } catch (err) {
    throw err;
  }
});
router.get('/logout/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationSchema = Joi.objectId().required();
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('Customer ID is not Valid! ');
    const user = await Users.findByIdAndUpdate({ _id: id }, { $unset: { logoutToken: '' } });
    if (_.isEmpty(user)) return res.send('User not found');
    return res.send('Logged out!!');
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
<<<<<<< HEAD
    let user = await Users.findOne({ email: req.body.email });
    user = await Users.findOne({ id: req.body.id });
    if (user) return res.status(400).send('User already registered');

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const {
      email,
      password,
      permission,
    } = req.body;

    user = { email, password, permission };
    const result = Joi.validate(user, schema);
    if (result.error) {
      return (res
        .status(400)
        .send(result.error.details[0].message));
    }
    let newUser = await Users.create({
      email,
      password,
      permission,
    });

    // const result = await createUser(req.body);
    let token = newUser.generateAuthToken();
    token = await bcrypt.hash(token, salt);
    newUser = await Users.findByIdAndUpdate(newUser.id, {
      logoutToken: token,
    });
    return (newUser.err) ? res.status(400).send(newUser.data)
      : res.header('x-auth-token', token).send(newUser);
=======
    const user = await Users.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    const result = await createUser(req.body);
    const newUser = result.data;
    // let token = newUser.generateAuthToken();
    // token = await bcrypt.hash(token, salt);
    // newUser = await Users.findByIdAndUpdate(newUser.id, {
    //   logoutToken: token,
    // });

    return (newUser.err)
      ? res.status(400).send(newUser.data)
      : res.send(newUser);
>>>>>>> bf5f00cb9d0aa185037a307d062fc3d338f220ea
  } catch (err) {
    throw err;
  }
});
<<<<<<< HEAD

=======
>>>>>>> bf5f00cb9d0aa185037a307d062fc3d338f220ea
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

<<<<<<< HEAD
module.exports = { router };
=======

module.exports = { router, createUser };
>>>>>>> bf5f00cb9d0aa185037a307d062fc3d338f220ea
