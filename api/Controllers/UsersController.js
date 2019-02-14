const express = require('express');
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

const creatUser = async (user) => {
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

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (_.isEmpty(user)) return res.send('User not found');
    return res.send(user);
  } catch (err) {
    throw err;
  }
});

router.post('/', async (req, res) => {
  try {
    const result = creatUser(req.body);
    return (result.err) ? res.status(400).send(result.data): res.send(result.data);
  } catch (err) {
    throw err;
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { email, password, permission } = req.body;
    const { id } = req.params;
    const user = await Users.findById(id);
    if (_.isEmpty(user)) return res.status(404).send('User not found');
    const result = Joi.validate(req.body, schema);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    user.email = email;
    user.password = password;
    user.permission = permission;
    user.save();
    return res.send(user);
  } catch (err) {
    throw err;
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByIdAndDelete(id);
    if (!user) return res.status(400).send('error');
    return res.send(user);
  } catch (err) {
    throw err;
  }
});


module.exports = { router, creatUser };
