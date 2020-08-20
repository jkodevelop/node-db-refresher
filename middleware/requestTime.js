var requestTime = function (req, res, next) {
  // adding a new attribute
  req.requestTime = Date.now();
  next()
}

module.exports = requestTime;