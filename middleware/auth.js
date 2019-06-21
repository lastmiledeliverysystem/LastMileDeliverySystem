const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function auth(req, res, next) {
  const token = req.header('x-auth-token') 
  // || req.body.token;
  console.log(token);

  // const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied. No token provided!');
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    console.log(decoded)
    res.locals.user = decoded;
    console.log(decoded)
    // console.log('user intered')
    next();
  } catch (ex) {
    // console.log(ex);
    res.status(400).send(ex);
  }
};
