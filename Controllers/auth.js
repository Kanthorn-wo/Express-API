const User = require('../Models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


exports.register = async (req, res) => {
  try {

    const { name, password } = req.body
    //Check User
    let user = await User.findOne({ name })

    if (user) {
      return res.send('User Already Exists').status(400)
    }
    //Encrypt
    const salt = await bcrypt.genSalt(10)
    user = new User({
      name,
      password
    })

    user.password = await bcrypt.hash(password, salt)

    //Save
    user.save()
    res.send('Register Successfully')

  } catch (err) {
    console.log()
    res.status(500).send('Server Error Register!!!')
  }
}

exports.login = async (req, res) => {
  try {
    //Chack login
    const { name, password } = req.body
    let user = await User.findOneAndUpdate({ name }, { new: true })

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).send('Password Invalid')
      }
      //Payload
      let payload = {
        user: {
          name: user.name,

        }
      }
      //Generate Token
      jwt.sign(payload, 'jwtsecret', { expiresIn: 5000 }, (err, token) => {
        if (err) throw err;
        res.json({ token, payload })
      })
    } else {
      return res.status(400).send('User Not Found')
    }
    console.log('object', user)


  } catch (err) {
    console.log()
    res.status(500).send('Server Error !!!')
  }
}