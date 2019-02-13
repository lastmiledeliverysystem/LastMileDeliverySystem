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
    const { email, password, permission } = req.body;
    const result = Joi.validate(req.body, schema);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    const user = await Users.create({
      email,
      password,
      permission,
    });
    return res.send(user);
  } catch (err) {
    throw err;
  }
});


module.exports = router;
