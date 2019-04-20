const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const userController = require('./api/Controllers/UsersController');
const vendorController = require('./api/Controllers/VendorController');
const customerController = require('./api/Controllers/CustomerController');
const orderController = require('./api/Controllers/OrderController');
const paymentCardsController = require('./api/Controllers/PaymentCardsController');
const productController = require('./api/Controllers/productController');
const cartController = require('./api/Controllers/CartController');
const auth = require('./api/Controllers/auth');

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use('/api/users', userController.router);
app.use('/api/vendors', vendorController);
app.use('/api/customers', customerController);
app.use('/api/orders', orderController);
app.use('/api/paymentCards', paymentCardsController);
app.use('/api/products', productController);
app.use('/api/cart', cartController);
app.use('/api/auth', auth);

// const uri = 'mongodb+srv://kay:project#1@cluster0.mongodb.net/admin';
// const con3 = 'mongodb://Rawan:project#1@host1:port1,/LastMileDelivery?authSource=admin&...';
// const con = 'mongodb+srv://Rawan:project#1@cluster0-yszas.mongodb.net/LastMileDelivery?retryWrites=true';
const con2 = 'mongodb://Kassim:project@cluster0-shard-00-00-yszas.mongodb.net:27017,cluster0-shard-00-01-yszas.mongodb.net:27017,cluster0-shard-00-02-yszas.mongodb.net:27017/LastMileDelivery?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';

mongoose.connect(con2, (err) => {
  (err) ? console.log(err) : console.log('Success')
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
