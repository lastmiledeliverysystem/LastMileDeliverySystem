const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function auth(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) return res.status(401).send('Access denied. No token provided!');
  try {
    const decoded = jwt.decode(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next();
  } catch (ex) {
    res.send(400).send('invalid token');
  }
};
