const jwt = require('jsonwebtoken')
exports.auth = async (req, res, next) => {
  try {
    const token = req.headers["auth_token"]
    if (!token) {
      return res.status(401).send('No Token');
    }
    const decoded = jwt.verify(token, 'jwtsecret')
    req.user = decoded.user
    console.log('token:', 'decoded:', token, decoded)
    next();
  } catch (error) {
    console.log(error)
    res.send('Token invalid').status(500)
  }
}