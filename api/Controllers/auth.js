const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');
const Users = require('../Models/Users');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await Users.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password');
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = jwt.sign({ _id: user.id }, config.get('jwtPrivateKey'));
    res.send(token);
    return res.status(200).send('logged in');
  } catch (err) {
    throw err;
  }
});

function validate(req) {
  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/).required(),
  };
  return Joi.validate(req, schema);
}
module.exports = router;
