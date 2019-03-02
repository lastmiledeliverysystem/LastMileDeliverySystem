
module.exports = function admin(req, res, next) {
    if (!req.user.isVendor) return res.status(401).send('Access denied. No token provided!');
    next();
  };
  