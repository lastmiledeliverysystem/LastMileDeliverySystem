
module.exports = function isVendor(req, res, next) {
  console.log(req.user)
  console.log(req.user.isVendor);
  if (!req.user.isVendor) return res.status(401).send('Access denied. you must be a vendor!');
  next();
};
