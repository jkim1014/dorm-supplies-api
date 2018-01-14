const User = require('../models/schemas/user')
const Item = require('../models/schemas/item')

exports.markPendingDelivered = (req, res, next) => {
  return res.sendStatus(501)
}

exports.markPendingPaid = (req, res, next) => {
  return res.sendStatus(501)
}

/*=============================================
=            C.R.U.D. Routes            
=============================================*/

exports.createStudent = (req, res, next) => {
  createUser(req, res, next, {
    isAdmin: false,
    address: req.body.address,
    classYear: req.body.classYear
  })
}

exports.createAdmin = (req, res, next) => {
  createUser(req, res, next, { isAdmin: true })
}

// helper function to create all types of users
function createUser (req, res, next, options) {
  if (!req.body.email) {
    return res.status(400).send('Must provide email')
  }
  if (!req.body.name) {
    return res.status(400).send('Must provide name')
  }
  if (!req.body.password) {
    return res.status(400).send('Must provide valid password')
  }
  if (!req.body.confirm) {
    return res.status(400).send('Must provide confirm password')
  }
  if (req.body.confirm !== req.body.password) {
    return res.status(400).send('Passwords must match')
  }

  if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(req.body.email)) {
    return res.status(400).send('Invalid email')
  }
  const userData = {
    email: req.body.email,
    hash: req.body.password,
    name: req.body.name,
  }
  // {
  //   isAdmin: false,
  //   address: req.body.address,
  //   classYear: req.body.classYear
  // }
  const fields = Object.keys(options).reduce((acc, key) => {
    if (options[key] === undefined) {
      return { isMissing: true, key }
    }
    userData[key] = options[key]
    return acc
  }, { isMissing: false, key: '' })

  if (fields.isMissing) {
    return res.status(400).send('Must provide ' + fields.key)
  }

  const newUser = new User(userData)
  newUser.save((err) => {
    if (err) {
      if (err.code === 11000) {
        return res.status(404).send('Duplicate Email')
      }
      else {
        return next(err)
      }
    }
    return res.json(newUser)
  })
}

exports.getAllUsers = (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) return next(err)
    return res.json(users)
  })
}

exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) return next(err)
    if (!user) return res.status(404).send('No user with id: ' + req.params.userId)
    return res.json(user)    
  })
}

exports.getUserByEmail = (req, res, next) => {
  User.findOne({ email: req.params.email }, (err, user) => {
    if (err) return next(err)
    if (!user) return res.status(404).send('No user with email: ' + req.params.email)
    return res.json(user)    
  })
}

exports.updateUser = (req, res, next) => {
  User.findOneAndUpdate({ _id: req.params.userId }, req.body, {}, (err, user) => {
    if (err) return next(err)
    if (!user) return res.status(404).send('Could not find user: ' + req.params.userId)
    return res.sendStatus(200)
  })
}
exports.deleteUser = (req, res, next) => {
  User.findByIdAndRemove(req.params.userId, (err, user) => {
    if (err) return next(err)
    if (!user) return res.status(404).send('Could not find user ' + req.params.userId)
    return res.json(user)
  })
}