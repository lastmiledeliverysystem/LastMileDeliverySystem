const express = require('express');
const _ = require('lodash');
const Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

const PaymentCards = require('../Models/PaymentCards');

const router = express.Router();
const schema = Joi.object().keys({
  salesOrderNumber: Joi.objectId(),
  cards: Joi.array(),
});
const createPaymentCard = async (paymentCard) => {
  try {
    const { salesOrderNumber, cards } = paymentCard;
    const result = Joi.validate(paymentCard, schema);
    if (result.error) {
      return ({
        err: true,
        data: result.error.details[0].message,
      });
    }
    const newPaymentCard = await PaymentCards.create({
      salesOrderNumber, cards,
    });
    JSON.stringify(newPaymentCard);

    return ({
      err: false,
      data: newPaymentCard,
    });
  } catch (err) {
    throw err;
  }
};


router.get('/', async (req, res) => {
  try {
    const paymentCard = await PaymentCards.find({});
    if (_.isEmpty(paymentCard)) return res.status(400).send('No payment cards');
    return res.send(paymentCard);
  } catch (err) {
    throw err;
  }
});
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationSchema = Joi.objectId().required();
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('Payment Card ID is not Valid! ');
    const paymentCard = await PaymentCards.findById(id);
    if (_.isEmpty(paymentCard)) return res.status(400).send('No payment cards');
    return res.send(paymentCard);
  } catch (err) {
    throw err;
  }
});

router.post('/', async (req, res) => {
  try {
    const result = await createPaymentCard(req.body);
    return (result.err) ? res.status(400).send(result.data) : res.send(result.data);
  } catch (err) {
    throw err;
  }
});
router.put('/:id', async (req, res) => {
  try {
    const { cards } = req.body;
    const { id } = req.params;
    const order = { cards };
    // Validate ID
    const idValidationSchema = Joi.objectId().required();
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('Order ID is not Valid! ');
    // Search and update
    const updatedPaymentCard = await PaymentCards.findByIdAndUpdate(id, order);
    if (_.isEmpty(updatedPaymentCard)) return res.status(404).send('Order is not found');
    const result = Joi.validate(req.body, schema);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    return res.send(order);
  } catch (err) {
    throw err;
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idValidationSchema = Joi.objectId().required();
    const idValidationResult = Joi.validate(id, idValidationSchema);
    if (idValidationResult.error) return res.status(400).send('Payment Card ID is not Valid! ');
    const paymentCard = await PaymentCards.findByIdAndDelete(id);
    if (_.isEmpty(paymentCard)) return res.status(400).send('No payment cards');
    return res.send(paymentCard);
  } catch (err) {
    throw err;
  }
});

module.exports = router;
